document.addEventListener('DOMContentLoaded', function() {
  const workspace = 'bookibooking';
  const apiBase = `https://api.counterapi.dev/v1/${workspace}/`;
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
      const visitValue = visitData.count ?? 0;
      visitElems.forEach(el => el.textContent = visitValue);
      console.log('Visits:', visitValue);
    } catch (err) {
      console.error('Ошибка загрузки visit-count:', err);
      visitElems.forEach(el => el.textContent = '—');
    }
    
    try {
      const clickRes = await fetch(apiBase + clickSlug);
      const clickData = await clickRes.json();
      const clickValue = clickData.count ?? 0;
      clickElems.forEach(el => el.textContent = clickValue);
      console.log('Clicks:', clickValue);
    } catch (err) {
      console.error('Ошибка загрузки click-count:', err);
      clickElems.forEach(el => el.textContent = '—');
    }
  }
  
  // === Счётчик посетителей (только первый визит) ===
  if (!localStorage.getItem('bookibooking_visited')) {
    fetch(apiBase + visitSlug + '/up')
      .then(res => res.json())
      .then(() => {
        localStorage.setItem('bookibooking_visited', 'true');
        setTimeout(updateDisplay, 500);
      })
      .catch(err => console.error('Ошибка увеличения visit:', err));
  }
  
  // === Счётчик кликов ===
  document.querySelectorAll('a[href*="register_admin"]').forEach(btn => {
    btn.addEventListener('click', () => {
      fetch(apiBase + clickSlug + '/up')
        .then(res => res.json())
        .then(() => setTimeout(updateDisplay, 500))
        .catch(err => console.error('Ошибка увеличения click:', err));
    });
  });
  
  // === Первичная загрузка ===
  updateDisplay();
});
