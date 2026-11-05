# 9 Square Infra – Estimates, Quotations & Agreements

Shared staff dashboard (Supabase backend). Live site: https://9squareinfra.github.io/Dashboard/

## Setup

Follow **[SUPABASE-STEPS.md](SUPABASE-STEPS.md)** : paste SQL once, create users, upload these files to GitHub Pages.

## Roles

| Role | Can do |
|------|--------|
| **user** | Create/edit own estimates & quotations, save, print, send for approval |
| **manager** | Everything user can + see all docs, approve / send back, WhatsApp PDF to customer, mark accepted/rejected |
| **admin** | Everything manager can + Settings (letterhead, invite code), delete docs, import old backups, manage Users & roles |

## Workflow

1. Staff creates estimate → **Send for approval**
2. Manager opens **Pending approvals** → edit if needed → **Approve** or **Send back** (with comment)
3. After **Approved** → **Send to customer on WhatsApp** (PDF + wa.me message) → status **sent**
4. Later mark **Accepted** or **Rejected**

## Security note

The publishable Supabase key is meant for the browser. Real protection is **Row Level Security** in the SQL you paste. Never put the **service_role / secret** key in this site.

## Files

- `index.html` – shell + CDN (supabase-js, html2pdf)
- `styles.css` – dark / gold theme
- `app.js` – app
- `assets/logo.png`

Offline: the current working estimate is cached in `localStorage` as a draft only. Source of truth is Supabase.
