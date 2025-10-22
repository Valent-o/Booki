(async function(){
  const NAMESPACE = 'bookibookingbot';  // уникальное имя для счетчика
  const VISIT_KEY = `${NAMESPACE}_visits`;
  const CLICK_KEY = `${NAMESPACE}_clicks`;

  const visitEl = document.getElementById('visit-count');
  const clickEl = document.getElementById('click-count');

  // Универсальная функция для запросов к API
  async function fetchCount(endpoint, key) {
    try {
      const res = await fetch(`https://countapi.nikz.me/${endpoint}/${NAMESPACE}/${key}`);
      const data = await res.json();
      return data.value;
    } catch (e) {
      console.error('CountAPI error:', e);
      return null;
    }
  }

  // Обновляем посещения раз в сутки
  const lastVisit = localStorage.getItem('bookibooking_last_visit');
  const now = Date.now();
  const ONE_DAY = 24 * 60 * 60 * 1000;

  if (!lastVisit || now - lastVisit > ONE_DAY) {
    const value = await fetchCount('hit', VISIT_KEY);
    if (value !== null && visitEl) visitEl.textContent = value;
    localStorage.setItem('bookibooking_last_visit', now);
  } else {
    const value = await fetchCount('get', VISIT_KEY);
    if (value !== null && visitEl) visitEl.textContent = value;
  }

  // Загружаем клики
  const clicks = await fetchCount('get', CLICK_KEY);
  if (clicks !== null && clickEl) clickEl.textContent = clicks;

  // При нажатии на кнопку "Розпочати безкоштовно" увеличиваем клики
  document.querySelectorAll('a[href*="register_admin"]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const value = await fetchCount('hit', CLICK_KEY);
      if (value !== null && clickEl) clickEl.textContent = value;
    });
  });
})();
