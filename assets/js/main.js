        document.addEventListener('DOMContentLoaded', function() {
            const burgerBtn = document.getElementById('burgerBtn');
            const menuClose = document.getElementById('menuClose');
            const menu = document.getElementById('menu');
            const menuOverlay = document.getElementById('menuOverlay');
            const content = document.getElementById('content');
            const body = document.body;

            // Функция открытия меню
            function openMenu() {
                burgerBtn.classList.add('active');
                menuClose.classList.add('active');
                menu.classList.add('active');
                menuOverlay.classList.add('active');
                content.classList.add('shifted');
                body.classList.add('menu-open');
            }

            // Функция закрытия меню
            function closeMenu() {
                burgerBtn.classList.remove('active');
                menuClose.classList.remove('active');
                menu.classList.remove('active');
                menuOverlay.classList.remove('active');
                content.classList.remove('shifted');
                body.classList.remove('menu-open');
            }

            // Функция переключения меню
            function toggleMenu() {
                if (menu.classList.contains('active')) {
                    closeMenu();
                } else {
                    openMenu();
                }
            }

            // Обработчик клика по бургер-кнопке
            burgerBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                openMenu();
            });

            // Обработчик клика по крестику в меню
            menuClose.addEventListener('click', function(e) {
                e.stopPropagation();
                closeMenu();
            });

            // Обработчик клика по оверлею
            menuOverlay.addEventListener('click', function() {
                closeMenu();
            });

            // Обработчик клика по пунктам меню
            const menuLinks = menu.querySelectorAll('a');
            menuLinks.forEach(link => {
                link.addEventListener('click', function() {
                    closeMenu();
                });
            });

            // Закрытие меню при клике вне меню
            document.addEventListener('click', function(e) {
                if (menu.classList.contains('active') && 
                    !menu.contains(e.target) && 
                    !burgerBtn.contains(e.target) &&
                    !menuClose.contains(e.target)) {
                    closeMenu();
                }
            });

            // Закрытие меню при нажатии Escape
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && menu.classList.contains('active')) {
                    closeMenu();
                }
            });

            // Адаптация к изменению размера окна
            window.addEventListener('resize', function() {
                if (window.innerWidth > 768 && menu.classList.contains('active')) {
                    // На больших экранах оставляем меню открытым
                } else if (window.innerWidth <= 768 && menu.classList.contains('active')) {
                    // На мобильных можно автоматически закрывать меню при изменении ориентации
                }
            });
        });


        // ============== SLIDER =================


        let currentSlide = 0;
        const slides = document.querySelectorAll('.slide');
        const slider = document.getElementById('slider');
        const navigation = document.getElementById('navigation');

        // Создаем точки навигации
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'dot';
            dot.addEventListener('click', () => goToSlide(index));
            navigation.appendChild(dot);
        });

        // Инициализируем первую точку как активную
        updateNavigation();

        function goToSlide(index) {
            currentSlide = index;
            updateSlider();
            updateNavigation();
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            updateSlider();
            updateNavigation();
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateSlider();
            updateNavigation();
        }

        function updateSlider() {
            slider.style.transform = `translateX(-${currentSlide * 100}%)`;
        }

        function updateNavigation() {
            const dots = document.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }

        // Автопрокрутка (раскомментируйте, если нужно)
        // setInterval(nextSlide, 3000);

        
// ============== SLIDER--SALES =================

document.addEventListener('DOMContentLoaded', function() {
    const wrapper = document.querySelector('.sales__wrapper');
    const items = document.querySelectorAll('.sales__item');
    const prevBtn = document.querySelector('.nav__prev');
    const nextBtn = document.querySelector('.nav__next');
    const progressFill = document.querySelector('.sales__progress-fill');
    const container = document.querySelector('.container');
    
    let currentPosition = 0;
    let itemWidth = 0;
    let currentIndex = 0;
    
    // Функция для обновления затемнения элементов
    function updateDimmedItems() {
        // Сначала убираем затемнение со всех элементов
        items.forEach(item => item.classList.remove('dimmed'));
        
        // Находим индекс элемента, который находится на 4-й позиции (визуально)
        // Это зависит от текущей позиции слайдера
        const visibleFourthIndex = currentIndex + 3;
        
        // Если такой элемент существует, затемняем его
        if (items[visibleFourthIndex]) {
            items[visibleFourthIndex].classList.add('dimmed');
        }
    }
    
    // Получаем ширину одного элемента с отступом
    function updateItemWidth() {
        if (items.length > 0) {
            const gap = 40; // Ваш gap из CSS
            itemWidth = items[0].offsetWidth + gap;
        }
    }
    
    // Функция для обновления прогресс бара
    function updateProgressBar() {
        const totalItems = items.length;
        
        if (totalItems <= 4) {
            progressFill.style.width = '100%';
            return;
        }
        
        const maxIndex = totalItems - 4;
        const progress = currentIndex / maxIndex;
        const percentage = Math.min(progress * 100, 100);
        
        progressFill.style.width = percentage + '%';
    }
    
    // Функция перемещения слайдера
    function moveSlider(direction) {
        if (items.length === 0) return;
        
        updateItemWidth();
        const maxIndex = Math.max(0, items.length - 4);
        
        // Сохраняем старый индекс для проверки
        const oldIndex = currentIndex;
        
        // Обновляем текущий индекс
        currentIndex += direction;
        
        // Строго ограничиваем движение
        if (currentIndex < 0) {
            currentIndex = 0;
            return; // Не обновляем если достигли начала
        }
        if (currentIndex > maxIndex) {
            currentIndex = maxIndex;
            return; // Не обновляем если достигли конца
        }
        
        // Рассчитываем новую позицию
        currentPosition = -currentIndex * itemWidth;
        
        wrapper.style.transform = `translateX(${currentPosition}px)`;
        
        // Обновляем прогресс бар
        updateProgressBar();
        
        // Обновляем затемнение элементов
        updateDimmedItems();
        
        // Обновляем состояние кнопок
        updateButtonsState(maxIndex);
    }
    
    // Обновление состояния кнопок
    function updateButtonsState(maxIndex) {
        if (prevBtn) {
            const isAtStart = currentIndex === 0;
            prevBtn.style.opacity = isAtStart ? '0.5' : '1';
            prevBtn.style.pointerEvents = isAtStart ? 'none' : 'auto';
            prevBtn.style.cursor = isAtStart ? 'not-allowed' : 'pointer';
        }
        if (nextBtn) {
            const isAtEnd = currentIndex === maxIndex;
            nextBtn.style.opacity = isAtEnd ? '0.5' : '1';
            nextBtn.style.pointerEvents = isAtEnd ? 'none' : 'auto';
            nextBtn.style.cursor = isAtEnd ? 'not-allowed' : 'pointer';
        }
    }
    
    // Инициализация
    function initSlider() {
        updateItemWidth();
        const maxIndex = Math.max(0, items.length - 4);
        
        updateButtonsState(maxIndex);
        updateProgressBar();
        updateDimmedItems(); // Инициализируем затемнение
        
        // Устанавливаем начальную позицию
        currentPosition = -currentIndex * itemWidth;
        wrapper.style.transform = `translateX(${currentPosition}px)`;
    }
    
    // Обработчики событий для кнопок
    if (prevBtn) {
        prevBtn.addEventListener('click', () => moveSlider(-1));
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => moveSlider(1));
    }
    
    // Обработчик изменения размера окна
    window.addEventListener('resize', function() {
        updateItemWidth();
        const maxIndex = Math.max(0, items.length - 4);
        
        // Корректируем currentIndex если он стал больше нового maxIndex
        if (currentIndex > maxIndex) {
            currentIndex = maxIndex;
        }
        
        currentPosition = -currentIndex * itemWidth;
        wrapper.style.transform = `translateX(${currentPosition}px)`;
        
        updateButtonsState(maxIndex);
        updateProgressBar();
        updateDimmedItems(); // Обновляем затемнение
    });
    
    // Добавляем поддержку свайпа на мобильных устройствах
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let startPosition = 0;
    
    if (wrapper) {
        wrapper.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startPosition = currentPosition;
            isDragging = true;
            wrapper.style.transition = 'none';
        });
        
        wrapper.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
            
            const diff = currentX - startX;
            const newPosition = startPosition + diff;
            
            // Ограничиваем движение во время свайпа
            const maxIndex = Math.max(0, items.length - 4);
            const minPosition = 0;
            const maxPosition = -maxIndex * itemWidth;
            
            const limitedPosition = Math.min(Math.max(newPosition, maxPosition), minPosition);
            wrapper.style.transform = `translateX(${limitedPosition}px)`;
        });
        
        wrapper.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            wrapper.style.transition = 'transform 0.5s ease';
            
            const diff = startX - currentX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    moveSlider(1); // Свайп влево - следующий элемент
                } else {
                    moveSlider(-1); // Свайп вправо - предыдущий элемент
                }
            } else {
                // Возвращаем на место если короткий свайп
                wrapper.style.transform = `translateX(${currentPosition}px)`;
            }
        });
    }
    
    // Запускаем инициализацию
    initSlider();
});

const items = document.querySelectorAll(".product__inner-pagination-item");

items.forEach(item => {
    // Отключаем выделение текста через JS
    item.style.userSelect = 'none';
    item.style.webkitUserSelect = 'none';
    item.style.mozUserSelect = 'none';
    item.style.msUserSelect = 'none';
    
    item.addEventListener("mousedown", function(e) {
        e.preventDefault(); // Предотвращаем выделение
    });
    
    item.addEventListener("click", function(e) {
        e.preventDefault();
        items.forEach(el => el.classList.remove("active"));
        this.classList.add("active");
    });
}); 

class FavoritesManager {
    constructor() {
        this.storageKey = 'userFavorites';
        this.init();
    }

    init() {
        // Инициализация обработчиков событий
        this.addEventListeners();
        this.updateFavoritesIcons();
    }

    addEventListeners() {
        // Делегирование событий на весь документ
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
        // Создаем уникальный ID на основе содержимого
        const title = itemElement.querySelector('.sales__item-title')?.textContent || '';
        const price = itemElement.querySelector('.sales__item-price')?.textContent || '';
        return `item_${title}_${price}`.replace(/\s+/g, '_').toLowerCase();
    }

    addToFavorites(itemData) {
        const favorites = this.getFavorites();
        
        // Проверяем, нет ли уже такого товара
        if (!favorites.some(item => item.id === itemData.id)) {
            favorites.push(itemData);
            this.saveFavorites(favorites);
            this.showNotification('Товар добавлен в избранное', 'success');
        }
    }

    removeFromFavorites(itemId) {
        const favorites = this.getFavorites();
        const updatedFavorites = favorites.filter(item => item.id !== itemId);
        this.saveFavorites(updatedFavorites);
        this.showNotification('Товар удален из избранного', 'info');
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
            
            if (favIcon && favoriteIds.includes(itemId)) {
                this.updateFavoriteIcon(favIcon, true);
            }
        });
    }

    updateFavoriteIcon(element, isFavorite) {
        const path = element.querySelector('path');
        if (!path) return;

        if (isFavorite) {
            path.setAttribute('fill', '#9D00FF'); // Красный цвет для избранного
            element.classList.add('active');
        } else {
            path.setAttribute('fill', '#F7F7F7'); // Исходный цвет
            element.classList.remove('active');
        }
    }

    showNotification(message, type = 'info') {
        // Создаем уведомление
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

        // Анимация появления
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Автоматическое скрытие
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Метод для получения всех избранных товаров
    getAllFavorites() {
        return this.getFavorites();
    }

    // Метод для очистки избранного
    clearFavorites() {
        localStorage.removeItem(this.storageKey);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.favoritesManager = new FavoritesManager();
});

// Дополнительные CSS стили для активного состояния
const style = document.createElement('style');
style.textContent = `
    .sales__fav.active {
        animation: heartBeat 0.6s ease;
    }
    
    @keyframes heartBeat {
        0% { transform: scale(1); }
        25% { transform: scale(1.2); }
        50% { transform: scale(0.9); }
        75% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    .sales__fav:hover path {
        fill: #9D00FF; !important;
        transition: fill 0.2s ease;
    }
`;
document.head.appendChild(style);

