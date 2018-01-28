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
         iscommand = true; //Permet de savoir si une commande a été faite
         
         /*
         *Permet de récuperer les arguments de la commande 
         *par exemple: 'cat:nya test test2' ; args 2 contiendra 'test' et 'test2' pour cet exemple
         */
         var args = message.content.slice(prefix.length).trim().split(/ +/g); 
         
         //Récuperer le nom de la commande exemple: 'cat:test' ; commande = 'test';
         var command = args.shift().toLowerCase();
         
         //cela supprime LE message qui a été après 0.5 secondes
         message.delete(500)
             .then(msg => console.log(`Message supprimé, raison: commande; Auteur: ${msg.author}`))
             .catch(console.error);
        }

});

//Démarer le bot
client.login(key);
