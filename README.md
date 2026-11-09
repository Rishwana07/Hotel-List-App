Hotel List App

A full-stack web application for adding, viewing, updating, deleting, and managing hotel details.

1. Project Description

I developed this Hotel List App as a full-stack web development project. The main purpose of this application is to manage hotel details in one place.

Users can add new hotels, view hotel information, edit existing details, and delete hotel records. The application also includes image upload, search, price filtering, and pagination features.

I used React.js for the frontend, Node.js and Express.js for the backend, and PostgreSQL for storing hotel information.

2. Live Project Links

Component	Link
Frontend	https://hotel-list-app.vercel.app
Backend	https://hotel-list-app.onrender.com
REST API	https://hotel-list-app.onrender.com/api/hotels
GitHub Repository	https://github.com/Rishwana07/Hotel-List-App

3. Features

Hotel Management

* Add new hotel details.
* View the list of hotels.
* Edit existing hotel information.
* Delete hotel records.
* Upload hotel images and preview them before saving.

Search and Filter

* Search hotels using the hotel name.
* Filter hotels based on minimum and maximum price.
* View hotel details using pagination.

User Interface

* Responsive design for desktop, tablet, and mobile screens.
* Card-based hotel listing.
* Reusable form for adding and editing hotels.
* Separate page to view complete hotel details.
* Form validation for hotel information.
* Dynamic page titles and metadata.

Location Details

* Store hotel latitude and longitude.
* Display hotel location using map integration.

4. Technologies Used

Frontend

* React.js
* Redux Toolkit
* React Router DOM
* JavaScript (ES6+)
* HTML5
* CSS3
* React Helmet Async

Backend

* Node.js
* Express.js
* Multer
* CORS

Database

* PostgreSQL
* Neon Database

Development Tools

* Visual Studio Code
* Git
* GitHub
* npm

Deployment Platforms

* Vercel – Frontend Deployment
* Render – Backend Deployment
* Neon – Database Hosting

5. How the Application Works

1. Users open the Hotel List App.
2. The application displays hotel details retrieved from the backend API.
3. The backend communicates with the PostgreSQL database.
4. Users can add, edit, and delete hotel information.
5. Users can search for hotels by name.
6. Users can filter hotels based on price.
7. Pagination is used to display hotel records across multiple pages.
8. Users can open an individual hotel to view its complete details.

6. System Architecture

             User
               |
               v
       React.js Frontend
               |
        Redux Toolkit
               |
         REST API Calls
               |
               v
       Node.js + Express
               |
          SQL Queries
               |
               v
         PostgreSQL
          (Neon DB)

7. REST API Details

Base URL:

https://hotel-list-app.onrender.com/api/hotels

Method	Endpoint	Purpose
GET	/api/hotels	Get all hotel records
GET	/api/hotels/:id	Get a particular hotel
POST	/api/hotels	Add a new hotel
PUT	/api/hotels/:id	Update hotel details
DELETE	/api/hotels/:id	Delete a hotel

Additional API Features

* Search hotels by title.
* Filter hotels using minimum and maximum price.
* Pagination using limit and offset.
* Upload hotel images using Multer.

8. Database Details

I used PostgreSQL to store the hotel information.

Table Name: hotels

Column	Description
id	Unique hotel ID
image	Hotel image path
title	Hotel name
description	Hotel description
latitude	Hotel latitude
longitude	Hotel longitude
price	Hotel price
created_at	Record creation date and time

9. Project Folder Structure

Hotel-List-App/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── routes/
│   │   └── hotelRoutes.js
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
├── src/
│   ├── app/
│   ├── components/
│   ├── features/
│   ├── pages/
│   ├── data/
│   ├── App.jsx
│   └── main.jsx
│
├── public/
├── package.json
└── README.md

10. How to Run the Project Locally

Prerequisites

* Node.js
* npm
* PostgreSQL database

Step 1: Clone the Repository

git clone https://github.com/Rishwana07/Hotel-List-App.git
cd Hotel-List-App

Step 2: Install Frontend Dependencies

npm install

Step 3: Install Backend Dependencies

cd backend
npm install

Step 4: Configure Environment Variables

Create a .env file inside the backend folder.

DATABASE_URL=your_postgresql_connection_string
PORT=5000

Step 5: Start the Backend

node server.js

Step 6: Start the Frontend

Open another terminal in the main project folder and run:

npm run dev

Open the local URL displayed in the terminal.

11. Deployment

I deployed the application using the following platforms:

Application Layer	Platform
Frontend	Vercel
Backend	Render
Database	Neon PostgreSQL

The deployed frontend connects to the backend API to retrieve and update hotel information. PostgreSQL is used to store the hotel records.

12. What I Learned

While developing this project, I learned how to:

* Create reusable components using React.js.
* Manage application data using Redux Toolkit.
* Connect the frontend with backend APIs.
* Perform CRUD operations.
* Work with a PostgreSQL database.
* Upload images using Multer.
* Implement search and price filtering.
* Implement pagination.
* Create responsive web pages.
* Deploy a full-stack application.

13. Project Screenshots

Screenshots of the application can be added here.

* Hotel Listing Page
* Add/Edit Hotel Form
* Hotel Details Page
* Search and Filter Results

14. About Me

Rishwana A.

B.E. Computer Science and Engineering
CARE College of Engineering

Project Name: Hotel List App
Project Type: Full-Stack Web Development
