document.addEventListener('DOMContentLoaded', function() {
    const workspace = 'bookibooking'; // Ваш workspace
    const apiBase = `https://api.counterapi.dev/v1/${workspace}/`;

    // Функция для обновления отображения счетчиков
    function updateDisplay(visitElem, clickElem) {
        fetch(apiBase + 'visitors')
            .then(response => response.json())
            .then(data => visitElem.textContent = data.count || 0)
            .catch(() => visitElem.textContent = 'Error');

        fetch(apiBase + 'clicks')
            .then(response => response.json())
            .then(data => clickElem.textContent = data.count || 0)
            .catch(() => clickElem.textContent = 'Error');
    }

    // Находим элементы для отображения
    const visitCountElem = document.getElementById('visit-count');
    const clickCountElem = document.getElementById('click-count');

    if (visitCountElem && clickCountElem) {
        // Увеличиваем счетчик посетителей при загрузке (только если не было визита)
        if (!localStorage.getItem('visited')) {
            fetch(apiBase + 'visitors/up')
                .then(() => localStorage.setItem('visited', 'true'))
                .catch(console.error);
        }

        // Обновляем отображение счетчиков
        updateDisplay(visitCountElem, clickCountElem);
    }
});
