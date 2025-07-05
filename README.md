# 🧠 ChatLoom – The Conversational Fabric

ChatLoom is a modern, fully customizable chatbot framework that brings intelligent and natural interactions to websites and web apps. Whether you're building a personal assistant, a customer support bot, or a fun interactive experience, ChatLoom serves as the perfect foundation to build on.

---

## ✨ Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Built With](#built-with)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Customization](#customization)
- [Loading Screen](#loading-screen)
- [Demo](#demo)
- [Screenshots](#screenshots)
- [Author](#author)
- [Connect With Me](#connect-with-me)
- [Contributing](#contributing)
- [License](#license)

---

## 📘 About the Project

> "ChatLoom" – because conversations are like fabric; every message a thread, every response a stitch.

ChatLoom is not just another chatbot. It is an extendable and scalable chatbot framework meant for developers, creators, and businesses who want to add a layer of intelligence and personality to their products.

Built with simplicity and modern tools in mind, ChatLoom offers:

- A clean codebase.
- API integration capabilities (like OpenAI, Dialogflow, Rasa, or your own).
- A beautiful and customizable UI.
- Local storage memory (or extend to backend memory).
- Component-level flexibility (React/Vue/Vanilla-ready).

---

## 🚀 Features

- 🧠 **Conversational Intelligence** – Plug in AI models or scripted flows.
- 🖌️ **Customizable UI** – Change colors, avatars, themes, and animations.
- 🌙 **Dark Mode Ready** – Because your chatbot deserves style.
- 📜 **Memory Support** – Maintain conversation history.
- 🔌 **API-Friendly** – Easily connect to third-party or custom APIs.
- ⚙️ **Component-based Architecture** – Easy to reuse and scale.
- 📱 **Mobile-Responsive** – Works across all screen sizes.
- 💬 **Typing Animations & Delay Simulation** – Mimic human interaction.
- ⏳ **Smart Loading Screen** – Beautiful animated loading with dither background.

---

## 🛠️ Built With

> You can modify these depending on your stack

- **React** – Frontend UI
- **TailwindCSS** – Styling
- **OpenAI API** (or other) – for AI brain
- **Node.js + Express** (optional) – for backend support
- **Framer Motion** – for animations
- **TypeScript** – for type safety (optional)

---

## 📦 Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

- Node.js and npm installed
- Basic knowledge of JavaScript/React

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/chatloom.git

# Navigate to project directory
cd chatloom

# Install dependencies
npm install

# Start the development server
npm run dev

```

## ⏳ Loading Screen

ChatLoom features a sophisticated loading screen that ensures a smooth user experience:

### Features
- **Animated Dither Background** – The same beautiful dither animation used throughout the app
- **Smart Loading Detection** – Automatically detects when resources are loaded
- **Smooth Transitions** – Fade-in/fade-out animations for seamless experience
- **Performance Optimized** – Reduced loading time for page refreshes
- **Responsive Design** – Works perfectly on all device sizes

### How It Works
The loading screen appears when:
- The app is first loaded
- Resources (fonts, images) are being loaded
- The React app is hydrating

It automatically disappears when:
- All critical resources are loaded
- Minimum loading time has elapsed (1.5s for new visits, 0.8s for refreshes)
- Maximum timeout is reached (3s fallback)

### Customization
You can customize the loading screen by modifying:
- `components/loading-screen.tsx` – Main loading component
- `components/app-wrapper.tsx` – Loading logic and timing
- `app/globals.css` – Loading animations and styles

---

## 🎥 Demo

[Watch the demo video](https://www.youtube.com/watch?v=dQw4w9WgXcQ)

---

## 📸 Screenshots

![ChatLoom Screenshot 1](https://via.placeholder.com/1280x720)
![ChatLoom Screenshot 2](https://via.placeholder.com/1280x720)

---

## 🤝 Author

[Your Name](https://www.linkedin.com/in/yourname/)

---

## 🔗 Connect With Me

- [LinkedIn](https://www.linkedin.com/in/yourname/)
- [Twitter](https://twitter.com/yourname)

---

## 🤖 Contributing

Contributions are welcome! Please read the [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
