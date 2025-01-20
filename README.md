# StreamCaster 🎥
A browser-based streaming studio inspired by StreamYard, built with Next.js, Node.js, and RTMP. StreamCaster enables content creators to manage their live streams, add overlays, and broadcast directly to platforms like YouTube—all from their browser.

## 🌟 Features

- **Browser-Based Streaming**: Stream directly from your browser without additional software.
- **Live Canvas Management**: Add/remove yourself and overlays in real-time.
- **YouTube Integration**: One-click streaming to YouTube.
- **Custom Overlays**: Add and manage custom overlays during your stream.
- **User Authentication**: Secure login and stream management.
- **Real-Time Preview**: See exactly what your viewers will see.

## 🚀 Tech Stack

### **Frontend**
- Next.js (App Router)
- TailwindCSS
- Shadcn/UI
- WebRTC (Camera/Microphone Handling)

### **Backend**
- Node.js (REST APIs)
- RTMP Server
- FFmpeg (Stream Processing)

### **Database & Auth**
- Supabase (Database and Authentication)

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
NEXT_PUBLIC_SUPABASE_URL=[Your Supabase URL]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[Your Supabase Anon Key]
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001

# Backend (.env)
SUPABASE_URL=[Your Supabase URL]
SUPABASE_SERVICE_KEY=[Your Supabase Service Key]
YOUTUBE_API_KEY=[Your YouTube API Key]
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

## 🏰 Project Structure

```plaintext
streamcaster/
├── frontend/                # Next.js frontend application
│   ├── app/                 # App router components
│   ├── components/          # Reusable UI components
│   ├── features/            # Feature-specific logic (e.g., Authentication, Streaming)
│   ├── lib/                 # Utility functions and hooks
│   └── styles/              # Global and component styles
├── backend/                 # Node.js backend application
│   ├── rtmp-server/         # RTMP server implementation
│   ├── stream-processor/    # FFmpeg stream processing
│   └── api/                 # REST API endpoints (Authentication, Streams, Overlays)
├── public/                  # Static assets (e.g., images, overlays, favicon)
├── prisma/                  # Prisma configuration and migrations
├── docs/                    # Documentation and guides
└── .env                     # Environment variable files
```

## 💻 API Documentation

### **Authentication Endpoints**
```http
POST /api/auth/signup        # Create a new user account
POST /api/auth/login         # Login and retrieve access token
```

### **Stream Management Endpoints**
```http
POST /api/streams/create     # Create a new live stream
GET /api/streams/:id         # Retrieve a specific live stream
PUT /api/streams/:id/start   # Start the live stream
PUT /api/streams/:id/stop    # Stop the live stream
```

### **Overlay Management Endpoints**
```http
POST /api/overlays/create    # Add a new overlay
GET /api/overlays            # Retrieve all overlays
DELETE /api/overlays/:id     # Remove an overlay by ID
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 🗒 License

This project is not licensed yet. Feel free to reach out if you'd like to collaborate on licensing.

## 🙏 Acknowledgments

- Inspired by [StreamYard](https://streamyard.com).
- Built using [Next.js](https://nextjs.org).
- UI components from [Shadcn/UI](https://ui.shadcn.com).

## 📩 Contact

Keyur Garsondiya - [@keyurgarsondiya](https://twitter.com/keyurgarsondiya)

Project Link: [https://github.com/keyurgarsondiya/streamcaster](https://github.com/keyurgarsondiya/streamcaster)

---
🌟 If this project helped you, please consider giving it a star!

