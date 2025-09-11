document.addEventListener('DOMContentLoaded', function() {
    // Аккордеоны
    document.querySelectorAll(".accordion-header").forEach((header) => {
      header.addEventListener("click", () => {
        const accordion = header.parentElement;
        const content = header.nextElementSibling;
        const icon = header.querySelector(".accordion-icon");

        accordion.classList.toggle("accordion-active");

        if (accordion.classList.contains("accordion-active")) {
          content.style.maxHeight = content.scrollHeight + "px";
          icon.classList.toggle("active")
        } else {
          content.style.maxHeight = "0";
          icon.classList.remove("active")
        }
      });
    });

    // Выбранные фильтры
    const selectedCategories = document.querySelector(".selected-categories");
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const productCards = document.querySelectorAll(".product-card");
    const priceApplyBtn = document.querySelector(".price-apply-btn");
    const resetFiltersBtn = document.querySelector(".reset-filters-btn");
    const priceMinInput = document.getElementById("price-min");
    const priceMaxInput = document.getElementById("price-max");
    const mobileApplyBtn = document.getElementById('mobileApplyFilters');

    let selectedFilters = new Set();
    let mobileSelectedFilters = new Set(); // Для мобильных устройств

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        const filterName = checkbox.parentElement.textContent.trim();
        const filterValue = checkbox.dataset.category || checkbox.dataset.year;
        const filterType = checkbox.dataset.category ? "category" : "year";

        const filterData = JSON.stringify({
          value: filterValue,
          name: filterName,
          type: filterType,
        });

        if (checkbox.checked) {
          if (isMobile()) {
            // На мобильных - добавляем во временное хранилище
            mobileSelectedFilters.add(filterData);
          } else {
            // На десктопе - сразу применяем
            selectedFilters.add(filterData);
            updateSelectedFilters();
            filterProducts();
          }
        } else {
          if (isMobile()) {
            mobileSelectedFilters.delete(filterData);
          } else {
            selectedFilters.delete(filterData);
            updateSelectedFilters();
            filterProducts();
          }
        }

        // Обновляем отображение выбранных фильтров на мобильных
        if (isMobile()) {
          updateMobileSelectedFilters();
        }
      });
    });

    // Функция проверки мобильного устройства
    function isMobile() {
      return window.innerWidth <= 768;
    }

    // Фильтр по цене
    if (priceApplyBtn) {
      priceApplyBtn.addEventListener("click", () => {
        filterProducts();
      });
    }

    function updateSelectedFilters() {
      if (!selectedCategories) return;
      
      selectedCategories.innerHTML = "";
      selectedFilters.forEach((filterStr) => {
        const filter = JSON.parse(filterStr);
        const filterTag = document.createElement("div");
        filterTag.className = "filter-tag";
        filterTag.innerHTML = `
              ${filter.name}
              <span class="remove-filter" data-value='${filter.value}' data-type='${filter.type}'>×</span>
            `;
        selectedCategories.appendChild(filterTag);
      });

      // Обработчики удаления фильтров
      document.querySelectorAll(".remove-filter").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const value = e.target.dataset.value;
          const type = e.target.dataset.type;

          // Находим и снимаем соответствующий чекбокс
          const selector =
            type === "year"
              ? `[data-year="${value}"]`
              : `[data-category="${value}"]`;
          const checkbox = document.querySelector(`input${selector}`);
          if (checkbox) {
            checkbox.checked = false;
            if (isMobile()) {
              mobileSelectedFilters.delete(JSON.stringify({
                value: value,
                name: checkbox.parentElement.textContent.trim(),
                type: type
              }));
              updateMobileSelectedFilters();
            } else {
              checkbox.dispatchEvent(new Event("change"));
            }
          }
        });
      });
    }

    // Обновление выбранных фильтров для мобильных (без применения)
    function updateMobileSelectedFilters() {
      if (!selectedCategories || !isMobile()) return;
      
      selectedCategories.innerHTML = "";
      mobileSelectedFilters.forEach((filterStr) => {
        const filter = JSON.parse(filterStr);
        const filterTag = document.createElement("div");
        filterTag.className = "filter-tag";
        filterTag.innerHTML = `
              ${filter.name}
              <span class="remove-filter" data-value='${filter.value}' data-type='${filter.type}'>×</span>
            `;
        selectedCategories.appendChild(filterTag);
      });

      // Обработчики удаления фильтров для мобильных
      document.querySelectorAll(".remove-filter").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const value = e.target.dataset.value;
          const type = e.target.dataset.type;

          const selector =
            type === "year"
              ? `[data-year="${value}"]`
              : `[data-category="${value}"]`;
          const checkbox = document.querySelector(`input${selector}`);
          if (checkbox) {
            checkbox.checked = false;
            mobileSelectedFilters.delete(JSON.stringify({
              value: value,
              name: checkbox.parentElement.textContent.trim(),
              type: type
            }));
            updateMobileSelectedFilters();
          }
        });
      });
    }

    // Применение фильтров на мобильных
    function applyMobileFilters() {
      selectedFilters = new Set(mobileSelectedFilters);
      updateSelectedFilters();
      filterProducts();
      closeFilter(); // Закрываем мобильный фильтр после применения
    }

    function filterProducts() {
      const minPrice = priceMinInput && priceMinInput.value ? parseInt(priceMinInput.value) : 0;
      const maxPrice = priceMaxInput && priceMaxInput.value
        ? parseInt(priceMaxInput.value)
        : Infinity;

      productCards.forEach((card) => {
        const cardPrice = parseInt(card.dataset.price);
        const cardCategories = card.dataset.category.split(" ");
        const cardYear = card.dataset.year;

        let matchesFilters = true;

        // Проверяем выбранные чекбоксы
        selectedFilters.forEach((filterStr) => {
          const filter = JSON.parse(filterStr);
          if (filter.type === "category") {
            if (!cardCategories.includes(filter.value)) {
              matchesFilters = false;
            }
          } else if (filter.type === "year") {
            if (cardYear !== filter.value) {
              matchesFilters = false;
            }
          }
        });

        // Проверяем цену
        if (cardPrice < minPrice || cardPrice > maxPrice) {
          matchesFilters = false;
        }

        card.style.display = matchesFilters ? "block" : "none";
      });

      // Обновляем сортировку после фильтрации
      sortProducts();
    }

    // Функция сброса фильтров
    function resetFilters() {
      // Сбрасываем чекбоксы
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
      });

      // Очищаем выбранные фильтры
      selectedFilters.clear();
      mobileSelectedFilters.clear();

      // Сбрасываем поля цены
      if (priceMinInput) priceMinInput.value = "";
      if (priceMaxInput) priceMaxInput.value = "";

      // Обновляем отображение
      updateSelectedFilters();
      if (isMobile()) {
        updateMobileSelectedFilters();
      }

      // Показываем все товары
      productCards.forEach((card) => {
        card.style.display = "block";
      });

      // Обновляем сортировку
      sortProducts();
    }

    // Обработчик кнопки сброса
    if (resetFiltersBtn) {
      resetFiltersBtn.addEventListener("click", resetFilters);
    }

    // Поиск товаров
    const searchInput = document.querySelector(".search-input");
    const searchBtn = document.querySelector(".search-btn");

    if (searchBtn) {
      searchBtn.addEventListener("click", performSearch);
    }
    if (searchInput) {
      searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          performSearch();
        }
      });
    }

    function performSearch() {
      const searchTerm = searchInput.value.toLowerCase().trim();

      productCards.forEach((card) => {
        const title = card
          .querySelector(".product-title")
          .textContent.toLowerCase();
        const isVisible = title.includes(searchTerm);

        card.style.display = isVisible ? "block" : "none";
      });

      // Обновляем сортировку после поиска
      sortProducts();
    }

    // Сортировка товаров
    const sortSelect = document.getElementById("sort-by");
    if (sortSelect) {
      sortSelect.addEventListener("change", sortProducts);
    }

    function sortProducts() {
      const sortValue = sortSelect ? sortSelect.value : 'default';
      const productsGrid = document.querySelector(".products-grid");
      if (!productsGrid) return;

      const products = Array.from(productCards).filter(
        (card) => card.style.display !== "none"
      );

      products.sort((a, b) => {
        switch (sortValue) {
          case "price-asc":
            return parseInt(a.dataset.price) - parseInt(b.dataset.price);
          case "price-desc":
            return parseInt(b.dataset.price) - parseInt(a.dataset.price);
          case "rating":
            return parseInt(b.dataset.rating) - parseInt(a.dataset.rating);
          case "newest":
            return parseInt(b.dataset.year) - parseInt(a.dataset.year);
          case "popular":
            return Math.random() - 0.5;
          default:
            return 0;
        }
      });

      // Переставляем товары
      products.forEach((product) => {
        productsGrid.appendChild(product);
      });
    }

    // Добавление в корзину
    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    addToCartButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.stopPropagation();
        const productCard = button.closest(".product-card");
        const productName = productCard.querySelector(".product-title").textContent;

        button.textContent = "Добавлено ✓";
        button.style.background = "#28a745";

        setTimeout(() => {
          button.textContent = "В корзину";
          button.style.background = "";
        }, 2000);

        console.log(`Товар "${productName}" добавлен в корзину`);
      });
    });

    // Клик по карточке товара
    productCards.forEach((card) => {
      card.addEventListener("click", () => {
        const productName = card.querySelector(".product-title").textContent;
        console.log(`Переход на страницу товара: ${productName}`);
      });
    });

    // Category slider
    const categorySlider = document.querySelector('.category__inner');
    if (categorySlider) {
      // ... (остальной код слайдера без изменений)
    }

    // ============== MOBILE FILTER =================
    console.log('Загрузка мобильного фильтра...');
    
    // Находим элементы
    const filterBtn = document.getElementById('filterToggleBtn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const closeBtn = document.getElementById('closeSidebar');
    
    if (filterBtn && sidebar && overlay && closeBtn && mobileApplyBtn) {
      console.log('Все элементы фильтра найдены');

      // Функция открытия фильтра
      function openFilter() {
        console.log('Открытие фильтра');
        sidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // При открытии синхронизируем мобильные фильтры с текущими
        if (isMobile()) {
          mobileSelectedFilters = new Set(selectedFilters);
          updateMobileSelectedFilters();
        }
      }

      // Функция закрытия фильтра
      function closeFilter() {
        console.log('Закрытие фильтра');
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // При закрытии без применения - восстанавливаем чекбоксы
        if (isMobile()) {
          syncCheckboxesWithSelectedFilters();
        }
      }

      // Синхронизация чекбоксов с выбранными фильтрами
      function syncCheckboxesWithSelectedFilters() {
        checkboxes.forEach(checkbox => {
          const filterValue = checkbox.dataset.category || checkbox.dataset.year;
          const filterType = checkbox.dataset.category ? "category" : "year";
          
          const filterExists = Array.from(selectedFilters).some(filterStr => {
            const filter = JSON.parse(filterStr);
            return filter.value === filterValue && filter.type === filterType;
          });
          
          checkbox.checked = filterExists;
        });
      }

      // Вешаем обработчики
      filterBtn.addEventListener('click', openFilter);
      closeBtn.addEventListener('click', closeFilter);
      overlay.addEventListener('click', closeFilter);
      mobileApplyBtn.addEventListener('click', applyMobileFilters);

      // Закрытие по ESC
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
          closeFilter();
        }
      });

      // Закрытие при ресайзе на десктоп
      window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && sidebar.classList.contains('active')) {
          closeFilter();
        }
      });

      console.log('Мобильный фильтр инициализирован');
    }

    // Проверка видимости кнопки фильтра
    function checkFilterButton() {
      const filterBtn = document.getElementById('filterToggleBtn');
      const mobileApplyBtn = document.getElementById('mobileApplyFilters');
      
      if (filterBtn) {
        filterBtn.style.display = isMobile() ? 'flex' : 'none';
      }
      
      if (mobileApplyBtn) {
        mobileApplyBtn.style.display = isMobile() ? 'block' : 'none';
      }
    }

    // Проверяем при загрузке и изменении размера
    checkFilterButton();
    window.addEventListener('resize', function() {
      checkFilterButton();
      
      // При изменении размера переключаем режим работы фильтров
      if (!isMobile()) {
        // Если перешли на десктоп - применяем мобильные фильтры
        if (mobileSelectedFilters.size > 0) {
          selectedFilters = new Set(mobileSelectedFilters);
          updateSelectedFilters();
          filterProducts();
          mobileSelectedFilters.clear();
        }
      }
    });
});