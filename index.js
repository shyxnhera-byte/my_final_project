const canvas = document.getElementById("salesChart");
if (canvas) {
const ctx = canvas.getContext("2d"); // stores 2d drawing tools for actual drawing

//match canvas resolution to its actual rendered size
// Makes canvas internal drawing grid match its actual displayed page

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

//to adjust spacing around
const padding = 60;

//tells canvas to start tracking a new shape
ctx.beginPath();

//y axis (vertical line)
ctx.moveTo(padding, padding); //move invisible pen to a staring point without drawing(60,60)
//starting(60pixels from  left, 60 from top)
ctx.lineTo(padding, canvas.height - padding); //starts drawing from current pstn to total canvas height - 60
//pen already at the botton...no need of moveTo
//x axis
ctx.lineTo(canvas.width - padding, canvas.height - padding); //draw to right till

ctx.strokeStyle = "white"; // for outlines
ctx.lineWidth = 2; //thickness
ctx.stroke(); //calls the stroke method to draw the path we've rendered

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const sales = [120, 180, 150, 220, 190, 260, 240];

ctx.fillStyle = "white"; //color when filling in text n shapes
days.forEach((day, index) => {
  const x =
    padding + index * ((canvas.width - padding * 2) / (days.length - 1));
  //ensures we dont start at the edge...divide available space by the number of spaces
  ctx.fillText(day, x, canvas.height - padding + 25);
}); // fillText(text , x, y)draws actual txt in a specific coordinate

const maxSales = Math.max(...sales); //find largest sale in array sales ...spread numbers individually
const chartHeight = canvas.height - padding * 2;

//map goes thro each sale at a time...for each we'll calculate x and y pstn
const points = sales.map((sale, index) => {
  const x =
    padding + index * ((canvas.width - padding * 2) / (sales.length - 1));
  const y = canvas.height - padding - (sale / maxSales) * chartHeight;
  //  bcoz canvas y coordinates increase downward
  return { x, y };
  //points end up like [{x: 280, y: 300}]
});

ctx.beginPath();
ctx.moveTo(points[0].x, points[0].y);
points.forEach((point) => {
  ctx.lineTo(point.x, point.y);
});

ctx.strokeStyle = "white";
ctx.lineWidth = 3;
ctx.stroke();

points.forEach((point) => {
  ctx.beginPath();
  ctx.arc(point.x, point.y, 5, 0, Math.PI * 2); // arc(x, y, radius, startAngle, endAngle)
  ctx.fillStyle = "white";
  ctx.fill(); //fills circle with current fillStyle
});
/*
points.forEach((point, index) => {
    ctx.font = "16px Arial"
    ctx.fillStyle = "white"
    ctx.textAlign = "center"
    ctx.fillText(sales[index], point.x, point.y - 12);
})
*/
const yLabels = [0, 50, 100, 150, 200, 250, 300];
yLabels.forEach((value) => {
  const y = canvas.height - padding - (value / maxSales) * chartHeight;
  ctx.font = "14px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "right"; //relative to x coordinate

  ctx.fillText(`$${value}`, padding - 10, y + 5);
});
}
//product data
/*const products = [
    {
        id: 1,
        name: "Bread",
        category: "Bakery",
        buyingPrice: 0.80,
        sellingPrice: 1.40,
        quantity: 32,
        lowStock: 5
    },
    {
        id: 2,
        name: "Milk",
        category: "Dairy",
        buyingPrice: 1.10,
        sellingPrice: 1.50,
        quantity: 4,
        lowStock: 5,
    },
    {
        id: 3,
        name: "Cooking Oil",
        category: "Pantry",
        buyingPrice: 2.50,
        sellingPrice: 3.20,
        quantity: 0,
        lowStock: 5
    }
];*/
/*
function displayProducts(){
    const tableBody = document.querySelector(".inventory-table tbody");
    tableBody.innerHTML = "";
    products.forEach(function(product){
        const row = document.createElement ("tr");
        row.innerHTML = `
        <td>${product.name}</td>
        <td>${product.category}</td>
        <td>${product.buyingPrice.toFixed(2)}</td>
        <td>$${product.sellingPrice.tofixed(2)}</td>
        <td>${product.quantity}</td>
        <td>${product.quantity <= product.lowStock 
            ? "Low Stock"
            : "In Stock"}
        </td>
        `;
        tableBody.appendChild(row);
    }
);
}
*/

//load existing products or start with an empty list
let products = JSON.parse(localStorage.getItem("products")) || [];
//grab references to the HTML
const productForm = document.querySelector(".add-product form");
const tableBody = document.querySelector(".inventory-table tbody");
//function to save array in local storage
function saveProducts() {
  localStorage.setItem("products", JSON.stringify(products));
}
//function to figure out stock status
function getStatus(quantity, lowStockLevel) {
  if (quantity === 0) return { text: "Out of Stock", class: "out-of-stock" };
  if (quantity <= lowStockLevel)
    return { text: "Low Stock", class: "low-stock" };
  return { text: "In Stock", class: "in-stock" };
}

//function to redraw the whole table fom the array
function renderTable() {
  tableBody.innerHTML = ""; //clear old rows first
  products.forEach((product, index) => {
    const status = getStatus(product.quantity, product.lowStock);
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${product.name}</td>
        <td>${product.category}</td>
        <td>${product.buyingPrice.toFixed(2)}</td>
        <td>${product.sellingPrice.toFixed(2)}</td>
        <td>${product.quantity}</td>
        <td><span class="status ${status.class}">${status.text}</span></td>
        <td>
        <button class="action-btn edit-btn" data-index="${index}">Edit</button>
        <button class="action-btn delete-btn" data-index="${index}">Delete</button>
        </td>
        `;
    tableBody.appendChild(row);
  });
}
//handle the add product form submission
if (productForm) {
productForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const newProduct = {
    name: document.getElementById("product-name").value,
    category: document.getElementById("category").value,
    buyingPrice: parseFloat(document.getElementById("buying-price").value),
    sellingPrice: parseFloat(document.getElementById("selling-price").value),
    quantity: parseInt(document.getElementById("quantity").value),
    lowStock: parseInt(document.getElementById("low-stock").value),
  };
  products.push(newProduct);
  saveProducts();
  renderTable();
  productForm.reset(); //clear form fields
});

//handle edit/delete clicks
tableBody.addEventListener("click", function (e) {
  const index = e.target.getAttribute("data-index");
  if (index === null) return;
  if (e.target.classList.contains("delete-btn")) {
    products.splice(index, 1);
    saveProducts();
    renderTable();
  }
  if (e.target.classList.contains("edit-btn")) {
    const product = products[index];
    document.getElementById("product-name").value = product.name;
    document.getElementById("category").value = product.category;
    document.getElementById("buying-price").value = product.buyingPrice;
    document.getElementById("selling-price").value = product.sellingPrice;
    document.getElementById("quantity").value = product.quantity;
    document.getElementById("low-stock").value = product.lowStock;
    products.splice(index, 1);
    saveProducts();
    renderTable();
  }
});
renderTable();
}
const saleForm = document.querySelector(".new-sale form");
const productSelect = document.getElementById("sale-product");
if (saleForm) {
    let cart = [];
    const cartBody = document.querySelector(".cart tbody");
    const cartTotalEl = document.querySelector(".cart-total span:last-child");
    // fill dropdown with real products
    function populateProductSelect(){
        productSelect.innerHTML = '<option value="">Select a product</option>';
        products.forEach((product, index) => {
            const option = document.createElement("option");
            option.value = index;
            option.textContent = `${product.name} - $${product.sellingPrice.toFixed(2)}`;
            productSelect.appendChild(option);
        });
    }
    populateProductSelect();

//....redraw cart table + total from cart array
function renderCart()  {
    cartBody.innerHTML = "";
    let total = 0;
    cart.forEach((item, index) => {
        total += item.subtotal;
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.qty}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td>$${item.subtotal.toFixed(2)}</td>
        <td><button class="action-btn delete-btn" data-index="${index}">Remove</button></td>
        `;
        cartBody.appendChild(row);
    });
    cartTotalEl.textContent = `$${total.toFixed(2)}`;
}
// add to cart button
saleForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const productIndex = productSelect.value;
    const qty = parseInt(document.getElementById("quantity").value);
    if (productIndex === "" || qty < 1) return;
    const product = products[productIndex];
    if (qty > product.quantity) {
        alert(`Only ${product.quantity} left in stock.`);
        return;
    }
    cart.push({
        productIndex: productIndex,
        name: product.name,
        qty: qty,
        price: product.sellingPrice,
        subtotal: product.sellingPrice * qty,
    });
    renderCart();
    saleForm.reset();
});
// 'remove' button inside cart
cartBody.addEventListener("click", function(e){
    if(e.target.classList.contains("delete-btn")) {
        const index = e.target.getAttribute("data-index");
        cart.splice(index,1);
        renderCart();
    }
});
// complete sale btn
console.log(document.querySelector(".complete-sale-btn"));
document.querySelector(".complete-sale-btn").addEventListener("click", function(){
    if (cart.length === 0)return;
    const total = cart.reduce((sum, item) => sum + item.subtotal, 0);
    const paymentMethod = document.getElementById("payment-method").value;
    //reduce stock for each item sold
    cart.forEach((item) => {
        products[item.productIndex].quantity -= item.qty;
    });

    //save sale record
    let sales = JSON.parse(localStorage.getItem("sales")) || [];
    sales.push({
        date: new Date().toISOString(),
        items: cart,
        total: total,
        paymentMethod: paymentMethod,
    });
    localStorage.setItem("sales", JSON.stringify(sales));
    saveProducts(); //update stock levels

    cart = [];
    renderCart();
    populateProductSelect(); //refresh dropdown stock
    alert("Sale completed");
});
}