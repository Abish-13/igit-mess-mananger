# IGIT Mess & Hostel Manager (MERN Stack)

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://igit-mess-mananger.vercel.app/login)
[![Backend Status](https://img.shields.io/badge/Backend-Render-blue)](https://igit-mess-mananger.onrender.com/)

A full-stack hostel management solution designed to automate room allocation, mess billing, and student records. This system replaces manual paper-based tracking with a cloud-synced digital dashboard.

---

## 🚀 Key Features

* **Admin Dashboard:** Provides a real-time overview of room occupancy and mess statistics.
* **Secure Authentication:** Implements role-based login for Admins and Students using JWT and Bcrypt.
* **Room Management:** Includes automated allocation logic based on student profiles and priorities.
* **Mess Tracking:** Digital meal "stop" requests with automated bill calculation and kitchen plate counts.
* **Real-time Notices:** Features instant communication of hostel updates and infrastructure complaints.

---

## 🛠 Tech Stack

**Frontend:**
* **React.js** – Used for building the dynamic UI.
* **Tailwind CSS** – Used for responsive and modern styling.
* **Vite** – Utilized as the fast build tool and development server.

**Backend:**
* **Node.js & Express.js** – Powering the REST API architecture.
* **MongoDB Atlas** – Serves as the cloud-hosted NoSQL database.
* **Mongoose** – Used for Object Data Modeling (ODM).

---

## 📂 Project Structure

```text
/
├── server.js            # Node.js Express Server entry point
├── models/             # Database Schemas (User, Room, Mess)
├── routes/             # API Endpoints (Auth, Rooms, Meals)
├── controllers/        # Business Logic & Request Handling
├── src/                # React Frontend Components & Assets
├── vercel.json         # SPA Routing Configuration for Vercel
└── package.json        # Project Dependencies & Scripts
