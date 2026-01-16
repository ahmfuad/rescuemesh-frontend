# RescueMesh Frontend

A modern, responsive web application built with React and Chakra UI v2 for the RescueMesh disaster coordination platform.

## 🚀 Features

- **Dashboard**: Real-time overview of active disasters, SOS requests, and available volunteers
- **Disaster Management**: View, create, and track disaster events with detailed information
- **User Management**: Browse volunteers, authorities, and other users
- **Skills & Resources**: Track available skills and equipment for disaster response
- **SOS Requests**: Create and manage emergency requests
- **Matching System**: View intelligent volunteer-to-request matching results
- **Notifications**: Real-time notification center for all platform events

## 🛠 Tech Stack

- **React 18** - Modern React with hooks
- **Chakra UI v2** - Component library for beautiful, accessible UI
- **React Router v6** - Client-side routing
- **Axios** - HTTP client for API requests
- **React Query** - Data fetching and caching
- **Vite** - Fast build tool and dev server
- **Date-fns** - Date formatting utilities
- **React Icons** - Icon library
- **Leaflet** - Map integration (optional)

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm
- Running RescueMesh backend services (API Gateway on port 8000)

### Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` if needed:
   ```
   VITE_API_BASE_URL=http://localhost:8000
   VITE_APP_TITLE=RescueMesh
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

## 🐳 Docker Deployment

### Build Docker image:
```bash
docker build -t rescuemesh-frontend .
```

### Run container:
```bash
docker run -p 80:80 rescuemesh-frontend
```

### Using Docker Compose (from project root):
Add to your `docker-compose.yml`:
```yaml
frontend:
  build: ./frontend
  ports:
    - "3000:80"
  depends_on:
    - api-gateway
  networks:
    - rescuemesh-network
```

Then run:
```bash
docker-compose up -d frontend
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

### Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   │   └── Layout/      # Layout components (Header, Sidebar, etc.)
│   ├── pages/           # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Disasters.jsx
│   │   ├── DisasterDetail.jsx
│   │   ├── Users.jsx
│   │   ├── Skills.jsx
│   │   ├── SOSRequests.jsx
│   │   ├── Matching.jsx
│   │   └── Notifications.jsx
│   ├── services/        # API service layer
│   │   └── api.js
│   ├── utils/           # Utilities and constants
│   │   ├── api.js       # Axios instance
│   │   └── constants.js # App constants
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── theme.js         # Chakra UI theme customization
├── index.html
├── vite.config.js
├── package.json
├── Dockerfile
└── README.md
```

## 🎨 Features Overview

### Dashboard
- Active disaster count and statistics
- Pending SOS requests
- Available volunteers and resources
- Quick links to all sections

### Disaster Management
- View all active disasters on cards
- Create new disaster reports
- Filter by disaster type and severity
- Detailed disaster view with required resources

### Users
- Browse all users (volunteers, authorities, NGOs)
- Filter by role
- View user profiles with location and trust scores

### Skills & Resources
- Two-tab interface for skills and resources
- Filter by disaster type
- View availability status
- See certifications and proficiency levels

### SOS Requests
- Create emergency requests
- View all pending/active requests
- Track urgency levels and required skills
- Real-time status updates

### Matching
- View volunteer-to-request matches
- See match scores and distances
- Estimated arrival times
- Assign volunteers to requests

### Notifications
- Multi-channel notification history
- Priority-based filtering
- Real-time status indicators

## 🌐 API Integration

The frontend communicates with the RescueMesh API Gateway:

- **Base URL**: `http://localhost:8000` (configurable via `.env`)
- **Proxy**: Vite dev server proxies `/api` requests to the gateway
- **Services**: Disaster, User, Skill, Resource, SOS, Matching, Notification

### API Service Layer

All API calls are abstracted in `src/services/api.js`:

```javascript
import { disasterService } from '../services/api'

// Get active disasters
const disasters = await disasterService.getActive()

// Create new disaster
await disasterService.create({ ... })
```

## 🎨 Theming

Customize the theme in `src/theme.js`:

- **Brand Colors**: Purple gradient
- **Emergency Colors**: Red tones for urgent items
- **Components**: Pre-styled Chakra UI components
- **Responsive**: Mobile-first design

## 📱 Responsive Design

- **Mobile**: Hamburger menu, stacked cards
- **Tablet**: Sidebar visible, 2-column grids
- **Desktop**: Full layout with 3-4 column grids

## 🔐 Authentication (Future)

The app is prepared for authentication:
- JWT token storage in localStorage
- Auth interceptor in Axios instance
- Protected routes ready to be added

## 🚧 Future Enhancements

- [ ] Real-time updates via WebSocket
- [ ] Interactive maps with Leaflet
- [ ] Advanced filtering and search
- [ ] User authentication and authorization
- [ ] File uploads for disaster reports
- [ ] Push notifications
- [ ] Offline support with service workers
- [ ] Analytics dashboard
- [ ] Multi-language support

## 🐛 Troubleshooting

### API Connection Issues
- Ensure backend services are running
- Check `VITE_API_BASE_URL` in `.env`
- Verify CORS is enabled in API Gateway

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use
```bash
# Change port in vite.config.js
server: {
  port: 3001  // Change to available port
}
```

## 📄 License

Part of the RescueMesh project.

## 👥 Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## 📞 Support

For issues or questions, contact the RescueMesh development team.

---

**Built with ❤️ for disaster response coordination**
