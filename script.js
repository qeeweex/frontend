document.addEventListener('DOMContentLoaded', function() {
    // Создание частиц для эффекта фона
    const particlesContainer = document.getElementById('particles');
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        const size = Math.random() * 5 + 1; 
        const posX = Math.random() * 100;   
        const posY = Math.random() * 100;   
        const animDuration = Math.random() * 10 + 10; 
        const animDelay = Math.random() * 5; 

        // Применение стилей к частицам
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = posX + '%';
        particle.style.top = posY + '%';
        particle.style.animation = `float ${animDuration}s ease-in-out ${animDelay}s infinite, pulse 4s ease-in-out infinite`;

        particlesContainer.appendChild(particle);
    }

    // Обработка кликов по тегам поиска для автоматического заполнения поля поиска
    const searchTags = document.querySelectorAll('.search-tag');
    searchTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const searchInput = document.querySelector('.search-input');
            const tagText = this.textContent;
            searchInput.value = tagText;
        });
    });
});
