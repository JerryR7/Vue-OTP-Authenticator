# Vue-OTP-Authenticator

Vue-OTP-Authenticator is a modern web application built with Vue 3 and the Composition API, showcasing a complete authentication process including One-Time Password (OTP) verification and user profile display. This project integrates front-end best practices with a clear code structure, aimed to provide developers with a practical and intuitive example of an authentication system.

## Features

- **One-Time Password Authentication**: Implements a simulated OTP authentication process with digit input and auto-submission.
- **Dynamic User Interface**: Utilizes Vue 3's reactivity to provide user interaction and instant feedback.
- **User Profile Display**: Shows user's personal information, including username, quote, and photo, after verification.
- **Local Token Management**: Manages user login state using browser's localStorage.
- **Mock API Interaction**: Includes Mock API endpoints for testing and demonstration purposes of authentication flow.

## Development Environment

- Node.js v18.16.0

## Installation and Setup

First, clone the repository to your local machine:

```bash
git clone https://github.com/JerryR7/Vue-OTP-Authenticator.git
cd Vue-OTP-Authenticator
```

Then, install the dependencies and start the project:

```bash
# Using npm
npm install
npm run dev

# Using pnpm
pnpm install
pnpm dev
```

## Features

### Verification Page

- Contains 4 digit input fields.
- Automatically focuses on the first input when the page loads.
- Focuses on the next input field as the user enters a digit.
- Focuses on the previous input field when the user presses backspace.
- Automatically submits the verification code after 4 digits are entered.
- Displays an error message for incorrect code entry.
- Shows a loading indicator when submitting the code.
- Redirects to the profile page upon correct code submission.
- Supports pasting code from the clipboard.
- Restricts input to numeric only.
- Limits each input field to a single digit.

### Profile Page

- Displays username, quote, user photo, and a logout button.
- Removes the token and redirects to the verification page when the logout button is clicked.
- Maintains user login state on page refresh.

## Mock API Documentation

### Overview

This document provides detailed specifications and guidelines for using the `/api/verify` and `/api/auth` endpoints.

---

### 1. Verification API - POST /api/verify

#### Request Body:

| Parameter | Type   | Description             |
|-----------|--------|-------------------------|
| code      | string | The OTP verification code. |

#### Example Request:

```json
{
    "code": "1234"
}
```

#### Response:

Returns whether the verification code is valid. If valid, a token is also provided.

#### Example Response (valid code):

```json
{
    "valid": true,
    "token": "example_token"
}
```

#### Example Response (invalid code):

```json
{
    "valid": false
}
```

### 2. Authorization API - GET /api/auth

#### Request Headers:

| Header Name   | Value  | Description                           |
|---------------|--------|---------------------------------------|
| Authorization | string | The token received from /api/verify. |

#### Response:

If authorized, the response will contain the username, quote, and photo. Otherwise, an error message is provided.

#### Example Response (Authorized):

```json
{
  "username": "johnDoe",
  "quote": "Hello, World!",
  "photo": "https://example.com/image.jpg"
}
```

#### Example Response (Unauthorized):

```json
{
    "message": "unauthorized"
}
```

## License
This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/). See the [LICENSE](LICENSE) file for details.