// Products Page Filtering and Sorting
let allProducts = [];

// Initialize products on page load
document.addEventListener('DOMContentLoaded', function() {
    // Get all product cards
    allProducts = Array.from(document.querySelectorAll('.product-card'));
    
    // Update initial count
    updateProductCount();
    
    // Initialize cart count
    if (typeof initCart === 'function') {
        initCart();
    }
});

// Apply filters function
function applyFilters() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const originValue = document.getElementById('originSelect').value;
    const typeValue = document.getElementById('typeSelect').value;
    const priceMax = document.getElementById('priceMax').value;
    const bestsellersOnly = document.getElementById('bestsellersOnly').checked;
    
    let visibleCount = 0;
    
    allProducts.forEach(product => {
        let shouldShow = true;
        
        // Search filter
        if (searchValue) {
            const productName = product.querySelector('h3').textContent.toLowerCase();
            const productDesc = product.querySelector('.product-description').textContent.toLowerCase();
            if (!productName.includes(searchValue) && !productDesc.includes(searchValue)) {
                shouldShow = false;
            }
        }
        
        // Origin filter
        if (originValue && product.dataset.origin !== originValue) {
            shouldShow = false;
        }
        
        // Type filter
        if (typeValue && product.dataset.type !== typeValue) {
            shouldShow = false;
        }
        
        // Price filter
        if (priceMax) {
            const productPrice = parseInt(product.dataset.price);
            if (productPrice > parseInt(priceMax)) {
                shouldShow = false;
            }
        }
        
        // Bestsellers filter
        if (bestsellersOnly && product.dataset.bestseller !== 'true') {
            shouldShow = false;
        }
        
        // Show or hide product
        if (shouldShow) {
            product.style.display = 'block';
            visibleCount++;
        } else {
            product.style.display = 'none';
        }
    });
    
    // Update product count
    updateProductCount();
    
    // Show/hide no products message
    const noProductsMsg = document.getElementById('noProducts');
    if (visibleCount === 0) {
        noProductsMsg.style.display = 'block';
    } else {
        noProductsMsg.style.display = 'none';
    }
}

// Clear all filters
function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('originSelect').value = '';
    document.getElementById('typeSelect').value = '';
    document.getElementById('priceMax').value = '';
    document.getElementById('bestsellersOnly').checked = false;
    
    // Show all products
    allProducts.forEach(product => {
        product.style.display = 'block';
    });
    
    // Hide no products message
    document.getElementById('noProducts').style.display = 'none';
    
    // Update count
    updateProductCount();
    
    // Show toast notification
    if (typeof showToast === 'function') {
        showToast('All filters cleared!');
    }
}

// Update product count
function updateProductCount() {
    const visibleProducts = allProducts.filter(p => p.style.display !== 'none');
    const countElement = document.getElementById('productCount');
    if (countElement) {
        countElement.textContent = visibleProducts.length;
    }
}

// Sort products
function sortProducts() {
    const sortValue = document.getElementById('sortSelect').value;
    const productGrid = document.getElementById('productGrid');
    const products = Array.from(productGrid.querySelectorAll('.product-card'));
    
    let sortedProducts = [...products];
    
    switch(sortValue) {
        case 'price-low':
            sortedProducts.sort((a, b) => {
                return parseInt(a.dataset.price) - parseInt(b.dataset.price);
            });
            break;
        case 'price-high':
            sortedProducts.sort((a, b) => {
                return parseInt(b.dataset.price) - parseInt(a.dataset.price);
            });
            break;
        case 'name':
            sortedProducts.sort((a, b) => {
                const nameA = a.querySelector('h3').textContent;
                const nameB = b.querySelector('h3').textContent;
                return nameA.localeCompare(nameB);
            });
            break;
        default:
            // Default order - do nothing
            break;
    }
    
    // Clear grid and re-append sorted products
    productGrid.innerHTML = '';
    sortedProducts.forEach(product => {
        productGrid.appendChild(product);
    });
}

// Mobile filter toggle (for responsive design)
function toggleFilters() {
    const sidebar = document.querySelector('.filters-sidebar');
    const overlay = document.querySelector('.filters-overlay');
    
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
    if (overlay) {
        overlay.classList.toggle('active');
    }
}

// Close filters on overlay click (mobile)
function closeFilters() {
    const sidebar = document.querySelector('.filters-sidebar');
    const overlay = document.querySelector('.filters-overlay');
    
    if (sidebar) {
        sidebar.classList.remove('active');
    }
    if (overlay) {
        overlay.classList.remove('active');
    }
}

// Add mobile toggle button and overlay if screen is small
function setupMobileFilters() {
    if (window.innerWidth <= 992) {
        const productsMain = document.querySelector('.products-main');
        
        // Check if toggle button doesn't already exist
        if (!document.querySelector('.filters-toggle-btn')) {
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'filters-toggle-btn';
            toggleBtn.textContent = '🔍 Show Filters';
            toggleBtn.onclick = toggleFilters;
            
            productsMain.insertBefore(toggleBtn, productsMain.firstChild);
        }
        
        // Check if overlay doesn't already exist
        if (!document.querySelector('.filters-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'filters-overlay';
            overlay.onclick = closeFilters;
            
            document.body.appendChild(overlay);
        }
    }
}

// Call on load and resize
window.addEventListener('load', setupMobileFilters);
window.addEventListener('resize', setupMobileFilters);
