### **Task Manager API (MERN Stack)**

This API provides functionality for managing tasks, users, and agents. It supports user authentication, agent management, and task distribution from CSV files.

---

### 🚀 **Features**
- **User Authentication**: Users can register and log in using JWT tokens.
- **Agent Management**: Add and manage agents (name, email, mobile number, and password).
- **Task Distribution**: Distribute tasks from CSV/XLS files to agents.
- **MongoDB Integration**: Stores user, agent, and task data.

---

### 🛠️ **Installation & Setup**

1️⃣ **Clone the Repository**  
```sh
git clone https://github.com/ShreyaChauhan-2/Task-Manager.git
cd Task-Manager/backend
```

2️⃣ **Install Dependencies**  
```sh
npm install
```

3️⃣ **Set Up Environment Variables**  
Create a `.env` file in the root directory and add the following:
```env
PORT=5002
MONGO_URI=mongodb+srv://your_username:your_password@cluster0.zosgv.mongodb.net/
JWT_SECRET=your_jwt_secret
```

4️⃣ **Start MongoDB**  
Ensure MongoDB is running locally or use **MongoDB Atlas**.

5️⃣ **Run the Server**  
```sh
node server.js
```
or (with nodemon):
```sh
npm run dev
```

---

### 📌 **API Endpoints**

#### **🔹 User Authentication**

1️⃣ **Register User**  
- **POST /api/register**  
- **Request Body**:  
  ```json
  {
    "email": "abcd@gmail.com",
    "password": "12345"
  }
  ```
- **Response**:  
  ```json
  {
    "message": "User registered successfully"
  }
  ```

2️⃣ **Login User**  
- **POST /api/login**  
- **Request Body**:  
  ```json
  {
    "email": "abcd@gmail.com",
    "password": "12345"
  }
  ```
- **Response**:  
  ```json
  {
    "token": "your_jwt_token"
  }
  ```

#### **🔹 Agent Management**

3️⃣ **Add Agent**  
- **POST /api/agents**  
- **Headers**:  
  `Authorization: Bearer your_jwt_token`
- **Request Body**:  
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "+123456789",
    "password": "password123"
  }
  ```
- **Response**:  
  ```json
  {
    "message": "Agent added successfully"
  }
  ```

#### **🔹 Task Distribution (CSV Upload)**

4️⃣ **Upload CSV and Distribute Tasks**  
- **POST /api/upload**  
- **Headers**:  
  `Authorization: Bearer your_jwt_token`
- **Request (form-data)**:  
  - **file**: Upload a CSV/XLS/XLSX file
- **Response**:  
  ```json
  {
    "message": "Tasks distributed successfully",
    "distributedTasks": [...]
  }
  ```

---

### ✅ **Testing with Postman**
- Open Postman.
- Send a **POST request** to `http://localhost:5003/api/login` with your credentials.
- Copy the returned token.
- Use the token in the **Authorization** header for other API requests.

---

### 📌 **Technologies Used**
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT, bcrypt.js
- **CSV Handling**: multer, csv-parser
- **Frontend (To be built)**: React.js

---

### 👨‍💻 **Author**  
Developed by **Shreya Chauhan** 🚀

---