(async function(){
  const visitEl = document.getElementById('visit-count');
  const clickEl = document.getElementById('click-count');
  
  const GITHUB_USER = 'Valent-o';
  const GITHUB_REPO = 'Booki';
  const GITHUB_TOKEN = 'ВАШ_ТОКЕН_СЮДА';  // вставьте ваш токен

  // Загрузить текущие значения (с защитой от кэша)
  async function loadCounters() {
    try {
      const timestamp = new Date().getTime();
      const res = await fetch(`https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/main/counters.json?nocache=${timestamp}`);
      
      if (!res.ok) {
        throw new Error('Failed to fetch');
      }
      
      const data = await res.json();
      console.log('Loaded counters:', data);  // для отладки
      
      if (visitEl) visitEl.textContent = data.visits || 0;
      if (clickEl) clickEl.textContent = data.clicks || 0;
      
      return data;
    } catch (e) {
      console.error('Failed to load counters:', e);
      if (visitEl) visitEl.textContent = '0';
      if (clickEl) clickEl.textContent = '0';
      return { visits: 0, clicks: 0 };
    }
  }

  // Отправить запрос на увеличение счетчика
  async function incrementCounter(type) {
    try {
      const response = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/dispatches`, {
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
      
      console.log(`${type} incremented, status:`, response.status);
      return true;
    } catch (e) {
      console.error('Failed to increment:', e);
      return false;
    }
  }

  // Загрузить при открытии страницы
  await loadCounters();

  // Увеличить посещения (раз в день)
  const lastVisit = localStorage.getItem('bookibooking_last_visit');
  const today = new Date().toDateString();
  
  if (lastVisit !== today) {
    console.log('New visit detected, incrementing...');
    await incrementCounter('visits');
    localStorage.setItem('bookibooking_last_visit', today);
    
    // Перезагрузить счетчики через 5 секунд
    setTimeout(async () => {
      await loadCounters();
    }, 5000);
  }

  // При клике на кнопку
  document.querySelectorAll('a[href*="register_admin"]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      console.log('Button clicked, incrementing clicks...');
      await incrementCounter('clicks');
      
      // Перезагрузить счетчики через 5 секунд
      setTimeout(async () => {
        await loadCounters();
      }, 5000);
    });
  });
})();
