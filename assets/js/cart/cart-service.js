// cart-service.js - общий сервис для работы с корзиной
class CartService {
    constructor() {
        this.init();
    }

    init() {
        // Инициализация при загрузке
        if (typeof window !== 'undefined') {
            this.updateCartCounter();
        }
    }

    getCartItems() {
        try {
            return JSON.parse(localStorage.getItem('cart')) || [];
        } catch {
            return [];
        }
    }

    saveCartItems(items) {
        localStorage.setItem('cart', JSON.stringify(items));
        this.updateCartCounter();
    }

    addToCart(product) {
        const items = this.getCartItems();
        const existingItemIndex = items.findIndex(item => item.id === product.id);
        
        if (existingItemIndex !== -1) {
            items[existingItemIndex].quantity += 1;
        } else {
            items.push({
                id: product.id || this.generateId(),
                title: product.title,
                image: product.image,
                category: product.category,
                genre: product.genre || 'Игра',
                price: product.price,
                originalPrice: product.originalPrice || product.price,
                quantity: 1,
                selected: true,
                isFavorite: false
            });
        }
        
        this.saveCartItems(items);
        this.showNotification('Товар добавлен в корзину!');
        return true;
    }

    removeFromCart(productId) {
        const items = this.getCartItems().filter(item => item.id !== productId);
        this.saveCartItems(items);
    }

    clearCart() {
        this.saveCartItems([]);
    }

    getCartCount() {
        return this.getCartItems().reduce((total, item) => total + item.quantity, 0);
    }

    updateCartCounter() {
        const count = this.getCartCount();
        const cartCounter = document.querySelector('.header__cart-counter');
        
        if (cartCounter) {
            cartCounter.textContent = count;
            cartCounter.style.display = count > 0 ? 'flex' : 'none';
        } else {
            this.createCartCounter();
        }
    }

    createCartCounter() {
        const cartIcon = document.querySelector('.header__icon-cart');
        if (!cartIcon) return;
        
        let counter = cartIcon.querySelector('.header__cart-counter');
        if (!counter) {
            counter = document.createElement('div');
            counter.className = 'header__cart-counter';
            counter.style.cssText = `
                position: absolute;
                top: 21px;
                right: -8px;
                background: linear-gradient(45deg, #9d00ff 0%, #003791 100%);
                color: white;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                font-weight: bold;
                font-family: 'Jost-SemiBold';
            `;
            cartIcon.style.position = 'relative';
            cartIcon.appendChild(counter);
        }
        
        this.updateCartCounter();
    }

    showNotification(message) {
        // Удаляем существующие уведомления
        const existingNotifications = document.querySelectorAll('.cart-notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Создаем элемент уведомления
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #9d00ff 0%, #003791 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 10000;
            font-family: 'Jost-Regular';
            font-size: 16px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}

// Создаем глобальный экземпляр
window.cartService = new CartService();

// Глобальная функция для обратной совместимости
window.addToCart = function(product) {
    return window.cartService.addToCart(product);
};

// cart-service.js - добавьте этот код в конец файла

// Обработчик для кнопок "Добавить в корзину"
document.addEventListener('DOMContentLoaded', function() {
    // Обработчик для кнопок с классом add-to-cart-btn
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart-btn')) {
            e.preventDefault();
            
            // Находим ближайшую карточку товара
            const productCard = e.target.closest('.sales__item, .catalog__item, .product-card');
            if (!productCard) return;
            
            // Извлекаем данные о товаре из data-атрибутов или из структуры HTML
            const product = {
                id: productCard.dataset.id || generateProductId(productCard),
                title: getProductTitle(productCard),
                image: getProductImage(productCard),
                category: getProductCategory(productCard),
                price: getProductPrice(productCard),
                originalPrice: getProductOriginalPrice(productCard)
            };
            
            // Добавляем товар в корзину
            window.cartService.addToCart(product);
        }
    });
});

// Вспомогательные функции для извлечения данных о товаре
function generateProductId(productCard) {
    // Генерируем ID на основе названия товара
    const title = getProductTitle(productCard);
    return title ? title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') : Date.now().toString();
}

function getProductTitle(productCard) {
    return productCard.querySelector('.sales__item-title, .catalog__item-title, .product-title')?.textContent || 'Неизвестный товар';
}

function getProductImage(productCard) {
    const img = productCard.querySelector('img');
    return img ? img.src : '/assets/image/placeholder.jpg';
}

function getProductCategory(productCard) {
    return productCard.querySelector('.sales__category, .catalog__category, .product-category')?.textContent || 'Категория';
}

function getProductPrice(productCard) {
    const priceElement = productCard.querySelector('.sales__item-price, .catalog__item-price, .product-price');
    if (!priceElement) return 0;
    
    const priceText = priceElement.textContent;
    return parseFloat(priceText.replace(/[^\d]/g, '')) || 0;
}

function getProductOriginalPrice(productCard) {
    const oldPriceElement = productCard.querySelector('.sales__item-price--old, .catalog__item-price--old, .product-price-old');
    if (!oldPriceElement) return null;
    
    const priceText = oldPriceElement.textContent;
    return parseFloat(priceText.replace(/[^\d]/g, '')) || null;
}