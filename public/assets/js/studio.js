const editor = document.querySelector('#editor');
const fields = editor.elements;
const labels = {intro:'Couple introduction', story:'Our story', countdown:'Countdown', events:'Wedding events', venue:'Venue and map', rsvp:'RSVP'};
const draftKey = 'invitation-studio-v1';
let order = Object.keys(labels);
let visible = Object.fromEntries(order.map(key => [key, true]));
try {
  const draft = JSON.parse(localStorage.getItem(draftKey));
  if (draft) {
    for (const [key, value] of Object.entries(draft.details)) {
      if (fields.namedItem(key)) fields.namedItem(key).value = value;
    }
    order = draft.order;
    visible = draft.visible;
  }
} catch {}
const sections = document.querySelector('#sections');
function renderSections() {
  sections.querySelectorAll('div').forEach(row => row.remove());
  for (const [index, key] of order.entries()) {
    const row = document.createElement('div');
    const label = document.createElement('label');
    const toggle = document.createElement('input');
    toggle.type = 'checkbox';
    toggle.checked = visible[key];
    toggle.onchange = () => { visible[key] = toggle.checked; update(); };
    label.append(toggle, ' ' + labels[key]);
    row.append(label);
    for (const [direction, symbol, description] of [[-1, '↑', 'Move up'], [1, '↓', 'Move down']]) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = symbol;
      button.setAttribute('aria-label', description + ' ' + labels[key]);
      button.disabled = !order[index + direction];
      button.onclick = () => {
        [order[index], order[index + direction]] = [order[index + direction], order[index]];
        renderSections();
        update();
      };
      row.append(button);
    }
    sections.append(row);
  }
}
function update() {
  const details = Object.fromEntries(new FormData(editor));
  try { localStorage.setItem(draftKey, JSON.stringify({details, order, visible})); } catch {}
  const {design, guest, ...wedding} = details;
  const url = new URL(design + '.html', location.href);
  url.searchParams.set('guest', guest);
  url.hash = new URLSearchParams({wedding: JSON.stringify({...wedding, sections: order.filter(key => visible[key])})});
  document.querySelector('#open').href = url;
  document.querySelector('#preview').src = url;
}
let pendingUpdate;
editor.addEventListener('input', event => {
  if (event.target.type === 'checkbox') return;
  clearTimeout(pendingUpdate);
  pendingUpdate = setTimeout(update, 200);
});
editor.addEventListener('submit', async event => {
  event.preventDefault();
  update();
  const status = document.querySelector('#status');
  if (location.protocol === 'file:') {
    status.textContent = 'Host the site to create a public guest link.';
    return;
  }
  const link = document.querySelector('#open').href;
  try {
    await navigator.clipboard.writeText(link);
    status.textContent = 'Guest link copied.';
  } catch {
    status.textContent = link;
  }
});
renderSections();
update();
