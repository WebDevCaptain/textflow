const express = require("express");
const http = require("http");
const WebSocket = require("ws");
// const Y = require("yjs");
const ywsUtils = require("y-websocket/bin/utils")
const setupWSConnection = ywsUtils.setupWSConnection
const docs = ywsUtils.docs

const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 3000;

// const doc = new Y.Doc();

// Serve static files from "public"
app.use(express.static("public"));

const wss = new WebSocket.Server({ server });

// const wsProvider = new WebsocketProvider(
//   "ws://localhost:3000/",
//   "monaco-demo",
//   doc,
//   { WebSocketPolyfill: wss }
// );

wss.on('connection', (conn, req) => {
  setupWSConnection(conn, req, { gc: req.url.slice(1) !== 'ws/prosemirror-versions' })
});


// log some stats
setInterval(() => {
  let conns = 0
  docs.forEach(doc => { conns += doc.conns.size })
  const stats = {
    conns,
    docs: docs.size,
    websocket: `ws://localhost:${port}`,
    http: `http://localhost:${port}`
  }
  console.log(`${new Date().toISOString()} Stats: ${JSON.stringify(stats)}`)
}, 15000)


server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
