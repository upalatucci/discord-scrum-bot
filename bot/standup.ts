import { Channel, Snowflake, TextChannel, User } from "discord.js"


interface StandupState {
  channel: Channel;
  remainingPartecipants: string[];
  scrumMaster: string;
}

export let standupsChannel: Record<Snowflake, StandupState> = {}



export function initStandup(channel: TextChannel, sender: User) {
  channel.send("Buongiorno a tutti raga! Iniziamo questo standup dai...")

  const partecipants: string[] = []
  channel.members.forEach(m => {
    if (!m.user.bot && m.user.username !== sender.username)
      partecipants.push(m.user.username)
  })

  standupsChannel[channel.id] = {channel, remainingPartecipants: partecipants, scrumMaster: sender.username}
  popPartecipant(channel)
}

export function popPartecipant(channel: TextChannel) {
  const {remainingPartecipants, scrumMaster} = standupsChannel[channel.id]

  if (remainingPartecipants.length) {
    const randomIndex = Math.round(Math.random() * remainingPartecipants.length) - 1
    const nextUser = remainingPartecipants[randomIndex]
    remainingPartecipants.splice(randomIndex, 1)
    channel.send(`Vaaaaa bene. Continuiamo.\nE' il tuo turno ${nextUser}`)
  } else {
    channel.send(`E' finito lo standup. L'ultimo è lo scrum master. Vai ${scrumMaster}`)
  }
}