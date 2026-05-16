# AI-Powered Resume Builder 🚀

A modern, full-stack web application that allows users to create, manage, and share professional resumes. Features AI-powered content enhancement, real-time preview, and multiple designer templates.

## ✨ Features

- **🤖 AI Resume Enhancer**: Uses Google Gemini AI to improve professional summaries and job descriptions semantically and grammatically.
- **🎨 Custom Templates**: Choose from various professional templates (Modern, Minimal, Classic) and customize with accent colors.
- **🔗 Instant Sharing**: Generate a public link for your resume that can be shared with recruiters.
- **🖼️ Image Support**: Upload and manage profile pictures integrated with ImageKit.
- **📱 Responsive Design**: Fully optimized for mobile and desktop viewing.
- **📂 Dashboard**: Manage multiple resumes with a clean, intuitive interface.

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS, Redux Toolkit, Lucide React
- **Backend**: Node.js, Express
- **Database**: MongoDB (Mongoose)
- **AI**: Google Generative AI (Gemini 1.5/2.x)
- **Media**: ImageKit.io for image hosting

## 🚀 Getting Started

### 1. Prerequisites
- Node.js installed
- MongoDB URI
- Google Gemini API Key
- ImageKit account

### 2. Installation

Clone the repository:
```bash
git clone <your-repo-url>
cd Resume-Builder
```

### 3. Setup Backend
```bash
cd Backend
npm install
```
Create a `.env` file in the `Backend` folder:
```env
PORT=3000
MONGODB_URI=your_mongodb_uri
GEMINI_API_KEY=your_gemini_api_key
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=your_url_endpoint
```
Start the server:
```bash
npm run start
```

### 4. Setup Frontend
```bash
cd ../Frontend
npm install
```
Create a `.env` file in the `Frontend` folder:
```env
VITE_API_URL=http://localhost:3000
```
Start the app:
```bash
npm run dev
```

## 📄 License
This project is licensed under the MIT License.
