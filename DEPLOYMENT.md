# 🚀 Thermal Guard Deployment Guide

This guide covers multiple deployment options for the Thermal Guard application.

---

## 📋 Table of Contents

1. [Quick Deploy (Recommended)](#quick-deploy-recommended)
2. [Platform-Specific Deployments](#platform-specific-deployments)
3. [Docker Deployment](#docker-deployment)
4. [Environment Variables](#environment-variables)
5. [Post-Deployment](#post-deployment)

---

## ⚡ Quick Deploy (Recommended)

### Option 1: Vercel (Frontend) + Railway (Backend)

This is the **easiest and fastest** way to deploy your app with free tiers.

#### Step 1: Deploy Backend to Railway

1. **Create Railway Account**: Go to [Railway.app](https://railway.app) and sign up
2. **Create New Project**: Click "New Project" → "Deploy from GitHub repo"
3. **Connect Repository**: Select your `thermal-guard` repository
4. **Configure Settings**:
   - Root Directory: Leave empty
   - Build Command: `pip install -r backend/requirements.txt`
   - Start Command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
5. **Add Variables**: In Settings → Variables, add:
   ```
   PYTHON_VERSION=3.12.10
   ```
6. **Deploy**: Railway will automatically deploy your backend
7. **Copy URL**: After deployment, copy the Railway URL (e.g., `https://your-app.railway.app`)

#### Step 2: Deploy Frontend to Vercel

1. **Install Vercel CLI** (optional but recommended):
   ```powershell
   npm install -g vercel
   ```

2. **Deploy via CLI**:
   ```powershell
   vercel
   ```
   - Follow the prompts
   - When asked for environment variables, add:
     ```
     VITE_API_BASE_URL=https://your-railway-backend-url.railway.app
     ```

3. **OR Deploy via GitHub**:
   - Go to [Vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Configure:
     - Framework Preset: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Add Environment Variable:
     ```
     VITE_API_BASE_URL=https://your-railway-backend-url.railway.app
     ```
   - Click "Deploy"

---

## 🎯 Platform-Specific Deployments

### Render (Full Stack)

Deploy both frontend and backend on Render using the included `render.yaml`:

1. **Create Render Account**: Go to [Render.com](https://render.com)
2. **New Blueprint**: Click "New" → "Blueprint"
3. **Connect Repository**: Select your GitHub repository
4. **Auto-Deploy**: Render will read `render.yaml` and deploy both services
5. **Environment Variables**: Set in Render Dashboard:
   - Backend: Already configured
   - Frontend: `VITE_API_BASE_URL` will auto-populate from backend

**Pros**: Single platform, infrastructure as code
**Cons**: Free tier has cold starts

### Netlify (Frontend Only)

1. **Create Netlify Account**: Go to [Netlify.com](https://netlify.com)
2. **Add New Site**: Click "Add new site" → "Import an existing project"
3. **Configure Build**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Environment variables:
     ```
     VITE_API_BASE_URL=https://your-backend-url.com
     ```
4. **Deploy**: Netlify will build and deploy

### AWS (Advanced)

For production-grade deployment:

**Backend** (Elastic Beanstalk or ECS):
```powershell
# Install AWS CLI first
pip install awsebcli

# Initialize EB
cd backend
eb init -p python-3.12 thermal-guard-api

# Create environment
eb create thermal-guard-api-prod

# Deploy
eb deploy
```

**Frontend** (S3 + CloudFront):
```powershell
# Build frontend
npm run build

# Upload to S3 (requires AWS CLI configured)
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

---

## 🐳 Docker Deployment

### Local Testing with Docker Compose

1. **Build and Run**:
   ```powershell
   docker-compose up --build
   ```

2. **Access Application**:
   - Frontend: http://localhost
   - Backend: http://localhost:8000

3. **Stop Services**:
   ```powershell
   docker-compose down
   ```

### Deploy to Cloud with Docker

#### DigitalOcean App Platform

1. Create account at [DigitalOcean](https://www.digitalocean.com)
2. Create App → Select Docker Hub or GitHub
3. Add two components:
   - Backend: Use `Dockerfile.backend`
   - Frontend: Use `Dockerfile.frontend`
4. Configure environment variables
5. Deploy

#### Google Cloud Run

```powershell
# Build and push backend
docker build -f Dockerfile.backend -t gcr.io/YOUR_PROJECT/thermal-guard-backend .
docker push gcr.io/YOUR_PROJECT/thermal-guard-backend

# Deploy
gcloud run deploy thermal-guard-backend \
  --image gcr.io/YOUR_PROJECT/thermal-guard-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

# Build and push frontend
docker build -f Dockerfile.frontend -t gcr.io/YOUR_PROJECT/thermal-guard-frontend .
docker push gcr.io/YOUR_PROJECT/thermal-guard-frontend

# Deploy
gcloud run deploy thermal-guard-frontend \
  --image gcr.io/YOUR_PROJECT/thermal-guard-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

---

## 🔐 Environment Variables

### Backend (Railway/Render)

```bash
# Automatically provided by platform
PORT=8000

# Optional: Python version
PYTHON_VERSION=3.12.10
```

### Frontend (Vercel/Netlify)

```bash
# Required: Backend API URL
VITE_API_BASE_URL=https://your-backend-domain.com

# Optional: Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here
```

### Setting Environment Variables

**Railway**:
1. Go to your project
2. Click "Variables" tab
3. Add key-value pairs

**Vercel**:
1. Go to project settings
2. Click "Environment Variables"
3. Add for Production, Preview, and Development

**Render**:
1. Go to your service
2. Click "Environment" tab
3. Add environment variables

---

## ✅ Post-Deployment

### 1. Test Your Deployment

```powershell
# Test backend health
curl https://your-backend-url.com/health

# Test backend API
curl https://your-backend-url.com/

# Visit frontend
# Open https://your-frontend-url.com in browser
```

### 2. Update CORS Settings

If you get CORS errors, update `backend/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-frontend-domain.vercel.app",
        "http://localhost:3000"  # Keep for local development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 3. Monitor Your Application

**Railway**: Built-in metrics and logs
**Render**: Check "Logs" and "Metrics" tabs
**Vercel**: Analytics available in dashboard

### 4. Set Up Custom Domain (Optional)

**Vercel**:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

**Railway**:
1. Go to Settings → Networking
2. Add custom domain
3. Update DNS CNAME record

---

## 🎬 Quick Start Commands

### Deploy Everything with One Command

**Using Vercel + Railway**:

```powershell
# 1. Deploy frontend to Vercel
vercel --prod

# 2. Note: Deploy backend to Railway via their web interface (easier)
# Or use Railway CLI:
railway login
railway init
railway up
```

### Deploy with Docker Compose (Local/VPS)

```powershell
# Build and run
docker-compose up -d

# Check logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## 🆘 Troubleshooting

### Build Failures

**TensorFlow Installation Issues**:
- Ensure Python 3.12 is used (not 3.14)
- Check platform has enough memory (>512MB)

**Frontend Build Issues**:
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node version: Should be 18+ or 20+

### Runtime Errors

**CORS Errors**:
- Add your frontend domain to CORS origins in `backend/main.py`

**Model Not Loading**:
- Ensure `mobilenet_thermal_model.tflite` is in `backend/models/`
- Check file is included in deployment (not in `.dockerignore`)

**API Connection Failed**:
- Verify `VITE_API_BASE_URL` is set correctly
- Check backend is running: Visit `/health` endpoint

---

## 📊 Recommended Setup

For most users, we recommend:

✅ **Frontend**: Vercel (fast, free, automatic deployments)
✅ **Backend**: Railway (easy Python deployment, free tier)

**Total Cost**: $0/month (within free tier limits)
**Deployment Time**: ~10 minutes
**Maintenance**: Automatic with GitHub integration

---

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [Docker Documentation](https://docs.docker.com)

---

**Need Help?** Check the logs in your deployment platform or create an issue in the repository.
