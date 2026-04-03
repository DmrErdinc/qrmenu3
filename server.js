require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session configuration (must be before static files)
app.use(session({
  secret: process.env.SESSION_SECRET || 'nava-hotel-secret-key-2024-very-long-secret-for-security',
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'lax'
  },
  name: 'nava.sid'
}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.redirect('/index.html');
});

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Helper functions to read/write data
const readData = (filename) => {
  try {
    const dataPath = path.join(__dirname, 'data', filename);
    if (!fs.existsSync(dataPath)) {
      if (filename === 'menu.json') return { categories: [], products: [] };
      if (filename === 'settings.json') return { logo: '', favicon: '', googleReviewUrl: '', hotelName: 'The Nava Hotel', copyrightText: '', whatsappNumber: '' };
      return { admins: [] };
    }
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    if (filename === 'menu.json') return { categories: [], products: [] };
    if (filename === 'settings.json') return { logo: '', favicon: '', googleReviewUrl: '', hotelName: 'The Nava Hotel', copyrightText: '', whatsappNumber: '' };
    return { admins: [] };
  }
};

const writeData = (filename, data) => {
  try {
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const dataPath = path.join(dataDir, filename);
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
};

// Authentication middleware
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.adminId) {
    return next();
  }
  return res.status(401).json({ success: false, message: 'Unauthorized' });
};

// ============= PUBLIC API ROUTES =============

// Get all menu data
app.get('/api/menu', (req, res) => {
  const menuData = readData('menu.json');
  // Filter only active products for public view
  const publicData = {
    categories: menuData.categories,
    products: menuData.products.filter(p => p.isActive)
  };
  res.json(publicData);
});

// Get cafe menu
app.get('/api/menu/cafe', (req, res) => {
  const menuData = readData('menu.json');
  const cafeData = {
    categories: menuData.categories.filter(c => c.menuType === 'cafe'),
    products: menuData.products.filter(p => p.menuType === 'cafe' && p.isActive)
  };
  res.json(cafeData);
});

// Get restaurant menu
app.get('/api/menu/restaurant', (req, res) => {
  const menuData = readData('menu.json');
  const restaurantData = {
    categories: menuData.categories.filter(c => c.menuType === 'restaurant'),
    products: menuData.products.filter(p => p.menuType === 'restaurant' && p.isActive)
  };
  res.json(restaurantData);
});

// Get settings (public)
app.get('/api/settings', (req, res) => {
  const settings = readData('settings.json');
  res.json(settings);
});

// ============= ADMIN AUTH ROUTES =============

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }
  
  const adminsData = readData('admins.json');
  const admin = adminsData.admins.find(a => a.username === username && a.password === password);
  
  if (admin) {
    req.session.adminId = admin.id;
    req.session.username = admin.username;
    return res.json({ success: true, message: 'Login successful', admin: { id: admin.id, username: admin.username } });
  }
  
  return res.status(401).json({ success: false, message: 'Invalid credentials' });
});

// Admin logout
app.post('/api/admin/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Logout failed' });
    }
    res.json({ success: true, message: 'Logout successful' });
  });
});

// Check admin session
app.get('/api/admin/check', (req, res) => {
  if (req.session && req.session.adminId) {
    return res.json({ success: true, authenticated: true, username: req.session.username });
  }
  return res.json({ success: false, authenticated: false });
});

// ============= ADMIN MENU MANAGEMENT ROUTES =============

// Get all menu data (admin view - includes inactive items)
app.get('/api/admin/menu', isAuthenticated, (req, res) => {
  const menuData = readData('menu.json');
  res.json(menuData);
});

// Get dashboard statistics
app.get('/api/admin/stats', isAuthenticated, (req, res) => {
  const menuData = readData('menu.json');
  const stats = {
    totalProducts: menuData.products.length,
    activeProducts: menuData.products.filter(p => p.isActive).length,
    inactiveProducts: menuData.products.filter(p => !p.isActive).length,
    totalCategories: menuData.categories.length,
    cafeProducts: menuData.products.filter(p => p.menuType === 'cafe').length,
    restaurantProducts: menuData.products.filter(p => p.menuType === 'restaurant').length
  };
  res.json(stats);
});

// ============= CATEGORY ROUTES =============

// Add new category
app.post('/api/categories', isAuthenticated, (req, res) => {
  const { name, menuType, order } = req.body;
  
  if (!name || !menuType) {
    return res.status(400).json({ success: false, message: 'Name and menu type are required' });
  }
  
  const menuData = readData('menu.json');
  const newCategory = {
    id: Date.now().toString(),
    name,
    menuType,
    order: order || menuData.categories.length + 1,
    createdAt: new Date().toISOString()
  };
  
  menuData.categories.push(newCategory);
  
  if (writeData('menu.json', menuData)) {
    return res.json({ success: true, message: 'Category added successfully', category: newCategory });
  }
  
  return res.status(500).json({ success: false, message: 'Failed to add category' });
});

// Update category
app.put('/api/categories/:id', isAuthenticated, (req, res) => {
  const { id } = req.params;
  const { name, menuType, order } = req.body;
  
  const menuData = readData('menu.json');
  const categoryIndex = menuData.categories.findIndex(c => c.id === id);
  
  if (categoryIndex === -1) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }
  
  menuData.categories[categoryIndex] = {
    ...menuData.categories[categoryIndex],
    name: name || menuData.categories[categoryIndex].name,
    menuType: menuType || menuData.categories[categoryIndex].menuType,
    order: order !== undefined ? order : menuData.categories[categoryIndex].order,
    updatedAt: new Date().toISOString()
  };
  
  if (writeData('menu.json', menuData)) {
    return res.json({ success: true, message: 'Category updated successfully', category: menuData.categories[categoryIndex] });
  }
  
  return res.status(500).json({ success: false, message: 'Failed to update category' });
});

// Delete category
app.delete('/api/categories/:id', isAuthenticated, (req, res) => {
  const { id } = req.params;
  
  const menuData = readData('menu.json');
  const categoryIndex = menuData.categories.findIndex(c => c.id === id);
  
  if (categoryIndex === -1) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }
  
  // Check if any products use this category
  const productsWithCategory = menuData.products.filter(p => p.categoryId === id);
  if (productsWithCategory.length > 0) {
    return res.status(400).json({ success: false, message: 'Cannot delete category with existing products' });
  }
  
  menuData.categories.splice(categoryIndex, 1);
  
  if (writeData('menu.json', menuData)) {
    return res.json({ success: true, message: 'Category deleted successfully' });
  }
  
  return res.status(500).json({ success: false, message: 'Failed to delete category' });
});

// ============= PRODUCT ROUTES =============

// Add new product
app.post('/api/products', isAuthenticated, (req, res) => {
  const { name, description, price, categoryId, menuType, image, tag, isActive, order } = req.body;
  
  if (!name || !price || !categoryId || !menuType) {
    return res.status(400).json({ success: false, message: 'Name, price, category, and menu type are required' });
  }
  
  const menuData = readData('menu.json');
  const newProduct = {
    id: Date.now().toString(),
    name,
    description: description || '',
    price: parseFloat(price),
    categoryId,
    menuType,
    image: image || '',
    tag: tag || '',
    isActive: isActive !== undefined ? isActive : true,
    order: order || menuData.products.length + 1,
    createdAt: new Date().toISOString()
  };
  
  menuData.products.push(newProduct);
  
  if (writeData('menu.json', menuData)) {
    return res.json({ success: true, message: 'Product added successfully', product: newProduct });
  }
  
  return res.status(500).json({ success: false, message: 'Failed to add product' });
});

// Update product
app.put('/api/products/:id', isAuthenticated, (req, res) => {
  const { id } = req.params;
  const { name, description, price, categoryId, menuType, image, tag, isActive, order } = req.body;
  
  const menuData = readData('menu.json');
  const productIndex = menuData.products.findIndex(p => p.id === id);
  
  if (productIndex === -1) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  
  menuData.products[productIndex] = {
    ...menuData.products[productIndex],
    name: name || menuData.products[productIndex].name,
    description: description !== undefined ? description : menuData.products[productIndex].description,
    price: price !== undefined ? parseFloat(price) : menuData.products[productIndex].price,
    categoryId: categoryId || menuData.products[productIndex].categoryId,
    menuType: menuType || menuData.products[productIndex].menuType,
    image: image !== undefined ? image : menuData.products[productIndex].image,
    tag: tag !== undefined ? tag : menuData.products[productIndex].tag,
    isActive: isActive !== undefined ? isActive : menuData.products[productIndex].isActive,
    order: order !== undefined ? order : menuData.products[productIndex].order,
    updatedAt: new Date().toISOString()
  };
  
  if (writeData('menu.json', menuData)) {
    return res.json({ success: true, message: 'Product updated successfully', product: menuData.products[productIndex] });
  }
  
  return res.status(500).json({ success: false, message: 'Failed to update product' });
});

// Delete product
app.delete('/api/products/:id', isAuthenticated, (req, res) => {
  const { id } = req.params;
  
  const menuData = readData('menu.json');
  const productIndex = menuData.products.findIndex(p => p.id === id);
  
  if (productIndex === -1) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  
  // Delete associated image if exists
  const product = menuData.products[productIndex];
  if (product.image) {
    const imagePath = path.join(__dirname, 'public', product.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }
  
  menuData.products.splice(productIndex, 1);
  
  if (writeData('menu.json', menuData)) {
    return res.json({ success: true, message: 'Product deleted successfully' });
  }
  
  return res.status(500).json({ success: false, message: 'Failed to delete product' });
});

// ============= FILE UPLOAD ROUTE =============

app.post('/api/upload', isAuthenticated, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  
  const imageUrl = '/uploads/' + req.file.filename;
  res.json({ success: true, message: 'File uploaded successfully', imageUrl });
});

// ============= SETTINGS ROUTES =============

// Get settings (admin)
app.get('/api/admin/settings', isAuthenticated, (req, res) => {
  const settings = readData('settings.json');
  res.json(settings);
});

// Update settings
app.put('/api/admin/settings', isAuthenticated, (req, res) => {
  const { logo, favicon, googleReviewUrl, hotelName, copyrightText, whatsappNumber } = req.body;
  
  const settings = readData('settings.json');
  const updatedSettings = {
    logo: logo !== undefined ? logo : settings.logo,
    favicon: favicon !== undefined ? favicon : settings.favicon,
    googleReviewUrl: googleReviewUrl !== undefined ? googleReviewUrl : settings.googleReviewUrl,
    hotelName: hotelName !== undefined ? hotelName : settings.hotelName,
    copyrightText: copyrightText !== undefined ? copyrightText : (settings.copyrightText || ''),
    whatsappNumber: whatsappNumber !== undefined ? whatsappNumber : (settings.whatsappNumber || ''),
    updatedAt: new Date().toISOString()
  };
  
  if (writeData('settings.json', updatedSettings)) {
    return res.json({ success: true, message: 'Settings updated successfully', settings: updatedSettings });
  }
  
  return res.status(500).json({ success: false, message: 'Failed to update settings' });
});

// Change admin password
app.put('/api/admin/password', isAuthenticated, (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Mevcut ve yeni şifre gerekli' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, message: 'Yeni şifre en az 6 karakter olmalı' });
  }

  const adminsData = readData('admins.json');
  const adminIndex = adminsData.admins.findIndex(a => a.id === req.session.adminId);

  if (adminIndex === -1) {
    return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı' });
  }

  if (adminsData.admins[adminIndex].password !== currentPassword) {
    return res.status(401).json({ success: false, message: 'Mevcut şifre yanlış' });
  }

  adminsData.admins[adminIndex].password = newPassword;
  adminsData.admins[adminIndex].updatedAt = new Date().toISOString();

  if (writeData('admins.json', adminsData)) {
    return res.json({ success: true, message: 'Şifre başarıyla güncellendi' });
  }

  return res.status(500).json({ success: false, message: 'Şifre güncellenemedi' });
});

// ============= ERROR HANDLING =============

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Something went wrong!' });
});

// ============= START SERVER =============

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 The Nava Hotel QR Menu Server is running!`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`📱 Public Menu: http://localhost:${PORT}/index.html`);
  console.log(`☕ Cafe Menu: http://localhost:${PORT}/cafe.html`);
  console.log(`🍽️  Restaurant Menu: http://localhost:${PORT}/restaurant.html`);
  console.log(`🔐 Admin Panel: http://localhost:${PORT}/admin.html`);
  console.log(`\n✨ Ready to serve!\n`);
});