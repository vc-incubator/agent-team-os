import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

/* Phase 12 on a live student install, 2026-09-24 (agent-team-template TESTING.md S3-33, S3-34,
   S3-35, S3-40):

   - It overwrote both receipt-chase jobs' done blocks with the owner's report standard, deleting
     "no tax or legal advice" and the rest of the client-email rules, and its summary described
     only what it added.
   - "Skip the empty sections" went into `never`, where it reads as never skip them.
   - Sentences with commas, unquoted, split into fragments.
   - The arming rule refused the two weekly jobs, and the installer had to invent a way to approve
     them. The template now ships `standing:` for exactly these two. */

const root = new URL('../', import.meta.url)
const phase = (await readFile(new URL('agent-team-os/skills/onboard/phases/12-the-standard.md', root), 'utf8'))
  .replace(/\s+/g, ' ')
const step = (n) => phase.split(`### ${n}.`)[1]?.split('### ')[0] ?? ''

test('an existing done block is added to, never replaced, and the diff is shown', () => {
  const write = step(3)
  assert.match(write, /add to it\. Never replace it/i, 'nothing stops phase 12 overwriting a job\'s standard')
  assert.match(write, /show the diff/i)
  assert.match(write, /no tax or legal advice/i, 'the client-email case is not named, and it is the one that was lost')
})

test('each sentence is filed by what it asks for, and quoted', () => {
  const write = step(3)
  assert.match(write, /Sort each sentence by what it asks for/i)
  assert.match(write, /Quote every item/i)
  assert.match(write, /never: \["/, 'the example still shows unquoted items')
})

test('the weekly jobs are approved under standing, and only they are', () => {
  const weekly = step(6)
  assert.match(weekly, /standing:/, 'nothing says where the owner\'s yes goes, so the arming rule refuses both')
  assert.match(weekly, /workflow:quality-review/)
  assert.match(weekly, /workflow:weekly-tune-up/)
  assert.match(weekly, /These two jobs and no others/i)
  assert.match(weekly, /check:arming/)
})
