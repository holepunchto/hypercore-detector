# Hypercore Detector

Detect the type of a Hypercore (Hypercore, Hyperbee or Hyperdrive)

## Install

`npm i hypercore-detector`

## Usage

```
const detect = require('hypercore-detector')

let type = await detect(aHypercore)

if (!type) {
  type = detect(aHypercore, { wait: true })
}

if (type === 'bee') {
  console.log('I am a bee')
} else if (type === 'drive') {
  console.log('I am the db core of a drive')
} else {
  console.log('I am a basic hypercore')
}

```

## API

#### `const type = await detect(hypercore, opts?)`

Detect the type of the `hypercore`.

returns either `'core'`, `'bee'`, `'drive'` or `null`.

`null` is returned when it is not yet possible to determine the type. Set `opts.wait = true` if instead you want to wait until the  type can be determined. 

Do note that this will wait until the first block of the hypercore becomes locally available, so make sure you are either the writer, or are swarming on this core.
