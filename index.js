//On récupère le token du bot
  var key = ﻿process.env.TOKEN;

//Id du bot
  var confid = "406951508790476801";
  var mention = "<@"+confid+">";
  
//Owner du bot
  var botowner = process.env.BOTW;
  
//Prefix du bot
  var prefix = "c$";

//On récupère discord.js qui permet l'intéraction entre discord et le bot
const Discord = require('discord.js');
const client = new Discord.Client();

/*FUNCTION MADE BY KNOSE1*/
function Database(allRolePrefix, gt, dbserv) {
    //Si on a donner une liste de prefix
    if (Array.isArray(allRolePrefix) && allRolePrefix.length > 0) {
        let retError = '';
        let toReturn = {};
        //Pour chaque préfix
        //console.log("allRolePrefix = "+allRolePrefix);
        let noError = true;
        allRolePrefix.forEach(rolePrefix => {
            //console.log("rolePrefix = "+rolePrefix);
            
            
            //S'il y a pas d'erreur:
            if (noError) {
                
                //On regarde si le préfix est un txt
                if (typeof(rolePrefix) == 'string') {
                    var newRolePrefix = rolePrefix;
                    toReturn[rolePrefix.replace(/:/g, "")] = new Array();
                    rolePrefix = newRolePrefix;
                    //On récupère les data de chaque role
                    client.guilds.get(dbserv).roles.forEach(role => {
                        //On regarde si le role correspond au préfix
                        if (role.name.indexOf(rolePrefix) == 0) {
                            //On récupère les data `${prefix}${data0} ${data1} ${data2}` exemple: user:1 1000
                            var data = role.name.slice(rolePrefix.length).trim().split(/ +/g);
                            toReturn[rolePrefix.replace(/:/g, "")][data[0]] = data.slice(1);
                            //Résultat: toReturn[prefix (sans ":")][data0] = [data1, data2]; exemple: toReturn[user][1] = [1000]
                        }
                    });
                    if (toReturn[rolePrefix.replace(/:/g, "")].length == 0) {
                        noError = false;
                        toReturn = undefined;
                        retError += `Error: ${rolePrefix} not found in the db` + "\n";
                    }
                } else {
                    //Si le préfix est pas un txt on retourne une erreur
                    noError = false;
                    toReturn = undefined;
                    retError += `Not a string at allRolePrefix.forEach(role =>{}) && role = ${rolePrefix}`+ "\n";
                    return [undefined, retError];
                }
            } else return [undefined, retError];
        });
        //On a récupéré les data de toReturn mais on a pas encors crée de méthode pour obtenir ${data0} à partir de ${data1} pour chaque préfix
        if (retError == '' && 'noGet' != gt) {
            toReturn.get = function (dataPrefix, data1, prefixInclude) {
                let retError = '';
                let toBeReturned = {};
                if (typeof(dataPrefix) == 'string' && typeof(data1) == 'string') {
                    if (undefined != toReturn[dataPrefix.replace(/:/g, "")] ) {
                        //On récupère l'id de la data à partir de la primary (dataPrefix)
                        var id = toReturn[dataPrefix.replace(/:/g, "")].findIndex(data => {
                            return data1 == data;
                        });
                        if (id != -1) {
                            //On a donné une liste de préfixInclude
                            if (prefixInclude != undefined && Array.isArray(prefixInclude)) {
                                //Pour chaque préfix inclue
                                toBeReturned['id'] = id;
                                prefixInclude.forEach(prefixI => {
                                    var defautprefixI = prefixI;
                                    //Si toReturn contient le préfix et que le préfix n'est pas id
                                    if (undefined != toReturn[prefixI.replace(/:/g, "")] && 'id' != toReturn[prefixI.replace(/:/g, "")]) {
                                        //On récupère la data correspondant à l'id
                                        toBeReturned[prefixI.replace(/:/g, "")] = {};
                                        toBeReturned[prefixI.replace(/:/g, "")].value = toReturn[prefixI.replace(/:/g, "")][id];
                                        
                                        
                                        if ('noSet' != gt) {
                                            /*On créer une fonction .set()*/
                                            toBeReturned[prefixI.replace(/:/g, "")].set = function (newValue) {
                                                let retError = '';
                                                if (Array.isArray(newValue)) {
                                                    var datas = toReturn[prefixI.replace(/:/g, "")][id];
                                                    client.guilds.get(dbserv).roles.find('name', defautprefixI+id+" "+datas.join(' ')).setName(defautprefixI+id+" "+newValue.join(' '))
                                                        .catch(console.error);
                                                    retError = `Edited the data "${defautprefixI+id+" "+datas.join(' ')}" => "${defautprefixI+id+" "+newValue.join(' ')}"` + "\n";
                                                    return retError;
                                                }
                                                else {
                                                    retError += `Not an Array at Database().get().set(${newValue})` + "\n";
                                                    return retError;
                                                }
                                            }
                                            /*FIN DE FONCTION SET*/
                                        }
                                    
                                    
                                    }
                                    //Si le préfix est 'id'
                                    else if('id' == prefixI.replace(/:/g, "")) {
                                        retError += `The prefix 'id' is disable at Database().get()` + "\n";
                                    }
                                    //Sinon
                                    else {
                                        toBeReturned[prefixI.replace(/:/g, "")] = undefined;
                                        retError += `toBeReturned[${prefixI.replace(/:/g, "")}] = undefined` + "\n";
                                    }
                                });
                                return [toBeReturned, retError];
                            }
                            //On a pas donné de préfixInclude
                            else if (prefixInclude == undefined) {
                                retError += `prefixInclude is undefined at Database().get(${dataPrefix},${data1},${prefixInclude})`+"\n";
                                return [undefined, retError];
                            }
                            //On a donné une var qui n'est pas une liste
                            else if (prefixInclude != undefined && !Array.isArray(prefixInclude)) {
                                retError += `Not and array at Database().get(${dataPrefix},${data1},${prefixInclude})`+"\n";
                                return [undefined, retError];
                            }
                        } else {
                            retError += `${data1} not found at Database().get(${dataPrefix},${data1})`+"\n";
                            return [undefined, retError];
                        }
                    } else {
                        retError += `Prefix unknown at Database().get(${dataPrefix})`+"\n";
                        return [undefined, retError];
                    }
                } else {
                    if (typeof(dataPrefix) == 'string') retError += `dataPrefix :Not a string at Database().get(${dataPrefix.toString()},${data1.toString()})`+"\n";
                    if (typeof(data1) == 'string') retError += `data1 :Not a string at Database().get(${dataPrefix.toString()},${data1.toString()})`+"\n";
                    return [undefined, retError];
                }
            };
        }
        return [toReturn, retError];
    } else {
        //Si on a pas donner de liste de préfix
        if(!Array.isArray(allRolePrefix)) retError += `Not an array at 'db.new(${allRolePrefix.toString()})'`+"\n";
        if(allRolePrefix.length <= 0) retError += `Can't read length < 0 at 'db.new(${allRolePrefix.toString()})'`+"\n";
        return [undefined, retError];
    }
};
/*FUNCTION END*/

client.on('ready', () => {
      //On envoie dans le log que le bot est pret
    console.log(`CasherMan est en marche, avec ${client.users.size} users, dans ${client.channels.size} salons et ${client.guilds.size} serveurs.`);
      //On Set le jeu de @CasherMan
    client.user.setGame(`CasherMan est en marche, avec ${client.users.size} users, dans ${client.channels.size} salons et ${client.guilds.size} serveurs.`);
});






//Lorsque le bot reçoie un message dans n'importe quel serveur
client.on('message', message => {
  var iscommand = false;

  //ignorer si c'est un bot
    if(message.author.bot) return;
  
  //ignorer si c'est un pm
    if(!message.guild) return;
    
  //si c'est une commande, récupérer les arguments, la commande et supprimer le message
    if (message.content.indexOf(prefix) == 0) {
         //Permet de savoir si une commande a été faite
         iscommand = true; 
         
         //Récuperer les arguments
         var args = message.content.slice(prefix.length).trim().split(/ +/g); 
         
         //Récuperer le nom de la commande
         var command = args.shift().toLowerCase();
         
         //cela supprime LE message qui a été après 0.5 secondes
         /*message.delete(500)
             .then(msg => console.log(`Message supprimé, raison: commande; Auteur: ${msg.author}`))
             .catch(console.error);
         */
    }
    //Commande`c$invite`
    if (command == 'invite') {
      message.channel.send(message.author+':\n https://discordapp.com/api/oauth2/authorize?client_id=406951508790476801&permissions=268717056&redirect_uri=https%3A%2F%2Fdiscordapp.com%2F&scope=bot')
      message.delete(500)
             .then(msg => console.log(`Message supprimé, raison: commande; Auteur: ${msg.author}`))
             .catch(console.error);
    }
    
    //Commande `c$cash`
    else if (command == 'cash') {
        var guild = client.guilds.get('407201633093681152');
        //var x = -1;
        var db = new Object();
        
        /* NOTE IMPORTANTE !!!
        * db.x.xGet Permet de récuperer x (avec x == un utilisateur, un serv ou autre)
        * db.x.idGet Permet de récuperer l'id de x sur le bot (exemple: user:1 2551515  ; l'id de l'utilisateur sur le bot c'est 1) 
        */
        
        /*Set Defaut object config*/
        db.serveurs = new Object();
        db.users = new Object();
        db.serveurs.servGet = new Array();
        db.serveurs.idGet = new Array();
        db.users.userGet = new Array();
        db.users.idGet = new Array();
      
        /*End set defaut*/
      
        
        
        //On récupère les servs
        guild.roles.forEach(role => {
            if (role.name.indexOf('serv:') == 0) {
                var dbserv = role.name.slice('serv:'.length).trim().split(/ +/g);
                var id = Number(dbserv.shift().toLowerCase());
                if (id != NaN) {
                    db.serveurs.servGet[id] = dbserv[0];
                    db.serveurs.idGet[dbserv[0]] = id;
                }
            }
        });
        
        //On regarde si le serveur existe
        var BotGuildExist = false;
        db.serveurs.servGet.forEach(id => {
            if (message.guild.id == id) {
                BotGuildExist = true;
            }
        });
        
        //Si le serveur n'existe pas on créer une data
        if (!BotGuildExist) {
          guild.createRole({
            name:"serv:"+db.serveurs.servGet.length+" "+message.guild.id,
          });
          message.channel.send('Le serveur \''+message.guild.name+'\' à été ajouté à la data base !');
        
         
          //On met à jour de la liste des serveurs
            var newServDb = "serv:"+db.serveurs.servGet.length+" "+message.guild.id;
            var dbserv = newServDb.slice('serv:'.length).trim().split(/ +/g);
            var id = Number(dbserv.shift().toLowerCase());
                if (id != NaN) {
                    db.serveurs.servGet[id] = dbserv[0];
                    db.serveurs.idGet[dbserv[0]] = id;
                }
        }  
      
      
        //On récupère la liste des utilisateurs
        guild.roles.forEach(role => {
            if (role.name.indexOf('user:') == 0) {
                var dbuser = role.name.slice('user:'.length).trim().split(/ +/g);
                var id = Number(dbuser.shift().toLowerCase());
                if (id != NaN) {
                    db.users.userGet[id] = dbuser[0];
                    db.users.idGet[dbuser[0]] = id;
                }
            }
        });
        //On regarde si l'utilisateur existe
        var botUserExist = false;
        db.users.userGet.forEach(id => {
            if (message.author.id == id) {
                botUserExist = true;
            }
        });
        
        //Si l'utilisateur n'existe pas on créer un compte et on return
        if (!botUserExist) {
            guild.createRole({
                name:"user:"+db.users.userGet.length+" "+message.author.id,
            });
            message.channel.send('L\'utilisateur \''+message.author.username+'\' à été ajouté à la data base !');
            
            //On met à jour de la liste
            var newUserDb = "user:"+db.users.userGet.length+" "+message.author.id;
            var dbuser = newUserDb.slice('user:'.length).trim().split(/ +/g);
            var id = Number(dbuser.shift().toLowerCase());
                if (id != NaN) {
                    db.users.userGet[id] = dbuser[0];
                    db.users.idGet[dbuser[0]] = id;
                }
        
        }
        
        //On récupère la liste des cash de l'utilisateur qui a été mentionné
        var botUserId = db.users.idGet[message.author.id];
        db.cash = new Object();
        db.cash.user = new Array();
        db.cash.user[botUserId] = new Object();
        db.cash.user[botUserId].serveur = new Array();
        
        guild.roles.forEach(role => {
            if (role.name.indexOf('cash:'+botUserId) == 0) {
                var dbcash = role.name.slice('cash:'.length).trim().split(/ +/g);
                var id = dbcash.shift().toLowerCase();
                if (Number(dbcash[1]) != NaN) {
                    //user[id] est l'objet à l'id de l'utilisateur;
                    //serveur[dbcash[0]] est l'id du serveur
                    //dncash[1] est la somme d'argent
                    db.cash.user[id].serveur[dbcash[0]] = dbcash[1];
                }
            }
            
        });
        
        //On regarde si l'utilisateur a un compte pour le serveur
        var botUserServeurAccountExist = true;
        var botUserId = db.users.idGet[message.author.id];
        var idserveur = db.serveurs.idGet[message.guild.id];
        if (undefined == db.cash.user[botUserId].serveur[idserveur]) {
            botUserServeurAccountExist = false;
        }
        
        //Si l'utilisateur n'a un compte pour le serveur
        if (!botUserServeurAccountExist) {
            guild.createRole({
                name:"cash:"+botUserId+" "+idserveur+" 500",
            });
            message.channel.send('Un compte à bien été créer pour l\'utilisateur \''+message.author.username+'\' sur le serveur \''+message.guild.name+'\' !');
        return;
        }
        
        //On display le cash de l'utilisateur
        message.channel.send(message.author+' vous avez '+db.cash.user[botUserId].serveur[idserveur]+'$ sur ce serveur.');
    }
    
    //commande c$daily
    else if(command = 'daily') {
        let dataget = Database(['user:','serv:','cash:','daily:'],'','407201633093681152')[0].get('user:',message.author.id);
        if (dataget[1] == '') {
            //À finir (Pas d'erreur, il est dans la db mais à t'il une var daily ?)
        } else {
            message.channel.send(message.author+' Please use c$cash to register');
        }
    }
});
/**/
//db.serveurs.idGet[dbserv[0]] = id;
/**/
        
//Démarer le bot
client.login(key);
