// cart.js - полный код для страницы корзины
document.addEventListener('DOMContentLoaded', function() {
    initializeCart();
    setupEventListeners();
});

function initializeCart() {
    const cartItems = window.cartService.getCartItems();
    
    if (cartItems.length === 0) {
        showEmptyCart();
    } else {
        renderCartItems(cartItems);
        updateCartSummary(cartItems);
    }
}

function setupEventListeners() {
    // Обработчики для кнопок управления
    const selectAllBtn = document.querySelector('.card__grid-btns-pickall');
    const removeSelectedBtn = document.querySelector('.card__grid-btns-remove');
    const clearCartBtn = document.querySelector('.cart__grid-clear');
    
    if (selectAllBtn) selectAllBtn.addEventListener('click', toggleSelectAll);
    if (removeSelectedBtn) removeSelectedBtn.addEventListener('click', removeSelectedItems);
    if (clearCartBtn) clearCartBtn.addEventListener('click', clearCart);
    
    // Обработчики для элементов корзины
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('cart__grid-amount-plus')) {
            increaseQuantity(e.target);
        } else if (e.target.classList.contains('cart__grid-amount-minus')) {
            decreaseQuantity(e.target);
        } else if (e.target.classList.contains('cart__grid-fav-btn')) {
            toggleFavorite(e.target);
        } else if (e.target.classList.contains('cart__grid-remove-btn')) {
            removeSingleItem(e.target);
        }
    });
    
    // Обработчик для чекбоксов
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('checkbox-input')) {
            updateItemSelection(e.target);
        }
    });
}

function updateItemSelection(checkbox) {
    const items = window.cartService.getCartItems();
    const itemElement = checkbox.closest('.cart__grid-item');
    if (itemElement) {
        const itemId = itemElement.dataset.id;
        const itemIndex = items.findIndex(item => item.id === itemId);
        
        if (itemIndex !== -1) {
            items[itemIndex].selected = checkbox.checked;
            window.cartService.saveCartItems(items);
            updateCartSummary(items);
        }
    }
}

function showEmptyCart() {
    const cartGrid = document.querySelector('.cart__grid');
    if (cartGrid) {
        cartGrid.innerHTML = `
            <div class="empty-state">
                <p class="empty-cart-text">
                    Ачивка "Покупатель" еще не разблокирована. Для ее разблокировки
                    нужно добавь первый товар в корзину!
                </p>
                <button class="empty-cart-btn sales__btn" onclick="goToCatalog()">
                    Перейти в каталог
                </button>
            </div>
        `;
    }
    
    const sidebar = document.querySelector('.cart__sidebar');
    if (sidebar) {
        sidebar.style.display = 'none';
    }
}

function renderCartItems(items) {
    const cartList = document.querySelector('.cart__grid-list');
    if (!cartList) return;
    
    cartList.innerHTML = items.map(item => `
        <li class="cart__grid-item" data-id="${item.id}">
            <div class="cart__grid-item-left">
                <label class="custom-checkbox">
                    <input type="checkbox" class="checkbox-input" ${item.selected ? 'checked' : ''}>
                    <div class="card__grid-left-checkbox"></div>
                </label>
                <div class="card__grid-left-img">
                    <img width="100" height="100" src="${item.image}" alt="${item.title}">
                </div>
                <div class="card__grid-left-name">
                    <h3 class="card__grid-name-title">${item.title}</h3>
                    <p class="card__grid-name-category sales__category">
                        ${item.category} <span class="point">·</span> ${item.genre}
                    </p>
                </div>
            </div>
            <div class="cart__grid-item-right">
                <div class="cart__grid-right-contols">
                    <div class="cart__grid-controls-amount">
                        <div class="cart__grid-amount-minus">-</div>
                        <div class="cart__grid-anount-input">${item.quantity}</div>
                        <div class="cart__grid-amount-plus">+</div>
                    </div>
                    <div class="cart__grid-fav-btn">
                        <svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.351 3.85221C18.261 1.58123 15.2808 1.6522 13.2346 3.49311C12.8922 3.7987 12.4552 3.96681 12.0031 3.96681C11.5509 3.96681 11.1139 3.7987 10.7715 3.49311C8.72667 1.65078 5.74377 1.58265 3.65643 3.85221C2.43996 5.46035 2.01618 6.94358 2.06007 8.30475C2.10532 9.69857 2.6443 11.0839 3.54946 12.4521C5.38034 15.2241 8.51958 17.6612 11.1706 19.5958C11.4139 19.7742 11.7048 19.87 12.0031 19.87C12.3013 19.87 12.5922 19.7742 12.8355 19.5958C15.4673 17.6711 18.6066 15.2327 20.4429 12.4592C21.3495 11.0881 21.8926 9.69999 21.9392 8.30617C21.9872 6.94358 21.5661 5.45893 20.351 3.85221ZM12.0031 1.78278C14.8351 -0.664197 19.0221 -0.723811 21.8802 2.42717L21.9104 2.46124L21.9378 2.49672C23.4327 4.45544 24.0635 6.43545 23.995 8.3814C23.9291 10.3046 23.1858 12.0803 22.1394 13.6614C20.0672 16.7954 16.6262 19.4311 14.0232 21.3345C12.8095 22.2216 11.198 22.2216 9.98428 21.3359C7.36345 19.4226 3.91975 16.7854 1.85161 13.6543C0.806564 12.0732 0.0673542 10.299 0.00426865 8.37714C-0.0588188 6.43261 0.574791 4.45544 2.06967 2.49672L2.09709 2.46124L2.12727 2.42717C4.98399 -0.723811 9.17376 -0.664197 12.0031 1.78278Z" fill="${item.isFavorite ? 'url(#heart-gradient)' : '#F7F7F7'}"/>
                        </svg>
                    </div>
                    <div class="cart__grid-remove-btn">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19.4669 3.03245C19.6336 2.87111 19.7665 2.67808 19.8581 2.46463C19.9496 2.25118 19.9978 2.02159 19.9999 1.78924C20.002 1.55689 19.958 1.32645 19.8704 1.11136C19.7828 0.89626 19.6534 0.700822 19.4897 0.536444C19.326 0.372066 19.1312 0.24204 18.9169 0.153953C18.7026 0.0658657 18.4729 0.0214823 18.2413 0.023391C18.0096 0.0252998 17.7807 0.0734628 17.5679 0.16507C17.355 0.256678 17.1624 0.389895 17.0014 0.556949L10.0099 7.56815L3.02063 0.556949C2.86093 0.385025 2.66835 0.247129 2.45437 0.151487C2.24039 0.0558458 2.0094 0.00441788 1.77518 0.000272328C1.54096 -0.00387323 1.3083 0.0393486 1.09109 0.127358C0.873883 0.215368 0.676571 0.346364 0.510925 0.51253C0.345279 0.678696 0.214694 0.876627 0.12696 1.09452C0.0392254 1.31241 -0.0038611 1.5458 0.000271475 1.78075C0.00440405 2.01571 0.0556709 2.24743 极寒之地 2.46208C0.246355 2.67673 0.383819 2.86992 0.555205 3.03012L7.5398 10.0436L0.550554 17.0548C0.242422 17.3866 0.0746724 极寒之地 0.082646 18.2787C0.0906196 18.732 0.273694 19.1645 0.593299 19.4851C0.912904 19.8057 1.34409 19.9894 1.79601 19.9974C2.24792 20.0054 2.6853 19.8371 3.01598 19.528L10.0099 12.5168L16.9991 19.5303C17.3298 19.8394 17.7672 20.0077 18.2191 19.9997C18.671 19.9917 19.1022 19.8081 19.4218 19.4875C19.7414 19.1669 19.9245 18.7343 19.9325 18.281C19.9404 17.8276 19.7727 17.3889 19.4645 17.0572L12.48 10.0436L19.4669 3.03245Z" fill="#F7F7F7"/>
                        </svg>
                    </div>
                </div>
                <div class="cart__grid-item-price">${(item.price * item.quantity).toLocaleString('ru-RU')} ₽</div>
            </div>
        </li>
    `).join('');
    
    const sidebar = document.querySelector('.cart__sidebar');
    if (sidebar) {
        sidebar.style.display = 'block';
    }
}

function updateCartSummary(items) {
    const selectedItems = items.filter(item => item.selected);
    const totalItems = selectedItems.length;
    const totalPrice = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = selectedItems.reduce((sum, item) => sum + (item.originalPrice - item.price) * item.quantity, 0);
    const originalTotal = selectedItems.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0);
    
    const summaryElement = document.querySelector('.cart__sidebar-order');
    if (summaryElement) {
        summaryElement.innerHTML = `
            <div class="cart__sidebar-order-inner">
                <div class="cart__sidebar-order-wrapper">
                    <div class="cart__sidebar-order-inner-sum">
                        <div class="cart__sidebar-sum-text">Товаров без учета скидки (${totalItems} шт)</div>
                        <div class="cart__sidebar-sum-price">${originalTotal.toLocaleString('ru-RU')} ₽</div>
                    </div>
                    <div class="cart__sidebar-order-inner-discount">
                        <div class="cart__sidebar-discount-text">Скидка</div>
                        <div class="cart__sidebar-discount-price">${discount.toLocaleString('ru-RU')} ₽</div>
                    </div>
                </div>
                <div class="cart__sidebar-order-total">
                    <div class="cart__sidebar-order-total-inner">
                        <div class="cart__sidebar-order-total-text">ИТОГО</div>
                        <div class="cart__sidebar-order-total-price">${totalPrice.toLocaleString('ru-RU')} ₽</div>
                    </div>
                    <button type="button" class="cart__sidebar-order-total-btn sales__btn">
                        Оформить заказ
                    </button>
                </div>
            </div>
        `;
    }
}

function toggleSelectAll() {
    const checkboxes = document.querySelectorAll('.checkbox-input');
    const items = window.cartService.getCartItems();
    const allSelected = Array.from(checkboxes).every(checkbox => checkbox.checked);
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = !allSelected;
    });
    
    items.forEach(item => {
        item.selected = !allSelected;
    });
    
    window.cartService.saveCartItems(items);
    updateCartSummary(items);
}

function removeSelectedItems() {
    const items = window.cartService.getCartItems();
    const remainingItems = items.filter(item => !item.selected);
    
    window.cartService.saveCartItems(remainingItems);
    
    if (remainingItems.length === 0) {
        showEmptyCart();
    } else {
        renderCartItems(remainingItems);
        updateCartSummary(remainingItems);
    }
}

function clearCart() {
    if (confirm('Вы уверены, что хотите очистить корзину?')) {
        window.cartService.clearCart();
        showEmptyCart();
    }
}

function increaseQuantity(button) {
    const itemElement = button.closest('.cart__grid-item');
    const itemId = itemElement.dataset.id;
    const quantityElement = itemElement.querySelector('.cart__grid-anount-input');
    
    let items = window.cartService.getCartItems();
    const itemIndex = items.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        items[itemIndex].quantity += 1;
        quantityElement.textContent = items[itemIndex].quantity;
        
        const priceElement = itemElement.querySelector('.cart__grid-item-price');
        priceElement.textContent = (items[itemIndex].price * items[itemIndex].quantity).toLocaleString('ru-RU') + ' ₽';
        
        window.cartService.saveCartItems(items);
        updateCartSummary(items);
    }
}

function decreaseQuantity(button) {
    const itemElement = button.closest('.cart__grid-item');
    const itemId = itemElement.dataset.id;
    const quantityElement = itemElement.querySelector('.cart__grid-anount-input');
    
    let items = window.cartService.getCartItems();
    const itemIndex = items.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1 && items[itemIndex].quantity > 1) {
        items[itemIndex].quantity -= 1;
        quantityElement.textContent = items[itemIndex].quantity;
        
        const priceElement = itemElement.querySelector('.cart__grid-item-price');
        priceElement.textContent = (items[itemIndex].price * items[itemIndex].quantity).toLocaleString('ru-RU') + ' ₽';
        
        window.cartService.saveCartItems(items);
        updateCartSummary(items);
    }
}

function toggleFavorite(button) {
    const itemElement = button.closest('.cart__grid-item');
    const itemId = itemElement.dataset.id;
    
    let items = window.cartService.getCartItems();
    const itemIndex = items.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        items[itemIndex].isFavorite = !items[itemIndex].isFavorite;
        window.cartService.saveCartItems(items);
        
        const heartIcon = button.querySelector('path');
        heartIcon.setAttribute('fill', items[itemIndex].isFavorite ? 'url(#heart-gradient)' : '#F7F7F7');
    }
}

function removeSingleItem(button) {
    const itemElement = button.closest('.cart__grid-item');
    const itemId = itemElement.dataset.id;
    
    let items = window.cartService.getCartItems();
    const remainingItems = items.filter(item => item.id !== itemId);
    
    window.cartService.saveCartItems(remainingItems);
    
    if (remainingItems.length === 0) {
        showEmptyCart();
    } else {
        renderCartItems(remainingItems);
        updateCartSummary(remainingItems);
    }
}

// Глобальные функции
window.goToCatalog = function() {
    window.location.href = '/catalog.html';
};

// Инициализация счетчика при загрузке
window.cartService.updateCartCounter();