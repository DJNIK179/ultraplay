// Получаем элемент для контента
const contentElement = document.getElementById('favorites-content');

// Функция для проверки пустого состояния
function checkFavorites() {
    if (!contentElement) return;
    
    // Получаем избранное из localStorage (используем ключ 'userFavorites')
    const favorites = JSON.parse(localStorage.getItem('userFavorites')) || [];
    
    if (favorites.length === 0) {
        showEmptyState();
    } else {
        showFavoritesList(favorites);
    }
}

// Функция показа пустого состояния
function showEmptyState() {
    if (!contentElement) return;
    
    contentElement.innerHTML = `
        <div class="empty-state">
            <p class="empty-fav-text">Ачивка "Сердцеед" пока не разблокирована. Чтобы получить ее, добавьте первую игру в избранное!</p>
            <button class="empty-fav-btn sales__btn" onclick="goToCatalog()">Перейти в каталог</button>
        </div> 
    `;
}

// Функция показа списка избранного
function showFavoritesList(favorites) {
    if (!contentElement) return;
    
    let html = '<div class="favorites-grid">';
    
    favorites.forEach(item => {
        // Экранируем ID для использования в JavaScript
        const escapedId = escapeJavaScriptString(item.id);
        
        html += `
            <div class="favorite-item sales__item" data-id="${escapeHTML(item.id)}">
                <div class="favorite-item__image sales__image">
                    <img class="sales__img" src="${escapeHTML(item.image)}" alt="${escapeHTML(item.imageAlt)}" onerror="this.src='/assets/image/placeholder.jpg'">
                    <button class="favorite-item__remove-btn" data-id="${escapeHTML(item.id)}">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19.4669 3.03245C19.6336 2.87111 19.7665 2.67808 19.8581 2.46463C19.9496 2.25118 19.9978 2.02159 19.9999 1.78924C20.002 1.55689 19.958 1.32645 19.8704 1.11136C19.7828 0.89626 19.6534 0.700822 19.4897 0.536444C19.326 0.372066 19.1312 0.24204 18.9169 0.153953C18.7026 0.0658657 18.4729 0.0214823 18.2413 0.023391C18.0096 0.0252998 17.7807 0.0734628 17.5679 0.16507C17.355 0.256678 17.1624 0.389895 17.0014 0.556949L10.0099 7.56815L3.02063 0.556949C2.86093 0.385025 2.66835 0.247129 2.45437 0.151487C2.24039 0.0558458 2.0094 0.00441788 1.77518 0.000272328C1.54096 -0.00387323 1.3083 0.0393486 1.09109 0.127358C0.873883 0.215368 0.676571 0.346364 0.510925 0.51253C0.345279 0.678696 0.214694 0.876627 0.12696 1.09452C0.0392254 1.31241 -0.0038611 1.5458 0.000271475 1.78075C0.00440405 2.01571 0.0556709 2.24743 0.151013 2.46208C0.246355 2.67673 0.383819 2.86992 0.555205 3.03012L7.5398 10.0436L0.550554 17.0548C0.242422 17.3866 0.0746724 17.8253 0.082646 18.2787C0.0906196 18.732 0.273694 19.1645 0.593299 19.4851C0.912904 19.8057 1.34409 19.9894 1.79601 19.9974C2.24792 20.0054 2.6853 19.8371 3.01598 19.528L10.0099 12.5168L16.9991 19.5303C17.3298 19.8394 17.7672 20.0077 18.2191 19.9997C18.671 19.9917 19.1022 19.8081 19.4218 19.4875C19.7414 19.1669 19.9245 18.7343 19.9325 18.281C19.9404 17.8276 19.7727 17.3889 19.4645 17.0572L12.48 10.0436L19.4669 3.03245Z" fill="#F7F7F7" />
                        </svg>
                    </button>
                </div>
                <p class="favorite-item__category sales__category">${escapeHTML(item.category || 'Категория не указана')}</p>
                <h3 class="favorite-item__title sales__item-title">${escapeHTML(item.title)}</h3>
                <div class="favorite-item__price sales__item-price">${escapeHTML(item.price)}</div>
                <button type="button" class="sales__btn favorite-item__cart-btn">
                    Добавить в корзину
                </button>
            </div>
        `;
    });
    
    html += '</div>';
    contentElement.innerHTML = html;
    
    // Добавляем обработчики событий после рендеринга
    addRemoveEventListeners();
}

// Функция для экранирования HTML
function escapeHTML(str) {
    if (!str) return '';
    return str.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
}

// Функция для экранирования JavaScript строк
function escapeJavaScriptString(str) {
    if (!str) return '';
    return str.toString()
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t');
}

// Добавляем обработчики событий для кнопок удаления
function addRemoveEventListeners() {
    const removeButtons = document.querySelectorAll('.favorite-item__remove-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.getAttribute('data-id');
            if (itemId) {
                removeFromFavorites(itemId);
            }
        });
    });
}

// Функция удаления из избранного
function removeFromFavorites(itemId) {
    let favorites = JSON.parse(localStorage.getItem('userFavorites')) || [];
    
    // Фильтруем массив, удаляя элемент с указанным ID
    favorites = favorites.filter(item => item.id !== itemId);
    
    // Сохраняем обновленный массив
    localStorage.setItem('userFavorites', JSON.stringify(favorites));
    
    // Показываем уведомление
    showNotification('Товар удален из избранного', 'info');
    
    // Обновляем отображение
    checkFavorites();
    
    // Обновляем счетчик в хедере
    if (window.favoritesCounter) {
        window.favoritesCounter.updateCounter();
    }
}
// Функция показа уведомления
function showNotification(message, type = 'info') {
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

// Вспомогательные функции
function goToCatalog() {
    window.location.href = 'catalog.html';
}

// Запускаем проверку при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    checkFavorites();
    
    // Инициализируем счетчик на странице избранного
    if (document.querySelector('.header__icons-fav')) {
        window.favoritesCounter = new FavoritesCounter();
    }
});