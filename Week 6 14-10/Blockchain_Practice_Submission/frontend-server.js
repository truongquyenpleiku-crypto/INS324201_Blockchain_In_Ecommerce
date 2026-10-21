const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const esbuild = require("esbuild");

const frontendDir = path.join(__dirname, "frontend");

const result = esbuild.buildSync({
  entryPoints: [path.join(frontendDir, "App.jsx")],
  bundle: true,
  write: false,
  platform: "browser",
  format: "iife",
});

const bundle = result.outputFiles[0].contents;
const html = fs.readFileSync(path.join(frontendDir, "index.html"));

http.createServer((req, res) => {
  res.setHeader("Cache-Control", "no-store");

  if (req.url === "/bundle.js") {
    res.writeHead(200, {
      "Content-Type": "application/javascript; charset=utf-8",
    });
    return res.end(bundle);
  }

  if (req.url === "/") {
    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
    });
    return res.end(html);
  }

  res.writeHead(404);
  res.end("Not found");
}).listen(3000, () => {
  console.log("React frontend running at http://localhost:3000");
});
