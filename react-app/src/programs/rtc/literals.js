export const literals = {
  OFFER_SENT: (id) => `SDP offer sent...\nwaiting for remote ICE candidates...\n<callId> ${id}`,
  ANSWER_SENT: (id) => `SDP answer sent for <callId> ${id}...\nwaiting for remote ICE candidates...`,
  CLOSE: 'Closing rtc video call',
  NO_ARGUMENTS: 'You have to specify at least one argument',
  PROGRAM_NAME: 'video_call'
}
