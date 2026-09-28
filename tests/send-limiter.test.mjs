import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

/* agent-team-template now denies every connector's send, reply, forward, publish, delete and
   trash tools in .claude/settings.json (branch fix/deny-send-tools). Strict by default, and
   meant to be changeable: an owner who wants one job to send removes one line. Phase 7 is where
   the student sees an agent refuse to send, so it is where they learn the switch exists and
   where it is. Without this, the first owner who needs a Friday reminder to go out on its own
   has a team that silently cannot, and no idea why. */

const root = new URL('../', import.meta.url)
const phase = (await readFile(new URL('agent-team-os/skills/onboard/phases/07-meet-the-team.md', root), 'utf8'))
  .replace(/\n>\s?/g, ' ').replace(/\s+/g, ' ')
const step = phase.split('### 4.')[1]?.split('### ')[0] ?? ''

test('phase 7 says sending is switched off, not merely discouraged', () => {
  assert.ok(step, 'step 4 is gone')
  assert.doesNotMatch(step, /Not because it cannot send/, 'it still says the agents could send')
  assert.match(step, /switched off/i)
})

test('phase 7 shows which line to remove, and what each one controls', () => {
  assert.match(step, /\.claude\/settings\.json/)
  for (const rule of ['send', 'reply', 'forward', 'publish', 'delete', 'trash']) {
    assert.match(step, new RegExp(`"mcp__\\*_${rule}\\*"`), `the ${rule} line is not in the table`)
  }
  assert.match(step, /delete that one line/i, 'it does not say how to turn one off')
})

test('the change is made by the owner in a session, never by a routine', () => {
  assert.match(step, /never in a routine/i)
})
