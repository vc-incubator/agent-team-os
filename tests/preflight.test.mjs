import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

/* Phase 11 needs a Vercel account. On a live student install (2026-09-23) a new account asked for
   phone verification there and then locked for 12 hours, which ends a live workshop
   (agent-team-template TESTING.md S3-25). The account has to exist, and be through that check,
   long before phase 11. */

const root = new URL('../', import.meta.url)
const read = async (path) => (await readFile(new URL(path, root), 'utf8')).replace(/\s+/g, ' ')

test('pre-flight checks the Vercel account at the start, not in phase 11', async () => {
  const phase = await read('agent-team-os/skills/onboard/phases/01-preflight.md')
  assert.match(phase, /### \d+\. A Vercel account/, 'pre-flight never asks about Vercel')
  assert.match(phase, /12 hours/, 'the lockout is not named, so nobody knows why to do it early')
  const count = /## The (\w+) checks/.exec(phase)?.[1]
  const headings = phase.match(/### \d+\./g)?.length
  const words = { four: 4, five: 5, six: 6 }
  assert.equal(words[count], headings, `the phase says "${count} checks" and lists ${headings}`)
})

test('the README asks for the Vercel account days ahead', async () => {
  const readme = await read('README.md')
  const before = readme.split('## Before you start')[1]?.split('## ')[0] ?? ''
  assert.match(before, /Vercel account, made a few days before/i)
})
