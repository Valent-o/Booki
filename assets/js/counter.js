document.addEventListener('DOMContentLoaded', function() {
    const workspace = 'bookibooking';
    const apiBase = `https://api.counterapi.dev/v1/${workspace}/`;

    function updateDisplay() {
        const visitElem = document.getElementById('visit-count');
        const clickElem = document.getElementById('click-count');
        
        if (visitElem) {
            fetch(apiBase + 'visitors')
                .then(r => r.json())
                .then(d => visitElem.textContent = d.count || 0);
        }
        
        if (clickElem) {
            fetch(apiBase + 'clicks')
                .then(r => r.json())
                .then(d => clickElem.textContent = d.count || 0);
        }
    }

    // Счетчик посетителей
    if (!localStorage.getItem('visited')) {
        fetch(apiBase + 'visitors/up');
        localStorage.setItem('visited', 'true');
    }

    updateDisplay();
});
