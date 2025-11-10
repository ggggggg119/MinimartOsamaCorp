document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const addForm = document.getElementById('add-product-form');
    const addFeedbackDiv = document.getElementById('form-feedback');
    const addSubmitBtn = document.getElementById('submit-btn');
    const addSubmitText = document.getElementById('submit-text');
    const addSubmitSpinner = document.getElementById('submit-spinner');

    const updateForm = document.getElementById('update-product-form');
    const updateFeedbackDiv = document.getElementById('update-form-feedback');

    // Category Management Elements
    const addCategoryForm = document.getElementById('add-category-form');
    const newCategoryNameInput = document.getElementById('new-category-name');
    const categoryTableBody = document.getElementById('category-table-body'); // NEW: Table body
    const categoryListFeedback = document.getElementById('category-list-feedback');
    const categoryListEl = document.getElementById('category-list'); // OLD: Simple list (can be removed if not needed)

    const addCategorySelect = document.getElementById('category');
    const updateCategorySelect = document.getElementById('update-category');

    const productTableBody = document.getElementById('product-table-body');
    const productTableLoader = document.getElementById('product-table-loader');
    const updateModal = document.getElementById('updateModal');
    const closeUpdateModalBtn = document.getElementById('closeUpdateModalBtn');
    
    // NEW: Update Category Modal
    const updateCategoryModal = document.getElementById('updateCategoryModal');
    const closeUpdateCategoryModalBtn = document.getElementById('closeUpdateCategoryModalBtn');
    const updateCategoryForm = document.getElementById('update-category-form');
    const updateCategoryFeedback = document.getElementById('update-category-form-feedback');


    const logoutBtn = document.getElementById('logout-btn');
    const toastContainer = document.getElementById('toast-container');

    // --- State ---
    let products = [];
    let categories = [];

    // --- API URL ---
    const API_URL = 'api/api.php';

    // --- Utility Functions ---
    const toIDR = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

    function showToast(message, isError = false) {
        if (!toastContainer) return alert(message);
        const toast = document.createElement('div');
        toast.className = `toast-notification ${isError ? 'bg-red-600' : 'bg-green-600'} text-white px-4 py-2 rounded-lg shadow-lg border border-white/10`;
        toast.textContent = message;
        toastContainer.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // --- Category Management ---
    async function fetchAndPopulateCategories() {
        try {
            const response = await fetch(`${API_URL}?action=get_categories`);
            if (!response.ok) throw new Error('Gagal mengambil data kategori');
            const fetchedCategories = await response.json();
            categories = fetchedCategories;
            
            populateCategoryDropdown(addCategorySelect);
            populateCategoryDropdown(updateCategorySelect);
            renderCategoryTable(); // NEW: Render the table
        } catch (error) {
            console.error('Error fetching categories:', error);
            showToast(`Error: ${error.message}`, true);
        }
    }

    function populateCategoryDropdown(dropdownElement) {
        if (!dropdownElement) return;
        dropdownElement.innerHTML = '<option value="">-- Pilih Kategori --</option>';
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            dropdownElement.appendChild(option);
        });
    }

    // NEW: Render categories in the management table
    function renderCategoryTable() {
        if (!categoryTableBody) return;
        if (categories.length === 0) {
            categoryTableBody.innerHTML = `<tr><td colspan="2" class="text-center py-4 text-gray-400">Belum ada kategori.</td></tr>`;
            return;
        }
        categoryTableBody.innerHTML = categories.map(cat => `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">${cat.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button class="update-category-btn text-indigo-400 hover:text-indigo-300" data-id="${cat.id}" data-name="${cat.name}">Update</button>
                    <button class="delete-category-btn text-red-400 hover:text-red-300" data-id="${cat.id}" data-name="${cat.name}">Hapus</button>
                </td>
            </tr>
        `).join('');
    }

    async function handleAddCategorySubmit(e) {
        e.preventDefault();
        const categoryName = newCategoryNameInput.value.trim();
        if (!categoryName) return;

        try {
            const response = await fetch(`${API_URL}?action=add_category`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: categoryName })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Gagal menambah kategori');
            
            showToast(result.success || 'Kategori berhasil ditambahkan.');
            newCategoryNameInput.value = '';
            categoryListFeedback.textContent = '';
            fetchAndPopulateCategories(); // Refresh all category-related elements
        } catch (error) {
            categoryListFeedback.textContent = `Error: ${error.message}`;
            categoryListFeedback.classList.add('text-red-600');
        }
    }

    // NEW: Handle deleting a category
    async function deleteCategory(id, name) {
        if (!confirm(`Apakah Anda yakin ingin menghapus kategori "${name}"?`)) return;
        try {
            const response = await fetch(`${API_URL}?action=delete_category`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: id })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Gagal menghapus kategori');
            
            showToast(result.success || 'Kategori berhasil dihapus.');
            fetchAndPopulateCategories(); // Refresh all category-related elements
        } catch (error) {
            showToast(`Error: ${error.message}`, true);
        }
    }

    // NEW: Show Update Category Modal
    function showUpdateCategoryModal(id, name) {
        document.getElementById('update-category-id').value = id;
        document.getElementById('update-category-name').value = name;
        
        updateCategoryModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    // NEW: Hide Update Category Modal
    function hideUpdateCategoryModal() {
        updateCategoryModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        updateCategoryFeedback.textContent = '';
    }

    // NEW: Handle Update Category Form Submit
    async function handleUpdateCategorySubmit(e) {
        e.preventDefault();
        const formData = new FormData(updateCategoryForm);
        const categoryData = Object.fromEntries(formData.entries());
        
        try {
            const response = await fetch(`${API_URL}?action=update_category`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(categoryData)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Gagal memperbarui kategori');

            showToast(result.success || 'Kategori berhasil diperbarui.');
            hideUpdateCategoryModal();
            fetchAndPopulateCategories(); // Refresh all category-related elements
        } catch (error) {
            updateCategoryFeedback.textContent = `Error: ${error.message}`;
            updateCategoryFeedback.classList.add('text-red-600');
        }
    }


    // --- Product Management (Unchanged) ---
    async function fetchAndDisplayProducts() {
        try {
            const response = await fetch(`${API_URL}?action=get_products`);
            if (!response.ok) throw new Error('Gagal mengambil data produk');
            products = await response.json();
            renderProductTable();
        } catch (error) {
            console.error(error);
            productTableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-red-400">Gagal memuat produk.</td></tr>`;
        } finally {
            productTableLoader.style.display = 'none';
        }
    }

    function renderProductTable() {
        if (products.length === 0) {
            productTableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-gray-400">Belum ada produk.</td></tr>`;
            return;
        }
        productTableBody.innerHTML = products.map(product => `
            <tr>
                <td class="p-4 whitespace-nowrap">
                    <img class="h-16 w-16 object-cover rounded-md" src="${product.image}" alt="${product.title}">
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">${product.title}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${product.category}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-100">${toIDR(product.price)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button class="update-btn text-indigo-400 hover:text-indigo-300" data-id="${product.id}">Update</button>
                    <button class="delete-btn text-red-400 hover:text-red-300" data-id="${product.id}">Hapus</button>
                </td>
            </tr>
        `).join('');
    }

    async function deleteProduct(id) {
        if (!confirm('Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.')) return;
        try {
            const response = await fetch(`${API_URL}?action=delete_product`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: id })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Gagal menghapus produk');
            
            showToast('Produk berhasil dihapus.');
            fetchAndDisplayProducts();
        } catch (error) {
            showToast(`Error: ${error.message}`, true);
        }
    }

    function showUpdateModal(id) {
        const product = products.find(p => p.id == id);
        if (!product) return;
        document.getElementById('update-product-id').value = product.id;
        document.getElementById('update-title').value = product.title;
        document.getElementById('update-price').value = product.price;
        document.getElementById('update-image').value = product.image;
        document.getElementById('update-description').value = product.description;
        updateCategorySelect.value = product.category_id || '';
        updateModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function hideUpdateModal() {
        updateModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        updateFeedbackDiv.textContent = '';
    }

    async function handleUpdateFormSubmit(e) {
        e.preventDefault();
        const formData = new FormData(updateForm);
        const productData = Object.fromEntries(formData.entries());
        productData.price = parseFloat(productData.price);
        productData.category_id = parseInt(productData.category_id);
        try {
            const response = await fetch(`${API_URL}?action=update_product`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Gagal memperbarui produk');
            showToast('Produk berhasil diperbarui.');
            hideUpdateModal();
            fetchAndDisplayProducts();
        } catch (error) {
            updateFeedbackDiv.textContent = `Error: ${error.message}`;
            updateFeedbackDiv.classList.add('text-red-600');
        }
    }

    async function handleAddFormSubmit(e) {
        e.preventDefault();
        addSubmitBtn.disabled = true;
        addSubmitText.textContent = 'Menyimpan...';
        addSubmitSpinner.classList.remove('hidden');
        addFeedbackDiv.textContent = '';
        addFeedbackDiv.className = 'text-sm';
        const formData = new FormData(addForm);
        const productData = Object.fromEntries(formData.entries());
        productData.price = parseFloat(productData.price);
        productData.category_id = parseInt(productData.category_id);
        try {
            const response = await fetch(`${API_URL}?action=add_product`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Terjadi kesalahan.');
            showToast(result.success || 'Produk berhasil ditambahkan!');
            addForm.reset();
            fetchAndDisplayProducts();
        } catch (error) {
            addFeedbackDiv.textContent = `Error: ${error.message}`;
            addFeedbackDiv.classList.add('text-red-600');
        } finally {
            addSubmitBtn.disabled = false;
            addSubmitText.textContent = 'Tambah Produk';
            addSubmitSpinner.classList.add('hidden');
        }
    }

    // --- Event Listeners ---
    productTableBody.addEventListener('click', (e) => {
        const updateBtn = e.target.closest('.update-btn');
        const deleteBtn = e.target.closest('.delete-btn');
        if (updateBtn) showUpdateModal(updateBtn.dataset.id);
        if (deleteBtn) deleteProduct(deleteBtn.dataset.id);
    });

    // NEW: Event listener for category table
    categoryTableBody.addEventListener('click', (e) => {
        const updateBtn = e.target.closest('.update-category-btn');
        const deleteBtn = e.target.closest('.delete-category-btn');
        if (updateBtn) showUpdateCategoryModal(updateBtn.dataset.id, updateBtn.dataset.name);
        if (deleteBtn) deleteCategory(deleteBtn.dataset.id, deleteBtn.dataset.name);
    });

    updateForm.addEventListener('submit', handleUpdateFormSubmit);
    addForm.addEventListener('submit', handleAddFormSubmit);
    addCategoryForm.addEventListener('submit', handleAddCategorySubmit);
    updateCategoryForm.addEventListener('submit', handleUpdateCategorySubmit);

    closeUpdateModalBtn.addEventListener('click', hideUpdateModal);
    updateModal.addEventListener('click', (e) => { if (e.target === updateModal) hideUpdateModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !updateModal.classList.contains('hidden')) hideUpdateModal(); });

    // NEW: Event listeners for category modal
    closeUpdateCategoryModalBtn.addEventListener('click', hideUpdateCategoryModal);
    updateCategoryModal.addEventListener('click', (e) => { if (e.target === updateCategoryModal) hideUpdateCategoryModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !updateCategoryModal.classList.contains('hidden')) hideUpdateCategoryModal(); });


    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Apakah Anda yakin ingin keluar dari panel admin?')) {
                window.location.href = 'index.html';
            }
        });
    }

    // --- Initial Load ---
    fetchAndPopulateCategories();
    fetchAndDisplayProducts();
});