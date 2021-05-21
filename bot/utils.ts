import { Channel, TextChannel, User } from "discord.js"


export function flipCoin(prob: number): boolean {
  return Math.random() > prob
}

export function userActive(user: User){
  return !user.bot && user.presence.status !== 'offline'
}

export function getUsernameFromChannel(channel: TextChannel, sender?: User): string[] {
  const partecipants: string[] = []
  channel.members.forEach(m => {
    if (m.user.username !== sender?.username && userActive(m.user))
      partecipants.push(m.user.username)
  })
  return partecipants
}