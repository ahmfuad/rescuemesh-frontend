# RescueMesh Frontend

A comprehensive React-based disaster response platform frontend built with React, Tailwind CSS, and Leaflet maps.

## Features

### 🏠 Dashboard
- Real-time disaster statistics
- Active SOS requests overview
- Quick action buttons
- Volunteer activity monitoring

### 🆘 SOS Emergency
- Emergency request creation
- Urgency level selection (Critical, High, Medium, Low)
- Disaster-specific skill/resource selection
- Real-time location tracking
- Contact information management

### 🗺️ Disaster Map
- Interactive map with Leaflet/OpenStreetMap
- Visual disaster zones with severity indicators
- SOS request markers
- Disaster impact radius visualization
- Real-time updates

### 👥 Volunteer Hub
- Available emergency requests
- Match management (accept/reject)
- Skill registration
- Trust score tracking
- Response history

### 📦 Resource Management
- Register skills and resources
- Update availability status
- Resource inventory tracking
- Skill certification levels

### 🔔 Notifications
- Real-time alerts
- SOS notifications
- Match notifications
- Disaster alerts
- Multi-channel delivery status

### 👤 Profile
- User information management
- Location tracking
- Trust score display
- Account settings

## Tech Stack

- **React 18** - UI framework
- **React Router 6** - Navigation
- **Tailwind CSS** - Styling
- **Leaflet + React-Leaflet** - Interactive maps
- **Axios** - API communication
- **React Hot Toast** - Notifications
- **Heroicons** - Icon library
- **Vite** - Build tool

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Local Development

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Access at http://localhost:3000
```

### Environment Variables

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8000
```

### Build for Production

```bash
npm run build
npm run preview
```

## Docker Deployment

### Build and Run

```bash
# From project root
docker compose up -d frontend

# Or rebuild
docker compose up -d --build frontend
```

The frontend will be available at `http://localhost:3000`

## Project Structure

```
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Layout.jsx    # Main layout with sidebar
│   │   ├── Cards.jsx     # Card components
│   │   └── Modal.jsx     # Modal dialogs
│   ├── context/          # React context providers
│   │   └── AppContext.jsx
│   ├── pages/            # Page components
│   │   ├── Dashboard.jsx
│   │   ├── SOSPage.jsx
│   │   ├── DisasterMap.jsx
│   │   ├── VolunteerHub.jsx
│   │   ├── ResourceManagement.jsx
│   │   ├── Notifications.jsx
│   │   └── Profile.jsx
│   ├── services/         # API service layer
│   │   ├── api.js       # Axios instance
│   │   └── index.js     # Service methods
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── Dockerfile           # Production build
├── nginx.conf          # Nginx configuration
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind configuration
└── package.json
```

## API Integration

The frontend connects to 6 microservices through an API gateway:

1. **User Service** (Port 3001) - User management
2. **Skill Service** (Port 3002) - Skills & resources
3. **Disaster Service** (Port 3003) - Disaster events
4. **SOS Service** (Port 3004) - Emergency requests
5. **Matching Service** (Port 3005) - Volunteer matching
6. **Notification Service** (Port 3006) - Alerts & notifications

All requests are proxied through the API Gateway at `http://localhost:8000`

## Key Features Implementation

### Real-time Disaster Map
- Uses Leaflet for interactive maps
- Circle overlays for disaster impact zones
- Color-coded severity indicators
- Popup details for disasters and SOS requests

### Responsive Design
- Mobile-first approach
- Collapsible sidebar on mobile
- Touch-friendly interface
- Optimized for all screen sizes

### User Experience
- Toast notifications for feedback
- Loading states for async operations
- Empty states with helpful messages
- Form validation
- Confirmation dialogs for critical actions

## Customization

### Colors

Edit `tailwind.config.js` to customize theme colors:

```javascript
colors: {
  disaster: {
    red: '#DC2626',    // Critical
    orange: '#EA580C', // High
    yellow: '#CA8A04', // Medium
    blue: '#2563EB',   // Low
  },
  rescue: {
    primary: '#059669',   // Main action color
    secondary: '#0891B2', // Secondary actions
    accent: '#7C3AED',    // Highlights
  },
}
```

### Disaster Icons

Modify disaster icons in `DisasterMap.jsx` and `Dashboard.jsx`:

```javascript
const disasterIcons = {
  flood: '🌊',
  earthquake: '🌋',
  fire: '🔥',
  // Add more...
};
```

## Performance Optimizations

- Code splitting with React.lazy
- Image optimization
- Gzip compression in nginx
- Static asset caching
- API request debouncing
- Memoization for expensive computations

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome)

## Contributing

When adding new features:

1. Create components in `src/components/`
2. Add pages to `src/pages/`
3. Update routes in `App.jsx`
4. Add API methods to `src/services/`
5. Use existing UI patterns for consistency

## Troubleshooting

### Map not loading
- Check Leaflet CSS is imported in `index.html`
- Verify map container has explicit height
- Check network connection for tile loading

### API errors
- Verify API gateway is running: `http://localhost:8000`
- Check CORS configuration
- Verify all backend services are running

### Build errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf .vite`
- Check Node.js version: `node -v` (should be 18+)

## License

Part of the RescueMesh platform - Disaster Response System
