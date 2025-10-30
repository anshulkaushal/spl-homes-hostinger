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
      image: 'assets/img/project-1.jpg'
    },
    {
      id: 'prj-oak-residence',
      title: 'Oak Residence',
      status: 'new',
      location: 'Central Business District',
      area: '2 BHK Apartments',
      price: 'Pre-launch | Enquire',
      image: 'assets/img/project-2.jpg'
    },
    {
      id: 'prj-skyline-plaza',
      title: 'Skyline Plaza',
      status: 'completed',
      location: 'South Avenue',
      area: 'Retail + Office',
      price: 'Sold Out',
      image: 'assets/img/project-3.jpg'
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
        <img class="cover" src="${p.image}" alt="${p.title}">
        <div>
          <span class="${badgeClass(p.status)}">${badgeLabel(p.status)}</span>
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


