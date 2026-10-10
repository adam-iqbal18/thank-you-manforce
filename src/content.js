// All the words on the note. Add, remove or edit wishes freely.
// Each department can have any number of wishes (one is fine).
// "Another wish" cycles through them in order.

export const WISHES = {
  acc: [
    'Thank you for your patience with my questions. May every account balance on the first try and every month-end close early.',
    'Thank you for the care you put into every figure. Wishing you smooth audits, happy totals, and a long rest after each deadline.',
  ],
  adm: [
    'Thank you for keeping everything running behind the scenes, my paperwork included. Wishing you a calm, well-organised, cheerful year ahead.',
    'The office works because of you. Thank you for all the little things you did for me. May good things come back to you in big ways.',
  ],
  bp: [
    'Thank you for being the bridge between teams and making the work smoother for everyone. Wishing you strong partnerships and easy conversations.',
    'Thank you for always seeing the bigger picture. May every client meeting go well and every partnership keep growing.',
  ],
  fin: [
    'Thank you for keeping the numbers honest and the budgets on track. Wishing you clean reports and quick approvals.',
    'Thank you for your patience every time I asked where a number came from. May every forecast hit and every payment go out on time.',
  ],
  hr: [
    'Thank you for welcoming me so warmly from my first day. May your inbox stay light and every new hire be as great as the people here.',
    'Thank you for making a new intern feel like part of the family. Wishing you a team that always shows up on time and smiling.',
  ],
  it: [
    'Thank you for every patient answer to my questions. May your servers stay green, your ticket queue stay short, and every deploy go smoothly.',
    'Working beside the IT team taught me more than any lecture. Wishing you quiet on-call nights and bug-free days ahead.',
  ],
  mgt: [
    'Thank you for giving a student the chance to learn inside your company. Wishing you continued growth and success for Manforce.',
    'Thank you for building a workplace where an intern can learn and be trusted. Wishing you and the company many more good years.',
  ],
  mkt: [
    'Thank you for showing me how a good idea becomes a campaign people remember. Wishing you great reach, happy clients, and deadlines with room to breathe.',
    'Thank you for the creativity you bring to every brief. May every launch shine and every number go up.',
  ],
  oa: [
    'Thank you for keeping so many people and moving parts on track. Wishing you smooth onboarding, tidy records, and calm Mondays.',
    'Thank you for handling the details nobody sees but everyone needs. May your workload stay light and your days end on time.',
  ],
  ovs: [
    'Thank you for working across time zones and borders with so much patience. Wishing you smooth trips, clear calls, and good news from every country.',
    'Thank you for showing me how big the Manforce world really is. May every overseas project run smoothly and every flight land on time.',
  ],
  pay: [
    'Thank you for making sure everyone is paid right and on time, every single month. Wishing you error-free runs and early cut-offs.',
    'Thank you for the care you put into work that matters to everyone here. May every payroll close smoothly and every payslip be right the first time.',
  ],
  pro: [
    'Thank you for always finding a way to get things done. Wishing you great deals, on-time deliveries, and happy suppliers.',
    'Thank you for helping whenever I needed something. May every quotation come in under budget and every order arrive early.',
  ],
  pm: [
    'Thank you for keeping every plan on track, mine included. Wishing you clear scopes, happy stakeholders, and milestones met early.',
    'Thank you for showing me how a good plan makes hard work easier. May every project finish on time and under budget.',
  ],
  pr: [
    'Thank you for always finding the right words. Wishing you great stories, good press, and events that run without a hitch.',
    'Thank you for showing the best side of Manforce to the world. May every announcement land well and every event be a success.',
  ],
  sal: [
    'Thank you for the energy you bring to the floor. Wishing you big deals, bigger campaigns, and clients who reply on the first message.',
    'Thank you for the great ideas and the good company. May every pitch land and every target be beaten.',
  ],
  svc: [
    'Thank you for showing me how a busy day gets handled with calm. Wishing you smooth schedules and no surprises when it matters most.',
    'Thank you for making hard work look easy. May your targets be met and your days end on time.',
  ],
  oth: [
    'Thank you for being so kind to me during my internship. Wishing you good health, good luck, and good things always.',
    'Working with you has been a real pleasure. Wishing you happiness at work and at home.',
  ],
};

// Second paragraph, chosen by position.
export const POSITION_LINES = {
  m: 'Thank you for the guidance and trust you gave me.',
  e: 'Thank you for sharing your time and know-how with me.',
  s: 'Thank you for the support that kept me going.',
  // Placeholder: no text was supplied for interns. Replace as you like.
  i: 'Thank you for learning alongside me. Good luck with everything ahead.',
};

// The keep-in-touch section under the note.
// In `message`, {name} becomes the visitor's name and {department} their
// department. They see it in WhatsApp and can edit it before sending.
// `noDepartment` stands in for {department} when they chose "Other" or none.
export const CONNECT = {
  heading: "Let's not make this goodbye",
  text: "Four months at Manforce gave me more than experience. It gave me people I'd like to keep. Send me a message and let's stay in touch.",
  button: 'Say hi on WhatsApp',
  message: "Hi Adam, it's {name} from {department}. Thanks for the lovely note! Let's stay connected.",
  noDepartment: 'Manforce',
};

// Replaces the department wish and position line for the supervisor.
export const SUPERVISOR_MESSAGE =
  'Thank you for guiding me through the whole internship, from my first ticket to the last feature I shipped. You gave me room to try, fix, and learn, and that meant everything. Wishing you and the team a smooth road ahead. I hope our paths cross again.';
