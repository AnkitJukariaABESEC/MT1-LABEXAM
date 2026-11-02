import express from "express";

const app = express();
const PORT = 4000;

// Middleware to parse incoming JSON request bodies.
app.use(express.json());

// In-memory product array (no database is required).
let cart = [
  { id: 1, productName: "Wireless Mouse", price: 799, quantity: 2, category: "Electronics" },
  { id: 2, productName: "Keyboard", price: 1200, quantity: 1, category: "Electronics" },
  { id: 3, productName: "Notebook", price: 80, quantity: 5, category: "Stationery" }
];
// 
function withTotalPrice(product) {
  return {
    ...product,
    totalPrice: product.price * product.quantity
  };
}

function validProductFields(product) {
  return product &&
    typeof product.productName === "string" &&
    product.productName.trim().length > 0 &&
    Number.isFinite(Number(product.price)) &&
    Number(product.price) >= 0 &&
    Number.isInteger(Number(product.quantity)) &&
    Number(product.quantity) > 0 &&
    typeof product.category === "string" &&
    product.category.trim().length > 0;
}

// GET /cart - Get all products
app.get("/cart", (req, res) => {
  res.status(200).json(cart.map(withTotalPrice));
});

// GET /cart/:id - Get one product by its id
app.get("/cart/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "Product id must be an integer" });
  }

  const product = cart.find((item) => item.id === id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  return res.status(200).json(withTotalPrice(product));
});

// POST /cart - Add a new product
app.post("/cart", (req, res) => {
  const { id, productName, price, quantity, category } = req.body || {};

  if (!Number.isInteger(Number(id)) || Number(id) <= 0 || !validProductFields({
    productName, price, quantity, category
  })) {
    return res.status(400).json({
      message: "Valid id, productName, price, quantity and category are required"
    });
  }

  const numericId = Number(id);
  if (cart.some((item) => item.id === numericId)) {
    return res.status(409).json({ message: "A product with this id already exists" });
  }

  const newProduct = {
    id: numericId,
    productName: productName.trim(),
    price: Number(price),
    quantity: Number(quantity),
    category: category.trim()
  };

  cart.push(newProduct);
  return res.status(201).json({
    message: "Product added successfully",
    product: withTotalPrice(newProduct)
  });
});

// PUT /cart/:id - Update an existing product
app.put("/cart/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "Product id must be an integer" });
  }

  const productIndex = cart.findIndex((item) => item.id === id);

  if (productIndex === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  const { productName, price, quantity, category } = req.body || {};

  if (!validProductFields({ productName, price, quantity, category })) {
    return res.status(400).json({
      message: "Valid productName, price, quantity and category are required for update"
    });
  }

  cart[productIndex] = {
    id,
    productName: productName.trim(),
    price: Number(price),
    quantity: Number(quantity),
    category: category.trim()
  };

  return res.status(200).json({
    message: "Product updated successfully",
    product: withTotalPrice(cart[productIndex])
  });
});

// DELETE /cart/:id - Delete a product
app.delete("/cart/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "Product id must be an integer" });
  }

  const productIndex = cart.findIndex((item) => item.id === id);

  if (productIndex === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  const deletedProduct = cart.splice(productIndex, 1)[0];

  return res.status(200).json({
    message: "Product deleted successfully",
    product: deletedProduct
  });
});

// Handle malformed JSON sent to express.json().
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ message: "Invalid JSON in request body" });
  }
  return next(error);
});

// Handle all unknown routes.
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});
