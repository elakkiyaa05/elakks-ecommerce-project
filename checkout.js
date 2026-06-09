const checkoutCart = JSON.parse(localStorage.getItem("cart")) || [];
console.log("Checkout Cart:", cart);

const checkoutItems = document.getElementById("checkout-items");

let total = 0;

cart.forEach(item => {

  total += item.price * item.quantity;

  checkoutItems.innerHTML += `
    <div class="cart-item">
      <h3>${item.name}</h3>
      <p>Price: ₹${item.price}</p>
      <p>Quantity: ${item.quantity}</p>
    </div>
  `;
});

document.getElementById("checkout-total").innerText =
  "Total: ₹" + total;

function placeOrder() {
  localStorage.removeItem("cart");
  window.location.href = "success.html";
}