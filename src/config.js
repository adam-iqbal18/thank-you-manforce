// Site settings. Edit these values; no other file needs to change.

// Shown at the bottom of every note and included in the copied text.
export const SIGN_OFF = 'With thanks, Adam Iqbal, the IT intern, June to October 2026';

// Text inside the postmark stamp on the note card.
export const LAST_DAY = { label: 'Last day', date: '16 Oct' };

// A name that matches this shows the supervisor message instead.
export const SUPERVISOR_PATTERN = /kah\s*kean/i;

// Department list. `value` must match a key in content.js (WISHES).
// A department with no wishes in content.js falls back to "oth".
export const DEPARTMENTS = [
  // Same names as the department list in the IT ticketing system.
  { value: 'acc', label: 'Accounts' },
  { value: 'adm', label: 'Administrative' },
  { value: 'bp', label: 'Business Partner' },
  { value: 'fin', label: 'Finance' },
  { value: 'hr', label: 'HR' },
  { value: 'it', label: 'IT' },
  { value: 'mgt', label: 'Management' },
  { value: 'mkt', label: 'Marketing' },
  { value: 'oa', label: 'Outsourcing Admin' },
  { value: 'ovs', label: 'Overseas' },
  { value: 'pay', label: 'Payroll' },
  { value: 'pro', label: 'Procurement' },
  { value: 'pm', label: 'Project Management' },
  { value: 'pr', label: 'Public Relations' },
  { value: 'sal', label: 'Sales' },
  { value: 'svc', label: 'Service team' },
  { value: 'oth', label: 'Other' },
]

// Position list. `value` must match a key in content.js (POSITION_LINES).
export const POSITIONS = [
  { value: 'm', label: 'Head or Manager' },
  { value: 'e', label: 'Executive or Officer' },
  { value: 's', label: 'Admin or Support staff' },
  { value: 'i', label: 'Intern' },
];

// WhatsApp number for the "keep in touch" button: country code and number,
// digits only, no "+" or spaces. Example for a Malaysian mobile: '60123456789'.
// Leave it empty to hide the keep-in-touch section.
export const WHATSAPP_NUMBER = '601110774399';

// Used when a department has no wishes of its own.
export const FALLBACK_DEPARTMENT = 'oth';
