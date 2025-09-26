export function byId(id) {
  return document.getElementById(id);
}

export function fmtBRL(n) {
  return (n ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatCep(value) {
  value = value.replace(/\D/g, '');
  if (value.length > 5) value = value.replace(/^(\d{5})(\d)/, '$1-$2');
  return value;
}

export function createElement(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  for (const key in attrs) {
    if (key.startsWith('data-')) el.setAttribute(key, attrs[key]);
    else if (key === 'className') el.className = attrs[key];
    else if (key === 'textContent') el.textContent = attrs[key];
    else el[key] = attrs[key];
  }
  children.forEach(child => el.appendChild(child));
  return el;
}
