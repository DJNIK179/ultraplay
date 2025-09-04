// Аккордеоны
document.querySelectorAll(".accordion-header").forEach((header) => {
  header.addEventListener("click", () => {
    const accordion = header.parentElement;
    const content = header.nextElementSibling;
    const icon = header.querySelector(".accordion-icon");

    accordion.classList.toggle("accordion-active");

    if (accordion.classList.contains("accordion-active")) {
      content.style.maxHeight = content.scrollHeight + "px";
      icon.textContent = "-";
    } else {
      content.style.maxHeight = "0";
      icon.textContent = "+";
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

let selectedFilters = new Set();

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    const filterName = checkbox.parentElement.textContent.trim();
    const filterValue = checkbox.dataset.category || checkbox.dataset.year;
    const filterType = checkbox.dataset.category ? "category" : "year";

    if (checkbox.checked) {
      selectedFilters.add(
        JSON.stringify({
          value: filterValue,
          name: filterName,
          type: filterType,
        })
      );
    } else {
      selectedFilters.delete(
        JSON.stringify({
          value: filterValue,
          name: filterName,
          type: filterType,
        })
      );
    }

    updateSelectedFilters();
    filterProducts();
  });
});

// Фильтр по цене
priceApplyBtn.addEventListener("click", () => {
  filterProducts();
});

function updateSelectedFilters() {
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
        checkbox.dispatchEvent(new Event("change"));
      }
    });
  });
}

function filterProducts() {
  const minPrice = priceMinInput.value ? parseInt(priceMinInput.value) : 0;
  const maxPrice = priceMaxInput.value
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
}

// Функция сброса фильтров
function resetFilters() {
  // Сбрасываем чекбоксы
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });

  // Очищаем выбранные фильтры
  selectedFilters.clear();

  // Сбрасываем поля цены
  priceMinInput.value = "";
  priceMaxInput.value = "";

  // Обновляем отображение
  updateSelectedFilters();

  // Показываем все товары
  productCards.forEach((card) => {
    card.style.display = "block";
  });
}

// Обработчик кнопки сброса
resetFiltersBtn.addEventListener("click", resetFilters);

// Поиск товаров
const searchInput = document.querySelector(".search-input");
const searchBtn = document.querySelector(".search-btn");

searchBtn.addEventListener("click", performSearch);
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    performSearch();
  }
});

function performSearch() {
  const searchTerm = searchInput.value.toLowerCase().trim();

  productCards.forEach((card) => {
    const title = card
      .querySelector(".product-title")
      .textContent.toLowerCase();
    const isVisible = title.includes(searchTerm);

    if (isVisible) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

// Сортировка товаров
const sortSelect = document.getElementById("sort-by");
sortSelect.addEventListener("change", sortProducts);

function sortProducts() {
  const sortValue = sortSelect.value;
  const productsGrid = document.querySelector(".products-grid");
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
