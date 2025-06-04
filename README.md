# Snake AI

This project contains a simple and colorful snake game built with **React** (Vite + TypeScript) and a small **Node.js**/Express server. The server serves the built client and stores a high score in memory.

## Development

### Client

```bash
cd client
npm install
npm run dev
```

### Server

In a separate terminal after building the client:

```bash
cd server
npm install
npm start
```

Open `http://localhost:3001` in your browser to play the game.

## Build

```bash
cd client
npm run build
```
The build output is placed in `client/dist` and served automatically by the server.
