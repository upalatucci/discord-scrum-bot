const {standupsChannel, popPartecipant} = require('./standup')

const channelId = "prova"
const scrumMaster = "ugo"

const mockChannel = {
  id: channelId,
  send: jest.fn()
}

const mockMessage = {
  channel: mockChannel
}


describe("pop partecipants", () => {
  beforeEach(() => {
    mockChannel.send.mockClear()
  })

  it("Pop correctly scrum Master without partecipants", () => {

    standupsChannel[channelId] = {channel: mockChannel, remainingPartecipants: [], scrumMaster}

    popPartecipant(mockMessage)


    const message = mockChannel.send.mock.calls[0][0]
    expect(message).toContain(scrumMaster)
  })

  it("With Partecipants", () => {

    const partecipants = ["hello", "ciao", "baubau"]
    standupsChannel[channelId] = {channel: mockChannel, remainingPartecipants: partecipants, scrumMaster}

    popPartecipant(mockMessage)
    expect(standupsChannel[channelId].remainingPartecipants.length).toBe(2)
    popPartecipant(mockMessage)
    expect(standupsChannel[channelId].remainingPartecipants.length).toBe(1)
    popPartecipant(mockMessage)

    expect(mockChannel.send).toBeCalledTimes(3)
    expect(standupsChannel[channelId].remainingPartecipants).toMatchObject([])


    popPartecipant(mockMessage)


    const allcalls = mockChannel.send.mock.calls
    const message = allcalls[allcalls.length - 1][0]
    expect(message).toContain(scrumMaster)


  })
})