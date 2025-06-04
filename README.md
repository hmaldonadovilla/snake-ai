# Snake AI

This project contains a simple and colorful snake game built with **React** (Vite + TypeScript) and a small **Node.js**/Express server. The server serves the built client and stores a high score in memory.

## Development

### Client

Use the Vite development server to iterate on the game quickly:

```bash
cd client
npm install
npm run dev
```

This runs the game at `http://localhost:5173` and auto reloads on changes.

### Server

The Express server serves the **built** client. Before starting the server you must build the client once:

```bash
# from the repository root
cd client
npm run build

cd ../server
npm install
npm start
```

Then open `http://localhost:3001` in your browser to play the game.

## Build

```bash
cd client
npm run build
```

The build output in `client/dist` is what the server will serve.
