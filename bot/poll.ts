import { Channel, DMChannel, Message, Snowflake, TextChannel, User } from "discord.js";
import { getUsernameFromChannel } from "./utils";



interface PollRecord {
  name: string;
  id: Snowflake;
  vote?: number;
}
interface UserVote {
  user: string;
  vote: number;
}
interface IActivePoll {
  votes: UserVote[];
  partecipants: string[];
  channel: TextChannel;
}


let usersPolls: Record<string, PollRecord[]> = {}

let activePolls: Record<Snowflake, IActivePoll> = {}

export async function initPoll(channel: TextChannel){
  const partecipants = getUsernameFromChannel(channel)
  console.log("Init Poll for channel", channel.name, "partecipants: ", partecipants)

  if (!partecipants.length)
    return channel.send("Non ho trovato partecipanti alla poll")
  else 
    channel.send("Ragazzi votiamo questa storia!\nSe volete nascondere il voto, scrivetemi in DM.")

  partecipants.forEach(username => {
    const newPoll = {name: channel.name, id: channel.id }
    if (usersPolls[username]) {
      usersPolls[username].push(newPoll)
    } else {
      usersPolls[username] = [newPoll]
    }
  })

  activePolls[channel.id] = {
    channel,
    partecipants,
    votes: []
  }
}

export function votePoll(message: Message, voteString: string | undefined) {
  if (!voteString) return message.channel.send("Scrivi anche il voto pls")

  const isDM = message.channel.type === "dm"
  

  const username = message.author.username
  const userPolls = usersPolls[username]

  if (!userPolls)
    return message.author.send("Non ci sono votazioni in corso per te!")

  let pollRecord

  if (isDM) {

    const userPollsNotVoted = userPolls.filter(p => !p.vote)
    
    if (!userPollsNotVoted.length) {
      return message.author.send("Hai già votato a tutte le votazioni!")
    } else if (userPollsNotVoted.length > 1) {
      return message.author.send(`Hai più di una votazione da fare: ${userPollsNotVoted.map(p => p.name).join(", ")}. Voterai per la prima...`)
    }

    pollRecord = userPollsNotVoted[0]

    if (!pollRecord) {
      return message.author.send("Non hai nessuna votazione attiva al momento")
    }
  } else {
    pollRecord = userPolls.find(p => p.id === message.channel.id)

    if (!pollRecord) {
      return message.channel.send("In questo canale non è attiva una votazione")
    }
  }

  const voteFloat = parseFloat(voteString)

  if (voteFloat) {
    activePolls[pollRecord.id].votes.push({user: username, vote: voteFloat})
    pollRecord.vote = voteFloat

    if (activePolls[pollRecord.id].votes.length >= activePolls[pollRecord.id].partecipants.length) {
      endPoll(pollRecord.id)
    }
  } else 
    message.author.send("Voto non valido...")
}

function avgVote(votes: UserVote[]) {
  return votes.reduce((acc, v) => acc + v.vote, 0) / votes.length
}

function formatVotes(votes: UserVote[]) {
  const avg = avgVote(votes)
  const userVotes = votes.reduce((acc, v) => acc + `\n${v.user}: ${v.vote}`, "")

  return userVotes + `\nMedia: ${avg}`
}

function deleteAllUsersPolls(poll: IActivePoll) {
  poll.partecipants.forEach(partecipant => {
    const indexUserPoll = usersPolls[partecipant].findIndex(p => p.id === poll.channel.id)

    if (indexUserPoll) {
      usersPolls[partecipant].splice(indexUserPoll, 1)
    }
  });
}

export function endPoll(channelId: Snowflake) {
  const poll = activePolls[channelId]
  if (poll && poll.votes.length) {
    const avg = avgVote(poll.votes)
    const  votesFormatted = formatVotes(poll.votes)

    poll.channel.send(`La votazione si è conclusa!\n${votesFormatted}`)

    deleteAllUsersPolls(poll)
    delete activePolls[channelId]
    

  } else if(poll) {
    poll.channel.send("Votazione cancellata!")
    delete activePolls[channelId]
  }
}