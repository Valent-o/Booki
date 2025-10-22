(async function(){
  const NAMESPACE = 'bookibookingbot';
  const VISIT_KEY = `${NAMESPACE}_visits`;
  const CLICK_KEY = `${NAMESPACE}_clicks`;

  const visitEl = document.getElementById('visit-count');
  const clickEl = document.getElementById('click-count');

  await fetch(`https://countapi.nikz.dev/create?namespace=${NAMESPACE}&key=${VISIT_KEY}&value=0`).catch(()=>{});
  await fetch(`https://countapi.nikz.dev/create?namespace=${NAMESPACE}&key=${CLICK_KEY}&value=0`).catch(()=>{});

  const lastVisit = localStorage.getItem('bookibooking_last_visit');
  const now = Date.now();
  const ONE_DAY = 24 * 60 * 60 * 1000;

  if (!lastVisit || now - lastVisit > ONE_DAY) {
    try {
      const res = await fetch(`https://countapi.nikz.dev/hit/${NAMESPACE}/${VISIT_KEY}`);
      const data = await res.json();
      if (visitEl) visitEl.textContent = data.value;
      localStorage.setItem('bookibooking_last_visit', now);
    } catch {
      if (visitEl) visitEl.textContent = '—';
    }
  } else {
    try {
      const res = await fetch(`https://countapi.nikz.dev/get/${NAMESPACE}/${VISIT_KEY}`);
      const data = await res.json();
      if (visitEl) visitEl.textContent = data.value;
    } catch {
      if (visitEl) visitEl.textContent = '—';
    }
  }

  try {
    const res = await fetch(`https://countapi.nikz.dev/get/${NAMESPACE}/${CLICK_KEY}`);
    const data = await res.json();
    if (clickEl) clickEl.textContent = data.value || 0;
  } catch {
    if (clickEl) clickEl.textContent = '—';
  }

  document.querySelectorAll('a[href*="register_admin"]').forEach(btn => {
    btn.addEventListener('click', async () => {
      try {
        const res = await fetch(`https://countapi.nikz.dev/hit/${NAMESPACE}/${CLICK_KEY}`);
        const data = await res.json();
        if (clickEl) clickEl.textContent = data.value;
      } catch {}
    });
  });
})();
