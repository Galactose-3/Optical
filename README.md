# 🕶️ Smart Optical Management System

A **Smart Management System** built for optical companies to efficiently manage customers, inventory, orders, and staff.
Developed using **React (Vite)**, **Node.js**, **HTML**, **CSS**, and **JavaScript**.

---

## 🚀 Features

✅ Customer management (appointments, prescriptions, history)
✅ Inventory management (frames, lenses, accessories)
✅ Order tracking & billing system
✅ Staff & role-based access management
✅ Dashboard with key insights
✅ Modern, responsive UI

---

## 🛠️ Tech Stack

* **Frontend:** React (Vite), HTML, CSS, JavaScript
* **Backend:** Node.js, Express
* **Database:** (add your DB here – e.g., MongoDB/MySQL/PostgreSQL)
* **Other Tools:** REST API, JSON

## 🌐 Deployment Configuration

### Environment Variables

For production deployment (Vercel), set the following environment variable:

```bash
VITE_PUBLIC_API_BASE_URL=https://staff-optical-production.up.railway.app/
```

Replace `your-railway-app` with your actual Railway backend URL.

### Vercel Environment Variables Setup

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add a new variable:
   - **Name**: `VITE_PUBLIC_API_BASE_URL`
   - **Value**: `https://staff-optical-production.up.railway.app/`
   - **Environment**: Production (and Preview if needed)

### Development vs Production

- **Development**: Uses `http://localhost:3000` (Vite proxy)
- **Production**: Uses the Railway backend URL from environment variable

---

## 📂 Project Structure

```
smart-optical-management/
│── client/              # Frontend (React + Vite)
│   ├── public/          
│   ├── src/             
│   │   ├── components/  
│   │   ├── pages/       
│   │   ├── assets/      
│   │   └── App.jsx      
│── server/              # Backend (Node.js + Express)
│   ├── routes/          
│   ├── controllers/     
│   ├── models/          
│   └── server.js        
│── package.json         
│── README.md            
```

---

## ⚡ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/smart-optical-management.git
cd smart-optical-management
```

### 2️⃣ Install Dependencies

#### Frontend (React Vite)

```bash
cd client
npm install
```

#### Backend (Node.js)

```bash
cd server
npm install
```

### 3️⃣ Run the Application

#### Start Backend Server

```bash
cd server
npm start
```

#### Start Frontend (React Vite)

```bash
cd client
npm run dev
```

App will be available at: **[http://localhost:5173/](http://localhost:5173/)**

---

## 📸 Screenshots

## Login Page
[Screenshot 2025-09-04 162252.png](https://github.com/Galactose-3/Optical/blob/main/ScreenShots/Screenshot%202025-09-04%20162150.png)

##Dashboard
[Screenshot 2025-09-04 162206.png](https://github.com/Galactose-3/Optical/blob/main/ScreenShots/Screenshot%202025-09-04%20162206.png)
[Screenshot 2025-09-04 162250.png](https://github.com/Galactose-3/Optical/blob/main/ScreenShots/Screenshot%202025-09-04%20162150.png)
[Screenshot 2025-09-04 162228.png](https://github.com/Galactose-3/Optical/blob/main/ScreenShots/Screenshot%202025-09-04%20162228.png)

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m 'Added new feature'`)
4. Push to the branch (`git push origin feature-name`)
5. Open a Pull Request

---



