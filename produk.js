// Inisialisasi setelah DOM siap
document.addEventListener('DOMContentLoaded', () => {
    // Elemen umum
    const productGrid = document.getElementById('product-grid');
    const loader = document.getElementById('loader');
    const errorMessage = document.getElementById('error-message');
    const searchInput = document.getElementById('search-input');
    const cartCount = document.getElementById('cart-count');
    const toastContainer = document.getElementById('toast-container');

    // Elemen halaman detail/modal
    const modal = document.getElementById('productModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalImage = document.getElementById('modal-image');
    const modalCategory = document.getElementById('modal-category');
    const modalProductName = document.getElementById('modal-product-name');
    const modalPrice = document.getElementById('modal-price');
    const modalDescription = document.getElementById('modal-description');
    const modalAddToCartBtn = document.getElementById('modal-add-to-cart');

    // State
    let products = [];
    const API_URL = 'api/api.php?action=get_products'; // API lokal

    // Utils
    const toIDR = (num) => new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(num);

    // Cart helpers (LocalStorage)
    function getCart() {
        try {
            return JSON.parse(localStorage.getItem('cart') || '[]');
        } catch (_) {
            return [];
        }
    }
    function setCart(newCart) {
        localStorage.setItem('cart', JSON.stringify(newCart));
        updateCartCounter();
    }
    function updateCartCounter() {
        if (!cartCount) return;
        const c = getCart();
        const count = c.reduce((sum, item) => sum + (item.qty || 1), 0);
        cartCount.textContent = count;
    }

    // Fetch produk dari API lokal
    async function fetchProducts() {
        if (!productGrid) return;
        if (loader) loader.style.display = 'block';
        productGrid.innerHTML = '';
        if (errorMessage) errorMessage.classList.add('hidden');
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            products = await response.json();
            displayProducts(products);
        } catch (err) {
            console.error('Gagal mengambil produk:', err);
            if (errorMessage) {
                errorMessage.classList.remove('hidden');
                errorMessage.querySelector('p').textContent = 'Gagal memuat produk. Silakan coba lagi nanti.';
            }
        } finally {
            if (loader) loader.style.display = 'none';
        }
    }

    // Render produk
    function displayProducts(productsToDisplay) {
        if (!productGrid) return;
        productGrid.innerHTML = '';
        if (productsToDisplay.length === 0) {
            if (errorMessage) {
                errorMessage.classList.remove('hidden');
                errorMessage.querySelector('p').textContent = 'Tidak ada produk yang ditemukan untuk pencarian ini.';
            }
            return;
        }
        if (errorMessage) errorMessage.classList.add('hidden');

        productsToDisplay.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card bg-gray-900 rounded-lg border border-gray-800 shadow-sm overflow-hidden flex flex-col cursor-pointer';
            productCard.dataset.productId = product.id;
            productCard.innerHTML = `
                <div class="p-4 bg-gray-900 h-48 flex items-center justify-center">
                    <img src="${product.image || 'assets/no-image.png'}" alt="${product.title}" class="max-h-full max-w-full object-contain">
                </div>
                <div class="p-4 border-t border-gray-800 flex flex-col flex-grow">
                    <span class="text-xs text-gray-400 capitalize">${product.category || '-'}</span>
                    <h3 class="text-md font-semibold text-gray-100 mt-1 flex-grow">${product.title.substring(0, 40)}...</h3>
                    <div class="mt-4 flex justify-between items-center">
                        <p class="text-lg font-bold text-white">${toIDR(product.price)}</p>
                        <button class="add-to-cart-btn bg-black text-white hover:bg-gray-800 rounded-full w-9 h-9 flex items-center justify-center transition-colors" data-product-id="${product.id}">
                            <i class="fas fa-cart-plus"></i>
                        </button>
                    </div>
                </div>
            `;
            productGrid.appendChild(productCard);
        });
    }

    // --- SEARCH FUNCTIONALITY ---
    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredProducts = products.filter(product => {
            return product.title.toLowerCase().includes(searchTerm);
        });
        displayProducts(filteredProducts);
    }

    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Modal detail produk
    function showProductDetail(productId) {
        if (!modal) return;
        const product = products.find(p => p.id == productId);
        if (!product) return;
        modalImage.src = product.image || 'assets/no-image.png';
        modalCategory.textContent = product.category || '-';
        modalProductName.textContent = product.title;
        modalPrice.textContent = toIDR(product.price);
        modalDescription.textContent = product.description || 'Tidak ada deskripsi.';
        if (modalAddToCartBtn) modalAddToCartBtn.dataset.productId = product.id;
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
    function hideModal() {
        if (!modal) return;
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    // Cart ops
    function addToCart(productId) {
        const product = products.find(p => p.id == productId);
        if (!product) return;
        const cart = getCart();
        const idx = cart.findIndex(i => i.id == product.id);
        if (idx > -1) {
            cart[idx].qty = (cart[idx].qty || 1) + 1;
        } else {
            cart.push({ id: product.id, title: product.title, price: product.price, image: product.image, category: product.category, qty: 1 });
        }
        setCart(cart);
        showToast(`${product.title.substring(0, 20)}... ditambahkan ke keranjang!`);
    }

    // Toast
    function showToast(message) {
        if (!toastContainer) return alert(message);
        const toast = document.createElement('div');
        toast.className = 'toast-notification bg-black text-white px-4 py-2 rounded-lg shadow-lg border border-white/10';
        toast.textContent = message;
        toastContainer.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // Event listeners
    if (productGrid) {
        productGrid.addEventListener('click', (e) => {
            const addToCartBtn = e.target.closest('.add-to-cart-btn');
            if (addToCartBtn) {
                const productId = addToCartBtn.dataset.productId;
                addToCart(productId);
                return;
            }
            const card = e.target.closest('.product-card');
            if (card) showProductDetail(card.dataset.productId);
        });
    }
    if (modalAddToCartBtn) {
        modalAddToCartBtn.addEventListener('click', () => {
            const productId = modalAddToCartBtn.dataset.productId;
            addToCart(productId);
            hideModal();
        });
    }
    if (closeModalBtn && modal) {
        closeModalBtn.addEventListener('click', hideModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) hideModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) hideModal();
        });
    }

    // Init
    updateCartCounter();
    if (productGrid) fetchProducts();
});