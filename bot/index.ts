import {Client, TextChannel} from 'discord.js'
import {prefixCommand, standupCommand} from "./constants"
import {initStandup, popPartecipant} from "./standup"

const client = new Client()


client.once("ready", () => {
  console.log("Bot ready");
})

client.on("message", message => {

  if (message.author.bot) return

  if (message.content.startsWith(prefixCommand)) {
    const args = message.content.slice(prefixCommand.length).split(/ +/)

    const command = args.shift()

    if (!command) return

    switch(command.toLowerCase()) {
      case standupCommand:
        message.channel.send("Buongiorno a tutti raga! Iniziamo questo standup dai...")
        initStandup(<TextChannel>message.channel, message.author)
        popPartecipant(message)
        break;
      default:
        break;
    }
  }
})

client.login(process.env.TOKEN)