document.addEventListener('DOMContentLoaded', function() {
  const SUPABASE_URL = 'https://fothwgfxotibfbpsdrde.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvdGh3Z2Z4b3RpYmZicHNkcmRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyMTA2OTcsImV4cCI6MjA3Njc4NjY5N30.ZfHc_nflkCJsYRq2KBl7DVRwnJSJU-cMxOwPWYoSPeo';
  
  const visitElems = document.querySelectorAll('#visit-count');
  const clickElems = document.querySelectorAll('#click-count');
  
  // === Загрузка счетчиков ===
  async function loadCounters() {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/site_stats?select=stat_type,count`, {
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
        
        console.log('✅ Загружено - Visits:', visits, 'Clicks:', clicks);
      } else {
        console.error('❌ Ошибка загрузки:', response.status, await response.text());
      }
    } catch (error) {
      console.error('❌ Ошибка:', error);
    }
  }
  
  // === Увеличение счетчика напрямую через UPDATE ===
  async function incrementCounter(statType) {
    try {
      // Сначала получаем текущее значение
      const getResponse = await fetch(`${SUPABASE_URL}/rest/v1/site_stats?stat_type=eq.${statType}&select=count`, {
        headers: {
          'apikey':
