# LOOP — Option C starter

This is the first full-stack starter for **LOOP — Stories worth your time.**

## What it does

- Public LOOP homepage reads published stories from Supabase.
- Admin workspace collects a small set of RSS items.
- AI turns each feed item into an original headline and short summary.
- Every generated item is saved as a **draft** with its source link.
- An editor reviews the source and draft, then approves or rejects it.
- The collector does **not** auto-publish stories.

The AI is not a fact-checker. Verify every claim against the linked source before publishing. Do not paste full articles into LOOP or republish copyrighted material. This starter uses feed titles/snippets only and links to the original publisher.

## Accounts and cost

Vercel and Supabase have free starting tiers, but limits and terms can change. AI API usage may cost money. Do not enable paid billing or share payment details without a parent/guardian helping you review it. You can publish the visual site first and connect the AI service later.

## 1. Create the database

1. Create a Supabase project.
2. Open **SQL Editor**.
3. Run `supabase/schema.sql`.
4. In Project Settings / API, copy the Project URL and the **service_role** secret. Never put the service-role secret in browser code or a public repository.

Official guide: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs

## 2. Configure environment variables

1. Copy `.env.example` to `.env.local`.
2. Add your Supabase URL and service-role key.
3. Add an OpenAI API key and model only if you have authorized access.
4. Replace `ADMIN_SECRET` and `CRON_SECRET` with different long random values.

All four values are server-only. Never rename them with `NEXT_PUBLIC_`.

## 3. Run locally

Install Node.js, then run:

```bash
npm install
npm run dev
```

Open http://localhost:3000. Admin is at http://localhost:3000/admin.

## 4. Deploy

Recommended host: Vercel.

1. Put this project in a private GitHub repository.
2. Import that repository into Vercel.
3. Add the same environment variables in Vercel Project Settings → Environment Variables.
4. Deploy. Vercel will provide a public `*.vercel.app` address.
5. Test the homepage and `/admin`.

Vercel deployment guide: https://nextjs.org/learn/pages-router/deploying-nextjs-app-deploy

## 5. Use Option C

1. Open `/admin`.
2. Enter the `ADMIN_SECRET` value.
3. Press **Collect & create AI drafts**.
4. Check every source link and compare the AI draft against the original report.
5. Press **Approve & publish** only after checking it. Otherwise reject it.

The collector uses these starter RSS feeds: BBC World, BBC Africa, The Guardian Technology, The Guardian Culture and NPR Entertainment. Add reputable sources in `lib/feeds.ts`. Feed availability and terms can change.

## Security checklist before public launch

- Keep the repository private while setting up secrets.
- Never commit `.env.local`.
- Never expose `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, `ADMIN_SECRET` or `CRON_SECRET`.
- Use strong, different secrets.
- Restrict access to the admin URL and rotate the admin secret if it is exposed.
- Add proper Supabase Auth / individual editor accounts before inviting other editors.
- Review RSS publishers' terms and use source links/attribution.
- Add a correction/contact policy and privacy notice before collecting visitor data.

## Current limitations

This is a working starter, not a finished newsroom platform. It has one shared admin secret, a small RSS source list, and no image licensing workflow, comments, analytics, newsletter service, ad network, or scheduled collection. Those should be added deliberately after the first version is tested.
