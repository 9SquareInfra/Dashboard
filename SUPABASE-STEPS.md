# 9 Square Infra Dashboard — Supabase setup (simple steps)

Do these **once**. You need the Supabase project already created  
(URL `https://lfldgnjzxhsgrwxdpqwj.supabase.co`).

---

## 1. Paste the database SQL

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project.
2. Left menu → **SQL Editor** → **New query**.
3. Open the file `supabase-setup.sql` on your computer.
4. Select all → copy → paste into the SQL Editor.
5. Click **Run**.
6. Wait until it says success (green).  
   If it warns that something already exists, that is usually fine.

This creates tables, security rules, the admin helper, and default company settings  
(including invite code `9SQUARE-STAFF` — change it later in the app Settings).

---

## 2. Auth settings (so staff can sign in easily)

1. Left menu → **Authentication** → **Providers** → confirm **Email** is enabled.
2. **Authentication** → **Sign In / Providers** or **Configuration** (wording varies):
   - For a private staff tool, turn **OFF** “Confirm email” / email confirmation  
     so new users can sign in immediately after you create them.
3. Save.

---

## 3. Create the first admin account

**Recommended (simplest):**

1. **Authentication** → **Users** → **Add user** → **Create new user**.
2. Email: `9squareinfravijayawada@gmail.com`
3. Set a strong password (save it somewhere safe).
4. Enable **Auto Confirm User** if you see that checkbox.
5. Create the user.

The SQL trigger promotes this email to **admin** automatically.

Then open the website, sign in with that email + password.

---

## 4. Create other staff accounts

**Option A — Admin creates them in Supabase (best for non-technical teams)**

1. **Authentication** → **Users** → **Add user** for each person (email + password, auto-confirm).
2. Sign in to the dashboard as admin → tab **Users**.
3. Set each person’s **display name** and **role** (`user`, `manager`, or `admin`) → **Save**.

**Option B — Staff self-register with invite code**

1. Admin opens **Settings** and notes/changes **Staff invite code**.
2. On the login page, staff clicks **Create account with invite code**, enters email, password, name, and the invite code.
3. Admin then sets their role under **Users** (default is `user`).

---

## 5. Upload the website to GitHub Pages

1. Unzip `Dashboard-site.zip` (or use the `dashboard-site` folder).
2. Upload **all files inside** that folder to the `9SquareInfra/Dashboard` repo  
   (`index.html`, `styles.css`, `app.js`, `assets/…`, `README.md`) on the branch used for Pages.
3. Repo **Settings → Pages**: source = that branch, folder `/` (root).
4. Site: https://9squareinfra.github.io/Dashboard/

Also keep `supabase-setup.sql` and `SUPABASE-STEPS.md` in the repo (or offline) for reference — they are not required for the site to load.

---

## 6. Optional — import old browser backups

If you used the old local-only dashboard:

1. Sign in as **admin**.
2. **Documents** → **Import old backup → Supabase**.
3. Choose the JSON file from **Export backup**.

---

## 7. Quick check

| Check | Expected |
|-------|----------|
| Sign in as admin | Sees Settings + Users |
| Create estimate → Send for approval | Status “Pending approval” |
| Manager Approves | Status “Approved” |
| Send to WhatsApp | PDF downloads / share sheet; WhatsApp opens |
| Regular user | Cannot open Settings or delete |

---

## Troubleshooting

- **“Invalid invite code”** — Settings invite code must match; or create the user in Supabase Auth instead.
- **Sign up works but cannot sign in** — turn off email confirmation (step 2), or confirm the email.
- **Permission / RLS errors** — re-run `supabase-setup.sql`; confirm you are signed in; check role under **Users**.
- **PDF blank** — open the **Quotation** tab first so the printable page exists, then send/download.

---

## Security reminder

Only the **publishable** key belongs in the website. Never put the **secret / service_role** key in GitHub or in `app.js`.
