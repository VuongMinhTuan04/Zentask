## 📌 ZenTask

ZenTask is a task management application that allows users to create, manage, and track tasks with authentication and role-based access control.

---

## 🚀 Tech Stack

- Frontend: React
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT
- Security: bcrypt
- API Style: RESTful API

---

## ✨ Key Features

- User authentication with JWT
- Role-based access control
- Task management (CRUD operations)
- Pagination and sorting for task lists
- Team collaboration with permission-based actions
- Secure password hashing using bcrypt

---

## ⚙️ Getting Started

### 1. Clone Repository
```bash
git clone https://github.com/VuongMinhTuan04/Zentask.git
cd ZenTask
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. .env
```bash
PORT=3000
MONGODB_CONNECTIONSTRING=mongodb://Bee:0359567792a@ac-xhho8rr-shard-00-00.ll3gtn2.mongodb.net:27017,ac-xhho8rr-shard-00-01.ll3gtn2.mongodb.net:27017,ac-xhho8rr-shard-00-02.ll3gtn2.mongodb.net:27017/?ssl=true&replicaSet=atlas-2m3w6m-shard-0&authSource=admin&appName=Project
JWT_SECRET=a3f9c8d2e7b6f1c9a8d7e6c5b4a3f2e1
NODE_ENV=production
```

### 5. Run Project
```bash
cd .. (Folder ZenTask)
npm run build
npm run start
```
