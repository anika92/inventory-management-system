# 📦 Full-Stack Inventory Management System

A high-performance, enterprise-ready Inventory & CRM Management System built with a **FastAPI** backend, **PostgreSQL** database, and **React + Tailwind CSS** frontend.

<img width="1053" height="568" alt="Screenshot 2026-11-05 190247" src="https://github.com/user-attachments/assets/60c67723-f988-40b5-a921-607bb67277d1" />


---

## ✨ Features

- **📊 Dashboard Analytics:** Real-time visibility into Total Revenue, Costs, Net Profit, and low-stock alerts.
- **📦 Product Management:** Full CRUD capabilities for stock inventory, SKU tracking, pricing, and threshold alerts.
- **🏷️ Category & CRM Management:** Categorize products and manage customer details efficiently.
- **⚡ High-Speed REST API:** Developed using Python, FastAPI, SQLAlchemy, and Pydantic.
- **🎨 Modern UI/UX:** Built with React, Vite, Tailwind CSS, and Lucide React icons.

---

## 🛠️ Tech Stack

- **Backend:** Python, FastAPI, SQLAlchemy, Pydantic, PostgreSQL, Uvicorn
- **Frontend:** React, Vite, Tailwind CSS, Axios, Lucide React, React Router

---

## 🚀 Local Setup Instructions

### Prerequisites
Make sure you have the following installed on your local system:
- **Python (3.10+)**
- **Node.js (18+)**
- **PostgreSQL**

---

### 1. Database Setup
Create a PostgreSQL database named `inventory_db` on your local server.

---

### 2. Backend Setup (FastAPI)

1. Navigate to the backend folder:
   ```bash
   cd backend

Create and activate a virtual environment:

Windows:

Bash
python -m venv venv
venv\Scripts\activate
macOS/Linux:

Bash
python3 -m venv venv
source venv/bin/activate
Install dependencies:

Bash
pip install -r requirements.txt
Start the FastAPI server:

Bash
uvicorn app.main:app --reload
The API documentation will be available at http://127.0.0.1:8000/docs.

3. Frontend Setup (React + Vite)
Open a new terminal and navigate to the frontend directory:

Bash
cd frontend
Install Node dependencies:

Bash
npm install
Run the development server:

Bash
npm run dev
The application will open at http://localhost:5173.

📄 License
This project is open-source and available under the MIT License.

