const form = document.getElementById('form');
const input = document.getElementById('input');
const lista = document.getElementById('lista');
const contador = document.getElementById('contador');
const botonesFiltro = document.querySelectorAll('.filtros button');

let tareas = JSON.parse(localStorage.getItem('tareas')) || [];
let filtro = 'todas';

function guardar() {
  localStorage.setItem('tareas', JSON.stringify(tareas));
}

function pintar() {
  lista.innerHTML = '';
  const visibles = tareas.filter(t =>
    filtro === 'todas' ||
    (filtro === 'hechas' && t.hecha) ||
    (filtro === 'pendientes' && !t.hecha));

  visibles.forEach(t => {
    const li = document.createElement('li');
    if (t.hecha) li.classList.add('hecha');

    const check = document.createElement('input');
    check.type = 'checkbox';
    check.checked = t.hecha;
    check.addEventListener('change', () => {
      t.hecha = check.checked;
      guardar(); pintar();
    });

    const texto = document.createElement('span');
    texto.textContent = t.texto;

    const del = document.createElement('button');
    del.textContent = 'X';
    del.className = 'del';
    del.addEventListener('click', () => {
      tareas = tareas.filter(x => x.id !== t.id);
      guardar(); pintar();
    });

    li.append(check, texto, del);
    lista.appendChild(li);
  });

  const pendientes = tareas.filter(t => !t.hecha).length;
  contador.textContent = `${pendientes} tarea(s) pendiente(s)`;
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const texto = input.value.trim();
  if (!texto) return;
  tareas.push({ id: Date.now(), texto, hecha: false });
  input.value = '';
  guardar(); pintar();
});

botonesFiltro.forEach(b => b.addEventListener('click', () => {
  filtro = b.dataset.f;
  botonesFiltro.forEach(x => x.classList.toggle('activo', x === b));
  pintar();
}));

pintar();
