const test = require('brittle')
const RAM = require('random-access-memory')
const Hypercore = require('hypercore')
const Hyperbee = require('hyperbee')
const Hyperdrive = require('hyperdrive')
const Corestore = require('corestore')

const detect = require('./index.js')

test('can detect normal hypercore', async (t) => {
  const core = new Hypercore(RAM)
  await core.ready()
  await core.append('I am just a normal core')
  t.is(await detect(core), 'core')
})

test('returns null if first block not available locally and wait not set', async (t) => {
  const core = new Hypercore(RAM)
  await core.ready()
  t.is(await detect(core), null)
})

test('returns null if first block not available locally and wait not set (hyperdrive)', async (t) => {
  const drive = await getDrive()
  t.is(await detect(drive.db.core), null)
})

test('waits for the first block if wait set', async (t) => {
  t.plan(1)

  const core = new Hypercore(RAM)
  await core.ready()
  detect(core, { wait: true })
    .then(res => t.is(res, 'core'))
    .catch(e => t.fail('Failed with unexpected error'))

  await core.append('I am just a normal core, but you only know this now')
})

test('waits for the first block if wait set (hyperdrive)', async (t) => {
  t.plan(1)

  const drive = await getDrive()
  detect(drive.db.core, { wait: true })
    .then(res => t.is(res, 'drive'))
    .catch(e => t.fail('Failed with unexpected error'))

  await drive.put('/confirmed', 'I am a hyperdrive')
})

test('can detect a hyperbee', async (t) => {
  const core = new Hypercore(RAM)
  const bee = new Hyperbee(core)
  await bee.put('Needs an entry', 'to officially be a hyperbee')

  t.is(await detect(core), 'bee')
  t.ok(core.closing == null, 'passed-in core not closed')
})

test('can detect a hyperdrive', async (t) => {
  const drive = await getDrive()
  await drive.put('/file', 'needs a file to officially become a hyperdrive')

  t.is(await detect(drive.db.core), 'drive')
})

async function getDrive () {
  const corestore = new Corestore(RAM)
  await corestore.ready()

  const drive = new Hyperdrive(corestore)
  await drive.ready()

  return drive
}
