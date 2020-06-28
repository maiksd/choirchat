# Usage and integration

## Use case

As required by social distancing rules during the Covid-19 pandemic, choirs cannot perform rehearsals in person as usual. What's possible is that either the conductor alone or the conductor together with a small group of singers in a large enough place can perform the rehearsal while the rest of the choir follows at home through a live stream.

Previously we used Jitsi or other video conference tools, but it turns out those had significant downsides:
- people got unmuted again and again, disturbing the audio from the conductor's place with their singing along solo
- In the case of public Jitsi instances with no authentication, if the moderator loses the connection, (s)he won't have moderator privileges after rejoining, and thus loses the ability to mute others
- Audio quality is low
- Video quality is low, while bandwidth requirements for everyone are relatively high if there are 40-60 participants and not everyone disables their cameras
- Sharing the scores is possible through screen sharing, but visual quality is not enough to really use that

## Concept

One user manages the live streaming. This manager has a video+audio connection to the conductor's place, using Skype, FaceTime or even something with more audio quality if available, so that this content appears on the manager's computer. This video+audio feed is then integrated into the live stream to everyone else, along with the score. Participants connect to the live stream.

I wanted this to be available on a private website, instead of on YouTube or Twitch, but that requires providing a way for participants to chat, since there is no other channel back to the manager or the conductor.


TODO: screenshots of OBS, index.html and stuff
