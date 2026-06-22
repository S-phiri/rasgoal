## Live Classroom Module

A scheduling + live video module bolted onto the existing Teacher/Student app. Uses Jitsi Meet (free, no API key) for the MVP video room.

### Scope (MVP)

To keep this shippable in one pass, I'll build the core flow end-to-end and stub the heavier extras. Anything marked *Later* is a follow-up.

**In this build:**
- Teacher: create / edit / cancel class, assign individual students (multi-select from linked students), view upcoming + past, start live room, mark attendance, add resources (links + uploaded files), add recording URL.
- Student: see assigned classes on dashboard, class detail page, Join button gated to 10 min before → end time, view resources & recording.
- Jitsi embedded via `@jitsi/react-sdk` in an in-app classroom page. Unique room name per class (`rasgoal-<classId>`).
- Access control via Supabase RLS: only the teacher who owns the class, assigned students, and admins can read it.

**Later (called out, not built now):**
- Student/class/school *groups* (right now you assign individual students; group assignment needs a groups table — quick follow-up).
- Admin role + admin dashboard (no `admin` app_role exists yet; needs auth changes).
- Homework submission flow (resources view-only for students in v1).
- Push/email notifications (in-app badge on dashboard only for now).

If you want groups or admin in this same pass, say so and I'll fold them in — it just adds another table + UI.

### Database (one migration)

New tables, all with RLS:

- `live_classes` — teacher_id, title, subject, grade, topic, description, scheduled_date, start_time, end_time, duration_minutes, class_type ('one_to_one'|'group'), room_name (unique), recording_url, status ('scheduled'|'live'|'completed'|'cancelled').
- `live_class_assignments` — class_id, student_id, joined_at, attended (bool, set by teacher).
- `live_class_resources` — class_id, title, type ('link'|'file'|'note'|'homework'), url, content, created_at.

**RLS rules:**
- Teachers manage their own classes / assignments / resources.
- Students can read classes where they have an assignment row; same for resources.
- Reuse existing `teacher_student_links` so teachers can only assign students they're linked to.

New storage bucket `class-resources` (private) with policies so teachers upload to their own class folder and assigned students can read.

### Frontend

New routes:
- `/teacher/classes` — list (upcoming + past tabs), Create button.
- `/teacher/classes/new` and `/teacher/classes/:id/edit` — form (title, subject, grade, topic, description, date, start, end, duration auto-computed, type, student multi-select from linked students).
- `/teacher/classes/:id` — detail: assigned students list, attendance checkboxes, resources manager, recording URL field, Start Live button.
- `/classes` — student "My Classes" (upcoming + past).
- `/classes/:id` — student detail: resources, recording, Join button (enabled only in `[start-10min, end]` window).
- `/classes/:id/room` — full-screen Jitsi room, both roles. Closes back to detail on hangup.

Dashboard touch-ups:
- Add an "Upcoming Classes" card on student `Index` and on `TeacherDashboard`.
- Top-nav link to Classes for both roles.

### Tech / styling

- Green education theme already matches existing `--primary` (teal-green). Keep semantic tokens, no raw colors.
- `@jitsi/react-sdk` (no API key, uses public `meet.jit.si`).
- `date-fns` for time windows; small `useNow()` hook ticking every 30s for the Join button gate.
- Mobile-first layouts using existing Tailwind patterns and shadcn components.

### Open question

Should I also build student/class **groups** and an **admin** role + admin dashboard in this same pass, or ship the MVP above first and add those next? They roughly double the size of the change.
