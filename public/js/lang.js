// ============= LANGUAGE SYSTEM =============
(function () {
    const LANG_KEY = 'menuLang';
    const CACHE_KEY = 'translationCache_v1';

    let _cacheData = null;

    function getCache() {
        if (!_cacheData) {
            try { _cacheData = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}'); }
            catch { _cacheData = {}; }
        }
        return _cacheData;
    }

    function setCache(key, value) {
        const c = getCache();
        c[key] = value;
        try { localStorage.setItem(CACHE_KEY, JSON.stringify(c)); } catch {}
    }

    // ---- UI text dictionary ----
    const UI = {
        tr: {
            searchPlaceholder: 'Menüde ara...',
            allCategories: 'Tümü',
            backBtn: '← Geri',
            reviewBtn: 'Değerlendir',
            loading: 'Menü yükleniyor...',
            noResults: 'Ürün bulunamadı',
            noResultsHint: 'Arama veya filtrenizi ayarlamayı deneyin',
            defaultDesc: 'Menümüzden lezzetli bir ürün.',
            cafeDefaultDesc: 'Cafe menümüzden lezzetli bir ürün.',
            googleReview: '⭐ Bizi Google\'da Değerlendirin',
            whatsapp: '💬 WhatsApp',
            langBtnLabel: '<span class="fi fi-gb"></span> EN',
            langBtnTitle: 'Switch to English',
        },
        en: {
            searchPlaceholder: 'Search menu...',
            allCategories: 'All',
            backBtn: '← Back',
            reviewBtn: 'Review',
            loading: 'Loading menu...',
            noResults: 'No products found',
            noResultsHint: 'Try adjusting your search or filter',
            defaultDesc: 'A delicious item from our menu.',
            cafeDefaultDesc: 'A delicious item from our cafe menu.',
            googleReview: '⭐ Review Us on Google',
            whatsapp: '💬 WhatsApp',
            langBtnLabel: '<span class="fi fi-tr"></span> TR',
            langBtnTitle: 'Türkçeye Geç',
        }
    };

    window.Lang = {

        get: function () {
            return localStorage.getItem(LANG_KEY) || 'tr';
        },

        set: function (lang) {
            localStorage.setItem(LANG_KEY, lang);
        },

        isEN: function () {
            return this.get() === 'en';
        },

        // Get UI text for current language
        t: function (key) {
            const lang = this.get();
            return (UI[lang] && UI[lang][key]) || UI.tr[key] || key;
        },

        // Translate a single text via MyMemory API (TR → EN)
        translateText: async function (text) {
            if (!text || !text.trim() || !this.isEN()) return text || '';
            const key = text.trim();
            const cached = getCache()[key];
            if (cached !== undefined) return cached;

            try {
                const controller = new AbortController();
                const timer = setTimeout(() => controller.abort(), 6000);
                const res = await fetch(
                    'https://api.mymemory.translated.net/get?q=' +
                    encodeURIComponent(key) + '&langpair=tr|en',
                    { signal: controller.signal }
                );
                clearTimeout(timer);
                const data = await res.json();
                if (data.responseStatus === 200 && data.responseData.translatedText) {
                    const translated = data.responseData.translatedText;
                    setCache(key, translated);
                    return translated;
                }
            } catch {}

            setCache(key, text); // cache original to avoid repeated failed calls
            return text;
        },

        // Translate an array of products (parallel)
        translateProducts: async function (products) {
            if (!this.isEN()) return products;
            return Promise.all(products.map(async p => {
                const [name, description] = await Promise.all([
                    this.translateText(p.name),
                    this.translateText(p.description)
                ]);
                return { ...p, name, description };
            }));
        },

        // Translate categories (parallel)
        translateCategories: async function (categories) {
            if (!this.isEN()) return categories;
            return Promise.all(categories.map(async cat => {
                const name = await this.translateText(cat.name);
                return { ...cat, name };
            }));
        },

        // Apply UI strings to static page elements
        applyUI: function () {
            const lang = this.get();
            document.documentElement.lang = lang === 'en' ? 'en' : 'tr';

            const searchInput = document.getElementById('searchInput');
            if (searchInput) searchInput.placeholder = this.t('searchPlaceholder');

            const backBtn = document.querySelector('.back-button');
            if (backBtn) backBtn.textContent = this.t('backBtn');

            const reviewText = document.querySelector('.review-text');
            if (reviewText) reviewText.textContent = this.t('reviewBtn');

            const googleReviewLink = document.getElementById('googleReviewLink');
            if (googleReviewLink) googleReviewLink.textContent = this.t('googleReview');

            const waLink = document.getElementById('whatsappLink');
            if (waLink) waLink.textContent = this.t('whatsapp');

            const langBtn = document.getElementById('langToggleBtn');
            if (langBtn) {
                langBtn.innerHTML = this.t('langBtnLabel');
                langBtn.title = this.t('langBtnTitle');
            }
        },

        // Toggle TR ↔ EN and reload
        toggle: function () {
            this.set(this.isEN() ? 'tr' : 'en');
            window.location.reload();
        },

        // Inject language toggle button into a given parent element
        injectToggleBtn: function (parentEl) {
            if (!parentEl || document.getElementById('langToggleBtn')) return;
            const btn = document.createElement('button');
            btn.id = 'langToggleBtn';
            btn.className = 'lang-toggle-btn';
            btn.textContent = this.t('langBtnLabel');
            btn.title = this.t('langBtnTitle');
            btn.addEventListener('click', () => this.toggle());
            parentEl.appendChild(btn);
        }
    };
})();
