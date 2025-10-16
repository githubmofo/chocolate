document.addEventListener('DOMContentLoaded', function() {
    console.log('Checkout page loaded');
    
    let cart = JSON.parse(localStorage.getItem('chocodream_cart')) || {};
    let savedForLater = JSON.parse(localStorage.getItem('chocodream_saved_later')) || {};
    let orderData = {};
    let appliedPromo = null;

    console.log('Cart:', cart);
    console.log('Cart items count:', Object.keys(cart).length);

    const promoCodes = {
        SWEET10: { type: 'percentage', value: 10, minOrder: 0 },
        CHOCO20: { type: 'percentage', value: 20, minOrder: 500 },
        FIRST50: { type: 'fixed', value: 50, minOrder: 200 },
        BULK25: { type: 'percentage', value: 25, minOrder: 1000 }
    };

    const sweetMessages = [
        "Your chocolates are being prepared with extra love and care! 🍫💕",
        "Each chocolate is handcrafted just for you! ✨",
        "Sweet dreams are made of chocolate, and yours are on the way! 🌟",
        "Happiness is a box of chocolates coming your way! 😊"
    ];

    function showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.textContent = message;
            toast.className = `toast show ${type}`;
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validatePhone(phone) {
        return /^[0-9]{10}$/.test(phone);
    }

    function validatePincode(pincode) {
        return /^[0-9]{6}$/.test(pincode);
    }

    function validateCardNumber(cardNumber) {
        return /^[0-9\s]{13,19}$/.test(cardNumber.replace(/\s/g, ''));
    }

    function validateExpiryDate(expiry) {
        return /^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(expiry);
    }

    function validateCVV(cvv) {
        return /^[0-9]{3,4}$/.test(cvv);
    }

    function validateUPI(upiId) {
        return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/.test(upiId);
    }

    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.color = '#d32f2f';
        }
    }

    function clearError(elementId) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    function calculateTotals() {
        let subtotal = 0;
        for (let id in cart) {
            subtotal += cart[id].price * cart[id].quantity;
        }
        let shipping = subtotal > 999 ? 0 : 50;
        let discount = 0;
        if (appliedPromo) {
            const promo = promoCodes[appliedPromo];
            if (subtotal >= promo.minOrder) {
                if (promo.type === 'percentage') {
                    discount = (subtotal * promo.value) / 100;
                } else {
                    discount = promo.value;
                }
            }
        }
        let afterDiscount = subtotal - discount;
        let gst = (afterDiscount * 18) / 100;
        let total = afterDiscount + shipping + gst;
        return { subtotal, discount, shipping, gst, total };
    }

    function updatePriceDisplay() {
        const totals = calculateTotals();

        document.getElementById('subtotal').textContent = `₹${totals.subtotal.toFixed(2)}`;
        document.getElementById('shipping').textContent = totals.shipping === 0 ? 'FREE' : `₹${totals.shipping.toFixed(2)}`;
        document.getElementById('gst').textContent = `₹${totals.gst.toFixed(2)}`;
        document.getElementById('finalTotal').textContent = `₹${totals.total.toFixed(2)}`;
        document.getElementById('btnAmount').textContent = `₹${totals.total.toFixed(2)}`;

        const discountRow = document.getElementById('discountRow');
        const discountAmount = document.getElementById('discountAmount');
        if (totals.discount > 0) {
            discountAmount.textContent = `-₹${totals.discount.toFixed(2)}`;
            discountRow.style.display = 'flex';
        } else {
            discountRow.style.display = 'none';
        }
    }

    function displayCheckoutItems() {
        console.log('displayCheckoutItems called');
        const checkoutItems = document.getElementById('checkoutItems');
        
        if (!checkoutItems) {
            console.error('checkoutItems element not found!');
            return;
        }

        if (Object.keys(cart).length === 0) {
            checkoutItems.innerHTML = '<div class="empty-cart">Your cart is empty! <a href="products.html">Shop now</a></div>';
            updatePriceDisplay();
            return;
        }

        let html = '';
        for (let id in cart) {
            const item = cart[id];
            html += `
                <div class="cart-item" data-id="${id}">
                    <img src="${item.imgSrc || 'images/placeholder.jpg'}" alt="${item.name}" class="item-image">
                    <div class="item-details">
                        <span class="item-name">${item.name}</span>
                        <span class="item-price">₹${item.price}</span>
                        <span class="item-qty">Qty: ${item.quantity}</span>
                        <div class="item-actions">
                            <button type="button" class="remove-btn">Remove</button>
                            <button type="button" class="save-btn">Save for Later</button>
                        </div>
                    </div>
                </div>
            `;
        }

        checkoutItems.innerHTML = html;
        console.log('Items displayed');
        addCartActionListeners();
        updatePriceDisplay();
    }

    function displaySavedForLaterItems() {
        const savedItems = document.getElementById('savedForLaterItems');
        if (!savedItems) return;

        if (Object.keys(savedForLater).length === 0) {
            savedItems.innerHTML = '<div class="empty-cart">No saved items yet.</div>';
            return;
        }

        let html = '';
        for (let id in savedForLater) {
            const item = savedForLater[id];
            html += `
                <div class="cart-item" data-id="${id}">
                    <img src="${item.imgSrc || 'images/placeholder.jpg'}" alt="${item.name}" class="item-image">
                    <div class="item-details">
                        <span class="item-name">${item.name}</span>
                        <span class="item-price">₹${item.price}</span>
                        <span class="item-qty">Qty: ${item.quantity}</span>
                        <div class="item-actions">
                            <button type="button" class="remove-btn">Remove</button>
                            <button type="button" class="move-cart-btn">Move to Cart</button>
                        </div>
                    </div>
                </div>
            `;
        }

        savedItems.innerHTML = html;
        addSavedItemActionListeners();
    }

    function addCartActionListeners() {
        document.querySelectorAll('.cart-item .remove-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const itemId = this.closest('.cart-item').dataset.id;
                delete cart[itemId];
                localStorage.setItem('chocodream_cart', JSON.stringify(cart));
                displayCheckoutItems();
                showToast('Item removed from cart');
            });
        });

        document.querySelectorAll('.cart-item .save-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const itemId = this.closest('.cart-item').dataset.id;
                savedForLater[itemId] = cart[itemId];
                delete cart[itemId];
                localStorage.setItem('chocodream_cart', JSON.stringify(cart));
                localStorage.setItem('chocodream_saved_later', JSON.stringify(savedForLater));
                displayCheckoutItems();
                displaySavedForLaterItems();
                showToast('Item saved for later');
            });
        });
    }

    function addSavedItemActionListeners() {
        document.querySelectorAll('#savedForLaterItems .remove-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const itemId = this.closest('.cart-item').dataset.id;
                delete savedForLater[itemId];
                localStorage.setItem('chocodream_saved_later', JSON.stringify(savedForLater));
                displaySavedForLaterItems();
                showToast('Item removed');
            });
        });

        document.querySelectorAll('#savedForLaterItems .move-cart-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const itemId = this.closest('.cart-item').dataset.id;
                cart[itemId] = savedForLater[itemId];
                delete savedForLater[itemId];
                localStorage.setItem('chocodream_cart', JSON.stringify(cart));
                localStorage.setItem('chocodream_saved_later', JSON.stringify(savedForLater));
                displayCheckoutItems();
                displaySavedForLaterItems();
                showToast('Item moved to cart');
            });
        });
    }

    function applyPromoCode() {
        const promoInput = document.getElementById('promoCode');
        const promoMessage = document.getElementById('promoMessage');
        const code = promoInput.value.toUpperCase().trim();

        if (!code) {
            promoMessage.innerHTML = '<span class="error">Please enter a promo code</span>';
            return;
        }

        if (!promoCodes[code]) {
            promoMessage.innerHTML = '<span class="error">Invalid promo code</span>';
            return;
        }

        const promo = promoCodes[code];
        const subtotal = calculateTotals().subtotal;

        if (subtotal < promo.minOrder) {
            promoMessage.innerHTML = `<span class="error">Minimum order of ₹${promo.minOrder} required</span>`;
            return;
        }

        appliedPromo = code;
        let discountText = promo.type === 'percentage' ? `${promo.value}% discount` : `₹${promo.value} discount`;
        promoMessage.innerHTML = `<span class="success">✓ ${discountText} applied!</span>`;
        updatePriceDisplay();
        showToast('Promo code applied successfully!');
    }

    // Payment method toggle
    const paymentOptions = document.querySelectorAll('input[name="payment"]');
    paymentOptions.forEach(option => {
        option.addEventListener('change', () => {
            document.getElementById('upiDetails').style.display = 'none';
            document.getElementById('bankDetails').style.display = 'none';
            document.getElementById('cardDetails').style.display = 'none';

            if (option.value === 'upi' && option.checked) {
                document.getElementById('upiDetails').style.display = 'block';
            } else if (option.value === 'bank' && option.checked) {
                document.getElementById('bankDetails').style.display = 'block';
            } else if (option.value === 'card' && option.checked) {
                document.getElementById('cardDetails').style.display = 'block';
            }
        });
    });

    // Offer tag clicks
    document.querySelectorAll('.offer-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            document.getElementById('promoCode').value = tag.getAttribute('data-code');
            applyPromoCode();
        });
    });

    // Apply promo button
    document.getElementById('applyPromo').addEventListener('click', applyPromoCode);

    // Auto-format card number
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\s/g, '');
            e.target.value = value.match(/.{1,4}/g)?.join(' ') || value;
        });
    }

    // Auto-format expiry
    const expiryInput = document.getElementById('expiryDate');
    if (expiryInput) {
        expiryInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });
    }

    // Form submission
    document.getElementById('checkoutForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        data.terms = document.getElementById('terms').checked;

        // Basic validation
        let isValid = true;

        if (!data.firstName.trim()) {
            showError('firstNameError', 'First name is required');
            isValid = false;
        }

        if (!validateEmail(data.email)) {
            showError('emailError', 'Please enter a valid email');
            isValid = false;
        }

        if (!validatePhone(data.phone)) {
            showError('phoneError', 'Please enter a valid 10-digit phone number');
            isValid = false;
        }

        if (!validatePincode(data.pincode)) {
            showError('pincodeError', 'Please enter a valid 6-digit pincode');
            isValid = false;
        }

        if (!data.terms) {
            showError('termsError', 'Please accept the terms and conditions');
            isValid = false;
        }

        // Payment method validation
        if (data.payment === 'upi' && !validateUPI(data.upiId)) {
            showError('upiIdError', 'Please enter a valid UPI ID');
            isValid = false;
        }

        if (data.payment === 'bank' && !data.bankName) {
            showError('bankNameError', 'Please select a bank');
            isValid = false;
        }

        if (data.payment === 'card') {
            if (!validateCardNumber(data.cardNumber)) {
                showError('cardNumberError', 'Please enter a valid card number');
                isValid = false;
            }
            if (!validateExpiryDate(data.expiryDate)) {
                showError('expiryDateError', 'Please enter valid expiry date (MM/YY)');
                isValid = false;
            }
            if (!validateCVV(data.cvv)) {
                showError('cvvError', 'Please enter a valid CVV');
                isValid = false;
            }
        }

        if (!isValid) {
            showToast('Please fix the errors in the form', 'error');
            return;
        }

        // Process order
        const totals = calculateTotals();
        orderData = {
            orderNumber: 'CD' + Date.now(),
            orderDate: new Date().toLocaleDateString('en-IN'),
            items: cart,
            customer: data,
            totals: totals,
            appliedPromo: appliedPromo,
            paymentMethod: data.payment
        };

        localStorage.setItem('chocodream_latest_order', JSON.stringify(orderData));
        localStorage.removeItem('chocodream_cart');

        const btn = document.getElementById('placeOrderBtn');
        btn.disabled = true;
        btn.innerHTML = '<span class="loading">Processing...</span>';

        setTimeout(() => {
    window.location.href = 'order-success.html';
}, 2000);

    });

    // Update cart count
    function updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            let totalItems = 0;
            for (let id in cart) {
                totalItems += cart[id].quantity;
            }
            cartCount.textContent = totalItems;
        }
    }

    // Initialize
    displayCheckoutItems();
    displaySavedForLaterItems();
    updateCartCount();
    console.log('Checkout initialized successfully');
});
