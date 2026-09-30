import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

/* Phase 11 on a live student install, 2026-09-24 (agent-team-template TESTING.md D1, D6 and
   S3-29). Four ways the phase as written left a student worse off than they started:

   - Vercel's picker lists the team repo beside the fork. A misclick deployed the team repo, and
     Vercel served the business brain and the client list to anyone, behind what looked like an
     ordinary 404.
   - VIEW_KEY was never set. The dashboard's own message then offered PUBLIC_DASHBOARD=true, which
     publishes everything the board reads.
   - A routine's API trigger needs a token, shown once. The phase said "copy its trigger URL", a
     thing a routine does not have until an API trigger is added, and never mentioned the token,
     so every Run tap failed.
   - Add task, New workflow, Arm and Approve go to a `task-intake` routine nothing created. */

const root = new URL('../', import.meta.url)
const read = (path) => readFile(new URL(path, root), 'utf8')
const phase = (await read('agent-team-os/skills/onboard/phases/11-oversight.md')).replace(/\s+/g, ' ')
const step = (n) => phase.split(`### ${n}.`)[1]?.split('### ')[0] ?? ''

test('the project name is read back before Deploy, and a bare 404 means the wrong repo', () => {
  const deploy = step(2)
  assert.ok(deploy, 'step 2 is gone')
  const check = deploy.search(/project name/i)
  const press = deploy.search(/Press \*\*Deploy\*\*/)
  assert.ok(check !== -1 && press !== -1 && check < press,
    'nothing makes them read the project name before pressing Deploy')
  assert.match(deploy, /agent-cockpit/)
  assert.match(deploy, /404[^.]*wrong repo|wrong repo[^.]*404/i, 'a bare 404 is not called out as the wrong repo')
  assert.match(deploy, /Delete/i, 'it does not say to take the wrong deployment down')
})

test('VIEW_KEY is set, and PUBLIC_DASHBOARD is only for a public repo', () => {
  const settings = step(3)
  assert.match(settings, /\| `VIEW_KEY` \|/, 'VIEW_KEY is not in the list of settings to type in')
  const warning = /[^.]*PUBLIC_DASHBOARD[^.]*\.[^.]*\./.exec(settings)?.[0] ?? ''
  assert.ok(warning, 'PUBLIC_DASHBOARD is not explained, and the dashboard itself suggests it')
  assert.match(settings, /only when the team repo itself is public/i)
})

test('each fire trigger is a URL and a token, from the routine\'s API trigger', () => {
  const buttons = step(5)
  assert.match(buttons, /Add another trigger/, 'it does not say how a routine gets a trigger URL at all')
  assert.match(buttons, /Generate token/, 'the token is never generated, so every tap is refused')
  assert.match(buttons, /shown once/i)
  assert.match(buttons, /"token": "PASTE-THE-TOKEN"/, 'the FIRE_TRIGGERS shape has nowhere to put the token')
})

test('the task-intake routine is created, and its prompt acts on the payload', () => {
  const buttons = step(5)
  assert.match(buttons, /`task-intake`/)
  assert.match(buttons, /routine-fire-payload/,
    'fire text arrives marked untrusted, and a routine acts on it only if its prompt names it')
  assert.match(buttons, /source[^.]*agent-cockpit/, 'the prompt does not check where the payload came from')
})

test('/new-workflow wires a button the same way', async () => {
  const skill = (await read('agent-team-os/skills/new-workflow/SKILL.md')).replace(/\s+/g, ' ')
  assert.match(skill, /Generate token/)
  assert.match(skill, /"token": "<that token>"/)
})
