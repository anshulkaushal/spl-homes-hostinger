// SPL HOMES - Interactivity & Data

document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Project Data (edit here to add/remove projects)
  const projects = [
    {
      id: 'prj-green-meadows',
      title: 'Green Meadows Villas',
      status: 'current', // current | new | completed
      location: 'North Zone, City',
      area: '3 & 4 BHK Villas',
      price: 'From $280,000',
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1000&q=80&auto=format&fit=crop'
    },
    {
      id: 'prj-oak-residence',
      title: 'Oak Residence',
      status: 'new',
      location: 'Central Business District',
      area: '2 BHK Apartments',
      price: 'Pre-launch | Enquire',
      image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=1000&q=80&auto=format&fit=crop'
    },
    {
      id: 'prj-skyline-plaza',
      title: 'Skyline Plaza',
      status: 'completed',
      location: 'South Avenue',
      area: 'Retail + Office',
      price: 'Sold Out',
      image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=1000&q=80&auto=format&fit=crop'
    }
  ];

  const grid = document.getElementById('projectGrid');
  const chips = document.querySelectorAll('.chip');

  function badgeClass(status){
    if (status === 'current') return 'badge current';
    if (status === 'new') return 'badge new';
    return 'badge completed';
  }

  function badgeLabel(status){
    if (status === 'current') return 'Current';
    if (status === 'new') return 'New / For Sale';
    return 'Completed';
  }

  function render(filter = 'all'){
    if (!grid) return;
    const list = filter === 'all' ? projects : projects.filter(p => p.status === filter);
    grid.innerHTML = list.map(p => `
      <article class="card project">
        <div class="media">
          <img class="cover" src="${p.image}" alt="${p.title}">
          <div class="badge-wrap"><span class="${badgeClass(p.status)}">${badgeLabel(p.status)}</span></div>
        </div>
        <div>
          <h3>${p.title}</h3>
          <div class="meta">
            <span>📍 ${p.location}</span>
            <span>📐 ${p.area}</span>
            <span>💲 ${p.price}</span>
          </div>
        </div>
        <div>
          <a class="btn btn-small" href="#contact">Enquire</a>
        </div>
      </article>
    `).join('');
  }

  // Filters
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      const filter = chip.getAttribute('data-filter') || 'all';
      render(filter);
    });
  });

  render('all');
});


