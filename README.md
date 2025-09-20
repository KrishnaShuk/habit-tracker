# Habit Track: A Full-Stack Social Habit Tracker

Habit Track is a modern, full-stack web application designed to help users build better habits through personal tracking and social accountability. Users can create, manage, and track their daily and weekly goals in a vibrant, motivating interface. The application also features a social component, allowing users to follow friends and view their progress in a beautifully designed "Friends Dashboard."

This project was built from the ground up to demonstrate proficiency in modern web development practices, including full-stack development with Next.js, database integration with MongoDB, user authentication, and containerization with Docker.




## ✨ Features

- **Complete User Authentication:** Secure sign-up, login, and logout functionality using JWT and secure cookies.
- **Protected Routes:** Middleware ensures that only authenticated users can access the dashboard and other protected pages.
- **Dynamic Habit Management (CRUD):**
  - **Create:** Add new habits via a rich, category-driven modal with pre-defined suggestions.
  - **Read:** View habits organized into "Daily Goals" and "Weekly Goals" sections.
  - **Update:** Edit the name and frequency of existing habits.
  - **Delete:** Permanently remove habits with a confirmation step.
- **Interactive Tracking:** A flexible, "toggle-style" check-in button allows users to mark habits as complete or incomplete for the current day.
- **Dynamic Streak Calculation:** An intelligent backend system accurately calculates and displays current streaks for both daily and weekly habits.
- **Social Accountability:**
  - **Find & Follow:** Search for other users by their unique username and follow them.
  - **Friends Dashboard:** View a colorful, engaging dashboard of your friends' progress, showing the real-time completion status of their habits for the day.
- **Gumroad-Inspired UI:** A bold, minimalist, and colorful user interface inspired by the Gumroad aesthetic, built with Tailwind CSS.

## 🎨 Tech Stack

This project leverages a modern, full-stack JavaScript technology set.

- **Framework:** **Next.js 13+** (App Router)
- **Frontend:**
  - **React** & **TypeScript**
  - **Tailwind CSS** for styling
- **Backend:**
  - **Next.js API Routes** (Route Handlers)
  - **Mongoose** as the ODM for MongoDB
- **Database:** **MongoDB Atlas**
- **Authentication:** **JWT (JSON Web Tokens)** with the `jose` library, stored in secure `httpOnly` cookies.
- **Containerization:** **Docker** & **Docker Compose**

## 🚀 Getting Started

There are two ways to run this project locally: using Docker (recommended for a consistent production-like environment) or running the Node.js development server directly.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/products/docker-desktop/) and [Docker Compose](https://docs.docker.com/compose/install/) (for the Docker method)
- A free **MongoDB Atlas** account and a cluster connection string.

### 1. Installation

First, clone the repository to your local machine:
```bash
git clone https://github.com/your-username/habit-tracker.git
cd habit-tracker
```

### 2. Environment Variables

This application requires a few secret keys to run. Create a file named `.env` in the root of the project. It's recommended to copy the example file if one is provided.

```bash
# Example: If .env.example exists, copy it
# cp .env.example .env
```

Now, open the `.env` file and add your own values:

```# Your MongoDB Atlas connection string.
# Make sure to replace <username>, <password>, and add your database name.
MONGODB_URI=mongodb+srv://<username>:<password>@cluster-url.mongodb.net/habit-tracker?retryWrites=true&w=majority

# A strong, secret key for signing JSON Web Tokens.
# You can generate one using an online tool or a password manager.
JWT_SECRET=your_super_secret_key_goes_here
```

### 3. Running the Application

#### Method A: Using Docker 

This is the simplest and most reliable way to get the application running, as it mirrors a production environment.

1.  **Build the Docker image:**
    ```bash
    docker-compose build
    ```

2.  **Start the container:**
    ```bash
    docker-compose up
    ```

The application will now be running and accessible at **`http://localhost:3000`**.

To stop the application, press `Ctrl+C` in the terminal, and then run:
```bash
docker-compose down
```

#### Method B: Running Locally with npm

If you prefer to run the Next.js development server directly:

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application will now be running and accessible at **`http://localhost:3000`** (or the next available port).
