<script>
document.addEventListener('DOMContentLoaded', function() {
  const workspace = 'bookibooking';
  const apiBase = `https://api.counterapi.dev/v2/${workspace}/`;

  const visitSlug = 'visit-count';
  const clickSlug = 'click-count';

  const visitElem = document.getElementById('visit-count');
  const clickElem = document.getElementById('click-count');

  // === Обновляем отображение ===
  async function updateDisplay() {
    try {
      const visitRes = await fetch(apiBase + visitSlug);
      const visitData = await visitRes.json();
      if (visitElem) visitElem.textContent = visitData.value ?? '0';
    } catch {
      if (visitElem) visitElem.textContent = '—';
    }

    try {
      const clickRes = await fetch(apiBase + clickSlug);
      const clickData = await clickRes.json();
      if (clickElem) clickElem.textContent = clickData.value ?? '0';
    } catch {
      if (clickElem) clickElem.textContent = '—';
    }
  }

  // === Счётчик посетителей (только первый визит с устройства) ===
  if (!localStorage.getItem('bookibooking_visited')) {
    fetch(apiBase + visitSlug + '/up');
    localStorage.setItem('bookibooking_visited', 'true');
  }

  // === Счётчик кликов по кнопке "Розпочати безкоштовно" ===
  document.querySelectorAll('a[href*="register_admin"]').forEach(btn => {
    btn.addEventListener('click', async () => {
      await fetch(apiBase + clickSlug + '/up');
      updateDisplay(); // обновляем сразу на экране
    });
  });

  // === Первичная загрузка значений ===
  updateDisplay();
});
</script>
