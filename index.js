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
        try {
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
        } catch (err) {console.log(err)}
    }
    
    //commande c$daily console.log(val+" + "+Number(val));
    /*else if(command = 'daily') {
        let serv_data = Database(['serv:'],'','407201633093681152')[0].get('serv:',message.guild.id, ['serv:']);
        if (serv_data[1] == '') {
            let user_id = Database(['user:','serv:','cash:','daily:'],'','407201633093681152')[0].get('user:',message.author.id, ['user:']);
            if (user_id[1] == '') {
                let user_data = Database(['user:','serv:',`cash:$[] ${serv_data[0].id} `,`daily:${serv_data[0].id}`],'','407201633093681152')[0].get('user:',message.author.id, ['user:','cash:','daily:']);
        } else {
            message.channel.send(message.author+' Please use c$cash to register');
            return;
        }
        //Si des data existe pour le serv && l'utilisateur
        if (user_data[1] == '' && serv_data[1] == '') {
            
            //Si bug de données:
                //Cash indéfini ou pas assez d'arguments
                if (user_data[0].cash.value == undefined || user_data[0].cash.value.lenght < 2) client.guilds.get('407201633093681152').createRole({
                        name: `cash:${user_data[0].id} ${serv_data[0].id} 500`,
                        color: 'YELLOW' });
                let Ncash = Database(['user:','serv:','cash:','daily:'],'','407201633093681152')[0].get('user:',message.author.id, ['user:','cash:','daily:'])[0]['cash']    
            
                //Daily indéfini ou pas assez d'arguments ou arguments qui ne sont pas des nombres
                var isOkDate = true;
                if (user_data[0].daily.value != undefined) {
                    user_data[0].daily.value.forEach(val => {
                        if (Number(val) == NaN) {
                            isOkDate = false;
                        }
                    });
                    if (user_data[0].daily.value.lenght < 7) isOkDate = false;
                } else isOkDate = false;
                
                console.log(isOkDate);
                console.log('--');
                console.log(user_data[0].daily.value);
                if (user_data[0].daily.value == undefined) {
                    client.guilds.get('407201633093681152').createRole({
                        name: `daily:${user_data[0].id} ${serv_data[0].id} ${Date().getFullYear()} ${Date().getMonth() + 1} ${Date().getDate() + 1} ${Date().getHours() + 1} ${Date().getMinutes() + 1} ${Date().getSeconds() + 1}`,
                        color: 'RED'
                    });
                    if (Number(Ncash.value[1]) == NaN) Ncash.set([serv_data[0].id,'1000']);
                    else Ncash.set([serv_data[0].id, Number(Ncash.value[1]) + 1000]);
                }
                else if (!isOkDate) {
                    user_data[0].daily.set([serv_data[0].id , Date().getFullYear() , Date().getMonth() + 1 , Date().getDate() + 1 , Date().getHours() + 1 , Date().getMinutes() + 1 , Date().getSeconds() + 1]);
                    if (Number(Ncash.value[1]) == NaN) Ncash.set([serv_data[0].id,'1000']);
                    else Ncash.set([serv_data[0].id, Number(Ncash.value[1]) + 1000]);
                }
            
                else if (new Date(user_data[0].daily.value[1], user_data[0].daily.value[2], user_data[0].daily.value[3], user_data[0].daily.value[4], user_data[0].daily.value[5], user_data[0].daily.value[6], 0) < new Date()) {
                    if (Number(Ncash.value[1]) == NaN) Ncash.set([serv_data[0].id,'1000']);
                    else Ncash.set([serv_data[0].id, Number(Ncash.value[1]) + 1000]);
                } else {
                    var diff = new Date(new Date() - new Date(user_data[0].daily.value[1], user_data[0].daily.value[2], user_data[0].daily.value[3], user_data[0].daily.value[4], user_data[0].daily.value[5], user_data[0].daily.value[6], 0));
                    message.channel.send(message.author+` vous devez attendre **${diff.getHours()}h ${diff.getMinutes()}min ${diff.getSeconds()}sec**`);
                }
                
        } else {
            message.channel.send(message.author+' Please use c$cash to register');
        }
    }*/
});
/**/
//db.serveurs.idGet[dbserv[0]] = id;
/**/
        
//Démarer le bot
client.login(key);
