# Facebook Helpdesk

A web application that allows Facebook page owners to manage customer conversations from Facebook Messenger in a unified helpdesk interface.



## Overview

Facebook Helpdesk enables businesses to efficiently handle customer support through Facebook Messenger. Page owners can connect their Facebook pages and respond to customer messages using a simple, intuitive interface.

## Features

- **User Authentication**: Secure registration and login system
- **Facebook Integration**: Connect multiple Facebook pages to the helpdesk
- **Real-time Messaging**: Get notified of new messages instantly
- **Conversation Management**: View all customer conversations in one place
- **Customer Profiles**: See basic customer information while chatting
- **Responsive Design**: Works on desktop and mobile devices

## Screenshots

### Login Screen
![Image](https://github.com/user-attachments/assets/3f1481f2-f37e-42ca-a4c4-348c1cd8d83f)

### Registration Screen
![Image](https://github.com/user-attachments/assets/cd852f71-861a-4c06-8f17-6237a3a737ae)

### Facebook Page Connection
![Image](https://github.com/user-attachments/assets/51ae9473-5210-43c5-8709-01f1c475ef05)


### Conversation Interface
![Image](https://github.com/user-attachments/assets/1eaaff60-a922-4571-aeb0-f99f85537fa9)

## Tech Stack

- **Frontend**: React.js, React Router, Socket.io Client, CSS3
- **Backend**: Node.js, Express.js, Socket.io
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **External API**: Facebook Graph API

## Installation

### Prerequisites

- Node.js (v14.0.0 or higher)
- MongoDB (local or cloud instance)
- Facebook Developer Account
- Facebook App with Messenger permissions

### Server Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/facebook-helpdesk.git
   cd facebook-helpdesk
   ```

2. Navigate to the server directory:
   ```bash
   cd server
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the server directory with the following content:
   ```
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # MongoDB Connection
   MONGODB_URI=your_mongodb_connection_string

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRATION=86400

   # Facebook App Configuration
   FB_APP_ID=your_facebook_app_id
   FB_APP_SECRET=your_facebook_app_secret
   FB_GRAPH_API_VERSION=v18.0
   FB_WEBHOOK_VERIFY_TOKEN=your_webhook_verify_token

   # Client URL
   CLIENT_URL=http://localhost:3000
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

### Client Setup

1. Navigate to the client directory:
   ```bash
   cd ../client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the client directory with the following content:
   ```
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_FB_APP_ID=your_facebook_app_id
   ```

4. Start the client:
   ```bash
   npm start
   ```

## Facebook App Setup

1. Create a Facebook App at [developers.facebook.com](https://developers.facebook.com/)
2. Add the Messenger product to your app
3. Configure webhook events for messages
4. Set up webhook verification using your `FB_WEBHOOK_VERIFY_TOKEN`
5. Generate an app secret and use it for `FB_APP_SECRET`
6. Add valid OAuth redirect URIs (e.g., `http://localhost:3000/connect`)

## Usage

1. Register a new account in the Facebook Helpdesk app
2. Log in with your credentials
3. Connect your Facebook page by clicking the "Connect Page" button
4. Authorize the app to access your Facebook page
5. Start responding to customer messages from the Agent Dashboard
6. View customer details in the profile panel while messaging

## Development

### Project Structure

```
facebook-helpdesk/
├── client/               # React frontend
│   ├── public/           # Static files
│   ├── src/              # Source files
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── utils/        # Utility functions
│   │   └── App.js        # Main app component
├── server/               # Node.js backend
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── middlewares/      # Express middlewares
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   └── server.js         # Entry point
└── README.md             # Project documentation
```


## Acknowledgements

- [Facebook Graph API](https://developers.facebook.com/docs/graph-api/)
- [React.js](https://reactjs.org/)
- [Express.js](https://expressjs.com/)
- [Socket.io](https://socket.io/)
- [MongoDB](https://www.mongodb.com/) 
