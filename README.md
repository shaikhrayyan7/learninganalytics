Perfect! We can now **update your README** to reflect that this is a **master thesis project**, highlighting the **research context, GDPR compliance, and ethical considerations**, while keeping it professional and detailed. Here’s a polished version integrating your exposé:

---

# Learning Analytics – Master Thesis Project

![Project Logo](https://via.placeholder.com/150)

## 📘 Overview

**Learning Analytics** is a research-driven web application developed as part of a master thesis at **SRH Hochschule Heidelberg** (Supervisor: Prof. Moeckel Gerd; External Advisor: Prof. Andrea Honal, DHBW Mannheim).

The project aims to **enhance educational outcomes** by providing **students, instructors, and administrators** with personalized insights into academic performance, motivation, well-being, and engagement patterns. All data processing is designed to comply with **GDPR** and incorporates **Privacy by Design principles**.

This project addresses a key gap in existing Learning Management Systems (LMS), which primarily focus on grades and content management but do not integrate student well-being, stress, or motivation into analytics.

---

## 🎯 Research Objectives

1. Develop a **Learning Analytics App** that:

   * Tracks learning progress, well-being, motivation, and stress levels.
   * Provides anonymized group-level insights for instructors.
   * Ensures full compliance with GDPR.
2. Investigate how **Privacy by Design** principles can be applied to educational applications.
3. Create a prototype demonstrating secure, ethical, and actionable learning analytics.

---

## 🚀 Features by Role

| Role           | Features                                                                                                                                                                                                                                              |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Student**    | - Personalized dashboards for performance and engagement<br>- Progress tracking across courses<br>- Insights on stress, motivation, and well-being<br>- Downloadable performance reports<br>- Goal setting and notifications on deadlines or feedback |
| **Instructor** | - Class and student analytics dashboards<br>- Reports on assignments, quizzes, and engagement patterns<br>- Feedback tools for students<br>- Monitor class trends without identifying individual students<br>- Exportable performance data            |
| **Admin**      | - User and role management<br>- Course and curriculum management<br>- System-wide analytics<br>- Activity logs monitoring<br>- GDPR-compliant configuration and consent management<br>- Oversee instructor-generated reports                          |

---

## 🛠️ Technologies Used

* **Frontend:** React.js, Chart.js, D3.js
* **Backend:** Python, Flask, Flask Blueprints
* **Database:** MongoDB
* **Machine Learning:** scikit-learn
* **Data Visualization:** D3.js, Chart.js
* **Security & Compliance:** AES encryption, anonymization, GDPR compliance workflows

---

## 📂 Detailed Project Structure

```
/learninganalytics
│
├── /backend
│   ├── app.py                  # Initializes Flask app and registers Blueprints
│   ├── config.py               # Configuration (DB URI, AES keys, environment variables)
│   ├── models.py               # Database models (Users, Courses, Assignments, Metrics)
│   ├── extensions.py           # Initialize extensions (DB, LoginManager, etc.)
│   ├── /blueprints             # Modular features using Flask Blueprints
│   │   ├── auth/               # Authentication (login, registration, consent)
│   │   │   ├── routes.py
│   │   │   └── controllers.py
│   │   ├── student/            # Student dashboards and analytics
│   │   │   ├── routes.py
│   │   │   └── controllers.py
│   │   ├── instructor/         # Instructor analytics and feedback
│   │   │   ├── routes.py
│   │   │   └── controllers.py
│   │   ├── admin/              # Admin management and system-wide analytics
│   │   │   ├── routes.py
│   │   │   └── controllers.py
│   │   └── common/             # Utilities, anonymization, encryption helpers
│   │       └── utils.py
│   └── requirements.txt
│
├── /frontend
│   ├── index.html              # Main HTML entry point
│   ├── app.js                  # Main React app
│   ├── routes.js               # Frontend routing
│   ├── /components             # Reusable React components
│   │   ├── Dashboard/          # Role-specific dashboards
│   │   ├── Analytics/          # Charts and visualizations
│   │   ├── Forms/              # Login, registration, data input
│   │   └── Layout/             # Navbar, sidebar, footer
│   ├── /pages                  # Route-based pages
│   │   ├── StudentDashboard.js
│   │   ├── InstructorDashboard.js
│   │   ├── AdminDashboard.js
│   │   └── Login.js
│   └── styles.css              # Global CSS
│
└── README.md                   # Project documentation
```

**Notes:**

* **Backend Blueprints:** Each role and feature is modularized using Flask Blueprints (`auth`, `student`, `instructor`, `admin`), ensuring separation of concerns and scalability.
* **Privacy by Design:** Sensitive metrics (stress, motivation) are encrypted, anonymized, and stored securely.
* **Frontend:** React components are organized by functionality to facilitate scalability and maintainability.

---

## ⚙️ Installation & Setup

### Prerequisites

* Python 3.8+
* Node.js & npm
* MongoDB (local or remote)

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

* Create a `.env` file in `backend/`:

```
AES_SECRET_KEY=your_secret_key
MONGO_URI=mongodb://localhost:27017/
```

* Start backend:

```bash
python app.py
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

* Access frontend at `http://localhost:3000`

---

## 📊 Usage

* **Students:** Log in → Track learning progress, motivation, and well-being → Set goals
* **Instructors:** Log in → View class and student analytics → Provide feedback → Export anonymized reports
* **Admins:** Log in → Manage users/courses → Configure GDPR-compliant settings → Monitor system-wide analytics

---

## 🔹 Thesis Context

This project addresses the research question:

> *"How can a Learning Analytics App be designed to provide personalized student insights while ensuring compliance with GDPR regulations?”*

**Key Contributions:**

* GDPR-compliant design for handling sensitive educational data.
* Privacy-by-Design implementation with encryption and anonymization.
* Role-specific dashboards and analytics for students, instructors, and admins.
* Prototype demonstrating ethical, secure, and actionable learning analytics.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

