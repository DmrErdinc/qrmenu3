// Admin Dashboard JavaScript
let menuData = { categories: [], products: [] };
let currentSection = 'dashboard';
let editingProductId = null;
let editingCategoryId = null;

// ============= MOBILE SIDEBAR =============
function toggleSidebar() {
    const nav = document.getElementById('adminNav');
    const overlay = document.getElementById('sidebarOverlay');
    if (!nav) return;
    const isOpen = nav.classList.toggle('open');
    if (overlay) overlay.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeSidebarOnMobile() {
    if (window.innerWidth <= 768) {
        const nav = document.getElementById('adminNav');
        const overlay = document.getElementById('sidebarOverlay');
        if (nav && nav.classList.contains('open')) {
            nav.classList.remove('open');
            if (overlay) overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
}

// ============= IMAGE UTILITIES =============
function normalizeImageUrl(url) {
    if (!url || typeof url !== 'string') return '';
    const trimmed = url.trim();
    return trimmed;
}

function buildAdminImagePreview(src) {
    const normalized = normalizeImageUrl(src);
    if (!normalized) return '';
    return '<div class="preview-wrapper">' +
        '<img src="' + normalized + '" alt="Preview" ' +
        'style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#f9f9f6;display:block;" ' +
        'onerror="this.style.display=\'none\';">' +
        '</div>' +
        '<button type="button" class="remove-image-btn" onclick="clearProductImage()">\u2715 G\u00F6rseli Kald\u0131r</button>';
}

function clearProductImage() {
    document.getElementById('productImage').value = '';
    document.getElementById('imagePreview').innerHTML = '';
    const urlInput = document.getElementById('productImageUrl');
    const fileInput = document.getElementById('productImageFile');
    if (urlInput) urlInput.value = '';
    if (fileInput) fileInput.value = '';
}

// ============= TOAST NOTIFICATIONS =============
const showToast = (title, message, type = 'info') => {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = { success: '\u2713', error: '\u2715', warning: '\u26A0', info: '\u2139' };
    toast.innerHTML = `
        <div class="toast-icon">${icons[type] || icons.info}</div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message || ''}</div>
        </div>
        <div class="toast-close" onclick="this.parentElement.remove()">&times;</div>
    `;
    container.appendChild(toast);
    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => { if (toast.parentElement) toast.remove(); }, 300);
        }
    }, 5000);
};

const showConfirm = (title, message, onConfirm, type = 'warning') => {
    return new Promise((resolve) => {
        const dialog = document.getElementById('confirmDialog');
        const icon = document.getElementById('confirmIcon');
        const titleEl = document.getElementById('confirmTitle');
        const messageEl = document.getElementById('confirmMessage');
        const cancelBtn = document.getElementById('confirmCancel');
        const okBtn = document.getElementById('confirmOk');

        const iconMap = { warning: '\u26A0\uFE0F', danger: '\uD83D\uDDD1\uFE0F', info: '\u2139\uFE0F' };
        icon.textContent = iconMap[type] || iconMap.warning;
        icon.className = `confirm-icon ${type}`;
        titleEl.textContent = title;
        messageEl.textContent = message;
        dialog.classList.add('active');

        const handleCancel = () => { dialog.classList.remove('active'); resolve(false); };
        const handleOk = () => { dialog.classList.remove('active'); if (onConfirm) onConfirm(); resolve(true); };

        cancelBtn.onclick = handleCancel;
        okBtn.onclick = handleOk;
        dialog.onclick = (e) => { if (e.target === dialog) handleCancel(); };
    });
};

const showSpinner = () => { document.getElementById('spinnerOverlay').classList.add('active'); };
const hideSpinner = () => { document.getElementById('spinnerOverlay').classList.remove('active'); };

// ============= INIT =============
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    setupEventListeners();
});

async function checkAuth() {
    try {
        const response = await fetch('/api/admin/check', { credentials: 'include' });
        const data = await response.json();
        if (!data.authenticated) { window.location.href = '/admin.html'; return; }
        document.getElementById('username').textContent = data.username;
        loadDashboardData();
    } catch (error) {
        console.error('Kimlik do\u011frulama hatas\u0131:', error);
        window.location.href = '/admin.html';
    }
}

function setupEventListeners() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            switchSection(section);
            closeSidebarOnMobile();
        });
    });

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', logout);

    document.getElementById('productForm').addEventListener('submit', handleProductSubmit);
    document.getElementById('categoryForm').addEventListener('submit', handleCategorySubmit);
    document.getElementById('productImageFile').addEventListener('change', handleImageUpload);

    document.getElementById('cafeSearch').addEventListener('input', () => filterTable('cafe'));
    document.getElementById('cafeFilter').addEventListener('change', () => filterTable('cafe'));
    document.getElementById('restaurantSearch').addEventListener('input', () => filterTable('restaurant'));
    document.getElementById('restaurantFilter').addEventListener('change', () => filterTable('restaurant'));
}

function switchSection(section) {
    currentSection = section;
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.section === section);
    });
    document.querySelectorAll('.admin-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(`${section}-section`).classList.add('active');

    const titles = {
        dashboard: 'Kontrol Paneli',
        cafe: 'Cafe Men\u00FC Y\u00F6netimi',
        restaurant: 'Restaurant Men\u00FC Y\u00F6netimi',
        categories: 'Kategori Y\u00F6netimi',
        settings: 'Site Ayarlar\u0131'
    };
    document.getElementById('sectionTitle').textContent = titles[section] || section;

    if (section === 'dashboard') loadDashboardData();
    else if (section === 'cafe' || section === 'restaurant') loadMenuData();
    else if (section === 'categories') loadCategories();
    else if (section === 'settings') loadSettings();
}

// ============= DASHBOARD =============
async function loadDashboardData() {
    try {
        showSpinner();
        const response = await fetch('/api/admin/stats', { credentials: 'include' });
        const stats = await response.json();
        document.getElementById('totalProducts').textContent = stats.totalProducts;
        document.getElementById('activeProducts').textContent = stats.activeProducts;
        document.getElementById('inactiveProducts').textContent = stats.inactiveProducts;
        document.getElementById('totalCategories').textContent = stats.totalCategories;
        document.getElementById('cafeProducts').textContent = stats.cafeProducts;
        document.getElementById('restaurantProducts').textContent = stats.restaurantProducts;
        hideSpinner();
    } catch (error) {
        hideSpinner();
        console.error('\u0130statistik y\u00FCkleme hatas\u0131:', error);
        showToast('Hata', '\u0130statistikler y\u00FCklenemedi', 'error');
    }
}

// ============= MENU DATA =============
async function loadMenuData() {
    try {
        showSpinner();
        const response = await fetch('/api/admin/menu', { credentials: 'include' });
        menuData = await response.json();
        renderTable('cafe');
        renderTable('restaurant');
        hideSpinner();
    } catch (error) {
        hideSpinner();
        console.error('Men\u00FC y\u00FCkleme hatas\u0131:', error);
        showToast('Hata', 'Men\u00FC y\u00FCklenemedi', 'error');
    }
}

function buildProductRow(product) {
    const category = menuData.categories.find(c => c.id === product.categoryId);
    const categoryName = category ? category.name : 'Bilinmeyen';
    const imgSrc = normalizeImageUrl(product.image);
    const imgHtml = imgSrc
        ? `<img src="${imgSrc}" alt="${product.name}" style="width:56px;height:56px;object-fit:contain;background:#f5f5f0;border-radius:6px;display:block;" onerror="this.style.display='none';">`
        : `<div style="width:56px;height:56px;display:flex;align-items:center;justify-content:center;background:#f0f0f0;border-radius:6px;font-size:1.5rem;">\uD83C\uDF7D\uFE0F</div>`;
    return `<tr>
        <td>${imgHtml}</td>
        <td><strong>${product.name}</strong></td>
        <td>${categoryName}</td>
        <td>\u20BA${product.price.toFixed(2)}</td>
        <td>${product.tag ? `<span class="tag-badge">${product.tag}</span>` : '-'}</td>
        <td><span class="status-badge ${product.isActive ? 'status-active' : 'status-inactive'}">${product.isActive ? 'Aktif' : 'Pasif'}</span></td>
        <td>
            <div class="action-buttons">
                <button class="btn btn-sm btn-primary" onclick="editProduct('${product.id}')">D\u00FCzenle</button>
                <button class="btn btn-sm btn-danger" onclick="deleteProduct('${product.id}')">Sil</button>
            </div>
        </td>
    </tr>`;
}

function renderTable(menuType) {
    const tbody = document.getElementById(`${menuType}TableBody`);
    const products = menuData.products.filter(p => p.menuType === menuType);
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:20px;">\u00DCr\u00FCn bulunamad\u0131</td></tr>';
        return;
    }
    tbody.innerHTML = products.map(buildProductRow).join('');
}

function filterTable(menuType) {
    const searchTerm = document.getElementById(`${menuType}Search`).value.toLowerCase();
    const filterValue = document.getElementById(`${menuType}Filter`).value;
    let products = menuData.products.filter(p => p.menuType === menuType);

    if (searchTerm) {
        products = products.filter(p =>
            p.name.toLowerCase().includes(searchTerm) ||
            (p.description || '').toLowerCase().includes(searchTerm)
        );
    }
    if (filterValue === 'active') products = products.filter(p => p.isActive);
    else if (filterValue === 'inactive') products = products.filter(p => !p.isActive);

    const tbody = document.getElementById(`${menuType}TableBody`);
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:20px;">\u00DCr\u00FCn bulunamad\u0131</td></tr>';
        return;
    }
    tbody.innerHTML = products.map(buildProductRow).join('');
}

// ============= PRODUCT MODAL =============
function openProductModal(menuType) {
    editingProductId = null;
    document.getElementById('productModalTitle').textContent = '\u00DCr\u00FCn Ekle';
    document.getElementById('productId').value = '';
    document.getElementById('productMenuType').value = menuType;
    document.getElementById('productName').value = '';
    document.getElementById('productDescription').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productTag').value = '';
    document.getElementById('productOrder').value = '1';
    document.getElementById('productActive').checked = true;
    clearProductImage();
    switchImageInputTab('file');
    setupImageTabListeners();

    const categorySelect = document.getElementById('productCategory');
    const categories = menuData.categories.filter(c => c.menuType === menuType);
    categorySelect.innerHTML = '<option value="">Kategori Se\u00E7in</option>' +
        categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');

    document.getElementById('productModal').classList.add('active');
}

function editProduct(productId) {
    const product = menuData.products.find(p => p.id === productId);
    if (!product) return;

    editingProductId = productId;
    document.getElementById('productModalTitle').textContent = '\u00DCr\u00FCn D\u00FCzenle';
    document.getElementById('productId').value = product.id;
    document.getElementById('productMenuType').value = product.menuType;
    document.getElementById('productName').value = product.name;
    document.getElementById('productDescription').value = product.description || '';
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productTag').value = product.tag || '';
    document.getElementById('productOrder').value = product.order || 1;
    document.getElementById('productActive').checked = product.isActive;
    document.getElementById('productImage').value = product.image || '';
    document.getElementById('productImageUrl').value = '';
    document.getElementById('productImageFile').value = '';

    switchImageInputTab('file');
    setupImageTabListeners();

    if (product.image) {
        document.getElementById('imagePreview').innerHTML = buildAdminImagePreview(product.image);
    } else {
        document.getElementById('imagePreview').innerHTML = '';
    }

    const categorySelect = document.getElementById('productCategory');
    const categories = menuData.categories.filter(c => c.menuType === product.menuType);
    categorySelect.innerHTML = '<option value="">Kategori Se\u00E7in</option>' +
        categories.map(c => `<option value="${c.id}" ${c.id === product.categoryId ? 'selected' : ''}>${c.name}</option>`).join('');

    document.getElementById('productModal').classList.add('active');
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
    editingProductId = null;
}

async function handleProductSubmit(e) {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.classList.add('loading');

    const productData = {
        name: document.getElementById('productName').value.trim(),
        description: document.getElementById('productDescription').value.trim(),
        price: parseFloat(document.getElementById('productPrice').value),
        categoryId: document.getElementById('productCategory').value,
        menuType: document.getElementById('productMenuType').value,
        image: normalizeImageUrl(document.getElementById('productImage').value),
        tag: document.getElementById('productTag').value,
        order: parseInt(document.getElementById('productOrder').value) || 1,
        isActive: document.getElementById('productActive').checked
    };

    try {
        let response;
        if (editingProductId) {
            response = await fetch(`/api/products/${editingProductId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(productData)
            });
        } else {
            response = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(productData)
            });
        }

        if (response.status === 401) {
            submitBtn.classList.remove('loading');
            showToast('Oturum S\u00FCresi Doldu', 'L\u00FCtfen tekrar giri\u015f yap\u0131n', 'error');
            setTimeout(() => { window.location.href = '/admin.html'; }, 2000);
            return;
        }

        const result = await response.json();
        submitBtn.classList.remove('loading');

        if (result.success) {
            showToast('Ba\u015far\u0131l\u0131', result.message, 'success');
            closeProductModal();
            loadMenuData();
            loadDashboardData();
        } else {
            showToast('Hata', result.message, 'error');
        }
    } catch (error) {
        submitBtn.classList.remove('loading');
        console.error('\u00DCr\u00FCn kaydetme hatas\u0131:', error);
        showToast('Hata', '\u00DCr\u00FCn kaydedilemedi', 'error');
    }
}

async function deleteProduct(productId) {
    const confirmed = await showConfirm(
        '\u00DCr\u00FCn\u00FC Sil',
        'Bu \u00FCr\u00FCn\u00FC silmek istedi\u011finizden emin misiniz? Bu i\u015flem geri al\u0131namaz.',
        null, 'danger'
    );
    if (!confirmed) return;

    try {
        showSpinner();
        const response = await fetch(`/api/products/${productId}`, { method: 'DELETE', credentials: 'include' });
        const result = await response.json();
        hideSpinner();
        if (result.success) {
            showToast('Ba\u015far\u0131l\u0131', result.message, 'success');
            loadMenuData();
            loadDashboardData();
        } else {
            showToast('Hata', result.message, 'error');
        }
    } catch (error) {
        hideSpinner();
        console.error('\u00DCr\u00FCn silme hatas\u0131:', error);
        showToast('Hata', '\u00DCr\u00FCn silinemedi', 'error');
    }
}

// ============= IMAGE UPLOAD =============
function switchImageInputTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    const tab = document.getElementById(tabName + 'Tab');
    if (tab) tab.classList.add('active');
}

function setupImageTabListeners() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.onclick = () => switchImageInputTab(btn.dataset.tab);
    });
}

async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    showSpinner();
    try {
        const formData = new FormData();
        formData.append('image', file);
        const response = await fetch('/api/upload', { method: 'POST', body: formData, credentials: 'include' });
        if (!response.ok) throw new Error('G\u00F6rsel y\u00FCklenemedi');
        const data = await response.json();
        if (data.success) {
            document.getElementById('productImage').value = data.imageUrl;
            document.getElementById('imagePreview').innerHTML = buildAdminImagePreview(data.imageUrl);
            showToast('Ba\u015far\u0131l\u0131', 'G\u00F6rsel y\u00FCklendi', 'success');
        } else {
            showToast('Hata', data.message, 'error');
        }
    } catch (error) {
        console.error('G\u00F6rsel y\u00FCkleme hatas\u0131:', error);
        showToast('Hata', 'G\u00F6rsel y\u00FCklenemedi', 'error');
    } finally {
        hideSpinner();
    }
}

async function loadImageFromUrl() {
    const urlInput = document.getElementById('productImageUrl');
    const url = normalizeImageUrl(urlInput.value);
    if (!url) {
        showToast('Hata', 'L\u00FCtfen ge\u00E7erli bir URL girin', 'error');
        return;
    }
    if (!url.startsWith('/')) {
        try {
            const parsed = new URL(url);
            if (!['http:', 'https:'].includes(parsed.protocol)) {
                showToast('Hata', 'Sadece http:// veya https:// URL kabul edilir', 'error');
                return;
            }
        } catch (e) {
            showToast('Hata', 'Ge\u00E7ersiz URL format\u0131', 'error');
            return;
        }
    }
    document.getElementById('productImage').value = url;
    document.getElementById('imagePreview').innerHTML = buildAdminImagePreview(url);
    const previewImg = document.querySelector('#imagePreview .preview-wrapper img');
    if (previewImg) {
        previewImg.onerror = function() {
            this.style.display = 'none';
            showToast('Uyar\u0131', 'G\u00F6rsel y\u00FCklenemedi - URL ge\u00E7ersiz olabilir', 'warning');
        };
    }
    showToast('Ba\u015far\u0131l\u0131', "G\u00F6rsel URL'si ayarland\u0131", 'success');
}

// ============= CATEGORY MANAGEMENT =============
function openCategoryModal(menuType) {
    editingCategoryId = null;
    document.getElementById('categoryModalTitle').textContent = 'Kategori Ekle';
    document.getElementById('categoryId').value = '';
    document.getElementById('categoryName').value = '';
    document.getElementById('categoryMenuType').value = menuType || '';
    document.getElementById('categoryOrder').value = '1';
    document.getElementById('categoryModal').classList.add('active');
}

function editCategory(categoryId) {
    const category = menuData.categories.find(c => c.id === categoryId);
    if (!category) return;
    editingCategoryId = categoryId;
    document.getElementById('categoryModalTitle').textContent = 'Kategori D\u00FCzenle';
    document.getElementById('categoryId').value = category.id;
    document.getElementById('categoryName').value = category.name;
    document.getElementById('categoryMenuType').value = category.menuType;
    document.getElementById('categoryOrder').value = category.order || 1;
    document.getElementById('categoryModal').classList.add('active');
}

function closeCategoryModal() {
    document.getElementById('categoryModal').classList.remove('active');
    editingCategoryId = null;
}

async function loadCategories() {
    try {
        showSpinner();
        const response = await fetch('/api/admin/menu', { credentials: 'include' });
        menuData = await response.json();
        renderCategories();
        hideSpinner();
    } catch (error) {
        hideSpinner();
        console.error('Kategori y\u00FCkleme hatas\u0131:', error);
        showToast('Hata', 'Kategoriler y\u00FCklenemedi', 'error');
    }
}

function renderCategories() {
    const grid = document.getElementById('categoriesGrid');
    if (!grid) return;
    if (menuData.categories.length === 0) {
        grid.innerHTML = '<p style="text-align:center;color:var(--text-light);grid-column:1/-1;">Kategori bulunamad\u0131</p>';
        return;
    }
    grid.innerHTML = menuData.categories.map(category => `
        <div class="category-card">
            <div class="category-info">
                <h3>${category.name}</h3>
                <span class="category-type">${category.menuType === 'cafe' ? '\u2615 Cafe' : '\uD83C\uDF7D\uFE0F Restaurant'}</span>
            </div>
            <div class="action-buttons">
                <button class="btn btn-sm btn-primary" onclick="editCategory('${category.id}')">D\u00FCzenle</button>
                <button class="btn btn-sm btn-danger" onclick="deleteCategory('${category.id}')">Sil</button>
            </div>
        </div>
    `).join('');
}

async function handleCategorySubmit(e) {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.classList.add('loading');

    const categoryData = {
        name: document.getElementById('categoryName').value.trim(),
        menuType: document.getElementById('categoryMenuType').value,
        order: parseInt(document.getElementById('categoryOrder').value) || 1
    };

    try {
        let response;
        if (editingCategoryId) {
            response = await fetch(`/api/categories/${editingCategoryId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(categoryData)
            });
        } else {
            response = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(categoryData)
            });
        }
        const result = await response.json();
        submitBtn.classList.remove('loading');
        if (result.success) {
            showToast('Ba\u015far\u0131l\u0131', result.message, 'success');
            closeCategoryModal();
            loadCategories();
            loadDashboardData();
        } else {
            showToast('Hata', result.message, 'error');
        }
    } catch (error) {
        submitBtn.classList.remove('loading');
        console.error('Kategori kaydetme hatas\u0131:', error);
        showToast('Hata', 'Kategori kaydedilemedi', 'error');
    }
}

async function deleteCategory(categoryId) {
    const confirmed = await showConfirm(
        'Kategoriyi Sil',
        'Bu kategoriyi silmek istedi\u011finizden emin misiniz? Bu kategoriye ait \u00FCr\u00FCnler varsa silme i\u015flemi ba\u015far\u0131s\u0131z olacakt\u0131r.',
        null, 'danger'
    );
    if (!confirmed) return;

    try {
        showSpinner();
        const response = await fetch(`/api/categories/${categoryId}`, { method: 'DELETE', credentials: 'include' });
        const result = await response.json();
        hideSpinner();
        if (result.success) {
            showToast('Ba\u015far\u0131l\u0131', result.message, 'success');
            loadCategories();
            loadDashboardData();
        } else {
            showToast('Hata', result.message, 'error');
        }
    } catch (error) {
        hideSpinner();
        console.error('Kategori silme hatas\u0131:', error);
        showToast('Hata', 'Kategori silinemedi', 'error');
    }
}

// ============= AUTH =============
async function logout() {
    const confirmed = await showConfirm(
        '\u00C7\u0131k\u0131\u015f Yap',
        '\u00C7\u0131k\u0131\u015f yapmak istedi\u011finizden emin misiniz?',
        null, 'warning'
    );
    if (!confirmed) return;

    try {
        await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
        window.location.href = '/admin.html';
    } catch (error) {
        console.error('\u00C7\u0131k\u0131\u015f hatas\u0131:', error);
        window.location.href = '/admin.html';
    }
}

// ============= SETTINGS =============
async function loadSettings() {
    try {
        const response = await fetch('/api/admin/settings', { credentials: 'include' });
        if (!response.ok) throw new Error('Ayarlar y\u00FCklenemedi');
        const settings = await response.json();

        document.getElementById('hotelNameInput').value = settings.hotelName || '';
        document.getElementById('googleReviewUrlInput').value = settings.googleReviewUrl || '';
        document.getElementById('whatsappNumberInput').value = settings.whatsappNumber || '';
        document.getElementById('copyrightTextInput').value = settings.copyrightText || '';

        if (settings.logo) {
            document.getElementById('logoPreview').innerHTML = `<img src="${settings.logo}" alt="Logo">`;
        }
        if (settings.favicon) {
            document.getElementById('faviconPreview').innerHTML = `<img src="${settings.favicon}" alt="Favicon">`;
        }
    } catch (error) {
        console.error('Ayarlar y\u00FCklenirken hata:', error);
        showToast('Hata', 'Ayarlar y\u00FCklenemedi', 'error');
    }
}

async function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    showSpinner();
    try {
        const formData = new FormData();
        formData.append('image', file);
        const response = await fetch('/api/upload', { method: 'POST', body: formData, credentials: 'include' });
        if (!response.ok) throw new Error('Logo y\u00FCklenemedi');
        const data = await response.json();
        const logoPreview = document.getElementById('logoPreview');
        logoPreview.innerHTML = `<img src="${data.imageUrl}" alt="Logo">`;
        logoPreview.dataset.imageUrl = data.imageUrl;
        showToast('Ba\u015far\u0131l\u0131', 'Logo y\u00FCklendi', 'success');
    } catch (error) {
        showToast('Hata', 'Logo y\u00FCklenemedi', 'error');
    } finally {
        hideSpinner();
    }
}

async function handleFaviconUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    showSpinner();
    try {
        const formData = new FormData();
        formData.append('image', file);
        const response = await fetch('/api/upload', { method: 'POST', body: formData, credentials: 'include' });
        if (!response.ok) throw new Error('Favicon y\u00FCklenemedi');
        const data = await response.json();
        const faviconPreview = document.getElementById('faviconPreview');
        faviconPreview.innerHTML = `<img src="${data.imageUrl}" alt="Favicon">`;
        faviconPreview.dataset.imageUrl = data.imageUrl;
        showToast('Ba\u015far\u0131l\u0131', 'Favicon y\u00FCklendi', 'success');
    } catch (error) {
        showToast('Hata', 'Favicon y\u00FCklenemedi', 'error');
    } finally {
        hideSpinner();
    }
}

async function saveSettings() {
    const hotelName = document.getElementById('hotelNameInput').value.trim();
    const googleReviewUrl = document.getElementById('googleReviewUrlInput').value.trim();
    const logoPreview = document.getElementById('logoPreview');
    const faviconPreview = document.getElementById('faviconPreview');
    const logo = logoPreview.dataset.imageUrl || logoPreview.querySelector('img')?.src || '';
    const favicon = faviconPreview.dataset.imageUrl || faviconPreview.querySelector('img')?.src || '';

    if (!hotelName) {
        showToast('Hata', 'Otel ad\u0131 gereklidir', 'error');
        return;
    }
    showSpinner();
    try {
        const response = await fetch('/api/admin/settings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ hotelName, googleReviewUrl, logo, favicon,
                whatsappNumber: document.getElementById('whatsappNumberInput').value.trim(),
                copyrightText: document.getElementById('copyrightTextInput').value.trim()
            })
        });
        if (!response.ok) throw new Error('Ayarlar kaydedilemedi');
        showToast('Ba\u015far\u0131l\u0131', 'Ayarlar ba\u015far\u0131yla kaydedildi', 'success');
        delete logoPreview.dataset.imageUrl;
        delete faviconPreview.dataset.imageUrl;
    } catch (error) {
        showToast('Hata', 'Ayarlar kaydedilemedi', 'error');
    } finally {
        hideSpinner();
    }
}

async function changePassword() {
    const currentPassword = document.getElementById('currentPasswordInput').value;
    const newPassword = document.getElementById('newPasswordInput').value;
    const confirmPassword = document.getElementById('confirmPasswordInput').value;

    if (!currentPassword || !newPassword || !confirmPassword) {
        showToast('Hata', 'Tüm alanları doldurun', 'error');
        return;
    }
    if (newPassword !== confirmPassword) {
        showToast('Hata', 'Yeni şifreler eşleşmiyor', 'error');
        return;
    }
    if (newPassword.length < 6) {
        showToast('Hata', 'Yeni şifre en az 6 karakter olmalı', 'error');
        return;
    }
    showSpinner();
    try {
        const response = await fetch('/api/admin/password', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ currentPassword, newPassword })
        });
        const data = await response.json();
        if (data.success) {
            showToast('Başarılı', 'Şifre başarıyla güncellendi', 'success');
            document.getElementById('currentPasswordInput').value = '';
            document.getElementById('newPasswordInput').value = '';
            document.getElementById('confirmPasswordInput').value = '';
        } else {
            showToast('Hata', data.message || 'Şifre güncellenemedi', 'error');
        }
    } catch (error) {
        showToast('Hata', 'Şifre güncellenemedi', 'error');
    } finally {
        hideSpinner();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const logoInput = document.getElementById('logoInput');
    const faviconInput = document.getElementById('faviconInput');
    if (logoInput) logoInput.addEventListener('change', handleLogoUpload);
    if (faviconInput) faviconInput.addEventListener('change', handleFaviconUpload);
});
