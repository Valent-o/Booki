(async function(){
  const visitEl = document.getElementById('visit-count');
  const clickEl = document.getElementById('click-count');

  // Простой подсчет с использованием GitHub Gist как хранилища
  // Или используем встроенный счетчик в память (обнуляется при перезагрузке страницы)
  
  // Временное решение - показываем реальные значения
  let visits = parseInt(localStorage.getItem('bookibooking_visits') || '0');
  let clicks = parseInt(localStorage.getItem('bookibooking_clicks') || '0');
  
  // Проверяем, был ли визит сегодня
  const lastVisit = localStorage.getItem('bookibooking_last_visit');
  const today = new Date().toDateString();
  
  if (lastVisit !== today) {
    visits++;
    localStorage.setItem('bookibooking_visits', visits);
    localStorage.setItem('bookibooking_last_visit', today);
  }
  
  if (visitEl) visitEl.textContent = visits;
  if (clickEl) clickEl.textContent = clicks;

  // При клике на кнопку
  document.querySelectorAll('a[href*="register_admin"]').forEach(btn => {
    btn.addEventListener('click', () => {
      clicks++;
      localStorage.setItem('bookibooking_clicks', clicks);
      if (clickEl) clickEl.textContent = clicks;
    });
  });
})();
