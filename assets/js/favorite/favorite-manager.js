class FavoritesManager {
    constructor() {
        this.storageKey = 'userFavorites';
        this.init();
    }

    init() {
        this.addEventListeners();
        this.updateFavoritesIcons();
        this.updateHeaderCounter();
    }

    addEventListeners() {
        document.addEventListener('click', (e) => {
            const favElement = e.target.closest('.sales__fav');
            if (favElement) {
                e.preventDefault();
                this.toggleFavorite(favElement);
            }
        });
    }

    toggleFavorite(element) {
        const itemElement = element.closest('.sales__item');
        if (!itemElement) return;

        const itemData = this.getItemData(itemElement);
        const isCurrentlyFavorite = this.isFavorite(itemData.id);

        if (isCurrentlyFavorite) {
            this.removeFromFavorites(itemData.id);
        } else {
            this.addToFavorites(itemData);
        }

        this.updateFavoriteIcon(element, !isCurrentlyFavorite);
    }

    getItemData(itemElement) {
        return {
            id: this.generateItemId(itemElement),
            title: itemElement.querySelector('.sales__item-title')?.textContent || 'Без названия',
            price: itemElement.querySelector('.sales__item-price')?.textContent || '0 ₽',
            category: itemElement.querySelector('.sales__category')?.textContent || '',
            image: itemElement.querySelector('.sales__img')?.src || '',
            imageAlt: itemElement.querySelector('.sales__img')?.alt || ''
        };
    }

    generateItemId(itemElement) {
        const title = itemElement.querySelector('.sales__item-title')?.textContent || '';
        const price = itemElement.querySelector('.sales__item-price')?.textContent || '';
        return `item_${title}_${price}`.replace(/\s+/g, '_').toLowerCase();
    }

    addToFavorites(itemData) {
        const favorites = this.getFavorites();
        
        if (!favorites.some(item => item.id === itemData.id)) {
            favorites.push(itemData);
            this.saveFavorites(favorites);
            this.showNotification('Товар добавлен в избранное', 'success');
            this.updateHeaderCounter();
        }
    }

    removeFromFavorites(itemId) {
        const favorites = this.getFavorites();
        const updatedFavorites = favorites.filter(item => item.id !== itemId);
        this.saveFavorites(updatedFavorites);
        this.showNotification('Товар удален из избранного', 'info');
        this.updateHeaderCounter();
    }

    getFavorites() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Ошибка чтения избранного:', error);
            return [];
        }
    }

    saveFavorites(favorites) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(favorites));
        } catch (error) {
            console.error('Ошибка сохранения избранного:', error);
        }
    }

    isFavorite(itemId) {
        return this.getFavorites().some(item => item.id === itemId);
    }

    updateFavoritesIcons() {
        const favorites = this.getFavorites();
        const favoriteIds = favorites.map(item => item.id);

        document.querySelectorAll('.sales__item').forEach(item => {
            const itemId = this.generateItemId(item);
            const favIcon = item.querySelector('.sales__fav');
            
            if (favIcon) {
                this.updateFavoriteIcon(favIcon, favoriteIds.includes(itemId));
            }
        });
    }

    updateFavoriteIcon(element, isFavorite) {
        const path = element.querySelector('path');
        if (!path) return;

        if (isFavorite) {
            path.setAttribute('fill', '#ff4444');
            element.classList.add('active');
        } else {
            path.setAttribute('fill', '#F7F7F7');
            element.classList.remove('active');
        }
    }

    updateHeaderCounter() {
        if (window.favoritesCounter && typeof window.favoritesCounter.updateCounter === 'function') {
            window.favoritesCounter.updateCounter();
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
            color: white;
            border-radius: 5px;
            z-index: 1000;
            opacity: 0;
            transform: translateX(100px);
            transition: all 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}