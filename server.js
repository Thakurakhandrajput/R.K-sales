const express = require("express");
const path = require("path");
const products = require("./data/products.json");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("view", path.join(__dirname, "view"));
app.use(express.static(path.join(__dirname, "public")));

const CATEGORIES = [
  { name: "Locks", icon: "lock" },
  { name: "Door Handles", icon: "handle" },
  { name: "Hinges", icon: "hinge" },
  { name: "Drawer Slides", icon: "slide" }
];

function findProduct(id) {
  return products.find((p) => p.id === id);
}

// Returns an "endless" slice of the catalog for infinite scroll:
// once real products run out it keeps cycling through them with a
// re-numbered feedId, so the feed never visibly ends (like a browse feed).
function getFeedPage(page, limit) {
  const start = (page - 1) * limit;
  const items = [];
  for (let i = 0; i < limit; i++) {
    const index = (start + i) % products.length;
    const cycle = Math.floor((start + i) / products.length);
    const base = products[index];
    items.push({
      ...base,
      feedId: cycle === 0 ? base.id : `${base.id}-r${cycle}`
    });
  }
  return items;
}

app.get("/", (req, res) => {
  res.render("index", {
    categories: CATEGORIES,
    initialFeed: getFeedPage(1, 8),
    page: "home"
  });
});

app.get("/products", (req, res) => {
  res.render("products", {
    categories: CATEGORIES,
    allProducts: products,
    page: "products"
  });
});

app.get("/shop/:id", (req, res) => {
  const product = findProduct(req.params.id);
  if (!product) return res.status(404).send("Product not found");
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  res.render("shop", { product, related, page: "shop" });
});

// Infinite-scroll feed API used by the homepage
app.get("/api/feed", (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 8;
  res.json({ items: getFeedPage(page, limit) });
});

app.listen(PORT, () => {
  console.log(`R.K Sales running at http://localhost:${PORT}`);
});
