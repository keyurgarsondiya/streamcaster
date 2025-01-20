# StreamCaster 🎥
A browser-based streaming studio inspired by StreamYard, built with Next.js, Node.js, and RTMP. StreamCaster allows content creators to manage their live streams, add overlays, and broadcast directly to platforms like YouTube - all from their browser.

## 🌟 Features

- **Browser-Based Streaming**: Stream directly from your browser without additional software
- **Live Canvas Management**: Add/remove yourself and overlays in real-time
- **YouTube Integration**: One-click streaming to YouTube
- **Custom Overlays**: Add and manage custom overlays during your stream
- **User Authentication**: Secure login and stream management
- **Real-Time Preview**: See exactly what your viewers will see

## 🚀 Tech Stack

- **Frontend**
  - Next.js
  - TailwindCSS
  - shadcn/ui
  - WebRTC for camera/mic handling
  
- **Backend**
  - Node.js
  - RTMP Server
  - FFmpeg for stream processing
  
- **Database & Auth**
  - Supabase

## 📋 Prerequisites

- Node.js 18+
- FFmpeg installed on your system
- A Supabase account
- YouTube API credentials (for streaming)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/keyurgarsondiya/streamcaster.git
cd streamcaster
```

2. Install dependencies:
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Set up environment variables:
```bash
# Frontend (.env.local)
-------TO BE ADDED-------
NEXT_PUBLIC_SUPABASE_URL=[URL]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[KEY]
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001

# Backend (.env)
-------TO BE ADDED-------
SUPABASE_URL=[URL]
SUPABASE_SERVICE_KEY=[KEY]
YOUTUBE_API_KEY=[KEY]
RTMP_SERVER_URL=rtmp://localhost/live
```

4. Start the development servers:
```bash
# Start frontend
cd frontend
npm run dev

# Start backend
cd ../backend
npm run dev
```

## 🏗️ Project Structure

```
streamcaster/
├── frontend/                # Next.js frontend application
│   ├── app/                # App router components
│   ├── components/         # Reusable UI components
│   └── lib/               # Utility functions and hooks
├── backend/
│   ├── rtmp-server/       # RTMP server implementation
│   ├── stream-processor/   # FFmpeg stream processing
│   └── api/               # REST API endpoints
└── docs/                  # Documentation
```

## 💻 API Documentation

### Authentication Endpoints
```
POST /api/auth/signup
POST /api/auth/login
```

### Stream Management
```
POST /api/streams/create
GET /api/streams/:id
PUT /api/streams/:id/start
PUT /api/streams/:id/stop
```

### Overlay Management
```
POST /api/overlays/create
GET /api/overlays
DELETE /api/overlays/:id
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is not licensed yet

## 🙏 Acknowledgments

- Inspired by [StreamYard](https://streamyard.com)
- Built using [Next.js](https://nextjs.org)
- UI components from [shadcn/ui](https://ui.shadcn.com)

## 📬 Contact

Keyur Garsondiya - [@keyurgarsondiya](https://twitter.com/keyurgarsondiya)

Project Link: [https://github.com/keyurgarsondiya/streamcaster](https://github.com/keyurgarsondiya/streamcaster)

---
⭐️ If this project helped you, please consider giving it a star!
