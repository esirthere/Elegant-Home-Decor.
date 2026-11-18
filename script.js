const products = [
    {
        id: 1,
        name: "Velvet Throw Pillow Set (Pair)",
        category: "Pillows",
        price: 1800,
        image: "photo1.avif",
        description: "Soft, plush decorative cushions ideal for living rooms, student hostels, and Airbnb lounges.",
        customOptions: ["Emerald Green", "Mustard Gold", "Warm Beige", "Custom Color"]
    },
    {
        id: 2,
        name: "Minimalist African Sunset Wall Art",
        category: "Wall Art",
        price: 2500,
        image: "photo2.avif",
        description: "High-resolution framed canvas art that adds warmth and modern Kenyan elegance to any wall.",
        customOptions: ["Black Frame (A3)", "Wooden Frame (A3)", "Large Canvas (A2)"]
    },
    {
        id: 3,
        name: "Nordic Ceramic Flower Vase",
        category: "Vases & Flowers",
        price: 1500,
        image: "photo4.avif",
        description: "Handcrafted matte ceramic vase suitable for dining tables, office desks, and reception areas.",
        customOptions: ["Matte White", "Terracotta Clay", "Sage Green"]
    },
    {
        id: 4,
        name: "Artificial Pampas & Eucalyptus Bouquet",
        category: "Vases & Flowers",
        price: 1200,
        image: "photo5..avif",
        description: "Maintenance-free lifelike artificial stems that stay fresh all year round.",
        customOptions: ["Standard Bunch (6 Stems)", "Full Luxury Bunch (12 Stems)"]
    },
    {
        id: 5,
        name: "Round Gold-Trimmed Wall Mirror",
        category: "Mirrors & Table",
        price: 4200,
        image: "photo6.avif",
        description: "Sleek circular mirror that brightens rooms and creates an illusion of extra space.",
        customOptions: ["50cm Diameter", "70cm Diameter"]
    },
    {
        id: 6,
        name: "Wooden Geometric Table Centerpiece",
        category: "Mirrors & Table",
        price: 1650,
        image: "photo7.avif",
        description: "Locally inspired decorative table accent for coffee tables, bookshelves, and hotel suites.",
        customOptions: ["Natural Mahogany Finish", "Dark Walnut Finish"]
    }
];

let cart = [];

function formatCurrency(amount) {
    return `KES ${Number(amount).toLocaleString()}`;
}

function updateCartCount() {
    const cartCountElement = document.getElementById("cart-count");
    if (cartCountElement) {
        cartCountElement.textContent = cart.length;
    }
}

function calculateTotal() {
    return cart.reduce((sum, item) => sum + item.price, 0);
}

function navigateTo(viewId) {
    document.querySelectorAll(".view").forEach((view) => {
        view.classList.remove("active");
    });

    const targetView = document.getElementById(`${viewId}-view`);
    if (targetView) {
        targetView.classList.add("active");
    }

    window.scrollTo(0, 0);

    if (viewId === "cart") {
        renderCart();
    } else if (viewId === "checkout") {
        const totalElement = document.getElementById("checkout-total");
        if (totalElement) {
            totalElement.textContent = calculateTotal().toLocaleString();
        }
    }
}

function renderProducts(items) {
    const grid = document.getElementById("product-grid");
    if (!grid) return;

    grid.innerHTML = "";

    items.forEach((product) => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <span class="category-tag">${product.category}</span>
                <h3>${product.name}</h3>
                <p class="price">${formatCurrency(product.price)}</p>
                <div class="card-actions">
                    <button class="outline-btn" onclick="viewProductDetails(${product.id})">View & Customize</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function filterProducts(category, btnElement) {
    document.querySelectorAll(".filter-btn").forEach((btn) => btn.classList.remove("active"));
    btnElement.classList.add("active");

    if (category === "All") {
        renderProducts(products);
    } else {
        const filtered = products.filter((product) => product.category === category);
        renderProducts(filtered);
    }
}

function viewProductDetails(productId) {
    const product = products.find((item) => item.id === productId);
    const container = document.getElementById("product-detail-container");
    if (!product || !container) return;

    const optionsHtml = product.customOptions
        .map((option) => `<option value="${option}">${option}</option>`)
        .join("");

    container.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <div>
            <span class="category-tag">${product.category}</span>
            <h2>${product.name}</h2>
            <p class="price" style="margin-top: 0.5rem;">${formatCurrency(product.price)}</p>
            <p style="line-height: 1.6; color: #555;">${product.description}</p>

            <div class="custom-box">
                <label for="custom-choice">Select Style / Size Preference:</label>
                <select id="custom-choice">${optionsHtml}</select>

                <label for="custom-note" style="margin-top: 0.8rem;">Custom Request (Optional):</label>
                <input type="text" id="custom-note" placeholder="e.g., Match specific color or gift wrap...">
            </div>

            <button class="primary-btn full-width" onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
    `;

    navigateTo("details");
}

function addToCart(productId) {
    const product = products.find((item) => item.id === productId);
    if (!product) return;

    const selectedOptionElement = document.getElementById("custom-choice");
    const customNoteElement = document.getElementById("custom-note");

    const selectedOption = selectedOptionElement ? selectedOptionElement.value : "Standard";
    const customNote = customNoteElement ? customNoteElement.value.trim() : "";

    cart.push({
        cartItemId: Date.now(),
        id: product.id,
        name: product.name,
        price: product.price,
        option: selectedOption,
        note: customNote || "Standard"
    });

    updateCartCount();
    alert(`${product.name} (${selectedOption}) added to your cart!`);
}

function removeFromCart(cartItemId) {
    cart = cart.filter((item) => item.cartItemId !== cartItemId);
    updateCartCount();
    renderCart();
}

function renderCart() {
    const container = document.getElementById("cart-items-container");
    const summary = document.getElementById("cart-summary");
    const totalElement = document.getElementById("cart-total");

    if (!container || !summary || !totalElement) return;

    if (cart.length === 0) {
        container.innerHTML = "<p>Your cart is currently empty. Browse our collection to add items!</p>";
        summary.classList.add("hidden");
        return;
    }

    container.innerHTML = "";
    cart.forEach((item) => {
        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
            <div>
                <h4>${item.name}</h4>
                <p style="font-size: 0.9rem; color: #666;">Option: ${item.option} | Note: ${item.note}</p>
                <strong>${formatCurrency(item.price)}</strong>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.cartItemId})">Remove</button>
        `;
        container.appendChild(div);
    });

    totalElement.textContent = calculateTotal().toLocaleString();
    summary.classList.remove("hidden");
}

function handleOrderSubmit(event) {
    event.preventDefault();

    if (cart.length === 0) {
        alert("Your cart is empty. Please add an item before checkout.");
        return;
    }

    const name = document.getElementById("cust-name").value.trim();
    const phone = document.getElementById("cust-phone").value.trim();
    const payment = document.getElementById("payment-method").value;
    const total = calculateTotal().toLocaleString();
    const orderNumber = "EHD-" + Math.floor(1000 + Math.random() * 9000);

    const message = `Thank you, <strong>${name}</strong>! Your order <strong>#${orderNumber}</strong> for <strong>KES ${total}</strong> has been received.<br><br>
        Payment Method: <strong>${payment}</strong>.<br>
        We have sent a confirmation SMS to <strong>${phone}</strong> and will dispatch your decor shortly.`;

    const confirmationMessage = document.getElementById("confirmation-message");
    if (confirmationMessage) {
        confirmationMessage.innerHTML = message;
    }

    if (currentUser) {
        currentUser.orders.push({
            orderNumber: orderNumber,
            total: total,
            payment: payment,
            date: new Date().toLocaleDateString()
        });
        updateAccountUI();
    }
    cart = [];
    updateCartCount();
    document.getElementById("checkout-form").reset();

    navigateTo("confirmation");
}

document.addEventListener("DOMContentLoaded", () => {
    renderProducts(products);
    updateCartCount();
});
// Simulated database storage & active session state
let userDatabase = [];
let currentUser = null;

// Simple cryptographic hash simulator
function simulateSecureHash(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        let char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
    }
    return "sha256_hash_" + Math.abs(hash).toString(16) + "9f2b";
}

// Handle User Registration
function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById("reg-name").value;
    const email = document.getElementById("reg-email").value;
    const rawPassword = document.getElementById("reg-password").value;

    const existingUser = userDatabase.find(u => u.email === email);
    if (existingUser) {
        alert("An account with this email already exists!");
        return;
    }

    const hashedPassword = simulateSecureHash(rawPassword);

    userDatabase.push({
        name: name,
        email: email,
        passwordHash: hashedPassword,
        orders: []
    });

    alert("Account created for " + name + "! You can now log in.");
    document.getElementById("register-form").reset();
}

// Handle Secure User Login & Switch to Profile View
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById("login-email").value;
    const rawPassword = document.getElementById("login-password").value;
    const statusBox = document.getElementById("account-status");

    const user = userDatabase.find(u => u.email === email);
    if (!user) {
        statusBox.style.color = "#d9534f";
        statusBox.textContent = "Login failed: Email not found.";
        return;
    }

    const hashedInput = simulateSecureHash(rawPassword);
    if (hashedInput === user.passwordHash) {
        currentUser = user;
        statusBox.textContent = "";
        document.getElementById("login-form").reset();
        updateAccountUI();
        navigateTo("home");
    } else {
        statusBox.style.color = "#d9534f";
        statusBox.textContent = "Login failed: Incorrect password.";
    }
}

// Handle Log Out & Return to Login Forms
function handleLogout() {
    currentUser = null;
    updateAccountUI();
    alert("You have been securely logged out.");
    navigateTo("home");
}

// Toggle UI between Login/Register and Customer Profile
function updateAccountUI() {
    const authContainer = document.getElementById("auth-forms-container");
    const profileDashboard = document.getElementById("profile-dashboard");
    const navBtn = document.getElementById("nav-account-btn");

    if (currentUser) {
        // Hide forms, show profile
        authContainer.classList.add("hidden");
        profileDashboard.classList.remove("hidden");
        navBtn.textContent = "Profile (" + currentUser.name.split(" ")[0] + ")";

        // Populate profile details
        document.getElementById("prof-name").textContent = currentUser.name;
        document.getElementById("prof-email").textContent = currentUser.email;
        document.getElementById("prof-hash").textContent = currentUser.passwordHash;

        // Render user's order history
        const ordersContainer = document.getElementById("prof-orders");
        if (currentUser.orders.length === 0) {
            ordersContainer.innerHTML = "<p>No orders placed yet. Browse our collection to place your first order!</p>";
        } else {
            let ordersHtml = "";
            for (let i = 0; i < currentUser.orders.length; i++) {
                let ord = currentUser.orders[i];
                ordersHtml += '<div class="cart-item" style="margin-bottom: 0.6rem;">' +
                                '<div><strong>Order #' + ord.orderNumber + '</strong> (' + ord.date + ')<br>' +
                                '<small>Payment: ' + ord.payment + '</small></div>' +
                                '<strong>KES ' + ord.total + '</strong>' +
                              '</div>';
            }
            ordersContainer.innerHTML = ordersHtml;
        }
    } else {
        // Show forms, hide profile
        authContainer.classList.remove("hidden");
        profileDashboard.classList.add("hidden");
        navBtn.textContent = "Account / Login";
    }
}
