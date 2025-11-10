// Inisialisasi setelah DOM siap
document.addEventListener('DOMContentLoaded', () => {
    // Elemen umum
    const cartCount = document.getElementById('cart-count');
    const toastContainer = document.getElementById('toast-container');

    // Elemen halaman keranjang
    const cartItemsEl = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    const orderBtn = document.getElementById('order-btn');

    // State
    let cart = [];

    // Utils
    const toIDR = (num) => new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(num);

    // --- Cart helpers (LocalStorage) ---
    function getCart() {
        try {
            return JSON.parse(localStorage.getItem('cart') || '[]');
        } catch (_) {
            return [];
        }
    }

    function setCart(newCart) {
        localStorage.setItem('cart', JSON.stringify(newCart));
        cart = newCart; // Update local state
        updateCartCounter();
        renderCartItems(); // Re-render if on cart page
        updateCartTotal(); // Re-calculate total if on cart page
    }

    function updateCartCounter() {
        if (!cartCount) return;
        const count = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
        cartCount.textContent = count;
    }
    
    // --- Cart Page Specific Functions ---

    /**
     * Render semua item di halaman keranjang
     */
    function renderCartItems() {
        if (!cartItemsEl) return;

        if (cart.length === 0) {
            cartItemsEl.innerHTML = `
                <div class="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
                    <i class="fas fa-shopping-cart text-4xl text-gray-600 mb-4"></i>
                    <p class="text-gray-400">Keranjang belanja Anda kosong.</p>
                    <a href="produk.html" class="mt-4 inline-block text-orange-500 hover:text-orange-400 font-semibold">Lanjut Belanja</a>
                </div>
            `;
            if(orderBtn) orderBtn.disabled = true;
            return;
        }

        if(orderBtn) orderBtn.disabled = false;
        
        cartItemsEl.innerHTML = cart.map(item => `
            <div class="bg-gray-900 border border-gray-800 rounded-lg p-4 flex flex-col sm:flex-row gap-4" data-id="${item.id}">
                <img src="${item.image || 'assets/no-image.png'}" alt="${item.title}" class="w-full sm:w-24 h-24 object-cover rounded-md">
                <div class="flex-grow">
                    <h4 class="text-lg font-semibold text-white">${item.title}</h4>
                    <p class="text-gray-400 text-sm">${item.category}</p>
                    <p class="text-lg font-bold text-white mt-2">${toIDR(item.price)}</p>
                </div>
                <div class="flex items-center justify-between sm:flex-col gap-2">
                    <div class="flex items-center border border-gray-700 rounded-lg">
                        <button class="decrease-qty px-3 py-1 text-gray-400 hover:text-white hover:bg-gray-800 transition">-</button>
                        <span class="px-4 py-1 text-white">${item.qty || 1}</span>
                        <button class="increase-qty px-3 py-1 text-gray-400 hover:text-white hover:bg-gray-800 transition">+</button>
                    </div>
                    <button class="remove-item text-red-500 hover:text-red-400 font-semibold text-sm">
                        <i class="fas fa-trash"></i> Hapus
                    </button>
                </div>
            </div>
        `).join('');
    }

    /**
     * Update total harga di halaman keranjang
     */
    function updateCartTotal() {
        if (!cartTotalEl) return;
        const total = cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
        cartTotalEl.textContent = toIDR(total);
    }

    /**
     * Hapus item dari keranjang
     */
    function removeFromCart(productId) {
        const newCart = cart.filter(item => item.id != productId);
        setCart(newCart);
        showToast('Item dihapus dari keranjang.');
    }

    /**
     * Ubah jumlah item di keranjang
     */
    function changeQuantity(productId, change) {
        const newCart = cart.map(item => {
            if (item.id == productId) {
                const newQty = (item.qty || 1) + change;
                return { ...item, qty: newQty > 0 ? newQty : 1 };
            }
            return item;
        });
        setCart(newCart);
    }

    // Toast notification
    function showToast(message) {
        if (!toastContainer) return alert(message);
        const toast = document.createElement('div');
        toast.className = 'toast-notification bg-black text-white px-4 py-2 rounded-lg shadow-lg border border-white/10';
        toast.textContent = message;
        toastContainer.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // --- Event Listeners ---
    
    // Event listener untuk interaksi di halaman keranjang
    if (cartItemsEl) {
        cartItemsEl.addEventListener('click', (e) => {
            const target = e.target;
            const productCard = target.closest('[data-id]');
            if (!productCard) return;
            const productId = productCard.dataset.id;

            if (target.closest('.remove-item')) {
                removeFromCart(productId);
            } else if (target.closest('.decrease-qty')) {
                changeQuantity(productId, -1);
            } else if (target.closest('.increase-qty')) {
                changeQuantity(productId, 1);
            }
        });
    }
    
    // --- Initial Load ---
    cart = getCart();
    updateCartCounter();
    renderCartItems();
    updateCartTotal();
});