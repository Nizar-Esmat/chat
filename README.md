# 💬 NizarChat - Real-Time Chat Application

A modern, full-stack real-time chat application built with the MERN stack, featuring Socket.IO for instant messaging, beautiful UI with Tailwind CSS, and secure authentication.

![NizarChat](frontEnd/dist/screenshot-for-readme.png)

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based authentication with HTTP-only cookies
- 💬 **Real-Time Messaging** - Instant message delivery using Socket.IO
- 👥 **Online Status** - See which users are currently online
- 🖼️ **Image Sharing** - Upload and share images in chats with Cloudinary integration
- 🔔 **Sound Notifications** - Customizable notification sounds for new messages
- ⌨️ **Keyboard Sound Effects** - Optional typing sound effects for enhanced UX
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS and DaisyUI
- 🔒 **Rate Limiting** - Protected against spam and abuse with Arcjet
- 📧 **Email Integration** - Password reset and notifications via Resend
- 🌙 **Dark Mode** - Eye-friendly dark theme

## 🚀 Tech Stack

### Frontend
- **React** - UI library
- **Zustand** - State management
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **DaisyUI** - UI components
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Socket.IO** - Real-time engine
- **JWT** - Authentication
- **Cloudinary** - Image hosting
- **Resend** - Email service
- **Arcjet** - Security & rate limiting

## 📦 Installation

1. **Clone the repository**
```bash
git clone https://github.com/Nizar-Esmat/NizarChat.git
cd NizarChat
```

2. **Install dependencies**
```bash
npm install
cd backEnd && npm install
cd ../frontEnd && npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Backend
PORT=5000
NODE_ENV=development
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=your_email
EMAIL_FROM_NAME=Your Name
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
ARCJET_KEY=your_arcjet_key
ARCJET_ENV=development

# Frontend
VITE_API_MODE=development
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

4. **Run the application**

```bash
# Run both frontend and backend concurrently
npm run dev

# Or run separately
npm run server  # Backend only
npm run client  # Frontend only
```

## 🎯 Usage

1. **Sign Up** - Create a new account with email and password
2. **Login** - Access your account
3. **Start Chatting** - Select a user from the contacts list and start messaging
4. **Share Images** - Click the image icon to upload and share photos
5. **Customize** - Toggle sound effects and notifications in settings

## 🏗️ Project Structure

```
chat/
├── backEnd/
│   ├── lib/
│   │   └── db.js
│   └── src/
│       ├── config/
│       │   └── env.js
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   └── massage.controller.js
│       ├── email/
│       │   ├── emailHandlers.js
│       │   └── emailTemplates.js
│       ├── lib/
│       │   ├── arcjet.js
│       │   ├── cloudinary.js
│       │   ├── resend.js
│       │   ├── socket.js
│       │   └── utils.js
│       ├── middleware/
│       │   ├── arcjet.middleware.js
│       │   ├── auth.middleware.js
│       │   └── socket.middleware.js
│       ├── models/
│       │   ├── massage.model.js
│       │   └── user.model.js
│       ├── routes/
│       │   ├── auth.route.js
│       │   └── massage.route.js
│       └── server.js
└── frontEnd/
    └── src/
        ├── components/
        ├── hooks/
        ├── pages/
        ├── store/
        └── App.jsx
```

## 🔑 Key Features Explained

### Real-Time Communication
Socket.IO enables instant message delivery and online status updates without polling, providing a seamless chat experience.

### Secure Authentication
- JWT tokens stored in HTTP-only cookies
- Password hashing with bcrypt
- Protected API routes with middleware

### Image Sharing
Cloudinary integration allows users to upload and share images with automatic optimization and CDN delivery.

### Rate Limiting
Arcjet protects the application from spam, abuse, and bot attacks with intelligent rate limiting.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Nizar Esmat**

- GitHub: [@Nizar-Esmat](https://github.com/Nizar-Esmat)
- LinkedIn: [Nizar Esmat](https://linkedin.com/in/nizar-esmat)

## 🙏 Acknowledgments

- Thanks to all the open-source libraries that made this project possible
- Special thanks to the MERN stack community

---

⭐ Star this repository if you found it helpful!
