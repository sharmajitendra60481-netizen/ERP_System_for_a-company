# Free demo deployment on Render

This setup is intended for a portfolio or demonstration. It is not suitable for real company records: Render's free services sleep when idle and its free Postgres database expires after 30 days.

1. Create a new GitHub repository and push this folder. Do not add `.env`.
2. In Render, create a free PostgreSQL database. Copy its external connection string into `DATABASE_URL` and `DIRECT_URL` on the `oilerp-api` service.
3. Create the API web service from this repository using `render.yaml`. After it deploys, open `https://your-api-url/health` to verify it.
4. Run the database schema and demo seed once from a local machine connected to the Render database:

   `pnpm --filter @oil-erp/database db:push`

   `pnpm --filter @oil-erp/database db:seed`

5. Deploy `oilerp-web`. Set its `API_URL` environment variable to the public URL of `oilerp-api`, then redeploy the web service.
6. Sign in using `admin@oilerp.com` and `Admin@123`. Change demo credentials before sharing a persistent deployment.

## Local run

1. Copy `.env.example` to `.env` and fill in local PostgreSQL connection strings plus a JWT secret.
2. Start PostgreSQL locally, then run `pnpm --filter @oil-erp/database db:push` and `pnpm --filter @oil-erp/database db:seed`.
3. Run `pnpm dev` and open `http://localhost:3000`.
