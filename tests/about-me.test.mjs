import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

/* agent-team-template's run-facts prints the owner's date, read from the Time zone section of
   shared/about-me.md: an IANA name first, a written offset second, UTC otherwise. On a live
   student install (2026-09-23) that section read "Cochabamba (Bolivia time, UTC-4)", and the
   files were dated in UTC, so a 21:13 run was filed under the next day and the next morning's
   scheduled run found its work already done (TESTING.md S3-14, S3-26). Phase 3 is where the
   name gets written. */

const root = new URL('../', import.meta.url)
const phase = (await readFile(new URL('agent-team-os/skills/onboard/phases/03-about-me.md', root), 'utf8'))
  .replace(/\s+/g, ' ')

test('phase 3 writes the IANA time zone name next to the owner\'s own words', () => {
  const writing = phase.split('## Writing it')[1]?.split('## ')[0] ?? ''
  assert.match(writing, /IANA/, 'nothing writes a time zone the scripts can read')
  assert.match(writing, /\([A-Z][a-z]+\/[A-Za-z_]+\)/, 'no worked example of the name in brackets')
  assert.match(writing, /daylight saving/i, 'it does not say why the name beats an offset')
})
