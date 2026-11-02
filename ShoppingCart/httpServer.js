import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

// In-memory cart array (no database is required).
let cart = [
  { id: 1, productName: "Wireless Mouse", price: 799, quantity: 2 },
  { id: 2, productName: "Keyboard", price: 1200, quantity: 1 },
  { id: 3, productName: "USB Cable", price: 199, quantity: 3 }
];

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}

function sendHTML(res, statusCode, html) {
  res.writeHead(statusCode, { "Content-Type": "text/html; charset=utf-8" });
  res.end(html);
}

function isValidNewProduct(product) {
  return product &&
    Number.isInteger(Number(product.id)) &&
    Number(product.id) > 0 &&
    typeof product.productName === "string" &&
    product.productName.trim().length > 0 &&
    Number.isFinite(Number(product.price)) &&
    Number(product.price) >= 0 &&
    Number.isInteger(Number(product.quantity)) &&
    Number(product.quantity) > 0;
}

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const route = requestUrl.pathname;

  // GET / - Welcome page
  if (req.method === "GET" && route === "/") {
    sendHTML(res, 200, `
      <!DOCTYPE html>
      <html lang="en">
      <head><meta charset="UTF-8"><title>Shopping Cart</title></head>
      <body>
        <h1>Welcome to Shopping Cart Management</h1>
        <p>Node.js native HTTP server is running.</p>
        <p>Try <a href="/cart">/cart</a>, <a href="/about">/about</a> or <a href="/home">/home</a>.</p>
      </body>
      </html>
    `);
    return;
  }

  // GET /cart - Return all cart items
  if (req.method === "GET" && route === "/cart") {
    sendJSON(res, 200, cart);
    return;
  }

  // GET /about - Application information
  if (req.method === "GET" && route === "/about") {
    sendHTML(res, 200, `
      <!DOCTYPE html>
      <html lang="en">
      <head><meta charset="UTF-8"><title>About</title></head>
      <body>
        <h1>About this application</h1>
        <p>This is a Shopping Cart Management application built with Node.js HTTP and FS modules.</p>
      </body>
      </html>
    `);
    return;
  }

  // GET /home - Serve public/index.html using the FS module
  if (req.method === "GET" && route === "/home") {
    const filePath = path.join(__dirname, "public", "index.html");

    fs.readFile(filePath, "utf8", (error, data) => {
      if (error) {
        console.error("Unable to read home page:", error.message);
        sendJSON(res, 500, { message: "Unable to load the home page" });
        return;
      }
      sendHTML(res, 200, data);
    });
    return;
  }

  // POST /add-to-cart - Add a product to the in-memory cart
  if (req.method === "POST" && route === "/add-to-cart") {
    let body = "";
    let bodyTooLarge = false;
    const MAX_BODY_SIZE = 1_000_000;

    req.on("data", (chunk) => {
      body += chunk;
      if (Buffer.byteLength(body, "utf8") > MAX_BODY_SIZE) {
        bodyTooLarge = true;
        res.writeHead(413, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ message: "Request body is too large" }));
        req.destroy();
      }
    });

    req.on("end", () => {
      if (bodyTooLarge || res.writableEnded) return;

      let product;
      try {
        product = JSON.parse(body);
      } catch {
        sendJSON(res, 400, { message: "Invalid JSON in request body" });
        return;
      }

      if (!isValidNewProduct(product)) {
        sendJSON(res, 400, {
          message: "Required fields: id, productName, price and quantity. Use a positive integer id and quantity, and a non-negative price."
        });
        return;
      }

      const id = Number(product.id);
      if (cart.some((item) => item.id === id)) {
        sendJSON(res, 409, { message: "A product with this id already exists" });
        return;
      }

      const newProduct = {
        id,
        productName: product.productName.trim(),
        price: Number(product.price),
        quantity: Number(product.quantity)
      };

      cart.push(newProduct);
      sendJSON(res, 201, {
        message: "Product added successfully",
        product: newProduct
      });
    });

    req.on("error", (error) => {
      console.error("Request error:", error.message);
      if (!res.writableEnded) {
        sendJSON(res, 400, { message: "Error while receiving request body" });
      }
    });
    return;
  }

  // Any route/method not handled above
  sendJSON(res, 404, { message: "Route not found" });
});

server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});
