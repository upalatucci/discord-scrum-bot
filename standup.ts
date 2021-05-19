import { Channel, Message, Snowflake, TextChannel, User } from "discord.js"


interface StandupState {
  channel: Channel;
  remainingPartecipants: string[];
  scrumMaster: string;
}

const standupsChannel: Record<Snowflake, StandupState> = {}



export function initStandup(channel: TextChannel, sender: User) {

  const partecipants: string[] = []
  channel.members.forEach(m => {
    if (!m.user.bot && m.user.username !== sender.username)
      partecipants.push(m.user.username)
  })


  standupsChannel[channel.id] = {channel, remainingPartecipants: partecipants, scrumMaster: sender.username}
}

export function popPartecipant(message: Message) {
  const {remainingPartecipants, scrumMaster} = standupsChannel[message.channel.id]

  if (remainingPartecipants.length) {
    const randomIndex = Math.random() * remainingPartecipants.length - 1
    const nextUser = remainingPartecipants[randomIndex]
    remainingPartecipants.splice(randomIndex, 1)
    message.channel.send(`E' il tuo turno ${nextUser}`)
  } else {
    message.channel.send(`E' finito lo standup. L'ultimo è lo scrum master. Vai ${scrumMaster}`)
  }
}