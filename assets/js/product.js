document.addEventListener('DOMContentLoaded', function() {
    const sliderList = document.getElementById('sliderList');
    const prevBtn = document.querySelector('.product__left-slider-prev');
    const nextBtn = document.querySelector('.product__left-slider-next');
    const items = sliderList.querySelectorAll('.product__left-slider-item');
    
    // Определяем, является ли устройство мобильным
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    
    // Количество видимых элементов в зависимости от устройства
    const VISIBLE_ITEMS = isMobile ? 2 : 3;
    let currentPosition = 0;
    
    // Размер элемента + отступ
    const itemSize = 81 + 30; // 81px + gap 30px
    
    // Функция для обновления состояния кнопок
    function updateButtons() {
        prevBtn.classList.toggle('disabled', currentPosition === 0);
        nextBtn.classList.toggle('disabled', currentPosition >= items.length - VISIBLE_ITEMS);
    }
    
    // Функция для обновления видимых слайдов
    function updateVisibleSlides() {
        items.forEach((item, index) => {
            if (index >= currentPosition && index < currentPosition + VISIBLE_ITEMS) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // Обновляем позицию слайдера в зависимости от устройства
        if (isMobile) {
            // Горизонтальный слайдер для мобильных
            sliderList.style.transform = `translateX(-${currentPosition * itemSize}px)`;
        } else {
            // Вертикальный слайдер для десктопа (оригинальный функционал)
            sliderList.style.transform = `translateY(-${currentPosition * itemSize}px)`;
        }
        
        updateButtons();
    }
    
    // Обработчики кликов
    nextBtn.addEventListener('click', function() {
        if (!this.classList.contains('disabled') && currentPosition < items.length - VISIBLE_ITEMS) {
            currentPosition++;
            updateVisibleSlides();
        }
    });
    
    prevBtn.addEventListener('click', function() {
        if (!this.classList.contains('disabled') && currentPosition > 0) {
            currentPosition--;
            updateVisibleSlides();
        }
    });
    
    // Обработчик для тач-устройств
    let startX, startY;
    const wrapper = document.querySelector('.product__left-slider-wrapper');
    
    wrapper.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    wrapper.addEventListener('touchend', function(e) {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        if (isMobile) {
            // Горизонтальный свайп для мобильных
            if (Math.abs(diffX) > 30 && Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > 0 && !nextBtn.classList.contains('disabled')) {
                    currentPosition++;
                } else if (diffX < 0 && !prevBtn.classList.contains('disabled')) {
                    currentPosition--;
                }
                updateVisibleSlides();
            }
        } else {
            // Вертикальный свайп для десктопа (оригинальная логика)
            if (Math.abs(diffY) > 50) {
                if (diffY > 0 && !nextBtn.classList.contains('disabled')) {
                    currentPosition++;
                } else if (diffY < 0 && !prevBtn.classList.contains('disabled')) {
                    currentPosition--;
                }
                updateVisibleSlides();
            }
        }
    });
    
    // Обработчик изменения размера окна
    window.addEventListener('resize', function() {
        // При изменении размера перезагружаем страницу для применения правильных стилей
        if (!this.resizeTimeout) {
            this.resizeTimeout = setTimeout(function() {
                this.resizeTimeout = null;
                location.reload();
            }, 200);
        }
    });
    
    // Инициализация
    updateVisibleSlides();
});