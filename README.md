# CodolioQuestions - Premium DSA Tracker

CodolioQuestions is a high-fidelity, full-stack DSA (Data Structures and Algorithms) sheet tracker. It allows students to track their progress through comprehensive problem sets (like the Striver A2Z Sheet), add custom questions, and stay organized throughout their interview preparation journey.

## 🚀 Key Features

- **Hierarchical Organization**: Problems are organized into Topics, which contain Sub-topics and individual Questions.
- **Interactive Progress**: Real-time progress bars at the Topic and Sub-topic levels.
- **Drag-and-Drop**: Easily reorder Topics, Sub-topics, and Questions using a smooth drag-and-drop interface.
- **Rich Metadata**: Track problem difficulty, platform (LeetCode, GFG, etc.), YouTube tutorial links, and Company tags.
- **Edit Functionality**: Full support for editing Topic titles/descriptions, Sub-topic titles, and Question details through pre-filled modals.
- **Glassmorphic UI**: A premium, modern dark-themed interface with smooth animations and hover effects.
- **Full-Stack Persistence**: Data is stored in a MongoDB Atlas database with frontend state management via Zustand.
- **API Proxy**: Configured Vite proxy for clean, relative URL calls (`/api/...`).

## 🛠️ Tech Stack

### Frontend
- **React 18** (Vite)
- **Tailwind CSS v4** (Modern utility-first styling)
- **Zustand** (Global state management with persistence)
- **@dnd-kit** (For robust drag-and-drop interactions)
- **Lucide React** (Beautiful, consistent iconography)

### Backend
- **Node.js & Express**
- **MongoDB Atlas** (Cloud database)
- **Mongoose** (Referenced document schemas)
- **Dotenv** (Environment variable management)

## 📂 Project Structure

```text
CodolioProject/
├── client/                # React Frontend
│   ├── src/
│   │   ├── components/    # UI Components (TopicCard, QuestionItem, Modals)
│   │   ├── store/         # Zustand Store logic
│   │   └── App.jsx        # Main application layout
│   └── index.html         # Portal root and entry point
├── server/                # Node.js Backend
│   ├── src/
│   │   ├── config/        # Database connectivity
│   │   ├── models/        # Mongoose Referenced Schemas
│   │   ├── controllers/   # Business logic / CRUD
│   │   └── routes/        # API Endpoints
│   └── index.js           # Server entry point
└── README.md              # Documentation
```

## ⚙️ Setup Instructions

### Prerequisites
- Node.js installed
- A MongoDB Atlas account (or local MongoDB)

### 1. Server Setup
1. Navigate to the `server` directory: `cd server`
2. Install dependencies: `npm install`
3. Create a `.env` file and add your MongoDB connection string:
   ```env
   ATLASDB_URL=your_mongodb_atlas_url
   PORT=3001
   CORS_ORIGIN=http://localhost:5173
   ```
4. Start the server: `npm run dev`

### 2. Client Setup
1. Navigate to the `client` directory: `cd client`
2. Install dependencies: `npm install`
3. Start the Vite dev server: `npm run dev`
4. Open the app at `http://localhost:5173`

### 3. Data Seeding (Optional)
If you want to load the Striver A2Z DSA Sheet data from `sheet.json`:
1. Ensure the server is running.
2. Open a new terminal in the `server` directory.
3. Run: `npm run seed`
4. This will clear existing data and populate exactly 449 questions from the provided JSON.

## 🔗 Models & Data
The database uses a referenced model structure:
- **Topics**: Top-level containers with descriptions and order.
- **Sub-Topics**: Nested categories within topics.
- **Questions**: Individual problems with links, resources, difficulty, and company tags.

---

Built for high-performance DSA tracking.
