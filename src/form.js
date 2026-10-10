// Form page: checks the details, then opens the note page.
import { DEPARTMENTS, POSITIONS } from './config.js';
import { isSupervisor, loadVisitor, noteUrlFor } from './note.js';

const $ = (id) => document.getElementById(id);

const form = $('wish-form');
const nameInput = $('name');
const deptSelect = $('department');
const posSelect = $('position');

const ERRORS = {
  name: 'Enter your name to get your note.',
  department: 'Choose your department.',
  position: 'Choose your position.',
};

function fillOptions(select, items) {
  for (const { value, label } of items) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    select.append(option);
  }
}

function setError(input, message) {
  $(`${input.id}-error`).textContent = message;
  if (message) input.setAttribute('aria-invalid', 'true');
  else input.removeAttribute('aria-invalid');
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = nameInput.value.trim();
  nameInput.value = name;

  setError(nameInput, name ? '' : ERRORS.name);
  // The supervisor note ignores department and position, so skip those checks.
  const needsChoices = !isSupervisor(name);
  setError(deptSelect, needsChoices && !deptSelect.value ? ERRORS.department : '');
  setError(posSelect, needsChoices && !posSelect.value ? ERRORS.position : '');

  const firstInvalid = [nameInput, deptSelect, posSelect].find(
    (el) => el.getAttribute('aria-invalid') === 'true',
  );
  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  location.href = noteUrlFor({ name, dept: deptSelect.value, pos: posSelect.value });
});

nameInput.addEventListener('input', () => {
  if (nameInput.value.trim()) setError(nameInput, '');
});
for (const select of [deptSelect, posSelect]) {
  select.addEventListener('change', () => setError(select, ''));
}

fillOptions(deptSelect, DEPARTMENTS);
fillOptions(posSelect, POSITIONS);

// Coming back from the note page: keep what they typed.
const previous = loadVisitor();
if (previous) {
  nameInput.value = previous.name;
  deptSelect.value = previous.dept;
  posSelect.value = previous.pos;
}
