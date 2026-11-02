# Shopping Cart Management - MT1 Lab Exam

This project follows the Shopping Cart Management exercise structure and uses:
- Node.js native `http` module and `fs` module in Part A.
- Express.js in Part B.
- JavaScript arrays for temporary in-memory data (no database).

## Project structure

```text
MT1-LABEXAM/
└── ShoppingCart/
    ├── package.json
    ├── httpServer.js
    ├── expressApp.js
    ├── public/
    │   └── index.html
    ├── screenshots/
    │   └── .gitkeep
    └── README.md
```

## 1. Install dependencies

Open a terminal in the `ShoppingCart` folder and run:

```bash
npm install
```

## 2. Run Part A - Native HTTP and FS modules

```bash
node httpServer.js
```

Server address: `http://localhost:3000`

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | Welcome HTML |
| GET | `/cart` | View cart items as JSON |
| GET | `/about` | Application information |
| GET | `/home` | Serve `public/index.html` using FS |
| POST | `/add-to-cart` | Add a product to the array |

Example POST body for `http://localhost:3000/add-to-cart`:

```json
{
  "id": 4,
  "productName": "Bluetooth Headphones",
  "price": 1499,
  "quantity": 1
}
```

## 3. Run Part B - Express CRUD API

Open a second terminal in the `ShoppingCart` folder and run:

```bash
node expressApp.js
```

Server address: `http://localhost:4000`

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/cart` | Get all products |
| GET | `/cart/:id` | Get one product |
| POST | `/cart` | Add a product |
| PUT | `/cart/:id` | Update a product |
| DELETE | `/cart/:id` | Delete a product |

### Postman examples

**GET all:** `http://localhost:4000/cart`

**GET one:** `http://localhost:4000/cart/1`

**POST:** `http://localhost:4000/cart`

```json
{
  "id": 4,
  "productName": "Bluetooth Headphones",
  "price": 1499,
  "quantity": 1,
  "category": "Electronics"
}
```

**PUT:** `http://localhost:4000/cart/1`

```json
{
  "productName": "Wireless Mouse",
  "price": 899,
  "quantity": 3,
  "category": "Electronics"
}
```

**DELETE:** `http://localhost:4000/cart/1`

All requests with JSON bodies should use the header:

```text
Content-Type: application/json
```

The Express API includes `totalPrice` (`price * quantity`) in product responses. Data is stored in memory, so changes reset when the server restarts.

## 4. Screenshots and GitHub submission

Save your own screenshots in the `screenshots/` folder:
- Native HTTP server running on port 3000.
- `/home` displaying the HTML file served through FS.
- Express server running on port 4000.
- Postman GET, POST, PUT and DELETE responses.
- GitHub repository and commit history.

Suggested Git commit sequence:

```bash
git init
git add .
git commit -m "Initial shopping cart project setup"
git add .
git commit -m "Implement native HTTP server and FS file serving"
git add .
git commit -m "Implement Express shopping cart CRUD API"
git add .
git commit -m "Complete API testing and documentation"
```

Do not commit `node_modules`. The `.gitignore` file already excludes it.
