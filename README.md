## 📌 ZenTask

**ZenTask** is a task management application that helps users create, update, organize, and track their daily tasks efficiently.

---

## 🚀 Tech Stack

- **Frontend:** React  
- **Backend:** Node.js, Express  
- **Database:** MongoDB  
- **Others:** RESTful API  

---

## ⚙️ Getting Started

### 1. Clone the repository
git clone https://github.com/VuongMinhTuan04/Zentask.git
cd ZenTask
How to setup

### 2. Backend
cd backend
npm install
npm start

### 3. Database & Port
File .env
PORT=3000
MONGODB_CONNECTIONSTRING=mongodb://localhost:27017/ZenTask

### 4. REST API
| Method | Endpoint              | Description        |
|--------|----------------------|--------------------|
| GET    | /api/tasks           | Get all tasks      |
| GET    | /api/tasks/sort      | Sort tasks         |
| GET    | /api/tasks/pagination| Paginate tasks     |
| POST   | /api/tasks           | Create a new task  |
| PUT    | /api/tasks/:id       | Update a task      |
| DELETE | /api/tasks/:id       | Delete a task      |
