
# HealthGrid - Hospital Management System

A comprehensive and modern Hospital Management System built with React, TypeScript, and Tailwind CSS.

## Features

- **Dashboard:** Overview of key hospital metrics and statistics
- **Patient Management:** Add, edit, view, and manage patient records
- **Doctor Management:** Manage doctor profiles, schedules, and specialties
- **Appointment Scheduling:** Efficient appointment booking and management
- **Medical Records:** Store and access patient medical history and reports
- **Pharmacy Integration:** Manage medications and prescriptions
- **Analytics & Reporting:** Generate comprehensive reports and insights
- **Secure Authentication:** Role-based access control with JWT and OTP

## Technology Stack

### Frontend
- React.js with TypeScript
- Tailwind CSS for styling
- Shadcn UI for pre-built components
- React Router for navigation
- React Query for data fetching
- Recharts for data visualization

### Backend (To be implemented)
- Node.js and Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Nodemailer for email notifications
- Multer for file uploads

### Security Features
- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control
- OTP verification via email

## Getting Started

### Prerequisites
- Node.js & npm

### Installation

1. Clone the repository:
   ```sh
   git clone <your-repo-url>
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npm run dev
   ```

## Project Structure

healthgrid/
├── client/ # React frontend
│ └── src/
│ ├── components/
│ ├── pages/
│ ├── services/
│ └── App.js
├── server/ # Express backend
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middlewares/
│ └── server.js
└── README.md

---

## ✨ Key Features

✅ Secure User Authentication with JWT and 6-digit OTP via email  
✅ Role-Based Access Control (Admin, Doctor, Nurse, Receptionist, Patient)  
✅ Patient Registration, Profile Management, Medical Records  
✅ Appointment Scheduling and Tracking  
✅ Staff Management and Scheduling  
✅ Billing and Payment Tracking  
✅ Secure Password Reset via Email Verification  
✅ Google reCAPTCHA Integration  
✅ Responsive UI with Tailwind CSS & Framer Motion  
✅ Form Validation with ZOD  
✅ Cloud Database with MongoDB Atlas

---

## 🔑 Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/healthgrid.git
cd healthgrid

## License

This project is licensed under the MIT License
