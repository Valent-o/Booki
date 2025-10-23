document.addEventListener('DOMContentLoaded', function() {
  const SUPABASE_URL = 'https://fothwgfxotibfbpsdrde.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvdGh3Z2Z4b3RpYmZicHNkcmRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyMTA2OTcsImV4cCI6MjA3Njc4NjY5N30.ZfHc_nflkCJsYRq2KBl7DVRwnJSJU-cMxOwPWYoSPeo';
  
  const visitElems = document.querySelectorAll('#visit-count');
  const clickElems = document.querySelectorAll('#click-count');
  
  // === Загрузка счетчиков ===
  async function loadCounters() {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/site_stats?select=*`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const visits = data.find(s => s.stat_type === 'visits')?.count || 0;
        const clicks = data.find(s => s.stat_type === 'clicks')?.count || 0;
        
        visitElems.forEach(el => el.textContent = visits);
        clickElems.forEach(el => el.textContent = clicks);
        
        console.log('Загружено - Visits:', visits, 'Clicks:', clicks);
      }
    } catch (error) {
      console.error('Ошибка загрузки счетчиков:', error);
    }
  }
  
  // === Увеличение счетчика ===
  async function incrementCounter(statType) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/increment_stat`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ p_stat_type: statType })
      });
      
      if (response.ok) {
        const newCount = await response.json();
        console.log(`${statType} увеличен:`, newCount);
        loadCounters();
      }
    } catch (error) {
      console.error(`Ошибка увеличения ${statType}:`, error);
    }
  }
  
  // === Отслеживание посещения (один раз за сессию) ===
  if (!sessionStorage.getItem('bookibooking_visited')) {
    incrementCounter('visits');
    sessionStorage.setItem('bookibooking_visited', 'true');
  }
  
  // === Отслеживание кликов ===
  document.querySelectorAll('a[href*="register_admin"]').forEach(button => {
    button.addEventListener('click', () => {
      incrementCounter('clicks');
    });
  });
  
  // Первая загрузка
  loadCounters();
});
