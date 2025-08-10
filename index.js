const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const sqlite3 = require("sqlite3").verbose();

const PORT = 8000;

const STATIC_PATH = path.join(process.cwd(), "./static");

const toBool = [() => true, () => false];

const MIME_TYPES = {
    default: "application/octet-stream",
    html: "text/html; charset=UTF-8",
    js: "application/javascript; charset=UTF-8",
    css: "text/css",
    png: "image/png",
    jpg: "image/jpg",
    gif: "image/gif",
    ico: "image/x-icon",
    svg: "image/svg+xml",
};

const prepareFile = async (url) => {
    const paths = [STATIC_PATH, url];
    if (url.endsWith("/")) paths.push("index.html");
    const filePath = path.join(...paths);
    const pathTravelsal = !filePath.startsWith(STATIC_PATH);
    const exists = await fs.promises.access(filePath).then(...toBool);
    const found = !pathTravelsal && exists;
    const streamPath = found ? filePath : path.join(STATIC_PATH, "404.html");
    const ext = path.extname(streamPath).substring(1).toLowerCase();
    const stream = fs.createReadStream(streamPath);
    return { found, ext, stream };
};

const db = new sqlite3.Database("./mydb.sqlite", (err) => {
  if (err) {
    console.error("Error to Open", err);
  } else {
    console.log("is open");
  }
});

db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT
)`);

function getUsers(callback) {
  db.all("SELECT * FROM users", (err, rows) => {
    if (err) {
      callback(err);
    } else {
      callback(null, rows);
    }
  });
}


http.createServer(async (req, res) => {
  if (req.url === "/api/users" && req.method === "GET") {
    getUsers((err, users) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Ошибка сервера" }));
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(users));
      }
    });
    return;
  }

  const file = await prepareFile(req.url);
  const statusCode = file.found ? 200 : 404;
  const mimeType = MIME_TYPES[file.ext] || MIME_TYPES.default;
  res.writeHead(statusCode, { "Content-Type": mimeType });
  file.stream.pipe(res);
  console.log(`${req.method} ${req.url} ${statusCode}`);
}).listen(PORT);

console.log(`Server running at http://127.0.0.1:${PORT}`);
