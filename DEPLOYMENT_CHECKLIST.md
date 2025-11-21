# 🚀 Deployment Checklist

## Pre-Deployment

### 1. Code Preparation
- [ ] All code committed to Git
- [ ] Model file exists: `backend/models/mobilenet_thermal_model.tflite`
- [ ] Dependencies are up to date
- [ ] Tests pass locally (if you have tests)
- [ ] Backend runs successfully: `python backend/main.py`
- [ ] Frontend runs successfully: `npm run dev`

### 2. Environment Variables
- [ ] `.env.example` file created with required variables
- [ ] Backend environment variables documented
- [ ] Frontend environment variables documented

### 3. Repository Setup
- [ ] Code pushed to GitHub/GitLab
- [ ] Repository is public or you have deployment access
- [ ] `.gitignore` properly configured
- [ ] Model file is tracked in Git (not ignored)

---

## Deployment Steps

### Option A: Vercel + Railway (Recommended - Easiest)

#### Backend (Railway)
1. [ ] Go to [Railway.app](https://railway.app)
2. [ ] Sign in with GitHub
3. [ ] Click "New Project" → "Deploy from GitHub repo"
4. [ ] Select `thermal-guard` repository
5. [ ] Configure:
   - [ ] Start command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
6. [ ] Add environment variable: `PYTHON_VERSION=3.12.10`
7. [ ] Wait for deployment to complete
8. [ ] Test health endpoint: `https://your-app.railway.app/health`
9. [ ] Copy Railway URL for frontend configuration

#### Frontend (Vercel)
1. [ ] Go to [Vercel.com](https://vercel.com)
2. [ ] Sign in with GitHub
3. [ ] Click "Add New" → "Project"
4. [ ] Import `thermal-guard` repository
5. [ ] Configure:
   - [ ] Framework: Vite
   - [ ] Build Command: `npm run build`
   - [ ] Output Directory: `dist`
6. [ ] Add environment variable:
   ```
   VITE_API_BASE_URL=<YOUR_RAILWAY_URL>
   ```
7. [ ] Click "Deploy"
8. [ ] Wait for deployment
9. [ ] Test the application

---

### Option B: Render (Full Stack on One Platform)

1. [ ] Go to [Render.com](https://render.com)
2. [ ] Sign in with GitHub
3. [ ] Click "New" → "Blueprint"
4. [ ] Connect to `thermal-guard` repository
5. [ ] Render will read `render.yaml` automatically
6. [ ] Wait for both services to deploy
7. [ ] Check environment variables are set correctly
8. [ ] Test both frontend and backend

---

### Option C: Docker (Self-Hosted or Cloud)

#### Local Testing First
1. [ ] Install Docker Desktop
2. [ ] Run: `docker-compose up --build`
3. [ ] Test: http://localhost (frontend) and http://localhost:8000 (backend)
4. [ ] Stop: `docker-compose down`

#### Deploy to Cloud
Choose one:

**DigitalOcean App Platform:**
1. [ ] Create DigitalOcean account
2. [ ] Create App from GitHub
3. [ ] Configure both Dockerfiles
4. [ ] Deploy

**Google Cloud Run:**
1. [ ] Setup gcloud CLI
2. [ ] Build and push images
3. [ ] Deploy services
4. [ ] Configure environment variables

**AWS ECS/Fargate:**
1. [ ] Create ECR repositories
2. [ ] Push Docker images
3. [ ] Create task definitions
4. [ ] Deploy services

---

## Post-Deployment

### 1. Verify Deployment
- [ ] Backend health check works: `https://your-backend-url/health`
- [ ] Backend API docs accessible: `https://your-backend-url/docs`
- [ ] Frontend loads correctly
- [ ] Can upload/capture images
- [ ] Image analysis works end-to-end
- [ ] Results display correctly

### 2. Configure CORS (If Needed)
If you get CORS errors:
- [ ] Update `backend/main.py` with your frontend domain
- [ ] Redeploy backend
- [ ] Test again

### 3. Performance Check
- [ ] Frontend loads in <3 seconds
- [ ] Image analysis completes in <10 seconds
- [ ] No console errors in browser
- [ ] Mobile responsive works

### 4. Optional Enhancements
- [ ] Set up custom domain
- [ ] Configure SSL certificate (usually automatic)
- [ ] Set up monitoring/alerts
- [ ] Configure auto-scaling (if needed)
- [ ] Add error tracking (e.g., Sentry)
- [ ] Set up CI/CD pipeline

---

## Troubleshooting

### Backend Issues
- [ ] Check logs in deployment platform
- [ ] Verify Python version is 3.12
- [ ] Ensure model file is present
- [ ] Check memory limits (TensorFlow needs >512MB)

### Frontend Issues
- [ ] Verify `VITE_API_BASE_URL` is correct
- [ ] Check for CORS errors in browser console
- [ ] Ensure build completed successfully
- [ ] Check Node.js version (should be 18+)

### Common Fixes
- [ ] Restart dyno/service
- [ ] Clear build cache and rebuild
- [ ] Check environment variables are set
- [ ] Verify Git commits are pushed

---

## Quick Deploy Commands

### Vercel CLI (Frontend)
```powershell
npm install -g vercel
vercel login
vercel --prod
```

### Railway CLI (Backend)
```powershell
npm install -g @railway/cli
railway login
railway init
railway up
```

### Docker Test
```powershell
docker-compose up --build
```

---

## Success Criteria

✅ Backend API responds at `/health` endpoint
✅ Frontend loads without errors
✅ Image upload/capture works
✅ Analysis returns valid results
✅ No CORS errors
✅ Responsive on mobile devices
✅ Both services auto-restart on failure

---

## Resources

- [Deployment Guide](./DEPLOYMENT.md) - Full documentation
- Backend logs: Check your platform's logs section
- Frontend logs: Browser DevTools Console
- API testing: Use Postman or curl

---

**Last Updated**: November 21, 2025
**Deployment Status**: ⏳ Ready to Deploy
