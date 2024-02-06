# tokaya-chan

A Discord bot for the Tokaya Discord server!

## Modules

### General

```
Commands
---
/ping
/help
/info server
/info user
```

### Moderation

```
Commands
---
/kick
/ban
/tempban
/unban
/timeout
/removetimeout
/message delete
/channel lock
/channel unlock
/server lock
/server unlock
/logchannel set
/logchannel unset
/addroleall

Functions
---
message-delete
message-edit
user-left
user-rejoint
role-update
channel-update
ban
kick
timeout
```

### Voice

```
Commands
---
/voice help
/voice admin add
/voice admin remove
/voice kick
/voice ban
/voice tempban
/voice unban
/voice whitelist toggle
/voice whitelist add
/voice whitelist remove
/voice manager create
/voice manager delete
/voice manager set
/voice manager unset
/voice manager rename
/voice manager voicename

Functions
---
create-channel
delete-channel
```

## Standard embed object

```js
const embed = {
  color: 0xffffff,
  title: "",
  url: "https://",
  author: {
    name: "",
    icon_url: "https://",
    url: "https://",
  },
  description: "",
  thumbnail: {
    url: "https://",
  },
  fields: [
    {
      name: "",
      value: "",
      inline: false,
    },
  ],
  image: {
    url: "https://",
  },
  timestamp: new Date().toISOString(),
  footer: {
    text: "",
    icon_url: "https://",
  },
};

export { embed };
```
