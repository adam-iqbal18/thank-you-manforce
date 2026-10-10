// Shared by both pages: building the note and handing the visitor's
// details from the form page to the note page.
import {
  SIGN_OFF,
  SUPERVISOR_PATTERN,
  DEPARTMENTS,
  POSITIONS,
  FALLBACK_DEPARTMENT,
} from './config.js';
import { WISHES, POSITION_LINES, SUPERVISOR_MESSAGE } from './content.js';

const STORAGE_KEY = 'thank-you-manforce:visitor';
export const MAX_NAME_LENGTH = 60;

// Always returns a non-empty list, so a department with zero or one
// wish (or a department missing from content.js) still works.
export function wishesFor(dept) {
  const list = WISHES[dept];
  if (Array.isArray(list) && list.length > 0) return list;
  return WISHES[FALLBACK_DEPARTMENT] ?? [''];
}

// Wraps the index so cycling never runs off the end of the list.
export function pickWish(list, index) {
  return list[((index % list.length) + list.length) % list.length];
}

export function isSupervisor(name) {
  return SUPERVISOR_PATTERN.test(name);
}

export function buildNote({ name, dept, pos }, index = 0) {
  const supervisor = isSupervisor(name);
  return {
    greeting: `Dear ${name},`,
    wish: supervisor ? SUPERVISOR_MESSAGE : pickWish(wishesFor(dept), index),
    position: supervisor ? '' : POSITION_LINES[pos] ?? '',
    signoff: SIGN_OFF,
    canCycle: !supervisor && wishesFor(dept).length > 1,
  };
}

function clean(raw) {
  if (!raw || typeof raw.name !== 'string') return null;
  const name = raw.name.trim().slice(0, MAX_NAME_LENGTH);
  if (!name) return null;
  const known = (list, value) => list.some((item) => item.value === value);
  return {
    name,
    dept: known(DEPARTMENTS, raw.dept) ? raw.dept : '',
    pos: known(POSITIONS, raw.pos) ? raw.pos : '',
  };
}

// Returns the URL of the note page. Details go in sessionStorage (this tab
// only, cleared when it closes). If storage is blocked, they travel in the
// URL hash instead, which is never sent to the server.
export function noteUrlFor(visitor) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(visitor));
    return 'note.html';
  } catch {
    const params = new URLSearchParams({ n: visitor.name, d: visitor.dept, p: visitor.pos });
    return `note.html#${params}`;
  }
}

export function loadVisitor() {
  if (location.hash.length > 1) {
    const params = new URLSearchParams(location.hash.slice(1));
    const visitor = clean({ name: params.get('n'), dept: params.get('d'), pos: params.get('p') });
    if (visitor) return visitor;
  }
  try {
    return clean(JSON.parse(sessionStorage.getItem(STORAGE_KEY)));
  } catch {
    return null;
  }
}
