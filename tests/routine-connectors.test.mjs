import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

/* Every connector on the account is attached to a new routine by default, with write access.
   On a live student install (2026-09-24, agent-team-template TESTING.md S3-41) the two weekly
   jobs, which read only their own repo, were created through the routines API holding all twelve
   of the tester's connectors, n8n and ClickUp included, and a test run fired before anyone took
   them off. The three phase-10 routines, created with Gmail named, got Gmail only. So a routine
   gets what the step that creates it says, and every step that creates one has to say it. */

const root = new URL('../', import.meta.url)
const read = async (path) => (await readFile(new URL(path, root), 'utf8')).replace(/\s+/g, ' ')

const creators = {
  'phase 8': 'agent-team-os/skills/onboard/phases/08-first-routine.md',
  'phase 10': 'agent-team-os/skills/onboard/phases/10-workflows.md',
  'phase 12': 'agent-team-os/skills/onboard/phases/12-the-standard.md',
  '/arm': 'agent-team-os/skills/arm/SKILL.md'
}

for (const [name, path] of Object.entries(creators)) {
  test(`${name} says which connectors a routine gets, and to read them back`, async () => {
    const text = await read(path)
    assert.match(text, /connectors?/i, `${name} creates a routine and never mentions connectors`)
    assert.match(text, /every connector on the (?:account|their account)|Every connector on (?:the|their) account/i,
      `${name} does not warn that every connector is attached by default`)
    assert.match(text, /read (?:the routine|it|them|its `mcp_connections`[^.]*) back|open the routine again/i,
      `${name} never checks what the routine actually got`)
  })
}

test('/arm names the connector list in the create call, even when it is empty', async () => {
  const arm = await read(creators['/arm'])
  assert.match(arm, /mcp_connections: \[/, 'the create call has no connector list, so it gets all of them')
})

test('a workflow routine acts on a Pause from the dashboard', async () => {
  const phase = await read(creators['phase 10'])
  assert.match(phase, /routine-fire-payload[^.]*pause/i,
    'the prompt ignores fire text, so the Pause button starts a run instead')
})
