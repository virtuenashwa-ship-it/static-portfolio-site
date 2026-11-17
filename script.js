// Step 1: Initialize the cart by checking localStorage. 
let cart = JSON.parse(localStorage.getItem("cart")) || [];
console.log("[Init] Loaded Cart from LocalStorage:", cart);

// Step 2: Register the Service Worker for static resource caching and run startup checks.
window.onload = function() {
    console.log("[Lifecycle] Window loaded. Executing startup checks...");
    
    // Register Service Worker for static resource caching
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then((reg) => console.log('[Service Worker] Registered successfully:', reg.scope))
            .catch((err) => console.log('[Service Worker] Registration failed:', err));
    }

    checkUserCookie();
    loadFontPreference();
    displayCart();
};

// Step 3: Check if a username cookie exists. 
function checkUserCookie() {
    let username = getCookie("username");
    let userSection = document.getElementById("userSection");
    let greetingHeading = document.getElementById("greetingHeading");

    console.log("[Cookie Check] Retrieved username cookie:", username ? username : "None found");

    if (!username) {
        userSection.innerHTML = `
            <input type="text" id="usernameInput" placeholder="Enter your name...">
            <button class="btn btn-secondary" onclick="saveUsername()">Login</button>
        `;
        greetingHeading.innerText = "Welcome to Apex Store!";
    } else {
        userSection.innerHTML = `
            <div class="user-display">
                <span>Hello, ${username}</span>
                <button class="btn btn-secondary" onclick="logoutUser()">Switch User</button>
            </div>
        `;
        greetingHeading.innerText = `Welcome back, ${username}!`;
    }
}

// Step 4: Parse a specific cookie by name using basic string methods.
function getCookie(name) {
    let nameEQ = name + "=";
    let cookieArray = document.cookie.split(';');
    
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i].trim();
        if (cookie.indexOf(nameEQ) === 0) {
            let value = decodeURIComponent(cookie.substring(nameEQ.length));
            console.log(`[Cookie Parse] Parsed cookie '${name}':`, value);
            return value;
        }
    }
    
    console.log(`[Cookie Parse] Parsed cookie '${name}': undefined`);
    return undefined;
}

// Step 5: Save the user's typed name into a cookie.
function saveUsername() {
    let inputVal = document.getElementById("usernameInput").value.trim();
    if (inputVal) {
        document.cookie = "username=" + encodeURIComponent(inputVal) + "; max-age=86400; path=/";
        console.log("[Cookie Save] Saved new username cookie:", inputVal);
        checkUserCookie();
    } else {
        alert("Please enter a valid name.");
    }
}

// Step 6: Clear the username cookie.
function logoutUser() {
    document.cookie = "username=; max-age=0; path=/";
    console.log("[Cookie Clear] Username cookie cleared.");
    checkUserCookie();
}

// Step 7: Capture the user's font dropdown choice and save it in sessionStorage.
function changeFont() {
    let font = document.getElementById("fontSelect").value;
    sessionStorage.setItem("preferredFont", font);
    document.getElementById("mainBody").style.fontFamily = font;
    console.log("[SessionStorage Update] Font preference saved to sessionStorage:", font);
}

// Step 8: Load font preference from sessionStorage on page load.
function loadFontPreference() {
    let savedFont = sessionStorage.getItem("preferredFont");
    if (savedFont) {
        document.getElementById("fontSelect").value = savedFont;
        document.getElementById("mainBody").style.fontFamily = savedFont;
        console.log("[SessionStorage Load] Applied font preference from sessionStorage:", savedFont);
    } else {
        console.log("[SessionStorage Load] No font preference found in sessionStorage.");
    }
}

// Step 9: Add a product to the cart and update localStorage.
function addToCart(name, price) {
    let newItem = { name, price };
    cart.push(newItem);
    
    let serializedCart = JSON.stringify(cart);
    localStorage.setItem("cart", serializedCart);
    
    console.log("[LocalStorage Write] Item added to cart:", newItem);
    console.log("[JSON Serialization] Serialized cart data stored in localStorage:", serializedCart);
    
    displayCart();
}

// Step 10: Render cart items to the DOM.
function displayCart() {
    let cartList = document.getElementById("cartItems");
    cartList.innerHTML = "";
    let total = 0;

    console.log("[Cart Render] Rendering active cart items. Total item count:", cart.length);

    if (cart.length === 0) {
        cartList.innerHTML = "<li style='justify-content: center; color: #6b7280;'>Your cart is empty.</li>";
    } else {
        cart.forEach((item) => {
            let li = document.createElement("li");
            li.innerHTML = `<span>${item.name}</span> <strong>$${item.price.toFixed(2)}</strong>`;
            cartList.appendChild(li);
            total += item.price;
        });
    }
    document.getElementById("totalPrice").innerText = total.toFixed(2);
    console.log("[Cart Total] Calculated overall price: $" + total.toFixed(2));
}

// Step 11: Clear cart data from localStorage and delete the user cookie to fully satisfy the reset requirement.
function clearCart() {
    localStorage.removeItem("cart");
    cart = [];
    
    // Also clear the username cookie 
    document.cookie = "username=; max-age=0; path=/";
    
    console.log("[State Reset] Cart data and user cookie completely cleared.");
    checkUserCookie();
    displayCart();
}