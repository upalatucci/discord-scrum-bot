import { Channel, Snowflake, TextChannel, User } from "discord.js"
import { flipCoin, getUsernameFromChannel, randomMessage } from "./utils"


interface StandupState {
  channel: Channel;
  remainingPartecipants: string[];
  scrumMaster: string;
}

export let standupsChannel: Record<Snowflake, StandupState> = {}


const startupStandupMessages = [
  "Vaaa beeeene... iniziamo questo standup...",
  "Oggi mi sono svegliato super attivo! Forzaaa iniziamo questo standup!!!!", 
  "Mamma non voglio andare a scuolaa.... ah buongiorno raga. Va bene voi iniziate lo standup io continuo a dormire....", 
  "Ma che volete da me.... ah lo standup giusto"
]

export function initStandup(channel: TextChannel, sender: User) {
  channel.send(randomMessage(startupStandupMessages))

  const partecipants = getUsernameFromChannel(channel, sender)
  standupsChannel[channel.id] = {channel, remainingPartecipants: partecipants, scrumMaster: sender.username}
  popPartecipant(channel)
}

export function popPartecipant(channel: TextChannel) {
  const {remainingPartecipants, scrumMaster} = standupsChannel[channel.id]

  if (remainingPartecipants.length) {
    const randomIndex = Math.round(Math.random() * remainingPartecipants.length)
    const nextUser = remainingPartecipants[randomIndex]
    remainingPartecipants.splice(randomIndex, 1)
    channel.send(`Vaaaaa bene. Continuiamo.\nE' il tuo turno ${nextUser}`)

    if (flipCoin(.1)) 
      channel.send("Mi raccomando voi altri!! Non parlate al posto suo.")

  } else {
    channel.send(`E' finito lo standup. L'ultimo è lo scrum master. Vai ${scrumMaster}`)
  }
}