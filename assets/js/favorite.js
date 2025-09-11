// Получаем элемент для контента
const contentElement = document.getElementById("favorites-content");

// Глобальные переменные для пагинации
let currentPage = 1;
const ITEMS_PER_PAGE = 8;

// Функция для проверки пустого состояния
function checkFavorites() {
  if (!contentElement) return;

  // Получаем избранное из localStorage (используем ключ 'userFavorites')
  const favorites = JSON.parse(localStorage.getItem("userFavorites")) || [];
  const totalPages = Math.ceil(favorites.length / ITEMS_PER_PAGE);
  
  // Сбрасываем на первую страницу если текущая страница не существует
  if (currentPage > totalPages && totalPages > 0) {
      currentPage = totalPages;
  }

  // Управляем видимостью элемента удаления
  toggleFavoriteRemoveElement(favorites.length > 0);

  if (favorites.length === 0) {
    showEmptyState();
  } else {
    showFavoritesList(favorites);
  }
}

// Обновите функцию удаления одного товара
function removeFromFavorites(itemId) {
  let favorites = JSON.parse(localStorage.getItem("userFavorites")) || [];

  // Фильтруем массив, удаляя элемент с указанным ID
  favorites = favorites.filter((item) => item.id !== itemId);

  // Сохраняем обновленный массив
  localStorage.setItem("userFavorites", JSON.stringify(favorites));
  
  const hasItems = favorites.length > 0;
  
  // Обновляем видимость кнопки удаления всех
  toggleFavoriteRemoveElement(hasItems);
  
  // Пересчитываем текущую страницу
  const totalPages = Math.ceil(favorites.length / ITEMS_PER_PAGE);
  if (currentPage > totalPages && totalPages > 0) {
      currentPage = totalPages;
  }

  // Показываем уведомление
  showNotification("Товар удален из избранного", "info");

  // Обновляем отображение
  checkFavorites();

  // Обновляем счетчик в хедере
  if (window.favoritesCounter) {
    window.favoritesCounter.updateCounter();
  }
}

// Функция для показа/скрытия элемента favorite__remove
function toggleFavoriteRemoveElement(show) {
  const favoriteRemoveElement = document.querySelector('.favorite__remove');
  if (favoriteRemoveElement) {
      favoriteRemoveElement.style.display = show ? 'flex' : 'none';
      
      // Добавляем обработчик события только если элемент видим
      if (show) {
          addRemoveAllEventListener();
      }
  }
}

// Добавление обработчика для кнопки удаления всех товаров
function addRemoveAllEventListener() {
  const removeAllBtn = document.querySelector('.favorite__remove');
  if (removeAllBtn) {
      // Удаляем старый обработчик чтобы избежать дублирования
      removeAllBtn.removeEventListener('click', removeAllFavorites);
      // Добавляем новый обработчик
      removeAllBtn.addEventListener('click', removeAllFavorites);
  }
}

// Функция удаления всех товаров из избранного
function removeAllFavorites() {
  // Подтверждение действия
  if (!confirm('Вы уверены, что хотите удалить все товары из избранного?')) {
      return;
  }
  
  // Очищаем localStorage
  localStorage.removeItem("userFavorites");
  
  // Сбрасываем текущую страницу
  currentPage = 1;
  
  // Скрываем элемент управления
  toggleFavoriteRemoveElement(false);
  
  // Показываем уведомление
  showNotification("Все товары удалены из избранного", "info");
  
  // Показываем пустое состояние
  showEmptyState();
  
  // Обновляем счетчик в хедере
  if (window.favoritesCounter) {
      window.favoritesCounter.updateCounter();
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

  const totalPages = Math.ceil(favorites.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, favorites.length);
  const currentItems = favorites.slice(startIndex, endIndex);

  let html = '<div class="favorites-grid">';

  currentItems.forEach((item) => {
    html += `
            <div class="favorite-item sales__item" data-id="${escapeHTML(
              item.id
            )}">
                <div class="favorite-item__image sales__image">
                    <img class="sales__img fav__img" src="${escapeHTML(
                      item.image
                    )}" alt="${escapeHTML(
      item.imageAlt
    )}" onerror="this.src='/assets/image/placeholder.jpg'">
                    <button class="favorite-item__remove-btn" data-id="${escapeHTML(
                      item.id
                    )}">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19.4669 3.03245C19.6336 2.87111 19.7665 2.67808 19.8581 2.46463C19.9496 2.25118 19.9978 2.02159 19.9999 1.78924C20.002 1.55689 19.958 1.32645 19.8704 1.11136C19.7828 0.89626 19.6534 0.700822 19.4897 0.536444C19.326 0.372066 19.1312 0.24204 18.9169 0.153953C18.7026 0.0658657 18.4729 0.0214823 18.2413 0.023391C18.0096 0.0252998 17.7807 0.0734628 17.5679 0.16507C17.355 0.256678 17.1624 0.389895 17.0014 0.556949L10.0099 7.56815L3.02063 0.556949C2.86093 0.385025 2.66835 0.247129 2.45437 0.151487C2.24039 0.0558458 2.0094 0.00441788 1.77518 0.000272328C1.54096 -0.00387323 1.3083 0.0393486 1.09109 0.127358C0.873883 0.215368 0.676571 0.346364 0.510925 0.51253C0.345279 0.678696 0.214694 0.876627 0.12696 1.09452C0.0392254 1.31241 -0.0038611 1.5458 0.000271475 1.78075C0.00440405 2.01571 0.0556709 2.24743 0.151013 2.46208C0.246355 2.67673 0.383819 2.86992 0.555205 3.03012L7.5398 10.0436L0.550554 17.0548C0.242422 17.3866 0.0746724 17.8253 0.082646 18.2787C0.0906196 18.732 0.273694 19.1645 0.593299 19.4851C0.912904 19.8057 1.34409 19.9894 1.79601 19.9974C2.24792 20.0054 2.6853 19.8371 3.01598 19.528L10.0099 12.5168L16.9991 19.5303C17.3298 19.8394 17.7672 20.0077 18.2191 19.9997C18.671 19.9917 19.1022 19.8081 19.4218 19.4875C19.7414 19.1669 19.9245 18.7343 19.9325 18.281C19.9404 17.8276 19.7727 17.3889 19.4645 17.0572L12.48 10.0436L19.4669 3.03245Z" fill="#F7F7F7" />
                        </svg>
                    </button>
                </div>
                <p class="favorite-item__category sales__category">${escapeHTML(
                  item.category || "Категория не указана"
                )}</p>
                <h3 class="favorite-item__title sales__item-title">${escapeHTML(
                  item.title
                )}</h3>
                <div class="favorite-item__price sales__item-price">${escapeHTML(
                  item.price
                )}</div>
                <button type="button" class="sales__btn favorite-item__cart-btn">
                    Добавить в корзину
                </button>
            </div>
        `;
  });

  html += "</div>";
  
  // Добавляем пагинацию если нужно (больше одной страницы)
  if (totalPages > 1) {
    html += generatePagination(totalPages, favorites.length);
  }
  
  contentElement.innerHTML = html;

  // Добавляем обработчики событий после рендеринга
  addRemoveEventListeners();
  addPaginationEventListeners();
}

// Генерация пагинации
function generatePagination(totalPages, totalItems) {
  return `
      <div class="favorite-pagination">
          <div class="favorite-pagination-info">
            В избранном ${totalItems} товаров
          </div>
          <div class ="favorite-pagination-wrapper">
          <button class="pagination-btn pagination-prev" ${currentPage === 1 ? 'disabled' : ''}>
            <svg width="13" height="23" viewBox="0 0 13 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.43934 12.5607C-0.146447 11.9749 -0.146447 11.0251 0.43934 10.4393L9.98528 0.893398C10.5711 0.307611 11.5208 0.307611 12.1066 0.893398C12.6924 1.47919 12.6924 2.42893 12.1066 3.01472L3.62132 11.5L12.1066 19.9853C12.6924 20.5711 12.6924 21.5208 12.1066 22.1066C11.5208 22.6924 10.5711 22.6924 9.98528 22.1066L0.43934 12.5607ZM2.5 11.5V13H1.5V11.5V10H2.5V11.5Z" fill="#F7F7F7" />
            </svg>
          </button>
          
          <div class="pagination-pages">
              ${generatePageNumbers(totalPages)}
          </div>
          
          <button class="pagination-btn pagination-next" ${currentPage === totalPages ? 'disabled' : ''}>
              <svg width="13" height="23" viewBox="0 0 13 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.5607 12.5607C13.1464 11.9749 13.1464 11.0251 12.5607 10.4393L3.01472 0.893398C2.42893 0.307611 1.47919 0.307611 0.893398 0.893398C0.307611 1.47919 0.307611 2.42893 0.893398 3.01472L9.37868 11.5L0.893398 19.9853C0.307611 20.5711 0.307611 21.5208 0.893398 22.1066C1.47919 22.6924 2.42893 22.6924 3.01472 22.1066L12.5607 12.5607ZM10.5 11.5V13H11.5V11.5V10H10.5V11.5Z" fill="#F7F7F7" />
              </svg>
          </button>
          </div>
      </div>
  `;
}

// Генерация номеров страниц
function generatePageNumbers(totalPages) {
  let pagesHTML = '';
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  
  // Первая страница
  if (startPage > 1) {
      pagesHTML += `<button class="pagination-page" data-page="1">1</button>`;
      if (startPage > 2) {
          pagesHTML += `<span class="pagination-dots">...</span>`;
      }
  }
  
  // Видимые страницы
  for (let i = startPage; i <= endPage; i++) {
      pagesHTML += `<button class="pagination-page ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
  }
  
  // Последняя страница
  if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
          pagesHTML += `<span class="pagination-dots">...</span>`;
      }
      pagesHTML += `<button class="pagination-page" data-page="${totalPages}">${totalPages}</button>`;
  }
  
  return pagesHTML;
}

// Добавление обработчиков для пагинации
function addPaginationEventListeners() {
  // Кнопки вперед/назад
  document.querySelectorAll('.pagination-prev, .pagination-next').forEach(btn => {
      btn.addEventListener('click', function() {
          if (this.classList.contains('pagination-prev')) {
              goToPage(currentPage - 1);
          } else {
              goToPage(currentPage + 1);
          }
      });
  });
  
  // Номера страниц
  document.querySelectorAll('.pagination-page').forEach(btn => {
      btn.addEventListener('click', function() {
          const page = parseInt(this.getAttribute('data-page'));
          goToPage(page);
      });
  });
}

// Переход на страницу
function goToPage(page) {
  const favorites = JSON.parse(localStorage.getItem('userFavorites')) || [];
  const totalPages = Math.ceil(favorites.length / ITEMS_PER_PAGE);
  
  if (page >= 1 && page <= totalPages) {
      currentPage = page;
      checkFavorites();
      
      // Прокрутка к верху страницы
      window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// Функция для экранирования HTML
function escapeHTML(str) {
  if (!str) return "";
  return str
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

// Добавляем обработчики событий для кнопок удаления
function addRemoveEventListeners() {
  const removeButtons = document.querySelectorAll(".favorite-item__remove-btn");
  removeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const itemId = this.getAttribute("data-id");
      if (itemId) {
        removeFromFavorites(itemId);
      }
    });
  });
}

// Функция удаления из избранного
function removeFromFavorites(itemId) {
  let favorites = JSON.parse(localStorage.getItem("userFavorites")) || [];

  // Фильтруем массив, удаляя элемент с указанным ID
  favorites = favorites.filter((item) => item.id !== itemId);

  // Сохраняем обновленный массив
  localStorage.setItem("userFavorites", JSON.stringify(favorites));
  
  const hasItems = favorites.length > 0;
  
  toggleFavoriteRemoveElement(hasItems);
  
  // Пересчитываем текущую страницу
  const totalPages = Math.ceil(favorites.length / ITEMS_PER_PAGE);
  if (currentPage > totalPages && totalPages > 0) {
      currentPage = totalPages;
  }

  // Показываем уведомление
  showNotification("Товар удален из избранного", "info");

  // Обновляем отображение
  checkFavorites();

  // Обновляем счетчик в хедере
  if (window.favoritesCounter) {
    window.favoritesCounter.updateCounter();
  }
  
  // Если товаров не осталось, показываем пустое состояние
  if (!hasItems) {
      showEmptyState();
  }
}

// Функция показа уведомления
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === "success" ? "#4CAF50" : "#2196F3"};
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
    notification.style.opacity = "1";
    notification.style.transform = "translateX(0)";
  }, 100);

  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transform = "translateX(100px)";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Вспомогательные функции
function goToCatalog() {
  window.location.href = "catalog.html";
}

// Запускаем проверку при загрузке страницы
document.addEventListener("DOMContentLoaded", function () {
  // Сразу скрываем элементы управления
  toggleFavoriteRemoveElement(false);
  
  checkFavorites();

  // Инициализируем счетчик на странице избранного
  if (document.querySelector(".header__icons-fav")) {
    window.favoritesCounter = new FavoritesCounter();
  }
});