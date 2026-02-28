# Deploy Medicus to Vercel (Frontend + Backend + Database)

## Important
You cannot "push database" to Vercel directly. For production, use MongoDB Atlas and connect your backend with `MONGODB_URI`.

## 1) Push code to GitHub
From project root:

```bash
git init
git add .
git commit -m "Prepare project for Vercel deployment"
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

If remote already exists:

```bash
git remote set-url origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

## 2) Prepare MongoDB Atlas
1. Create a MongoDB Atlas cluster.
2. Create a database user.
3. Add network access (IP allow list).
4. Copy connection string into backend environment variable:
   - `MONGODB_URI`

## 3) Deploy backend (`server`) on Vercel
1. In Vercel: **Add New Project** → Import your repo.
2. Set **Root Directory** to `server`.
3. Add Environment Variables:
   - `MONGODB_URI` = your Atlas URI
   - `MONGODB_URI_FALLBACK` = `mongodb://127.0.0.1:27017/medicus` (optional)
   - `CORS_ORIGIN` = `https://<your-frontend-domain>.vercel.app,http://localhost:3000`
4. Deploy.
5. Note backend URL, e.g. `https://medicus-backend.vercel.app`.

## 4) Deploy frontend (`Medicus`) on Vercel
1. Add another Vercel project from same repo.
2. Set **Root Directory** to `Medicus`.
3. Add Environment Variables:
   - `REACT_APP_API_URL` = `https://<your-backend-domain>.vercel.app/api`
   - `REACT_APP_GOOGLE_MAPS_API_KEY` = your maps key
4. Deploy.

## 5) Optional: migrate local dump to Atlas
The repo intentionally ignores `server/dump/` and bson metadata files. To move local data to Atlas, run locally:

```bash
mongorestore --uri="<MONGODB_URI>" ./server/dump
```

## 6) Verify production
- Frontend opens and can register/login.
- Backend health endpoint works:
  - `https://<your-backend-domain>.vercel.app/api/health`
- CORS allows frontend domain.

## Notes
- Frontend now supports `REACT_APP_API_URL`.
- Backend is configured for Vercel serverless (`server/vercel.json`) and still runs locally with `npm start`.
