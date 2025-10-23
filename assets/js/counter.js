document.addEventListener('DOMContentLoaded', function() {
  const workspace = 'bookibooking';
  const apiBase = `https://api.counterapi.dev/v2/${workspace}/`;
  const visitSlug = 'visit-count';
  const clickSlug = 'click-count';
  
  // Получаем ВСЕ элементы счетчиков (для обеих языковых версий)
  const visitElems = document.querySelectorAll('#visit-count');
  const clickElems = document.querySelectorAll('#click-count');
  
  // === Обновляем отображение ===
  async function updateDisplay() {
    try {
      const visitRes = await fetch(apiBase + visitSlug);
      const visitData = await visitRes.json();
      const visitValue = visitData.data?.up_count ?? 0;
      visitElems.forEach(el => el.textContent = visitValue);
      console.log('Visits:', visitValue); // для отладки
    } catch (err) {
      console.error('Ошибка загрузки visit-count:', err);
      visitElems.forEach(el => el.textContent = '—');
    }
    
    try {
      const clickRes = await fetch(apiBase + clickSlug);
      const clickData = await clickRes.json();
      const clickValue = clickData.data?.up_count ?? 0;
      clickElems.forEach(el => el.textContent = clickValue);
      console.log('Clicks:', clickValue); // для отладки
    } catch (err) {
      console.error('Ошибка загрузки click-count:', err);
      clickElems.forEach(el => el.textContent = '—');
    }
  }
  
  // === Счётчик посетителей (только первый визит) ===
  if (!localStorage.getItem('bookibooking_visited')) {
    fetch(apiBase + visitSlug + '/up', { method: 'POST' })
      .then(() => {
        localStorage.setItem('bookibooking_visited', 'true');
        setTimeout(updateDisplay, 300); // небольшая задержка для обновления
      })
      .catch(err => console.error('Ошибка увеличения visit:', err));
  }
  
  // === Счётчик кликов по всем кнопкам "Розпочати/Начать безкоштовно" ===
  document.querySelectorAll('a[href*="register_admin"]').forEach(btn => {
    btn.addEventListener('click', () => {
      fetch(apiBase + clickSlug + '/up', { method: 'POST' })
        .then(() => setTimeout(updateDisplay, 300))
        .catch(err => console.error('Ошибка увеличения click:', err));
    });
  });
  
  // === Первичная загрузка значений ===
  updateDisplay();
});
