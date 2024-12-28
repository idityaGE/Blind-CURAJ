# Installation Guide for College Chat Web App

This guide provides step-by-step instructions to set up the web app, including the WebSocket server and Next.js frontend.

---

## Prerequisites

1. **Node.js**: Install [Node.js](https://nodejs.org/) (version 16 or higher).
2. **Database**: Set up a database (e.g., PostgreSQL) compatible with Prisma.
3. **Environment Variables**: Gather required keys and configuration details for the app.

---

## Repository Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/idityaGE/Blind-Chat
   cd Blind-Chat
   ```

2. Navigate to the respective directories:
   - **WebSocket Server**: `cd websocket-server`
   - **Next.js App**: `cd nextjs-app`

---

## WebSocket Server Setup

### 1. Install Dependencies

```bash
cd websocket-server
npm install
```

### 2. Environment Variables

Create a `.env` file in the `websocket-server` directory with the following variables:

```env
PORT=8080
JWT_SECRET=your_jwt_secret
```

### 3. Build and Start the Server

#### Development Mode:
```bash
npm run dev
```

#### Production Mode:
1. Build the server:
   ```bash
   npm run start
   ```

---

## Next.js Frontend Setup

### 1. Install Dependencies

```bash
cd nextjs-app
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the `nextjs-app` directory with the following variables:

```env
DATABASE_URL=

# Mail service
MAIL_SERVICE=
MAIL_PORT=
MAIL_HOST=
MAIL_USER=
MAIL_PASS=

# Base URL
NEXT_PUBLIC_BASE_URL=

# JWT secret key
JWT_SECRET=

# Node environment
NODE_ENV=

# Socket server URL
NEXT_PUBLIC_SOCKET_URL=

# Redis service for rate limiting
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

### 3. Build and Start the App

#### Development Mode:
```bash
npm run dev
```

#### Production Mode:
1. Generate Prisma Client:
   ```bash
   npx prisma generate
   ```
2. Build the app:
   ```bash
   npm run build
   ```
3. Start the app:
   ```bash
   npm run start
   ```

---

## Final Steps

1. **Testing**:
   - Verify the WebSocket server is running by connecting to it.
   - Check the frontend by accessing it on `http://localhost:3000`.
2. **Customization**:
   - Update the `config` files to match your college’s details.
3. **Monitoring**:
   - Use local logs for debugging and monitoring.

Your app is now live and ready to use locally!