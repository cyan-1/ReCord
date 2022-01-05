const OBSWebSocket = require('obs-websocket-js');
const obs = new OBSWebSocket();
const Discord = require("discord.js");
const config = require("./config.json");
const bot = new Discord.Client();
const prefix = config.prefix;
//-------Change The UserID---------
const userID = "688836813900480643";
//---------------------------------
obs.on('ConnectionOpened', () => {
  console.log('Connection Opened');
});

bot.on('voiceStateUpdate', (newState, oldState) => {
  if(oldState.member.user.id === userID && oldState.channelID != null) {
    obs.sendCallback('StartRecording');
  }
  if(oldState.channelID == null){
    obs.sendCallback('StopRecording');
  }
})

bot.on('message', async message => {
  if (!message.content.startsWith(prefix)) return;
  let args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();

  switch(cmd){

    case "rec":
      rec(message);
    break;

    case "stop":
      stop(message);
    break;

    case "kill":
      stop(message)
      obs.disconnect();
      process.exit();
    break;
  }
})

bot.login(config.token);
obs.connect('ws://192.168.0.4:4444');

function rec(message) {
  try{
    obs.sendCallback('StartRecording');
  }catch(e){console.log(e);}
  message.channel.send("Recording Started!");
}
function stop(message) {
  try{
    obs.sendCallback('StopRecording');
  }catch(e){console.log(e);}
  message.channel.send("Recording Stopped!");
}
