// ================= CART =================

let products = [];


let cart = JSON.parse(localStorage.getItem("cart")) || [];
let quantities = {};

cart.forEach(item => {
  quantities[item._id] = item.quantity;
});

// SAVE CART
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ================= FETCH PRODUCTS =================
fetch("http://localhost:5000/products")
  .then(res => res.json())
  .then(data => {
    products = data;
    displayProducts();
  })
  .catch(err => console.log("Fetch error:", err));

// ================= DISPLAY PRODUCTS =================
function displayProducts() {
  const container = document.getElementById("product-list");

  if (!container) return;

  container.innerHTML = "";

  products.forEach(p => {
    container.innerHTML += `
      <div class="product-card">
        <img src="${p.image}" width="150" />
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>

        <button onclick="addToCart('${p._id}')">+</button>

        <span id="qty-${p._id}">${quantities[p._id] || 0}</span>

        <button onclick="decreaseQty('${p._id}')">-</button>
      </div>
    `;
  });
}

// ================= ADD =================
function addToCart(id) {

  const product = products.find(p => p._id === id);
  if (!product) return;

  if (!quantities[id]) quantities[id] = 0;
  quantities[id]++;

  const existing = cart.find(item => item._id === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  updateCartUI();

  const el = document.getElementById("qty-" + id);
  if (el) el.innerText = quantities[id];
}
// ================= DECREASE =================
function decreaseQty(id) {

  const product = products.find(p => p._id === id);
  if (!product) return;

  if (!quantities[id]) quantities[id] = 0;

  if (quantities[id] > 0) {
    quantities[id]--;
  }

  const item = cart.find(p => p._id === id);

  if (item) {
    item.quantity--;

    if (item.quantity <= 0) {
      cart = cart.filter(p => p._id !== id);
    }
  }

  saveCart();
  updateCartUI();

  const el = document.getElementById("qty-" + id);
  if (el) el.innerText = quantities[id];
} 
// ================= CART UI =================
function updateCartUI() {
  const cartItems = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const totalBox = document.getElementById("total");

  if (!cartItems || !cartCount || !totalBox) return;

  cartItems.innerHTML = "";

  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;

    cartItems.innerHTML += `
      <div class="cart-item">
        <h4>${item.name}</h4>
        <p>₹${item.price}</p>
        <p>Qty: ${item.quantity}</p>
        <p>Total: ₹${item.price * item.quantity}</p>
        <button onclick="removeFromCart('${item._id}')">Remove</button>
      </div>
    `;
  });

  totalBox.innerText = "Total: ₹" + total;
  cartCount.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
}

// ================= REMOVE =================
function removeFromCart(id) {

  // Remove product completely from cart
  cart = cart.filter(item => item._id !== id);

  // Reset quantity shown on product card
  quantities[id] = 0;

  const el = document.getElementById("qty-" + id);
  if (el) {
    el.innerText = 0;
  }

  saveCart();
  updateCartUI();
}

// ================= PLACE ORDER =================
function placeOrder() {

  fetch("http://localhost:5000/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      items: cart,
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    })
  })
  .then(res => res.json())
  .then(data => {
    localStorage.removeItem("cart");
    window.location.href = "success.html";
  });
}
function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    localStorage.removeItem("cart");

    window.location.href = "login.html";
}

// ================= INIT =================
updateCartUI();