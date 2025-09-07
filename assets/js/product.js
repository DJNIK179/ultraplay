        document.addEventListener('DOMContentLoaded', function() {
            const sliderList = document.getElementById('sliderList');
            const prevBtn = document.querySelector('.product__left-slider-prev');
            const nextBtn = document.querySelector('.product__left-slider-next');
            const items = sliderList.querySelectorAll('.product__left-slider-item');
            
            const VISIBLE_ITEMS = 3;
            let currentPosition = 0;
            const itemHeight = 81 + 30; // высота изображения (81px) + gap (30px)
            
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
                
                // Обновляем позицию слайдера
                sliderList.style.transform = `translateY(-${currentPosition * itemHeight}px)`;
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
            
            // Инициализация
            updateVisibleSlides();
            
            // Обработчик для тач-устройств
            let startY;
            const wrapper = document.querySelector('.product__left-slider-wrapper');
            
            wrapper.addEventListener('touchstart', function(e) {
                startY = e.touches[0].clientY;
            });
            
            wrapper.addEventListener('touchend', function(e) {
                const endY = e.changedTouches[0].clientY;
                const diffY = startY - endY;
                
                if (Math.abs(diffY) > 50) {
                    if (diffY > 0 && !nextBtn.classList.contains('disabled')) {
                        currentPosition++;
                    } else if (diffY < 0 && !prevBtn.classList.contains('disabled')) {
                        currentPosition--;
                    }
                    updateVisibleSlides();
                }
            });
        });