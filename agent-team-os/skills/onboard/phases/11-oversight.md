# Phase 11 — Oversight

**Time:** 30 minutes
**Ends with:** the dashboard live at a URL they own, the fire buttons wired, the URL
bookmarked on their phone, and one job dispatched from that phone and watched to the end.

This is stage 5 of 6. The team already works; this phase makes it visible from a phone at
the school gate. More people are lost by not finding their way back in than by anything
technical — the bookmark at the end is not a nicety, it is the retention step.

## Open with

> "Phase 11 of 12: oversight. Your team runs whether you watch or not. This gives you the
> window to watch through — five screens, on your phone, at a URL you own. Half an hour,
> and the last step happens on your phone, not your laptop."

## How this phase is driven

You are the guide, not the operator. Every step here happens in **their** browser, on
**their** accounts — GitHub, Vercel, their phone. You tell them exactly where to click and
what to type; you do not run deploy commands, and nothing from this phase gets written
into a file in the repo. The dashboard's settings live in Vercel's own settings screen and
nowhere else.

## Steps

### 1. Fork the dashboard

Their copy, on their GitHub:

> "Open `github.com/vc-incubator/agent-cockpit` and press **Fork**, top right. Keep
> the name. This copy is yours — if we disappear tomorrow, it keeps working."

### 2. Put it on Vercel

> "Go to `vercel.com/new` — sign in with your GitHub if it asks — and pick your
> `agent-cockpit` fork. **Before you press Deploy, read me the project name on the screen.**"

Wait for them to read it back. It must say `agent-cockpit`. Vercel's picker lists every repo
they own, and the team repo sits right next to the fork. Deploy the team repo by mistake and
Vercel serves it to anyone with the link: the business brain, the client list, all of it,
behind what looks like an ordinary 404. If the name is anything else, go back and pick again.

Then:

> "Press **Deploy**. There is no build step; it takes under a minute."

The first deploy shows the dashboard's own message about not being able to read the repo, or
about not being configured. Say up front that this is expected — step 3 is what fixes it.
**A bare 404 page instead means the wrong repo was deployed.** Stop, delete that project at
once (Settings → Advanced → Delete Project) and start step 2 again.

### 3. Tell it which repo to read

In their Vercel project: **Settings → Environment Variables**. They type the values into
that form. Do not ask them to paste any of these values into this chat, and do not write
any of them into a file — the Vercel form is the only place they go.

| Name | Value |
|---|---|
| `GITHUB_OWNER` | Their GitHub username |
| `GITHUB_REPO` | Their team repo's name |
| `GITHUB_TOKEN` | Only if the team repo is private — step 4 |
| `VIEW_KEY` | A long random string they make up (`openssl rand -hex 32` works). The board's password |
| `FIRE_KEY` | Step 5 |
| `FIRE_TRIGGERS` | Step 5 |

**`VIEW_KEY` is not optional for a private team repo.** Without it the dashboard refuses to
serve and says it is not configured. Its own message offers a way out, `PUBLIC_DASHBOARD=true`,
and that setting shows the board, and everything the board reads from the repo, to anyone with
the URL. Use it only when the team repo itself is public. The page asks for the view key once
per browser and remembers it.

Then **Deployments → the latest one → Redeploy**. The five screens should load with their
real team on them, after the view key.

### 4. If the team repo is private

Most are, because the business brain is in there.

> "Make a token at `github.com/settings/personal-access-tokens/new`. Repository access:
> only your team repo. Permissions: Contents, read-only. Nothing else. Paste it into
> `GITHUB_TOKEN` in the Vercel form, then redeploy."

Say why the scope is that narrow: the dashboard only ever reads. A token that can write is
a token that can be abused, and this one has no reason to exist with write access.

### 5. Wire the fire buttons

Every workflow with `fire: true` becomes a Run button. Two variables in the same Vercel
form make the buttons live:

- **`FIRE_KEY`** — a long random string they invent or generate
  (`openssl rand -hex 32` in any terminal works). The dashboard asks for it once per
  browser tab, on the first tap.
- **`FIRE_TRIGGERS`** — one JSON object mapping each workflow's slug to its routine's API
  trigger: a URL and a token. A routine has neither until one is added. For each
  fire-enabled workflow: `claude.ai/code` → Routines → open the routine → menu → **Edit** →
  **Add another trigger** → **API**. The box shows the URL. Then **Generate token**, and copy
  it straight into the Vercel form: it is shown once and never again.

The Add task, New workflow, Arm and Approve buttons all go to one more routine, `task-intake`,
which is not a workflow and which nothing so far has created. Make it now, the same way as the
others (their repo, no connectors, Sonnet, no schedule), with this prompt:

> "You were started from the owner's dashboard. The routine-fire-payload block holds one JSON
> dispatch from it, with `source: agent-cockpit`. Do exactly what its `instruction` field says,
> in this repo, following CLAUDE.md, then commit and push to main. If the payload is missing,
> or its source is anything else, do nothing and say so."

The prompt has to name the payload: text sent to a routine arrives marked as untrusted, and a
routine acts on it only when its own prompt says to. Then add its API trigger and token the
same way.

Give them the shape with placeholders and let them fill the real values directly into the
Vercel form:

```json
{"monday-brief": {"url": "PASTE-THE-URL", "token": "PASTE-THE-TOKEN"}, "task-intake": {"url": "PASTE-THE-URL", "token": "PASTE-THE-TOKEN"}}
```

The tokens are secrets: anyone holding one can start that routine on their account. So: into
the Vercel form, not into the repo, not into this chat. If one gets pasted here anyway, tell
them to regenerate it on the routine (that revokes the old one) and do not repeat it back.

Redeploy once more after saving.

If their deployment is already locked behind Vercel's own authentication (team-only
access), `PUBLIC_FIRE` set to `true` skips the key prompt for same-origin taps. On a
normal public URL, leave it unset.

### 6. Bookmark it on the phone — before anything else

This happens now, not at the end of the session:

> "Take out your phone. Open the dashboard URL. Add it to your home screen — Share →
> Add to Home Screen on iPhone, the browser menu → Add to Home screen on Android. Do it
> now, while we are both looking at it."

### 7. Dispatch from the phone

The closing move of the whole install:

> "From your phone, open the Workflows screen, tap Run on one of your jobs, and put in
> your fire key when it asks. Then watch: the run appears, and when it finishes there is
> a commit in your repo that neither of us typed on a keyboard."

Wait for them to tell you what they saw. This is the moment the course was building to —
give it a beat before closing out.

## Check

- The dashboard loads at their Vercel URL with their agents and workflows on screen
- The icon is on their phone's home screen
- They confirm, in their own words: they dispatched a job from the phone and watched it
  run to a result
- The Vercel project is named `agent-cockpit`, and the board asked for the view key
- No token, key, or trigger URL appears in any file in the repo or in this conversation

## Close out

```bash
git add .agent-team/
git commit -m "onboard: phase 11, oversight"
git push
```

Set `install_complete: true` and `oversight_complete: true` in
`.agent-team/onboarding-state.md`.

One phase left, and it is the one that keeps this alive past month one:

> "Your team runs and you can watch it from your phone. The last phase is the one that makes
> it get better instead of just staying busy — your own standard, in your words, and a weekly
> check that keeps everything current. Twenty-five minutes. Continue to phase 12, or pause?"

Do not run the finishing steps in the skill file here — those close the install after phase
12.

## If it goes wrong

| What they saw | What to do |
|---|---|
| Deploy succeeded but the screens are empty | `GITHUB_OWNER` or `GITHUB_REPO` is misspelled, or the repo is private with no token. Fix in the Vercel form, redeploy. |
| A 503 when tapping Run | `FIRE_KEY` or `FIRE_TRIGGERS` is unset. Closed is the endpoint's default — set both, redeploy. |
| A 401 that will not clear | The key typed on the phone differs from the one in Vercel. Retype it; the page drops a wrong key and asks again. |
| Tap accepted but nothing ran | The slug in `FIRE_TRIGGERS` does not match the workflow filename, or the workflow lacks `fire: true`. Match the slug to `workflows/<slug>.yml`. |
| "is a Claude Code routine with no token" | That entry in `FIRE_TRIGGERS` is a bare URL. Generate the routine's token and change the entry to `{"url": "...", "token": "..."}`, then redeploy. |
| "refused its token (status 401)" | The token was regenerated or revoked since it was saved. Generate a new one on the routine and update the Vercel form. |
| A 502 on every tap | The trigger URL is wrong or the routine was deleted. Copy it fresh from the routine's API trigger and update the Vercel form. |
| The dashboard URL shows a bare 404 | The wrong repo was deployed, most likely the team repo. Delete that Vercel project now and redo step 2. |
