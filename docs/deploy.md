# Deploy

https://diegosancheztirado.com and https://www.diegosancheztirado.com are custom domains on the Cloudflare Worker `diego-personal-site`, production, in the `diegosancheztirado.com` zone. The apex is not a Pages project and has no Git-connected build.

Sign in once on this machine:

```bash
npx wrangler login
```

From a checkout of `main`:

```bash
npm ci
npm run deploy
```

`npm run deploy` runs `scripts/build.mjs`, which writes `dist/`, then `wrangler deploy`. The Worker name and the asset directory are in `wrangler.jsonc`. That config also sets `workers_dev`, so the same deploy updates the Workers subdomain. The public site is the two custom domains above.

Deploy only this Worker. Do not create a zone, edit DNS, or change `todo.diegosancheztirado.com`.
