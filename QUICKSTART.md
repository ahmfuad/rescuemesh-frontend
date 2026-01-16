# RescueMesh Frontend - Quick Start Guide

## 🚀 Get Started in 3 Minutes

### Prerequisites
- Node.js 18+ installed
- RescueMesh backend running (API Gateway on port 8000)

### Option 1: Development Mode (Recommended)

```bash
# Navigate to frontend directory
cd /home/ahmf/Documents/rescuemesh/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Access the app**: http://localhost:3000

### Option 2: Docker (Production-like)

```bash
# Build and run with Docker
cd /home/ahmf/Documents/rescuemesh/frontend
docker build -t rescuemesh-frontend .
docker run -p 3000:80 rescuemesh-frontend
```

**Access the app**: http://localhost:3000

## 📋 What You Get

### Pages Included:
1. **Dashboard** (`/`) - Overview of all metrics
2. **Disasters** (`/disasters`) - View and create disasters
3. **Disaster Detail** (`/disasters/:id`) - Detailed disaster info
4. **Users** (`/users`) - Browse volunteers and users
5. **Skills & Resources** (`/skills`) - Available skills and equipment
6. **SOS Requests** (`/sos`) - Emergency requests
7. **Matching** (`/matching`) - Volunteer matching results
8. **Notifications** (`/notifications`) - Notification center

### Features:
- ✅ Fully responsive design (mobile, tablet, desktop)
- ✅ Chakra UI v2 components
- ✅ Real-time data from backend API
- ✅ Beautiful purple gradient theme
- ✅ Interactive forms and modals
- ✅ Mock data for demonstration
- ✅ Error handling and loading states

## 🔧 Configuration

Edit `.env` file:
```bash
VITE_API_BASE_URL=http://localhost:8000  # Your API Gateway URL
VITE_APP_TITLE=RescueMesh
```

## 🎨 UI Components

Built with Chakra UI v2:
- Cards, Badges, Buttons
- Forms with validation
- Modal dialogs
- Stats and metrics
- Responsive grids
- Navigation sidebar
- Alert notifications

## 🔗 API Integration

Connects to these backend services via API Gateway:
- **Disaster Service** (Port 3003)
- **User Service** (Port 3001)
- **Skill Service** (Port 3002)
- **SOS Service** (Port 3004)
- **Matching Service** (Port 3005)
- **Notification Service** (Port 3006)

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (stacked layout)
- **Tablet**: 768px - 1024px (2 columns)
- **Desktop**: > 1024px (full layout with sidebar)

## 🐛 Troubleshooting

### Port 3000 already in use?
```bash
# Edit vite.config.js and change port
server: {
  port: 3001  // Use any available port
}
```

### Backend not accessible?
1. Ensure docker-compose services are running:
   ```bash
   cd /home/ahmf/Documents/rescuemesh
   docker-compose ps
   ```

2. Check API Gateway is running on port 8000:
   ```bash
   curl http://localhost:8000/health
   ```

3. Update `.env` if backend is on different URL

### Dependencies won't install?
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

## 🎯 Next Steps

1. **Customize Theme**: Edit `src/theme.js` for colors and styles
2. **Add Features**: Create new pages in `src/pages/`
3. **Connect Real Data**: Replace mock data with API calls
4. **Add Authentication**: Implement login/logout
5. **Deploy**: Build for production with `npm run build`

## 📂 Key Files

```
frontend/
├── src/
│   ├── pages/           # All page components
│   ├── components/      # Reusable components
│   ├── services/api.js  # API service layer
│   ├── theme.js         # Chakra UI theme
│   └── App.jsx          # Main app & routing
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
└── Dockerfile           # Docker build
```

## 🚀 Production Build

```bash
# Build optimized production bundle
npm run build

# Preview production build
npm run preview

# Output will be in dist/ folder
```

## 💡 Tips

- Use React DevTools for debugging
- Check browser console for API errors
- Mock data is used when backend is unavailable
- All pages are mobile-responsive
- Chakra UI theme tokens are in `src/theme.js`

---

**Enjoy building with RescueMesh! 🚨**
