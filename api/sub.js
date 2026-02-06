import fs from "fs";
import net from "net";
import { URL } from "url";

const TIMEOUT = 3000;

function checkHost(host, port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(TIMEOUT);

    socket.on("connect", () => {
      socket.destroy();
      resolve(true);
    });

    socket.on("timeout", () => {
      socket.destroy();
      resolve(false);
    });

    socket.on("error", () => {
      resolve(false);
    });

    socket.connect(port, host);
  });
}

export default async function handler(req, res) {
  try {
    const raw = fs.readFileSync("Whitelist", "utf8");

    const lines = raw
      .split("\n")
      .map(l => l.trim())
      .filter(l => l.startsWith("vless://"));

    const alive = [];

    for (const link of lines) {
      try {
        const u = new URL(link);
        const host = u.hostname;
        const port = Number(u.port || 443);

        const ok = await checkHost(host, port);
        if (ok) alive.push(link);
      } catch {}
    }

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.send(alive.join("\n"));
  } catch (e) {
    res.status(500).send("error");
  }
}
