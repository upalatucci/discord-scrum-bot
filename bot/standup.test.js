const {standupsChannel, popPartecipant, initStandup} = require('./standup')

const channelId = "prova"
const scrumMaster = "ugo"

const mockMembers = [{ user: {username: "hello", bot: false} }, {user: {username: "ciao", bot: false } }, { user: { username: "baubau", bot: false} }]

const mockChannel = {
  id: channelId,
  members: [...mockMembers],
  send: jest.fn()
}

const mockMessage = {
  channel: mockChannel
}

describe("Standup", () => {
  beforeEach(() => {
    mockChannel.send.mockClear()
    delete standupsChannel[mockChannel.id]
  })

  
  describe("init standup", () => {
    it("init standup", () => {
      initStandup(mockChannel, {username: scrumMaster})

      expect(standupsChannel[channelId].scrumMaster).toBe(scrumMaster)
      expect(standupsChannel[channelId].remainingPartecipants.length).toBe(2)
      expect(mockChannel.send).toBeCalledTimes(2)

      const allcalls = mockChannel.send.mock.calls

      expect(allcalls[0][0]).toContain("Buongiorno")
      expect(allcalls[1][0]).toContain("Continuiamo")
    })

    it("init standup with bot", () => {

      const membersWithBot = [...mockMembers, {user: {username: "bot", bot: true } }]
      const channelWithBot = {...mockChannel, members: membersWithBot}
      initStandup(channelWithBot, {username: scrumMaster})

      expect(standupsChannel[channelId].scrumMaster).toBe(scrumMaster)
      expect(standupsChannel[channelId].remainingPartecipants.length).toBe(2)
      expect(mockChannel.send).toBeCalledTimes(2)

      const allcalls = mockChannel.send.mock.calls

      expect(allcalls[0][0]).toContain("Buongiorno")
      expect(allcalls[1][0]).toContain("Continuiamo")
    })
  })


  describe("pop partecipants", () => {
    it("Pop correctly scrum Master without partecipants", () => {

      standupsChannel[channelId] = {channel: mockChannel, remainingPartecipants: [], scrumMaster}

      popPartecipant(mockChannel)


      const message = mockChannel.send.mock.calls[0][0]
      expect(message).toContain(scrumMaster)
    })

    it("With Partecipants", () => {

      const partecipants = [...mockMembers]
      standupsChannel[channelId] = {channel: mockChannel, remainingPartecipants: partecipants, scrumMaster}

      popPartecipant(mockChannel)
      expect(standupsChannel[channelId].remainingPartecipants.length).toBe(2)
      popPartecipant(mockChannel)
      expect(standupsChannel[channelId].remainingPartecipants.length).toBe(1)
      popPartecipant(mockChannel)

      expect(mockChannel.send).toBeCalledTimes(3)
      expect(standupsChannel[channelId].remainingPartecipants).toMatchObject([])


      popPartecipant(mockChannel)


      const allcalls = mockChannel.send.mock.calls
      const message = allcalls[allcalls.length - 1][0]
      expect(message).toContain(scrumMaster)
    })
  })
})