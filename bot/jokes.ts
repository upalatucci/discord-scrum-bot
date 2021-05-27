import { DMChannel, TextChannel } from "discord.js"
import { randomMessage } from "./utils"

const jokes = [
  "Story Specifications are like sex. If it's good, it's very good. If it's bad, well it's better than nothing.",
  `How many software developers does it take to change a light bulb? This question reveals that you are still thinking waterfall. For a more agile approach, ask e.g. "When will the scrum master call the janitor?"`,
  "I'll add your request to my backlog and get to it next sprint.",
  "Why do Java developers wear glasses? Because they don't C#...",
  "If having a coffee in the morning doesn't wake you up, try deleting a table in production instead.",
  "Hardware: The part of a computer that you can kick!",
  "What's the best thing about a Boolean? Even if you're wrong, you're only off by a bit.",
  "To understand what recursion is... You must first understand what recursion is",
  "I was gonna tell you a joke about UDP...but you might not get it.",
  "3 SQL statements walk into a NoSQL bar. Soon, they walk out. They couldn't find a table."
]


export function getRandomJokes(channel: TextChannel | DMChannel) {
  channel.send(randomMessage(jokes))
}