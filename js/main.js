// Toast Notification Function
function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Initialize main functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Sticky Navbar
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = '0 4px 20px rgba(93, 64, 55, 0.2)';
            } else {
                navbar.style.boxShadow = '0 2px 10px rgba(93, 64, 55, 0.1)';
            }
        }
    });

    // Smooth Scrolling
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

    // Auth Tabs Functionality
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');
    const loginContent = document.getElementById('loginContent');
    const signupContent = document.getElementById('signupContent');

    if (loginTab && signupTab) {
        loginTab.addEventListener('click', () => {
            loginTab.classList.add('active');
            signupTab.classList.remove('active');
            loginContent.classList.add('active');
            signupContent.classList.remove('active');
        });

        signupTab.addEventListener('click', () => {
            signupTab.classList.add('active');
            loginTab.classList.remove('active');
            signupContent.classList.add('active');
            loginContent.classList.remove('active');
        });
    }
    
    // Add home link functionality
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'index.html';
        });
    }
});
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.add-to-cart-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            if (typeof addToCart === "function") {
                addToCart(id, name, price);
            } else {
                alert('Add to cart function not loaded!');
            }
        });
    });
});
