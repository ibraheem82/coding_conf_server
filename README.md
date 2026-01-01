# Conference Ticket Generator - Backend Server

This is the backend API for the Conference Ticket Generator application. It handles ticket creation, image upload, email delivery, and persistent data storage.

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express 5 (Beta)
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Language:** TypeScript
- **Services:** Cloudinary (Image Upload), Brevo (Email Delivery)

## Prerequisites
- Node.js (v18+)
- PostgreSQL Database
- Cloudinary Account
- Brevo Account

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root directory and add the following:
   ```env
   # Server
   PORT=9392
   NODE_ENV=development

   # Database (PostgreSQL)
   DATABASE_URL=postgres://user:password@localhost:5432/conference_db

   # Cloudinary (Image Hosting)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Brevo (Email Service)
   BREVO_API_KEY=your_brevo_api_key
   BREVO_SENDER_EMAIL=your_verified_sender_email
   BREVO_SENDER_NAME="Coding Conf Team"
   ```

3. **Database Setup**
   Ensure your PostgreSQL server is running. Then verify schemas:
   ```bash
   npm run db:generate
   npm run db:migrate  # Or npm run db:push for prototyping
   ```

## Running the Server

- **Development Mode** (with hot reload):
  ```bash
  npm run dev
  ```
- **Production Build**:
  ```bash
  npm run build
  npm start
  ```

## API Endpoints

| Method | Endpoint | Description | Body / Query |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Check server status | N/A |
| `POST` | `/api/tickets` | Create a new ticket | FormData: `fullName`, `email`, `githubUsername`, `avatar` (file) |
| `GET` | `/api/tickets/search` | Find a ticket | Query: `?query=email_or_ticket_number` |
