# 💬 NizarChat - Real-Time Chat Application

A modern, full-stack real-time chat application built with the MERN stack, featuring instant messaging, message editing/deletion, image sharing, and a beautiful UI.

![NizarChat](frontEnd/dist/screenshot-for-readme.png)

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based auth with HTTP-only cookies
- 💬 **Real-Time Messaging** - Instant message delivery with Socket.IO
- 🎤 **Voice Messages** - Record and share voice messages (cannot be edited)
- ✏️ **Edit Messages** - Edit your sent text/image messages with timestamp tracking
- 🗑️ **Delete Messages** - Soft delete messages (marked as deleted, not removed)
- 👥 **Online Status** - See who's currently online
- 🖼️ **Image Sharing** - Upload and share images with fullscreen preview
- 🔔 **Sound Notifications** - Customizable notification sounds
- ⌨️ **Keyboard Sounds** - Optional typing sound effects
- 🎨 **Modern UI** - Clean, responsive design with Tailwind CSS & DaisyUI
- 🔒 **Rate Limiting** - Protected against spam with Arcjet
- 📧 **Email Integration** - Notifications via Resend

## 🚀 Tech Stack

**Frontend:** React, Zustand, Socket.IO Client, Tailwind CSS, Vite  
**Backend:** Node.js, Express, MongoDB, Socket.IO, JWT  
**Services:** Cloudinary (images), Resend (email), Arcjet (security)

## 📦 Quick Start

1. **Clone and install**
```bash
git clone https://github.com/Nizar-Esmat/NizarChat.git
cd NizarChat
npm install
cd backEnd && npm install
cd ../frontEnd && npm install
```

2. **Configure environment** - Create `.env` files:

**project `.env`:**
```env
# project Environment Variables
PORT=5000
NODE_ENV=development
MONGO_URL=mongodb+srv://nizaresmat2000_db_user:kMHA7a5fu3WFwdhY@cluster0.ua4fi9n.mongodb.net/NizarChat?appName=Cluster0
JWT_SECRET=chatAppSecrit
RESEND_API_KEY=re_PQYMHCSt_AeWEbZrHdRk2jsSh4fhXq54d
EMAIL_FROM=<onboarding@resend.dev>
EMAIL_FROM_NAME=Nizar_Esmat
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=dqmnyaqev
CLOUDINARY_API_KEY=224814535274293
CLOUDINARY_API_SECRET=bdY0UpqAr9Tnm5L7vGMZ9qJnff0
ARCJET_KEY=ajkey_01ka8vkkrtfnqvpcnwv2a28t3w
ARCJET_ENV=development

# Frontend Environment Variables (Vite requires VITE_ prefix)
VITE_API_MODE=development
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000/

```
3. **Run the app**
```bash
npm run server (for BackEnd)
npm run client (for frontEnd)
```

## 🏗️ Project Structure

```
NizarChat/
├── backEnd/
│   └── src/
│       ├── controllers/      # Auth & message logic
│       ├── middleware/       # Auth, ownership verification
│       ├── models/           # User & Message schemas
│       ├── routes/           # API routes
│       ├── lib/              # Socket.IO, Cloudinary, utils
│       └── server.js
└── frontEnd/
    └── src/
        ├── components/
        │   └── messages/     # Message-related components
        ├── pages/            # Chat, Login, Signup
        └── store/            # Zustand state management
```

## 🎯 Key Features

### Voice Messaging
- Click to record voice messages (pause/resume supported)
- Waveform visualization during recording
- Audio playback with progress bar and seek controls
- Voice messages cannot be edited (delete only)
- Cloudinary storage for reliable audio delivery

### Message Editing & Deletion
- Edit your sent text and image messages
- Soft delete with "This message was deleted" placeholder
- Timestamps track edits and deletions
- Only message sender can edit/delete (backend verification)
- Voice messages support deletion but not editing

### Message Display
- Clean bubble UI with sender alignment (DaisyUI chat component)
- Edit indicator with timestamp
- Deleted message placeholder
- Voice message player with waveform visualization
- Image preview with fullscreen modal
- Dropdown menu for message actions (edit/delete)
- Responsive design for all device sizes

### Real-Time Updates
- Socket.IO for instant message delivery
- Live edit/delete sync across users
- Online status indicators

## 📬 API Reference (Postman)

A ready-to-use Postman collection is included in the repository root:  
**`NizarChat.postman_collection.json`**

Import it into Postman to explore and test all API endpoints.

| Group | Endpoint | Method | Auth |
|-------|----------|--------|------|
| Auth | `/api/auth/signUp` | POST | ❌ |
| Auth | `/api/auth/login` | POST | ❌ |
| Auth | `/api/auth/logout` | POST | ❌ |
| Auth | `/api/auth/updateProfile` | PUT | ✅ |
| Auth | `/api/auth/is_auth` | GET | ✅ |
| Messages | `/api/massage/AllContacts` | GET | ✅ |
| Messages | `/api/massage/chats` | GET | ✅ |
| Messages | `/api/massage/:id` | GET | ✅ |
| Messages | `/api/massage/sendMassage/:reseiverId` | POST | ✅ |
| Messages | `/api/massage/editMassage/:id` | PATCH | ✅ |
| Messages | `/api/massage/deleteMassage/:id` | DELETE | ✅ |

> Set the `baseUrl` collection variable to `http://localhost:5000/api` (default). Auth is handled automatically via HTTP-only JWT cookies — log in first, then all protected requests will work.

## 🤝 Contributing

Contributions welcome! Fork, create a feature branch, and open a PR.

## 👨‍💻 Author

**Nizar Esmat**  
GitHub: [@Nizar-Esmat](https://github.com/Nizar-Esmat)

---

⭐ Star this repo if you find it helpful!
