// Menu names transcribed from the user's flavour poster.
const flavours = [
  'Strawberry Coklat', 'Mint', 'Evergreen', 'Frozen', 'O Putih',
  'Marble Cheese', 'Dilwale', 'Pelangi', '4 Rasa', 'Green Tea',
  'Cappuccino', 'Masam-Manis', 'Sayang Sarawak', 'Ored', 'Tembikai',
  'Durian Pandan', 'Kopi Choki', 'Pua Kumbu', 'Pertiwi(an)', 'Idola',
].map((name, i) => ({
  id: i + 1,
  name,
  group: `${String(Math.floor(i / 5) * 5 + 1).padStart(2, '0')}–${String(Math.floor(i / 5) * 5 + 5).padStart(2, '0')}`,
  swatch: ['#e6ac78', '#f0d59b', '#bdd09d', '#e3aab0', '#b8c1da'][i % 5],
}));

const grid = document.querySelector('#catalogue-grid');
const filters = document.querySelector('#filters');
const search = document.querySelector('#search');
const select = document.querySelector('#flavour-select');
const quantity = document.querySelector('#quantity');
const total = document.querySelector('#total');
let activeGroup = 'All';

function renderFilters() {
  const groups = ['All', ...new Set(flavours.map((flavour) => flavour.group))];
  filters.innerHTML = groups.map((group) => `<button class="filter-chip${group === activeGroup ? ' active' : ''}" type="button" data-group="${group}">${group === 'All' ? 'All 20' : `Flavours ${group}`}</button>`).join('');
}

function renderCards() {
  const term = search.value.trim().toLowerCase();
  const shown = flavours.filter((flavour) => (activeGroup === 'All' || flavour.group === activeGroup) && flavour.name.toLowerCase().includes(term));
  grid.innerHTML = shown.map((flavour) => `
    <article class="flavour-card${select.value === String(flavour.id) ? ' selected' : ''}" data-id="${flavour.id}" tabindex="0" role="button" aria-label="Select ${flavour.name}">
      <div class="card-top"><span class="flavour-swatch" style="--swatch:${flavour.swatch}" aria-hidden="true"></span><span class="flavour-number">NO. ${String(flavour.id).padStart(2, '0')}</span></div>
      <div><h3>${flavour.name}</h3><p>Whole loaf · RM15</p></div><span class="card-link">Choose this flavour <span aria-hidden="true">↗</span></span>
    </article>`).join('');
  document.querySelector('#empty-state').hidden = shown.length > 0;
}

function renderSelect() {
  select.innerHTML = '<option value="">Select one</option>' + flavours.map((flavour) => `<option value="${flavour.id}">${flavour.name}</option>`).join('');
}

function setFlavour(id) {
  select.value = String(id);
  renderCards();
  document.querySelector('#order').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function updateTotal() {
  const count = Math.max(1, Math.min(30, Number.parseInt(quantity.value, 10) || 1));
  quantity.value = count;
  total.textContent = `RM${count * 15}`;
}

filters.addEventListener('click', (event) => {
  const button = event.target.closest('[data-group]');
  if (!button) return;
  activeGroup = button.dataset.group;
  renderFilters();
  renderCards();
});
search.addEventListener('input', renderCards);
grid.addEventListener('click', (event) => {
  const card = event.target.closest('[data-id]');
  if (card) setFlavour(card.dataset.id);
});
grid.addEventListener('keydown', (event) => {
  const card = event.target.closest('[data-id]');
  if (card && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault();
    setFlavour(card.dataset.id);
  }
});
select.addEventListener('change', renderCards);
quantity.addEventListener('input', updateTotal);
document.querySelector('#minus').addEventListener('click', () => { quantity.value = Math.max(1, Number(quantity.value) - 1); updateTotal(); });
document.querySelector('#plus').addEventListener('click', () => { quantity.value = Math.min(30, Number(quantity.value) + 1); updateTotal(); });

document.querySelector('#order-form').addEventListener('submit', (event) => {
  event.preventDefault();
  if (!select.value) {
    select.focus();
    select.setCustomValidity('Please choose a flavour first.');
    select.reportValidity();
    select.setCustomValidity('');
    return;
  }
  const flavour = flavours.find((item) => item.id === Number(select.value));
  const count = Number(quantity.value);
  const seller = document.querySelector('input[name="seller"]:checked').value;
  const message = `Hi! I’d like to pre-order ${count} whole loaf${count === 1 ? '' : 's'} of ${flavour.name} from Kek Lapese.\nEstimated total: RM${count * 15}.\nI understand pre-orders are taken Sunday–Thursday. Please let me know the available dates. Thank you!`;
  window.open(`https://wa.me/${seller}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
});

renderFilters();
renderSelect();
renderCards();
updateTotal();

