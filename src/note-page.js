// Note page: shows the personal note and the keep-in-touch button.
import { LAST_DAY, WHATSAPP_NUMBER, DEPARTMENTS, FALLBACK_DEPARTMENT } from './config.js';
import { CONNECT } from './content.js';
import { buildNote, loadVisitor } from './note.js';
import { drawNoteImage, imageFileName } from './save-image.js';

const $ = (id) => document.getElementById(id);

const visitor = loadVisitor();
const anotherBtn = $('another');
const copyBtn = $('copy');
const saveBtn = $('save');
const preview = $('save-preview');
let index = 0;

function render() {
  const note = buildNote(visitor, index);
  $('card-greeting').textContent = note.greeting;
  $('card-wish').textContent = note.wish;
  const posEl = $('card-position');
  posEl.textContent = note.position;
  posEl.hidden = !note.position;
  $('card-signoff').textContent = note.signoff;
  anotherBtn.hidden = !note.canCycle;
  copyBtn.textContent = 'Copy wish';
  saveBtn.textContent = 'Save my note';
  hidePreview();
  prepareImage();
}

function noteAsText() {
  const note = buildNote(visitor, index);
  return [note.greeting, note.wish, note.position, note.signoff].filter(Boolean).join('\n\n');
}

// Older browsers and some in-app browsers block the async clipboard API.
function legacyCopy(text) {
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.append(area);
  area.select();
  try {
    return document.execCommand('copy');
  } finally {
    area.remove();
    copyBtn.focus();
  }
}

anotherBtn.addEventListener('click', () => {
  index += 1;
  render();
});

copyBtn.addEventListener('click', async () => {
  const text = noteAsText();
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(text);
    copyBtn.textContent = 'Copied';
  } catch {
    try {
      copyBtn.textContent = legacyCopy(text) ? 'Copied' : 'Copy not allowed';
    } catch {
      copyBtn.textContent = 'Copy not allowed';
    }
  }
});

// The image is drawn ahead of time so a tap can open the share sheet at once:
// Safari only allows sharing straight from the tap, with no waiting first.
let imageFile = null;
let imageJob = 0;
let previewUrl = '';

async function prepareImage() {
  const job = ++imageJob;
  imageFile = null;
  try {
    const blob = await drawNoteImage(buildNote(visitor, index), LAST_DAY);
    if (job === imageJob) imageFile = new File([blob], imageFileName(visitor.name), { type: 'image/png' });
  } catch {
    // Left empty; a tap on "Save my note" tries again.
  }
}

function hidePreview() {
  preview.hidden = true;
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  previewUrl = '';
}

// Last resort for in-app browsers that can neither share nor download.
function showPreview(file) {
  hidePreview();
  previewUrl = URL.createObjectURL(file);
  $('save-preview-image').src = previewUrl;
  preview.hidden = false;
  preview.scrollIntoView({ block: 'nearest' });
}

function download(file) {
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = file.name;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

const isTouch = window.matchMedia('(pointer: coarse)').matches;

saveBtn.addEventListener('click', async () => {
  if (!imageFile) await prepareImage();
  const file = imageFile;
  if (!file) {
    saveBtn.textContent = "Couldn't save";
    return;
  }

  if (isTouch && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file] });
      return;
    } catch (error) {
      if (error.name === 'AbortError') return; // closed the share sheet
      // Otherwise sharing was refused; fall through to the preview.
    }
  }

  if (isTouch) {
    showPreview(file);
    return;
  }

  try {
    download(file);
    saveBtn.textContent = 'Saved';
  } catch {
    showPreview(file);
  }
});

function setUpConnect() {
  const number = WHATSAPP_NUMBER.replace(/\D/g, '');
  if (!number) return;
  $('connect-heading').textContent = CONNECT.heading;
  $('connect-text').textContent = CONNECT.text;
  $('connect-label').textContent = CONNECT.button;
  const department =
    DEPARTMENTS.find((d) => d.value === visitor.dept && d.value !== FALLBACK_DEPARTMENT)?.label ??
    CONNECT.noDepartment;
  const message = CONNECT.message
    .replaceAll('{name}', visitor.name)
    .replaceAll('{department}', department);
  const link = $('whatsapp');
  link.href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  $('connect').hidden = false;
}

function start() {
  $('stamp-label').textContent = LAST_DAY.label;
  $('stamp-date').textContent = LAST_DAY.date;
  document.title = `A note for ${visitor.name}`;
  render();
  setUpConnect();
  $('card').classList.add('card-enter');
}

if (visitor) start();
// Opened directly, without filling in the form.
else location.replace('index.html');
