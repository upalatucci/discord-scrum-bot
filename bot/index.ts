import {Client, TextChannel} from 'discord.js'
import {prefixCommand, standupCommand, continueStandup} from "./constants"
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
        initStandup(<TextChannel>message.channel, message.author)
        break;
      case continueStandup:
        popPartecipant(<TextChannel>message.channel)
      default:
        break;
    }
  }
})

client.login(process.env.TOKEN)