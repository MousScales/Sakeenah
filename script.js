// Cart management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// SMS Popup - Show only on first visit
function showSmsPopup() {
    const hasVisited = localStorage.getItem('hasVisited');
    const smsPopup = document.getElementById('smsPopup');
    
    if (!hasVisited && smsPopup) {
        // Show popup after a short delay
        setTimeout(() => {
            smsPopup.classList.add('active');
        }, 2000); // 2 second delay
        
        // Mark as visited
        localStorage.setItem('hasVisited', 'true');
    }
}

function closeSmsPopup() {
    const smsPopup = document.getElementById('smsPopup');
    if (smsPopup) {
        smsPopup.classList.remove('active');
    }
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutButton = document.getElementById('checkoutButton');
    
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
    
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        } else {
            cartItems.innerHTML = cart.map((item, index) => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">$${item.price}</div>
                    </div>
                    <button class="cart-item-remove" data-index="${index}">Remove</button>
                </div>
            `).join('');
            
            // Add event listeners to remove buttons
            document.querySelectorAll('.cart-item-remove').forEach(btn => {
                btn.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    cart.splice(index, 1);
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCartUI();
                });
            });
        }
    }
    
    if (cartTotal) {
        const total = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);
        cartTotal.textContent = total.toFixed(2);
    }
    
    // Enable/disable checkout button based on cart contents
    if (checkoutButton) {
        checkoutButton.disabled = cart.length === 0;
    }
}

function addToCart(name, price) {
    cart.push({ name, price });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
}

// Add to cart functionality
document.addEventListener('DOMContentLoaded', function() {
    // Show SMS popup on first visit
    showSmsPopup();
    
    // Initialize cart UI
    updateCartUI();
    
    // Side panel toggle
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const sidePanel = document.getElementById('sidePanel');
    const sidePanelOverlay = document.getElementById('sidePanelOverlay');
    
    function openSidePanel() {
        if (sidePanel && sidePanelOverlay) {
            sidePanel.classList.add('active');
            sidePanelOverlay.classList.add('active');
            hamburgerMenu.classList.add('active');
        }
    }
    
    function closeSidePanel() {
        if (sidePanel && sidePanelOverlay) {
            sidePanel.classList.remove('active');
            sidePanelOverlay.classList.remove('active');
            if (hamburgerMenu) {
                hamburgerMenu.classList.remove('active');
            }
        }
    }
    
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', function(e) {
            e.stopPropagation();
            if (sidePanel.classList.contains('active')) {
                closeSidePanel();
            } else {
                openSidePanel();
            }
        });
    }
    
    // Close side panel when clicking overlay
    if (sidePanelOverlay) {
        sidePanelOverlay.addEventListener('click', closeSidePanel);
    }
    
    // Search icon (placeholder for now)
    const searchIcon = document.getElementById('searchIcon');
    if (searchIcon) {
        searchIcon.addEventListener('click', function() {
            alert('Search functionality coming soon!');
        });
    }
    
    // Cart icon now navigates to cart.html via link
    // No need for dropdown toggle anymore
    
    // Checkout button functionality (if dropdown is still present)
    const checkoutButton = document.getElementById('checkoutButton');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function() {
            if (cart.length > 0) {
                window.location.href = 'cart.html';
            }
        });
    }
    
    // Cart page functionality
    const cartItemsList = document.getElementById('cartItemsList');
    const cartEmptyState = document.getElementById('cartEmptyState');
    const cartSummary = document.getElementById('cartSummary');
    const recommendedProducts = document.getElementById('recommendedProducts');
    
    if (cartItemsList) {
        updateCartPage();
    }
    
    function updateCartPage() {
        const cartPageTotal = document.getElementById('cartPageTotal');
        const cartSubtotal = document.getElementById('cartSubtotal');
        
        if (cart.length === 0) {
            // Show empty state
            if (cartEmptyState) cartEmptyState.style.display = 'block';
            if (cartItemsList) cartItemsList.style.display = 'none';
            if (cartSummary) cartSummary.style.display = 'none';
            if (recommendedProducts) recommendedProducts.style.display = 'block';
        } else {
            // Show cart items
            if (cartEmptyState) cartEmptyState.style.display = 'none';
            if (cartItemsList) {
                cartItemsList.style.display = 'block';
                cartItemsList.innerHTML = cart.map((item, index) => `
                    <div class="cart-item-card">
                        <div class="cart-item-image">
                            <div class="placeholder-img">Product</div>
                        </div>
                        <div class="cart-item-details">
                            <h3>${item.name}</h3>
                            <p class="price">$${item.price}</p>
                        </div>
                        <button class="cart-item-remove" data-index="${index}">&times;</button>
                    </div>
                `).join('');
                
                // Add remove functionality
                document.querySelectorAll('.cart-item-remove').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const index = parseInt(this.getAttribute('data-index'));
                        cart.splice(index, 1);
                        localStorage.setItem('cart', JSON.stringify(cart));
                        updateCartPage();
                        updateCartUI();
                    });
                });
            }
            if (cartSummary) cartSummary.style.display = 'block';
            if (recommendedProducts) recommendedProducts.style.display = 'block';
            
            // Calculate totals
            const total = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);
            if (cartPageTotal) cartPageTotal.textContent = '$' + total.toFixed(2);
            if (cartSubtotal) cartSubtotal.textContent = '$' + total.toFixed(2);
        }
    }
    
    // Add to cart from cart page recommendations
    const cartProductAddButtons = document.querySelectorAll('.cart-product-add');
    cartProductAddButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.getAttribute('data-product');
            const productPrice = this.getAttribute('data-price');
            
            addToCart(productName, productPrice);
            updateCartPage();
            
            // Visual feedback
            this.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
            setTimeout(() => {
                this.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>';
            }, 2000);
        });
    });
    
    // Checkout button on cart page
    const checkoutButtonFull = document.getElementById('checkoutButtonFull');
    if (checkoutButtonFull) {
        checkoutButtonFull.addEventListener('click', function() {
            alert('Checkout functionality will be integrated with Stripe payment processing.');
            // Stripe integration will be added here later
        });
    }
    
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const productCard = this.closest('.product-card-wrapper') || this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            
            // Get price - check for sale price first, otherwise get regular price
            let productPrice;
            const salePriceElement = productCard.querySelector('.sale-price');
            if (salePriceElement) {
                productPrice = salePriceElement.textContent.replace('$', '').trim();
            } else {
                productPrice = productCard.querySelector('.price').textContent.replace('$', '').trim();
            }
            
            // Add to cart
            addToCart(productName, productPrice);
            
            // Visual feedback
            this.textContent = 'Added!';
            this.style.backgroundColor = '#4a4a4a';
            
            setTimeout(() => {
                this.textContent = 'Add to Cart';
                this.style.backgroundColor = '#2c2c2c';
            }, 2000);
        });
    });
    
    // Add to cart for product detail pages
    const addToCartLarge = document.querySelectorAll('.add-to-cart-large');
    
    addToCartLarge.forEach(button => {
        button.addEventListener('click', function() {
            const productName = document.querySelector('.product-detail-right h1').textContent;
            const productPriceElement = document.querySelector('.product-detail-right .product-price');
            const productPrice = productPriceElement ? productPriceElement.textContent.replace('$', '') : '0';
            
            // Add size to product name
            const productWithSize = `${productName} (Size: ${selectedSize})`;
            
            // Add to cart
            addToCart(productWithSize, productPrice);
            
            // Visual feedback
            this.textContent = 'ADDED!';
            this.style.backgroundColor = '#4a4a4a';
            
            setTimeout(() => {
                this.textContent = 'ADD TO CART';
                this.style.backgroundColor = '#000';
            }, 2000);
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Smooth scroll for product images - no need for click handlers
    // Images stack vertically and scroll naturally

    // Size selector functionality
    const sizeButtons = document.querySelectorAll('.size-btn');
    let selectedSize = 'S'; // Default size
    
    sizeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            sizeButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            selectedSize = this.getAttribute('data-size');
        });
    });

    // Accordion functionality
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const icon = this.querySelector('.accordion-icon');
            
            // Toggle active class
            this.classList.toggle('active');
            content.classList.toggle('active');
            
            // Toggle icon
            if (content.classList.contains('active')) {
                icon.textContent = '−';
            } else {
                icon.textContent = '+';
            }
        });
    });

    // Ummah link toggle
    const ummahLink = document.getElementById('ummahLink');
    const ummahFormContainer = document.getElementById('ummahFormContainer');
    
    if (ummahLink && ummahFormContainer) {
        ummahLink.addEventListener('click', function() {
            ummahFormContainer.classList.toggle('active');
        });
    }

    // Ummah signup form functionality
    const ummahSignupForm = document.getElementById('ummahSignupForm');
    
    if (ummahSignupForm) {
        ummahSignupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const ummahInput = document.getElementById('ummahInput');
            const input = ummahInput.value;
            
            if (input) {
                // Determine if it's an email or phone number
                const isEmail = input.includes('@');
                const listKey = isEmail ? 'emailList' : 'smsList';
                const listName = isEmail ? 'email' : 'SMS';
                
                // Store in localStorage
                let contactList = JSON.parse(localStorage.getItem(listKey)) || [];
                if (!contactList.includes(input)) {
                    contactList.push(input);
                    localStorage.setItem(listKey, JSON.stringify(contactList));
                    alert(`Welcome to our Ummah! You've been added to our ${listName} list.`);
                } else {
                    alert('You\'re already part of our Ummah!');
                }
                ummahInput.value = '';
                ummahFormContainer.classList.remove('active');
            }
        });
    }

    // SMS Popup functionality
    const closePopupBtn = document.getElementById('closePopup');
    const smsPopup = document.getElementById('smsPopup');
    const smsSignupForm = document.getElementById('smsSignupForm');
    
    if (closePopupBtn) {
        closePopupBtn.addEventListener('click', closeSmsPopup);
    }
    
    // Close popup when clicking outside
    if (smsPopup) {
        smsPopup.addEventListener('click', function(e) {
            if (e.target === smsPopup) {
                closeSmsPopup();
            }
        });
    }
    
    // SMS signup form submission
    if (smsSignupForm) {
        smsSignupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const phoneInput = document.getElementById('phoneInput');
            const phone = phoneInput.value;
            
            if (phone) {
                // Store phone in localStorage (you can integrate with SMS service later)
                let smsList = JSON.parse(localStorage.getItem('smsList')) || [];
                if (!smsList.includes(phone)) {
                    smsList.push(phone);
                    localStorage.setItem('smsList', JSON.stringify(smsList));
                    alert('Welcome to the Ummah! Your 10% discount code: WELCOME10');
                } else {
                    alert('You\'re already part of the Ummah!');
                }
                closeSmsPopup();
            }
        });
    }
});

