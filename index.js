
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
        <td>KES${item.price.toFixed(2)}</td>
        <td>KES${item.subtotal.toFixed(2)}</td>
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
  
const historyBody = document.querySelector(".inventory-table tbody");
const pageTitle = document.querySelector(".inventory-header h1");

if (historyBody && pageTitle && pageTitle.textContent === "Sales History"){
    const sales = JSON.parse(localStorage.getItem("sales")) || [];
    sales.slice().reverse().forEach((sale) => {
        const itemsSummary = sale.items.map((item) => `${item.name} (x${item.qty})`).join(",");
        const dateFormatted = new Date(sale.date).toLocaleString();
        const row = document.createElement("tr");
        row.innerHTML =`
        <td>${dateFormatted}</td>
        <td>${itemsSummary}</td>
        <td>${sale.total.toFixed(2)}</td>
        <td>${sale.paymentMethod}</td>
        `;
        historyBody.appendChild(row);
    });
   
    }

    const totalProductsEl = document.querySelector(".stat-total-products");
    const todaysSalesEl = document.querySelector(".stat-today-sales");
    const totalSalesEl = document.querySelector(".stat-total-sales");
    const lowStockEl = document.querySelector(".stat-low-stock");

    if (totalProductsEl) {
        const sales = JSON.parse(localStorage.getItem("sales")) || [];
        // total products
        totalProductsEl.textContent = products.length;
        //todays sales
        const today = new Date().toDateString();
        const todaysTotal = sales
            .filter((sale) => new Date(sale.date).toDateString() === today)
            .reduce((sum, sale) => sum + sale.total, 0);
     todaysSalesEl.textContent = `KES${todaysTotal.toFixed(2)}`;
     totalSalesEl.textContent = sales.length
     
     const lowStockCount = products.filter((p) => p.quantity <= p.lowStock).length;
     lowStockEl.textContent = lowStockCount;
    }
