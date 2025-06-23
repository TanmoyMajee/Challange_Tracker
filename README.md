#  Daily Challenge Tracker API

A robust Node.js backend API for tracking daily challenges, user progress, and history. Built with Express.js and MongoDB (Mongoose), featuring JWT authentication and role-based access control.

---


## Features

- **User Registration & Authentication** (JWT)
- **Challenge Creation & Assignment**
- **Daily Progress Tracking**
- **Progress History & Filtering**
- **Challenge Status (current, upcoming, completed)**
- **Reminders Endpoint**
- **Role-based Access Control (User/Admin)**
- **Bonus:** Statistics, Social Sharing, Notification Integration

---


---

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Task_Management/Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**  
   Create a `.env` file in `Backend/`:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. **Run the server**
   ```bash
   npm run dev
   ```

---

## Environment Variables

| Variable      | Description                |
|---------------|---------------------------|
| MONGODB_URI   | MongoDB connection string |
| JWT_SECRET    | Secret for JWT signing    |
| PORT          | Server port (default 5000)|

---

## API Endpoints

### Auth Routes (`/api/auth`)

| Method | Endpoint         | Description                | Access   | Returns                        |
|--------|------------------|----------------------------|----------|---------------------------------|
| POST   | `/register`      | Register new user          | Public   | `{ user, token }`               |
| POST   | `/login`         | Login, get JWT             | Public   | `{ user, token }`               |
| GET    | `/profile`       | Get own profile            | User     | `user` object                   |
| GET    | `/users`         | List all users             | User[as user can assign/create challang]   | `[user, ...]`                   |

---

### Challenge Routes (`/api/challenges`)

| Method | Endpoint                | Description                        | Access   | Returns                        |
|--------|-------------------------|------------------------------------|----------|---------------------------------|
| POST   | `/`                     | Create a new challenge             | User     | `challenge` object             |
| GET    | `/`                     | List own challenges (filterable)   | User     | `[challenge, ...]`             |
| GET    | `/status/:status`       | List by status (current/upcoming/completed) | User | `[challenge, ...]`    |
| GET    | `/:id`                  | Get challenge by ID                | User     | `challenge` object             |
| PUT    | `/:id`                  | Update challenge                   | Owner    | `challenge` object             |
| DELETE | `/:id`                  | Delete challenge                   | Owner    | `{ message }`                  |
| POST   | `/:id/assign`               | Assign challenge to user(s)        | User     | `{ message, challenge }`       |

---

### Progress Routes (`/api/progress`)

| Method | Endpoint         | Description                        | Access   | Returns                        |
|--------|------------------|------------------------------------|----------|---------------------------------|
| POST   | `/`              | Mark/update daily progress         | User     | `progress` object              |
| GET    | `/`              | Get progress history (filterable)  | User     | `[progress, ...]`              |
| GET    | `/today`         | Get today’s pending/completed      | User     | `{ completed, pending }`       |

---


## Models

- **User:**  
  ```js
  {
    _id,
    name,
    email,
    password,
    role // 'user' or 'admin'
  }
  ```
- **Challenge:**  
  ```js
  {
    _id,
    title,
    description,
    startDate,
    endDate,
    assignedTo, // user id(s)
    createdBy,  // user id
    status      // current, upcoming, completed
  }
  ```
- **Progress:**  
  ```js
  {
    _id,
    user,      // user id
    challenge, // challenge id
    date,
    completed, // boolean
    notes
  }
  ```

---

## Access Control

- **Public:** Register, Login
- **User:** All challenge/progress endpoints for own data
- **Admin:** Can view all users, all challenges
- **Owner:** Can update/delete only own challenges

---

## Error Handling

All endpoints return errors as:
```json
{ "error": "Error message" }
```
- Validation errors: 400
- Unauthorized: 401
- Not found: 404

---
## Testing

- Use Postman or similar tool for API testing.
- [Download Postman Collection]([https://www.postman.com/collections/your-collection-link](https://tanmoy-852295.postman.co/workspace/Tanmoy's-Workspace~5a9ba9dd-d00c-4661-8b49-b0e1fc3600db/collection/44367592-7c3c3413-9b48-4025-9053-bffb80e014ec?action=share&creator=44367592))
- [Live API Base URL]([https://your-live-api-link.com](https://challange-tracker-wimo.onrender.com)) 

---

## License

MIT

---
