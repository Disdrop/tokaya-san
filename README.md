# tokaya-chan

A Discord bot for the Tokaya Discord server!

## Standard embed object

```js
const embed = {
  color: 0xffffff,
  title: '',
  url: 'https://',
  author: {
    name: '',
    icon_url: 'https://',
    url: 'https://'
  },
  description: '',
  thumbnail: {
    url: 'https://'
  },
  fields: [
    {
      name: '',
      value: '',
      inline: false
    },
  ],
  image: {
    url: 'https://'
  },
  timestamp: new Date().toISOString(),
  footer: {
    text: '',
    icon_url: 'https://'
  }
}

export {embed};
```