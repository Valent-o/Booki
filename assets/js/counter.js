(async function(){
  const visitEl = document.getElementById('visit-count');
  const clickEl = document.getElementById('click-count');
  const GITHUB_USER = 'ВАШ_USERNAME';
  const GITHUB_REPO = 'ВАШ_REPO';
  const GITHUB_TOKEN = 'ВАШ_PERSONAL_ACCESS_TOKEN'; // создайте в Settings > Developer settings

  // Загрузить текущие значения
  async function loadCounters() {
    try {
      const res = await fetch(`https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/main/counters.json?t=${Date.now()}`);
      const data = await res.json();
      
      if (visitEl) visitEl.textContent = data.visits || 0;
      if (clickEl) clickEl.textContent = data.clicks || 0;
    } catch (e) {
      console.error('Failed to load counters:', e);
      if (visitEl) visitEl.textContent = '0';
      if (clickEl) clickEl.textContent = '0';
    }
  }

  // Отправить запрос на увеличение счетчика
  async function incrementCounter(type) {
    try {
      await fetch(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/dispatches`, {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          event_type: 'increment_counter',
          client_payload: { counter_type: type }
        })
      });
    } catch (e) {
      console.error('Failed to increment:', e);
    }
  }

  // Загрузить при открытии страницы
  await loadCounters();

  // Увеличить посещения (раз в день)
  const lastVisit = localStorage.getItem('last_visit');
  const today = new Date().toDateString();
  if (lastVisit !== today) {
    await incrementCounter('visits');
    localStorage.setItem('last_visit', today);
    setTimeout(loadCounters, 2000); // Обновить через 2 сек
  }

  // При клике на кнопку
  document.querySelectorAll('a[href*="register_admin"]').forEach(btn => {
    btn.addEventListener('click', async () => {
      await incrementCounter('clicks');
      setTimeout(loadCounters, 2000);
    });
  });
})();
