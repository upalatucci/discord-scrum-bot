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

    standupsChannel[channelId] = {channel: mockChannel, remainingPartecipants: [], scrumMaster: scrumMaster}

    popPartecipant(mockMessage)


    const message = mockChannel.send.mock.calls[0][0]
    expect(message).toContain(scrumMaster)
  })

  it("With Partecipants", () => {

    const partecipants = ["hello", "ciao", "baubau"]
    standupsChannel[channelId] = {channel: mockChannel, remainingPartecipants: partecipants, scrumMaster: scrumMaster}

    popPartecipant(mockMessage)

    expect(mockChannel.send).toBeCalledWith("ciao")

  })
})