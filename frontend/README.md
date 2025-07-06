# Frontend - Authentication App

A modern React frontend for user authentication with OTP verification.

## Features

- **Login Page**: Email and password authentication
- **Registration Page**: Multi-step registration with OTP verification
- **Modern UI**: Built with React and Tailwind CSS
- **Form Validation**: Client-side validation with error handling
- **Toast Notifications**: User-friendly feedback with react-hot-toast
- **Responsive Design**: Works on desktop and mobile devices

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Make sure the backend server is running on `http://localhost:5000`

## API Endpoints

The frontend communicates with the following backend endpoints:

- `POST /api/auth/send-otp` - Send OTP to email
- `POST /api/auth/verify-otp` - Verify OTP and create account
- `POST /api/auth/login` - User login

## Project Structure

```
src/
├── App.jsx          # Main app component with routing
├── pages/
│   ├── Login.js     # Login page component
│   └── Register.js  # Registration page with OTP
├── App.css          # Global styles
└── index.css        # Tailwind CSS imports
```

## Technologies Used

- React 19
- React Router DOM
- Tailwind CSS v4
- Axios for API calls
- React Hot Toast for notifications

## Usage

1. Navigate to the registration page to create a new account
2. Enter your email to receive an OTP
3. Fill in your details and verify the OTP
4. Use the login page to sign in with your credentials
