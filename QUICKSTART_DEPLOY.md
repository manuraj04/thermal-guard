# 🚀 Quick Start: Deploy in 10 Minutes

This guide will get your Thermal Guard app deployed in under 10 minutes using the easiest free platforms.

---

## ⚡ Fast Track Deployment

### Step 1: Deploy Backend (Railway) - 5 minutes

1. **Open Railway**: https://railway.app
   - Click "Login" → Sign in with GitHub

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `thermal-guard` repository
   - Click "Deploy Now"

3. **Configure Service**:
   - Railway will auto-detect Python
   - Click on your service
   - Go to "Settings" tab
   - Scroll to "Deploy"
   - Set **Custom Start Command**:
     ```
     cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
     ```
   - Click "Save"

4. **Add Environment Variable** (Optional):
   - Go to "Variables" tab
   - Click "New Variable"
   - Add: `PYTHON_VERSION` = `3.12.10`

5. **Get Your Backend URL**:
   - Go to "Settings" tab
   - Under "Networking", click "Generate Domain"
   - Copy the URL (e.g., `https://thermal-guard-production.up.railway.app`)
   - ✅ **Save this URL - you'll need it in Step 2!**

6. **Verify Deployment**:
   - Visit: `https://your-app.railway.app/health`
   - You should see: `{"status": "healthy", "model_loaded": true}`
   - ✅ Backend is live!

---

### Step 2: Deploy Frontend (Vercel) - 5 minutes

#### Option A: Via Vercel Website (Easiest)

1. **Open Vercel**: https://vercel.com
   - Click "Sign Up" → Use GitHub

2. **Import Project**:
   - Click "Add New..." → "Project"
   - Click "Import" next to your `thermal-guard` repo
   - If not listed, click "Adjust GitHub App Permissions"

3. **Configure Project**:
   - Framework Preset: **Vite** (should auto-detect)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `dist` (default)

4. **Add Environment Variable**:
   - Click "Environment Variables"
   - Add variable:
     - Name: `VITE_API_BASE_URL`
     - Value: `https://your-railway-url.railway.app` (from Step 1)
   - Select all environments (Production, Preview, Development)
   - Click "Add"

5. **Deploy**:
   - Click "Deploy"
   - Wait 1-2 minutes
   - ✅ Done! Click "Visit" to see your app

#### Option B: Via PowerShell Script

1. **Run Deployment Script**:
   ```powershell
   .\deploy.ps1
   ```

2. **Follow Prompts**:
   - Enter your Railway backend URL when asked
   - Script will build and deploy to Vercel
   - Follow Vercel CLI prompts if asked to login

---

## ✅ Verification Checklist

After deployment, verify everything works:

1. **Backend Health Check**:
   ```
   Visit: https://your-app.railway.app/health
   Should see: {"status": "healthy", "model_loaded": true}
   ```

2. **Backend API Docs**:
   ```
   Visit: https://your-app.railway.app/docs
   Should see: FastAPI interactive documentation
   ```

3. **Frontend Loading**:
   ```
   Visit: https://your-app.vercel.app
   Should see: Thermal Guard interface
   ```

4. **End-to-End Test**:
   - Open your Vercel app
   - Upload or capture a thermal image
   - Click "Analyze Image"
   - Should receive analysis results
   - ✅ **If you see results, congratulations! You're deployed!**

---

## 🐛 Troubleshooting

### "Failed to analyze image" Error

**Cause**: Frontend can't reach backend (CORS or wrong URL)

**Fix**:
1. Check `VITE_API_BASE_URL` in Vercel environment variables
2. Make sure it matches your Railway URL exactly
3. Ensure Railway service is running (check Railway dashboard)
4. If CORS error in console, update `backend/main.py`:
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["https://your-vercel-app.vercel.app"],
       # ... rest of config
   )
   ```
5. Redeploy backend

### Railway Build Fails

**Cause**: Python version or dependencies issue

**Fix**:
1. Check Railway logs (click on service → "Deployments" → failed deployment)
2. Ensure Python 3.12 is being used
3. Check `requirements.txt` is in `backend/` folder
4. Verify start command is correct

### Vercel Build Fails

**Cause**: Missing dependencies or wrong build config

**Fix**:
1. Check Vercel deployment logs
2. Ensure `package.json` is in root directory
3. Verify Node.js version is 18 or 20 in Vercel settings
4. Try clearing cache and redeploying

---

## 🎯 Next Steps After Deployment

1. **Custom Domain** (Optional):
   - Vercel: Settings → Domains → Add custom domain
   - Railway: Settings → Networking → Add custom domain

2. **Monitor Your App**:
   - Railway: Check "Metrics" tab for backend performance
   - Vercel: Check "Analytics" for frontend usage

3. **Set Up Continuous Deployment**:
   - Both platforms auto-deploy when you push to GitHub
   - No extra setup needed!

4. **Share Your App**:
   - Copy your Vercel URL
   - Share with users
   - Start analyzing thermal images!

---

## 💰 Cost Estimate

**Free Tier Limits**:
- **Railway**: 500 hours/month (~$5 credit) - More than enough for testing
- **Vercel**: Unlimited deployments, 100GB bandwidth/month

**Expected Cost**: $0/month for personal projects and testing

**When to Upgrade**:
- High traffic (>100 users/day)
- Need faster cold start times
- Require guaranteed uptime

---

## 📞 Need Help?

- **Full Documentation**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Checklist**: See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs

---

## 🎉 Success!

If you've made it this far and your app is working, congratulations! 

Your Thermal Guard application is now:
- ✅ Deployed globally
- ✅ Auto-scaling
- ✅ Auto-updating on code changes
- ✅ Accessible via HTTPS
- ✅ Ready for real-world use

**Share your deployed app URL! 🚀**

---

**Deployment Date**: November 21, 2025
**Estimated Time**: ~10 minutes
**Difficulty**: ⭐⭐ (Easy)
