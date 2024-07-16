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
/user kick
/user ban
/user tempban
/user unban
/user timeout
/user removetimeout
/message delete
/channel lock
/channel unlock
/server lock
/server unlock
/logchannel set
/logchannel unset
/modrole set
/modrole unset
/addroleall

modrole command Perms

Desto mehr Banns desto mehr Zustimmmungen aus dem Team braucht man.

Log Channel Functions
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
/voice setowner
/voice admin add
/voice admin remove
/voice kick
/voice ban
/voice tempban
/voice unban
/voice whitelist toggle
/voice whitelist add
/voice whitelist remove
/voicemanager set
/voicemanager unset
/voicemanager voicename

Functions
---
create-channel
delete-channel
```

### Level

```
Commands
---

Functions
---
```

### Welcome

```
Commands
---

Functions
---
```

### Support

```
Commands
---

Functions
---
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

# Test Server

id: `"1111492325319909467",`
