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
        db['users'] = new Object();
        
        //On récupère la liste des utilisateurs
        guild.roles.forEach(role => {
            if (role.name.indexOf('user:') == 0) {
                //Récuperer les valeurs
                var val = role.name.slice('user:'.length).trim().split(/ +/g);
                //Récuperer l'id de l'utilisateur
                db.users[val[0]].id = val.shift().toLowerCase();
                db.users[val[0]].val = val[0]
            }
            message.channel.send(db.users.0.id+" "+db.users.0.val)
        });
    }

});

//Démarer le bot
client.login(key);
