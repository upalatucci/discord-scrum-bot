import { DMChannel, Message, Snowflake, TextChannel } from "discord.js";
import { getUsernameFromChannel } from "./utils";


let usersPolls: Record<string, pollRecord[]> = {}


interface pollRecord {
  name: string;
  id: Snowflake;
}

let votes: Record<Snowflake, number[]> = {}

export function initPoll(channel: TextChannel){
  channel.send("Ragazzi votiamo questa storia! Scrivetemi in DM il voto.")

  const partecipants = getUsernameFromChannel(channel)

  partecipants.forEach(username => {
    const newPoll = {name: channel.name, id: channel.id }
    if (usersPolls[username]) {
      usersPolls[username].push(newPoll)
    } else {
      usersPolls[username] = [newPoll]
    }
  })

  votes[channel.id] = []
}


export function votePoll(message: Message, voteString) {
  const channel = <DMChannel>message.channel
  const username = channel.recipient.username

  const userPolls = usersPolls[username]

  if (!userPolls.length) {
    channel.send("Non hai al momento votazioni in corso")
    return
  } else if (userPolls.length > 1) {
    channel.send(`Hai più di una votazione in corso: ${userPolls.map(p => p.name).join(", ")}. Voterai per la prima...`)
  }

  const pollRecord = userPolls.shift()

  if (!pollRecord)
    return

  const vote = parseFloat(voteString)

  if (vote)
    votes[pollRecord.id].push(vote)
  else 
    channel.send("Voto non valido...")
}