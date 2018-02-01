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
    console.log(`CasherMan est en marche, avec ${client.users.size} users, dans ${client.channels.size} salons et ${client.guilds.size} servers.`);
      //On Set le jeu de @CasherMan
    client.user.setGame(`CasherMan est en marche, avec ${client.users.size} users, dans ${client.channels.size} salons et ${client.guilds.size} servers.`);
});






//Lorsque le bot reçoie un message dans n'importe quel server
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
        
    //Commande `c$cash`
    if (command == 'cash') {
        var guild = client.guilds.get('407201633093681152');
        //var x = -1;
        var db = new Object();
        
        /* NOTE IMPORTANTE !!!
        * db.x.xGet Permet de récuperer x (avec x == un utilisateur, un serv ou autre)
        * db.x.idGet Permet de récuperer l'id de x sur le bot (exemple: user:1 2551515  ; l'id de l'utilisateur sur le bot c'est 1) 
        */
        
        /*Set Defaut object config*/
        
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
        //On regarde si le server existe
        var BotGuildExist = false;
        db.serveurs.servGet(id => {
            if (message.guild.id == id) {
                BotGuildExist = true;
            }
        });
        
        //Si l'server n'existe pas on créer une data
        if (!BotGuildExist) {
          guild.createRole({
            name:"serv:"+db.servers.servGet.length+" "+message.guild.id,
          });
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
        db.users.userGet(id => {
            if (message.author.id == id) {
                botUserExist = true;
            }
        });
        
        //Si l'utilisateur n'existe pas on créer un compte
        /*if (!botUserExist) {
        
        }*/
    }

});

//Démarer le bot
client.login(key);
