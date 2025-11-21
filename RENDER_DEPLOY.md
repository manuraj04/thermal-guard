# 🚀 Deploy to Render - Step by Step Guide

Render will host both your frontend and backend on one platform!

---

## 📋 Prerequisites

1. ✅ Code pushed to GitHub
2. ✅ GitHub account
3. ✅ Model file in `backend/models/mobilenet_thermal_model.tflite`

---

## 🎯 Deployment Steps

### Step 1: Create Render Account

1. Go to https://render.com (opened in your browser)
2. Click **"Get Started"**
3. Sign up with **GitHub** (recommended)
4. Authorize Render to access your GitHub repositories

---

### Step 2: Deploy Using Blueprint (Easiest Way)

#### Option A: Deploy via Blueprint (Recommended)

1. **Create New Blueprint**:
   - In Render Dashboard, click **"New +"** (top right)
   - Select **"Blueprint"**

2. **Connect Repository**:
   - Click **"Connect a repository"**
   - Find and select **`thermal-guard`** repository
   - Click **"Connect"**

3. **Configure Blueprint**:
   - Render will automatically detect `render.yaml`
   - You'll see two services listed:
     - ✅ `thermal-guard-api` (Backend)
     - ✅ `thermal-guard-frontend` (Frontend)

4. **Set Service Group Name**:
   - Enter a name: `thermal-guard-production`
   - Click **"Apply"**

5. **IMPORTANT - Set Frontend Environment Variable**:
   - Before deploying, you need to set the backend URL
   - Click on **`thermal-guard-frontend`** service
   - Under "Environment", you'll see `VITE_API_BASE_URL`
   - For now, leave it blank - we'll update it after backend deploys

6. **Deploy**:
   - Click **"Create Blueprint"** or **"Apply"**
   - Render will start deploying both services

7. **Wait for Backend to Deploy** (5-10 minutes):
   - Click on **`thermal-guard-api`** service
   - Wait until status shows **"Live"** (green)
   - Copy the URL (e.g., `https://thermal-guard-api.onrender.com`)

8. **Update Frontend Environment Variable**:
   - Go back to **`thermal-guard-frontend`** service
   - Click **"Environment"** in left sidebar
   - Find `VITE_API_BASE_URL`
   - Click **"Edit"**
   - Set value to: `https://thermal-guard-api.onrender.com` (your backend URL)
   - Click **"Save Changes"**
   - Frontend will automatically redeploy

9. **Wait for Frontend** (3-5 minutes):
   - Wait until status shows **"Live"**
   - Click on the frontend URL
   - ✅ Your app is live!

---

#### Option B: Manual Service Creation (Alternative)

If Blueprint doesn't work, create services manually:

##### A. Deploy Backend First

1. **Create Web Service**:
   - Click **"New +"** → **"Web Service"**
   - Connect GitHub repo: `thermal-guard`
   - Click **"Connect"**

2. **Configure Backend**:
   ```
   Name: thermal-guard-api
   Region: Oregon (US West)
   Branch: main
   Root Directory: (leave blank)
   Runtime: Python 3
   Build Command: pip install -r backend/requirements.txt
   Start Command: cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
   Plan: Free
   ```

3. **Add Environment Variable**:
   - Click **"Advanced"** → **"Add Environment Variable"**
   - Key: `PYTHON_VERSION`
   - Value: `3.12.10`

4. **Set Health Check** (Optional but recommended):
   - Health Check Path: `/health`

5. **Create Web Service**:
   - Click **"Create Web Service"**
   - Wait 5-10 minutes for deployment
   - **Copy the URL** once it's live

##### B. Deploy Frontend

1. **Create Static Site**:
   - Click **"New +"** → **"Static Site"**
   - Connect same GitHub repo
   - Click **"Connect"**

2. **Configure Frontend**:
   ```
   Name: thermal-guard-frontend
   Branch: main
   Root Directory: (leave blank)
   Build Command: npm install && npm run build
   Publish Directory: ./dist
   ```

3. **Add Environment Variable**:
   - Click **"Advanced"** → **"Add Environment Variable"**
   - Key: `VITE_API_BASE_URL`
   - Value: `https://thermal-guard-api.onrender.com` (your backend URL from step A)

4. **Create Static Site**:
   - Click **"Create Static Site"**
   - Wait 3-5 minutes
   - ✅ Done!

---

## ✅ Verify Deployment

### 1. Test Backend
```
Visit: https://thermal-guard-api.onrender.com/health

Should see:
{
  "status": "healthy",
  "model_loaded": true
}
```

### 2. Test API Documentation
```
Visit: https://thermal-guard-api.onrender.com/docs

Should see: FastAPI Swagger UI
```

### 3. Test Frontend
```
Visit: https://thermal-guard-frontend.onrender.com

Should see: Thermal Guard app interface
```

### 4. End-to-End Test
1. Open your frontend URL
2. Upload or capture a thermal image
3. Click "Analyze Image"
4. Should receive analysis results
5. ✅ **Success!**

---

## 🔧 Troubleshooting

### Backend Issues

**Build Fails - TensorFlow Error**:
```
Solution: Ensure PYTHON_VERSION=3.12.10 is set in environment variables
```

**Build Fails - Requirements Error**:
```
Solution: Check that requirements.txt is in backend/ folder
Check logs for specific missing package
```

**Service Crashes on Startup**:
```
Solution: 
1. Check logs for model loading error
2. Ensure mobilenet_thermal_model.tflite is in backend/models/
3. Verify model file is committed to Git (not in .gitignore)
```

### Frontend Issues

**Build Succeeds but Shows Blank Page**:
```
Solution: Check browser console for errors
Verify VITE_API_BASE_URL is set correctly
```

**CORS Error in Browser Console**:
```
Solution: Update backend/main.py CORS settings:

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://thermal-guard-frontend.onrender.com",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Then redeploy backend
```

**"Failed to Analyze Image" Error**:
```
Solution:
1. Verify VITE_API_BASE_URL matches backend URL exactly
2. Test backend /health endpoint
3. Check backend logs for errors
4. Ensure backend is "Live" status
```

### Free Tier Limitations

**⚠️ Cold Starts**:
- Free tier services "spin down" after 15 minutes of inactivity
- First request after inactivity takes 30-60 seconds to wake up
- This is normal for Render's free tier

**Solution for Better Performance**:
- Upgrade to paid plan ($7/month) for 24/7 uptime
- Or: Keep service warm with uptime monitor (e.g., UptimeRobot)

---

## 🎨 Custom Domain (Optional)

### Add Custom Domain to Frontend

1. Go to your static site dashboard
2. Click **"Settings"** → **"Custom Domain"**
3. Click **"Add Custom Domain"**
4. Enter your domain (e.g., `thermal-guard.yourdomain.com`)
5. Update DNS records as instructed by Render
6. Wait for SSL certificate (automatic)

### Add Custom Domain to Backend

1. Go to your web service dashboard
2. Click **"Settings"** → **"Custom Domain"**
3. Follow same steps as frontend

---

## 📊 Monitoring & Logs

### View Logs

**Backend Logs**:
1. Go to `thermal-guard-api` service
2. Click **"Logs"** tab
3. See real-time logs

**Frontend Logs**:
1. Go to `thermal-guard-frontend` service
2. Click **"Events"** tab
3. See deployment logs

### Monitor Performance

**Backend Metrics**:
- Go to service → **"Metrics"** tab
- See CPU, Memory, Request count

**Check Status**:
- Dashboard shows all services
- Green = Live
- Yellow = Building
- Red = Failed

---

## 🔄 Auto-Deployments

Render automatically deploys when you push to GitHub!

**How it Works**:
1. Push code to GitHub
2. Render detects the push
3. Automatically rebuilds and redeploys
4. No manual action needed

**Disable Auto-Deploy** (if needed):
1. Go to service → **"Settings"**
2. Scroll to **"Build & Deploy"**
3. Toggle **"Auto-Deploy"** off

---

## 💰 Cost Information

**Free Tier Includes**:
- ✅ 750 hours/month of runtime (both services combined)
- ✅ Automatic HTTPS/SSL
- ✅ Global CDN for static sites
- ✅ 100GB bandwidth/month
- ⚠️ Services spin down after 15 min inactivity

**Paid Plans** (if you need more):
- **Starter**: $7/month per service
  - No spin down
  - 24/7 uptime
  - Better performance
  
**Total for Both Services**: $14/month (if upgraded)

---

## 🎉 Success Checklist

After deployment, you should have:

- ✅ Backend running at `https://thermal-guard-api.onrender.com`
- ✅ Frontend running at `https://thermal-guard-frontend.onrender.com`
- ✅ Backend `/health` endpoint returning healthy status
- ✅ Frontend loads without errors
- ✅ Image analysis works end-to-end
- ✅ Auto-deployment from GitHub enabled
- ✅ HTTPS enabled automatically

---

## 📞 Need Help?

- **Render Documentation**: https://render.com/docs
- **Render Community**: https://community.render.com
- **Service Logs**: Check in Render dashboard
- **Browser Console**: Check for frontend errors

---

## 🚀 Next Steps

1. **Test Your App**: Upload thermal images and verify analysis
2. **Share Your URL**: Give frontend URL to users
3. **Monitor Usage**: Check Render dashboard regularly
4. **Set Up Uptime Monitor**: Use UptimeRobot to keep service warm
5. **Consider Upgrading**: If you need 24/7 uptime

---

**Deployment Time**: ~15 minutes
**Difficulty**: ⭐⭐ (Easy)
**Cost**: Free (with limitations)

**Your app will be live at**:
- Frontend: `https://thermal-guard-frontend.onrender.com`
- Backend: `https://thermal-guard-api.onrender.com`

🎊 **Congratulations on deploying to Render!** 🎊
