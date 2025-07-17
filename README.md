# 🎓 Faculty Appraisal Management System (FAMS)

A **MERN stack web application** to **digitize and automate faculty appraisals** in colleges, enabling structured, transparent evaluations and seamless management of faculty research activities.

---

## 🚩 Features

✅ **Role-Based Access:** Separate dashboards for Faculty, HOD, and Admin with secure logins.  
✅ **Faculty:**
- Submit research activities with structured details and file uploads.
- View, edit, delete submissions with status tracking.
  
✅ **HOD:**
- View department-wise research submissions.
- Review and approve submissions.
- Export research data to Excel.

✅ **Admin:**
- Add, edit, delete, and manage faculty and HOD records.
- Filter by department for structured management.

✅ **Notifications:**
- Faculty receive alerts when submissions are reviewed by HOD.

✅ **Clean UI:**
- User-friendly interface for efficient navigation.

---

## 🛠️ Tech Stack

- **Frontend: React.js**  
  For building interactive user interfaces, routing between dashboards, and managing state using Context API.

- **Backend: Node.js + Express.js**  
  For building RESTful APIs to handle CRUD operations, user authentication, and file uploads.

- **Database: MongoDB**  
  For storing faculty, HOD, admin details, research submissions, and notifications.

- **Libraries:**
  - **Axios:** For API calls between frontend and backend.
  - **Multer:** For secure file uploads.
  - **XLSX:** For exporting data to Excel.
  - **React Toastify:** For notifications within the app.

- **Tools:**
  - **VS Code:** Development environment.
  - **Git + GitHub:** Version control and hosting.
  - **MongoDB Compass:** Database visualization and management.

---
Faculty-Appraisal-Management-System/
│
├── backend/                    # Node.js + Express backend
│   ├── models/                 # Mongoose schemas (Faculty, HOD, Admin, Research)
│   ├── routes/                 # API routes for auth, faculty, HOD, research
│   ├── uploads/                # Stores uploaded research files (PDF, DOCX)
│   ├── server.js               # Entry point for backend server
│   └── .env                    # Environment variables (MONGO_URI, PORT)
│
├── frontend/                   # React frontend
│   ├── public/                 # Public assets and index.html
│   └── src/
│       ├── pages/              # React pages (Dashboards, Login, AddResearch, MyEntries)
│       ├── contexts/           # Context API for state management
│       ├── styles/             # CSS for clean, responsive UI
│       ├── App.js              # Main React component with routing
│       └── index.js            # Entry point for React app
│
├── .gitignore                  # Specifies files/folders to ignore (node_modules, .env, uploads)
├── package.json                # Project metadata and scripts
└── README.md                   # Project overview and documentation

Faculty (Frontend) ↔ API Calls ↔ Backend (Express) ↔ MongoDB (Database)
📊 Architecture & Workflow
⚙️ System Architecture
Frontend (React): Handles user interfaces, role-based dashboards, routing, and state management using Context API.

Backend (Node.js + Express): Provides RESTful APIs for authentication, CRUD operations, and file uploads.

Database (MongoDB): Stores faculty, HOD, admin details, research submissions, and notifications.

scss
Copy
Edit
Faculty (Frontend) ↔ API Calls ↔ Backend (Express) ↔ MongoDB (Database)
🗂️ Data Flow
1️⃣ Faculty submits research form → Frontend sends data & file via API → Backend saves to MongoDB and uploads file.
2️⃣ HOD fetches department-wise data → Reviews & updates status → Faculty notified via dashboard.
3️⃣ Admin manages faculty and HOD data with add/edit/delete capabilities.
4️⃣ All roles interact securely through structured APIs.

🖥️ Role-Based Workflow
✅ Faculty:

Login with secure authentication.

Submit research activities with structured details and file uploads.

View, edit, and delete submissions with status tracking.

✅ HOD:

Login and view department-specific research submissions.

Review and approve submissions easily.

Export research data to Excel for reporting.

✅ Admin:

Login to manage faculty and HOD records (add, update, delete).

View and filter data department-wise for structured administration.
