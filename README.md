# Socio - A Social Media Platform

Socio is a social media application built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. It allows users to connect, share posts, and interact with each other in real-time. This repository contains both the **client** and **server** directories, each responsible for the frontend and backend of the application, respectively.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Directory Structure](#directory-structure)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Contributing](#contributing)


## Features

- User authentication and authorization (JWT-based).
- Create, update, and delete posts.
- Like and comment on posts.
- Follow/unfollow users.
- Real-time updates on posts and interactions.
- Responsive design for mobile and desktop.

## Technologies Used

- **Frontend (Client)**:
  - React.js (with Hooks)
  - Redux (for state management)
  - Axios (for API calls)
  - Material-UI (for UI components)
  
- **Backend (Server)**:
  - Node.js (with Express.js)
  - MongoDB (with Mongoose for data modeling)
  - JSON Web Tokens (JWT) for user authentication
  - Bcrypt for password encryption
  - Cloudinary for image hosting (optional)

## Directory Structure

```plaintext
Socio/
├── client/              # Frontend React.js application
├── server/              # Backend Node.js/Express API
├── README.md            # Project documentation
├── .gitignore           # Git ignore file
```

## Installation
Ensure that you have the following installed on your machine:

- Node.js
- MongoDB
- Git

Clone the Repository
```
git clone https://github.com/ArinNigam/Socio.git
cd Socio
```

Install Dependencies
1. Navigate to the client directory and install the dependencies:
```
cd client
npm install
```
2. Navigate to the server directory and install the dependencies:
```
cd server
npm install
```

## Running the Application
### Backend (Server)

1. Navigate to the server directory:
  ``` cd server```
2. Create a .env file in the root of the server directory and add the following environment variables:
```
PORT=5000
MONGO_URI=<Your MongoDB Connection URI>
JWT_SECRET=<Your JWT Secret>
CLOUDINARY_NAME=<Your Cloudinary Name (optional)>
CLOUDINARY_API_KEY=<Your Cloudinary API Key (optional)>
CLOUDINARY_API_SECRET=<Your Cloudinary API Secret (optional)>
```

### Frontend (Client)
1. Navigate to the client directory:
```
cd client
```
2. Start the React development server:
```
npm start
```
By default, the React app runs on ```http://localhost:3000```, and the server API runs on ```http://localhost:5000```.

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request for any improvements, bug fixes, or features you'd like to add.

