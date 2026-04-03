// Cafe Menu JavaScript
let allProducts = [];
let allCategories = [];
let currentCategory = 'all';

// Normalize image URL - trim and return empty string for invalid values
function normalizeImageUrl(url) {
    if (!url || typeof url !== 'string') return '';
    const trimmed = url.trim();
    if (!trimmed) return '';
    return trimmed;
}

// Build safe image HTML with onerror fallback
function buildImageHtml(src, alt, styleStr) {
    const normalized = normalizeImageUrl(src);
    if (!normalized) return '<span style="font-size:2.5rem;">\u{1F37D}\uFE0F</span>';
    return `<img src="${normalized}" alt="${alt || ''}" style="${styleStr || ''}" loading="lazy" onerror="this.style.display='none';var s=this.nextElementSibling;if(s)s.style.display='flex';"><span style="display:none;width:100%;height:100%;align-items:center;justify-content:center;font-size:2.5rem;">\u{1F37D}\uFE0F</span>`;
}

// Load menu data on page load
document.addEventListener('DOMContentLoaded', () => {
    loadMenuData();
    setupEventListeners();
});

function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => filterProducts(e.target.value));
    }
}

async function loadMenuData() {
    const menuContent = document.getElementById('menuContent');
    menuContent.innerHTML = `<div class="loading">${window.Lang ? Lang.t('loading') : 'Menü yükleniyor...'}</div>`;
    try {
        const response = await fetch('/api/menu/cafe');
        const data = await response.json();

        if (window.Lang) {
            allCategories = await Lang.translateCategories(data.categories);
            allProducts = await Lang.translateProducts(data.products);
            Lang.applyUI();
        } else {
            allCategories = data.categories;
            allProducts = data.products;
        }

        renderCategories();
        renderProducts(allProducts);
    } catch (error) {
        console.error('Error loading menu:', error);
        menuContent.innerHTML = `
            <div class="no-results">
                <h3>${window.Lang ? Lang.t('noResults') : 'Menü yüklenemedi'}</h3>
                <p>Lütfen daha sonra tekrar deneyin</p>
            </div>
        `;
    }
}

function renderCategories() {
    const categoriesFilter = document.getElementById('categoriesFilter');
    const allLabel = window.Lang ? Lang.t('allCategories') : 'Tümü';
    categoriesFilter.innerHTML = `<button class="category-btn active" data-category="all">${allLabel}</button>`;
    allCategories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'category-btn';
        button.textContent = category.name;
        button.dataset.category = category.id;
        button.addEventListener('click', () => filterByCategory(category.id));
        categoriesFilter.appendChild(button);
    });
    const allButton = categoriesFilter.querySelector('[data-category="all"]');
    allButton.addEventListener('click', () => filterByCategory('all'));
}

function filterByCategory(categoryId) {
    currentCategory = categoryId;
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === categoryId);
    });
    const searchInput = document.getElementById('searchInput');
    filterProducts(searchInput ? searchInput.value : '');
}

function filterProducts(searchTerm) {
    let filtered = allProducts;
    if (currentCategory !== 'all') {
        filtered = filtered.filter(p => p.categoryId === currentCategory);
    }
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(term) ||
            (p.description || '').toLowerCase().includes(term)
        );
    }
    renderProducts(filtered);
}

function renderProducts(products) {
    const menuContent = document.getElementById('menuContent');
    if (products.length === 0) {
        const noRes = window.Lang ? Lang.t('noResults') : 'Ürün bulunamadı';
        const hint = window.Lang ? Lang.t('noResultsHint') : 'Arama veya filtrenizi ayarlamayı deneyin';
        menuContent.innerHTML = `<div class="no-results"><h3>${noRes}</h3><p>${hint}</p></div>`;
        return;
    }
    const CARD_IMG_STYLE = 'position:absolute;inset:0;width:100%;height:100%;object-fit:contain;object-position:center;background:#f9f9f6;display:block;';
    menuContent.innerHTML = products.map(product => {
        const imgHtml = buildImageHtml(product.image, product.name, CARD_IMG_STYLE);
        return `
            <div class="product-card" onclick="openProductModal('${product.id}')">
                <div class="product-image">${imgHtml}</div>
                ${product.tag ? `<span class="product-tag">${product.tag}</span>` : ''}
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description || (window.Lang ? Lang.t('defaultDesc') : 'Menümüzden lezzetli bir ürün')}</p>
                    <div class="product-price">\u20BA${product.price.toFixed(2)}</div>
                </div>
            </div>
        `;
    }).join('');
}

function openProductModal(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    const category = allCategories.find(c => c.id === product.categoryId);
    const categoryName = category ? category.name : '';
    const modal = document.getElementById('productModal');
    const modalBody = document.getElementById('modalBody');
    const MODAL_IMG_STYLE = 'position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#f9f9f6;display:block;';
    const modalImgHtml = buildImageHtml(product.image, product.name, MODAL_IMG_STYLE).replace('font-size:2.5rem', 'font-size:4rem');
    modalBody.innerHTML = `
        <div class="modal-image">${modalImgHtml}</div>
        <div class="modal-body">
            ${product.tag ? `<span class="product-tag" style="position:relative;top:auto;left:auto;display:inline-block;margin-bottom:12px;">${product.tag}</span>` : ''}
            <h2 class="modal-title">${product.name}</h2>
            ${categoryName ? `<p style="color:#999;margin-bottom:12px;font-size:0.9rem;">${categoryName}</p>` : ''}
            <p class="modal-description">${product.description || (window.Lang ? Lang.t('cafeDefaultDesc') : 'Cafe menümüzden lezzetli bir ürün.')}</p>
            <div class="modal-price">\u20BA${product.price.toFixed(2)}</div>
        </div>
    `;
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('productModal').classList.remove('active');
}

document.addEventListener('click', (e) => {
    const modal = document.getElementById('productModal');
    if (e.target === modal) closeModal();
});

document.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.querySelector('.modal-close');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});
