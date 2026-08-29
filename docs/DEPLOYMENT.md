# Free demo deployment on Render

This setup is intended for a portfolio or demonstration. It is not suitable for real company records: Render's free services sleep when idle and its free Postgres database expires after 30 days.

## Deployment Steps

1. **Create a GitHub repository** and push this folder (do not commit `.env`).

2. **Create a PostgreSQL database on Render**:
   - Create a free PostgreSQL database
   - Copy its external connection string for the next steps

3. **Deploy the API service**:
   - Create a new web service from your GitHub repository using `render.yaml`
   - Configure environment variables:
     - `DATABASE_URL`: PostgreSQL connection string
     - `DIRECT_URL`: PostgreSQL connection string (same as DATABASE_URL)
     - `FRONTEND_URL`: Leave blank initially (will set after web app deploys)
   - Wait for deployment to complete
   - Verify it works by visiting `https://your-api-url/health` (should return `{"status":"ok",...}`)

4. **Initialize the database** (run once from your local machine):
   ```bash
   # Set environment variables
   export DATABASE_URL="your-render-postgres-url"
   export DIRECT_URL="your-render-postgres-url"
   
   # Run migrations and seed data
   pnpm --filter @oil-erp/database db:push
   pnpm --filter @oil-erp/database db:seed
   ```

5. **Deploy the web service**:
   - Create another web service from the same GitHub repository using `render.yaml`
   - Configure environment variables:
     - `API_URL`: Set to `https://your-api-url.onrender.com` (the API service URL from step 3)
   - Wait for deployment to complete

6. **Update API CORS** (important for production):
   - Go back to the API service settings
   - Add/update `FRONTEND_URL` to `https://your-web-url.onrender.com`
   - Trigger a redeploy of the API service

7. **Test the deployment**:
   - Open your web app URL
   - Sign in with demo credentials: `admin@oilerp.com` / `Admin@123`
   - Change the password before sharing with others

## Local development

1. Copy `.env.example` to `.env` and fill in:
   - `DATABASE_URL`: Your local PostgreSQL connection
   - `DIRECT_URL`: Your local PostgreSQL connection  
   - `JWT_SECRET`: A random secret string
   - `FRONTEND_URL`: `http://localhost:3000`

2. Start PostgreSQL locally, then run:
   ```bash
   pnpm --filter @oil-erp/database db:push
   pnpm --filter @oil-erp/database db:seed
   ```

3. Run the development server:
   ```bash
   pnpm dev
   ```
   - API will run on `http://localhost:4000`
   - Web app will run on `http://localhost:3000`
