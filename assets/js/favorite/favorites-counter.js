class FavoritesCounter {
    constructor() {
        this.counterElement = null;
        this.storageKey = 'userFavorites';
        this.init();
    }

    init() {
        this.createCounter();
        this.updateCounter();
        this.addEventListeners();
    }

    createCounter() {
        const favIcon = document.querySelector('.header__icons-fav');
        if (!favIcon) return;

        this.counterElement = document.createElement('div');
        this.counterElement.className = 'favorites-counter';
        this.counterElement.style.cssText = `
            position: absolute;
            top: -5px;
            right: -5px;
            background: linear-gradient(135deg, #9d00ff, #003791);
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            border: 2px solid #1a1a1a;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        `;

        favIcon.style.position = 'relative';
        favIcon.appendChild(this.counterElement);
    }

    updateCounter() {
        if (!this.counterElement) return;

        const favorites = this.getFavorites();
        const count = favorites.length;

        this.counterElement.textContent = count > 99 ? '99+' : count;
        this.counterElement.style.display = count > 0 ? 'flex' : 'none';

        if (count > 0) {
            this.animateCounter();
        }
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

    animateCounter() {
        if (!this.counterElement) return;
        this.counterElement.style.transform = 'scale(1.2)';
        setTimeout(() => {
            this.counterElement.style.transform = 'scale(1)';
        }, 300);
    }

    addEventListeners() {
        window.addEventListener('storage', (e) => {
            if (e.key === this.storageKey) {
                this.updateCounter();
            }
        });

        document.addEventListener('click', (e) => {
            if (e.target.closest('.sales__fav')) {
                setTimeout(() => this.updateCounter(), 100);
            }
        });
    }
}