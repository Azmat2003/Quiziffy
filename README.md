# Quiziffy

> **An AI-powered quiz platform that generates personalized quizzes, tracks attempts, enforces timed questions, and provides performance analytics.**

Quiziffy is a full-stack MERN application that allows users to generate quizzes using AI based on a topic and difficulty level, attempt them under time constraints, review their performance, and track learning progress through an analytics dashboard.

The project focuses not only on AI integration, but also on real application concerns such as authentication, persistent quiz attempts, rate limiting, generation quotas, attempt expiration, server-side scoring, and dashboard analytics.

---

## Live Demo

**Frontend:**  
https://quiziffy.vercel.app/

**Backend API:**  
https://quiziffy.onrender.com/

---

## Features

### AI Quiz Generation

Users can create quizzes by selecting:

- Topic
- Difficulty
  - Easy
  - Medium
  - Hard
- Time allowed per question

Quiz questions are generated using an LLM and stored in MongoDB so that the generated quiz remains persistent.

---

### Authentication

Quiziffy provides complete authentication using JWT and HTTP-only cookies.

Features include:

- User registration
- Login
- Logout
- Protected routes
- Password recovery
- Password reset
- Role-based authorization

---

### AI Generation Quota

Each user has a limited number of AI quiz generations.

Deleting a quiz does **not** restore the generation quota.

This prevents users from repeatedly generating and deleting quizzes to bypass the limit.

---

### API Rate Limiting

Quiz generation endpoints are rate limited to reduce abuse and unnecessary AI API requests.

---

### Timed Quiz Attempts

Each quiz has a configurable timer for every question.

During an attempt:

- Questions are shown one at a time
- Users cannot navigate backward
- The next question becomes available after answering
- If the timer expires, the question is recorded as unanswered
- Unanswered questions are stored as `null`
- Progress is persisted on the backend

---

### Persistent Quiz Attempts

Quiz state is stored in MongoDB rather than only in React state.

This allows a user to resume an unfinished quiz using the persisted:

- current question index
- selected answers
- attempt status
- quiz expiration time

---

### Attempt Lifecycle

Quiz attempts can exist in three states:

```text
IN_PROGRESS
COMPLETED
EXPIRED
```

A quiz attempt expires after **24 hours** if it is not completed.

```text
Quiz Generated
      |
      v
Attempt Started
      |
      v
 IN_PROGRESS
      |
      +----------------------+
      |                      |
      v                      v
Quiz Submitted        24 Hours Passed
      |                      |
      v                      v
 COMPLETED                EXPIRED
```

---

### Server-Side Scoring

Quiz scores are calculated on the backend using the stored correct answers.

The frontend does not determine the final score.

This keeps quiz evaluation centralized and prevents the client from controlling result calculation.

---

### Quiz Review

Completed quizzes can be reviewed after submission.

Users can inspect:

- Questions
- Selected answers
- Correct answers
- Final score
- Percentage

---

### Dashboard

Quiziffy includes a user dashboard for tracking activity and performance.

The dashboard contains:

#### Overview

- AI quizzes generated
- Generation quota usage
- Completed quizzes
- Average score
- Highest scoring quiz
- Lowest scoring quiz

#### My Quizzes

Quizzes can be filtered by:

```text
ALL
COMPLETED
IN_PROGRESS
EXPIRED
```

Available actions depend on quiz status:

```text
COMPLETED   -> Review
IN_PROGRESS -> Continue
EXPIRED     -> View
```

#### Analytics

Analytics include:

- Topic distribution
- Score trend
- Average performance
- Quiz history
- Performance summary

---

# Tech Stack

## Frontend

- React
- Vite
- React Router
- Tailwind CSS
- JavaScript

## Backend

- Node.js
- Express.js
- REST APIs

## Database

- MongoDB
- Mongoose

## AI

- Gemini / LLM API integration

## Authentication

- JSON Web Tokens
- HTTP-only cookies
- bcrypt password hashing

## Deployment

- Vercel — Frontend
- Render — Backend
- MongoDB Atlas — Database

---

# System Architecture

```text
                    +--------------------+
                    |        User        |
                    +---------+----------+
                              |
                              v
                    +--------------------+
                    |   React Frontend   |
                    |   Vite + Tailwind  |
                    +---------+----------+
                              |
                              | REST API
                              v
                    +--------------------+
                    | Express.js Backend |
                    +---------+----------+
                              |
                +-------------+-------------+
                |             |             |
                v             v             v
        +-------------+ +------------+ +-------------+
        |    Auth     | |   Quizzes  | |  Dashboard  |
        +-------------+ +------------+ +-------------+
                              |
                     +--------+--------+
                     |                 |
                     v                 v
              +-------------+    +-------------+
              | MongoDB     |    |  AI / LLM   |
              | Atlas       |    |    API      |
              +-------------+    +-------------+
```

---

# Quiz Generation Flow

```text
User
 |
 | Topic + Difficulty + Timer
 v
Quiz Generation Request
 |
 v
Authentication Middleware
 |
 v
Rate Limiter
 |
 v
Request Validation
 |
 v
Generation Quota Check
 |
 v
AI Quiz Generation
 |
 v
Validate AI Response
 |
 v
Store Quiz in MongoDB
 |
 v
Quiz Ready
```

---

# Quiz Attempt Flow

```text
                 START QUIZ
                     |
                     v
              Fetch Existing Attempt
                     |
           +---------+---------+
           |                   |
           | Exists            | Does Not Exist
           v                   v
       Resume Attempt      Create Attempt
           |                   |
           +---------+---------+
                     |
                     v
                Show Question
                     |
             +-------+-------+
             |               |
             v               v
        User Answers      Timer Ends
             |               |
             v               v
      Save Selection      Save null
             |               |
             +-------+-------+
                     |
                     v
              Next Question
                     |
                     v
               Final Question
                     |
                     v
                  Submit
                     |
                     v
            Calculate Score
                     |
                     v
                 COMPLETED
```

---

# Database Design

Quiziffy separates quiz definitions from user attempts.

This avoids mixing generated quiz content with continuously changing attempt state.

## User

```text
User
|
+-- name
+-- email
+-- password
+-- role
+-- profilePic
+-- aiQuizGeneratedCount
+-- createdAt
+-- updatedAt
```

---

## Quiz

```text
Quiz
|
+-- user
+-- title
+-- topic
+-- difficulty
+-- questionTimer
+-- tags[]
|
+-- questions[]
|    |
|    +-- question
|    +-- options[4]
|    +-- correctOption
|
+-- createdAt
+-- updatedAt
```

---

## Attempt

```text
Attempt
|
+-- user
+-- quiz
|
+-- answers[]
|    |
|    +-- questionIndex
|    +-- selectedOption
|
+-- currentQuestionIndex
+-- status
+-- startedAt
+-- expiresAt
+-- submittedAt
+-- score
+-- percentage
+-- createdAt
+-- updatedAt
```

---

# Why Quiz and Attempt Are Separate

A `Quiz` represents the generated quiz itself.

A quiz contains relatively static information such as:

```text
questions
options
correct answers
difficulty
topic
timer
```

An `Attempt` represents a user's progress while taking that quiz.

It contains frequently changing data such as:

```text
answers
currentQuestionIndex
status
score
expiry
```

Separating these responsibilities keeps the database design cleaner and makes attempts easier to resume and manage.

---

# API Overview

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

---

## Quizzes

```http
POST /api/quizzes/generate

GET /api/quizzes

GET /api/quizzes/:quizId
```

---

## Quiz Attempts

```http
GET /api/quizzes/:quizId/attempt

POST /api/quizzes/:quizId/attempt

PUT /api/quizzes/:quizId/attempt

POST /api/quizzes/:quizId/attempt/submit
```

---

## Dashboard

```http
GET /api/dashboard/overview

GET /api/dashboard/analytics
```

---

# Important Engineering Decisions

## Backend Controls Quiz Progression

The backend stores `currentQuestionIndex`.

When an answer is submitted, the server verifies that the submitted question corresponds to the question the user is currently allowed to answer.

This prevents the frontend from arbitrarily submitting answers for different question indices.

---

## Timeout Answers Are Explicitly Stored

If the timer expires before the user selects an option:

```js
selectedOption: null
```

is stored.

This makes a distinction between:

```text
Answered Question
```

and

```text
Question Not Answered Within Time
```

---

## Scoring Happens on the Server

The backend compares submitted answers against the quiz's stored correct answers.

The client only displays the result returned by the server.

---

## Attempts Expire Independently of Question Timers

Quiziffy uses two different timer concepts.

### Question Timer

Controls how long the user has to answer an individual question.

### Attempt Expiry

Controls how long the entire attempt remains valid.

Current attempt expiry:

```text
24 hours
```

---

## Generation Quota Is Permanent

Deleting generated quizzes does not decrease:

```text
aiQuizGeneratedCount
```

This prevents quota circumvention through repeated quiz deletion.

---

# Security

Quiziffy implements several security measures:

- Password hashing
- JWT authentication
- HTTP-only cookies
- Protected API routes
- Role-based authorization
- Request validation
- CORS configuration
- API rate limiting
- AI generation quotas
- Server-side score calculation
- Environment variables for secrets

---

# Project Structure

```text
Quiziffy/
|
+-- frontend/
|   |
|   +-- src/
|   |   |
|   |   +-- components/
|   |   +-- context/
|   |   +-- pages/
|   |   +-- assets/
|   |   +-- App.jsx
|   |   +-- main.jsx
|   |
|   +-- package.json
|   +-- vite.config.js
|
+-- backend/
|   |
|   +-- src/
|   |   |
|   |   +-- controllers/
|   |   +-- middlewares/
|   |   +-- models/
|   |   +-- routes/
|   |   +-- services/
|   |   +-- validations/
|   |   +-- server.js
|   |
|   +-- package.json
|
+-- README.md
```

---

# Challenges and Learnings

Building Quiziffy involved solving several problems beyond basic CRUD operations.

### Persistent Quiz State

Quiz attempts needed to survive:

- page refreshes
- route changes
- temporary navigation
- browser sessions

This required moving important attempt state from the frontend into MongoDB.

---

### Quiz Expiration

Attempts have to automatically become invalid after a fixed duration.

The backend checks `expiresAt` while retrieving and updating attempts and updates the status when the attempt has expired.

---

### Handling Timed-Out Questions

A timer finishing without an answer still represents an attempt at the question.

Quiziffy stores these responses explicitly as `null` instead of simply skipping them.

---

### Preventing Multiple Answer Submissions

Frontend request locking is used to avoid situations where:

```text
Timer reaches 0
```

and

```text
User presses Next
```

at almost the same time.

---

### Cross-Origin Authentication

The production application uses separate domains for the frontend and backend.

```text
Vercel
   |
   | Cross-origin request
   v
Render
```

This required configuring:

- CORS
- credentials
- HTTP-only cookies
- `SameSite`
- `Secure` cookie settings

---

### AI Response Handling

LLM output must be transformed into predictable quiz data before being stored.

Quiziffy validates the generated structure before saving quiz data to MongoDB.

---

# Future Improvements

Potential improvements include:

- Automated API integration tests
- Server-authoritative question timers
- Database-level unique constraints for quiz attempts
- Redis-backed distributed rate limiting
- Improved AI provider fallback
- More advanced MongoDB aggregation for analytics
- Quiz sharing
- Public quiz links
- Improved accessibility
- Expanded admin analytics

---

# Running Quiziffy Locally

## Prerequisites

Make sure the following are installed or available:

- Node.js
- npm
- MongoDB or MongoDB Atlas
- Gemini / supported AI API key

For password reset emails, email credentials may also be required.

---

## 1. Clone the Repository

```bash
git clone https://github.com/Azmat2003/Quiziffy.git

cd Quiziffy
```

---

# Backend Setup

## 2. Open the Backend Directory

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

---

## 3. Create Backend Environment Variables

Create a `.env` file inside the `backend` directory.

Example:

```env
PORT=3000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET_KEY=your_jwt_secret

FRONTEND_BASE_URL=http://localhost:5173

GEMINI_API_KEY=your_gemini_api_key

EMAIL_USER=your_email

EMAIL_PASS=your_email_app_password
```

Environment variable names should match the variables being used in the backend source code.

---

## 4. Start the Backend

```bash
npm run dev
```

The API should now be available at:

```text
http://localhost:3000
```

---

# Frontend Setup

Open another terminal and return to the project root.

```bash
cd Quiziffy/frontend
```

Install dependencies:

```bash
npm install
```

---

## 5. Create Frontend Environment Variables

Create a `.env` file inside the `frontend` directory.

```env
VITE_BACKEND_BASE_URL=http://localhost:3000/api
```

---

## 6. Start the Frontend

```bash
npm run dev
```

Vite will usually start the application at:

```text
http://localhost:5173
```

Open the URL in your browser.

---

# Local Architecture

```text
Browser
   |
   v
http://localhost:5173
React Frontend
   |
   | HTTP requests
   v
http://localhost:3000/api
Express Backend
   |
   +------> MongoDB
   |
   +------> Gemini / AI API
```

---

# Author

**Azmat Matin Shadab**

GitHub:  
https://github.com/Azmat2003

---

If you found this project useful or interesting, consider giving the repository a ⭐.