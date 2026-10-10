// Draws the note as a PNG with the 2D canvas API. Everything happens in the
// visitor's browser; nothing is uploaded. The image always uses the light
// palette so it looks the same wherever it is saved.

const COLORS = {
  mint: '#EDF4F0',
  pandan: '#1F6F58',
  marigold: '#F4B63F',
  text: '#FFFFFF',
  muted: '#D7EAE2',
  rule: 'rgba(255, 255, 255, 0.28)',
};

const FONT_STACK = "'Bricolage Grotesque', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif";
const font = (weight, size) => `${weight} ${size}px ${FONT_STACK}`;

// All sizes in image pixels. 1080 wide, at least 1350 tall (4:5, fits phone galleries).
const W = 1080;
const MIN_H = 1350;
const MARGIN = 56; // mint frame around the card
const PAD = 88; // inside the card
const CONTENT_W = W - 2 * MARGIN - 2 * PAD;
const STAMP = { size: 190, inset: 60, gap: 28 };

const TYPE = {
  greeting: { weight: 800, size: 80, line: 88 },
  body: { weight: 400, size: 42, line: 62 },
  signoff: { weight: 400, size: 32, line: 46 },
};

// Splits text into lines no wider than maxWidth. Words longer than a line
// (a long name with no spaces) are broken by character.
function wrap(ctx, text, maxWidth) {
  const lines = [];
  let line = '';
  const push = () => {
    if (line) lines.push(line);
    line = '';
  };
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth) {
      line = candidate;
      continue;
    }
    push();
    if (ctx.measureText(word).width <= maxWidth) {
      line = word;
      continue;
    }
    for (const char of word) {
      if (ctx.measureText(line + char).width > maxWidth) push();
      line += char;
    }
  }
  push();
  return lines;
}

function layout(ctx, note) {
  ctx.font = font(TYPE.greeting.weight, TYPE.greeting.size);
  const greeting = wrap(ctx, note.greeting, CONTENT_W - STAMP.size - STAMP.gap);
  ctx.font = font(TYPE.body.weight, TYPE.body.size);
  const wish = wrap(ctx, note.wish, CONTENT_W);
  const position = note.position ? wrap(ctx, note.position, CONTENT_W) : [];
  ctx.font = font(TYPE.signoff.weight, TYPE.signoff.size);
  const signoff = wrap(ctx, note.signoff, CONTENT_W);

  // Vertical positions relative to the top of the card.
  const greetingTop = PAD;
  const greetingBottom = greetingTop + greeting.length * TYPE.greeting.line;
  const stampBottom = STAMP.inset + STAMP.size;
  const wishTop = Math.max(greetingBottom + 48, stampBottom + 36);
  const positionTop = wishTop + wish.length * TYPE.body.line + 26;
  const bodyBottom = position.length
    ? positionTop + position.length * TYPE.body.line
    : wishTop + wish.length * TYPE.body.line;
  const ruleY = bodyBottom + 48;
  const signoffTop = ruleY + 30;
  const cardH = signoffTop + signoff.length * TYPE.signoff.line + PAD - 10;

  return { greeting, wish, position, signoff, greetingTop, wishTop, positionTop, ruleY, signoffTop, cardH };
}

function drawLines(ctx, lines, x, top, lineHeight) {
  lines.forEach((line, i) => ctx.fillText(line, x, top + i * lineHeight));
}

function drawStamp(ctx, cx, cy, lastDay) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((-12 * Math.PI) / 180);
  ctx.strokeStyle = COLORS.marigold;
  ctx.fillStyle = COLORS.marigold;

  ctx.setLineDash([16, 11]);
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(0, 0, STAMP.size / 2 - 12, 0, Math.PI * 2);
  ctx.stroke();

  ctx.setLineDash([]);
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, STAMP.size / 2, 0, Math.PI * 2);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = font(600, 28);
  ctx.fillText(lastDay.label, 0, -24);
  ctx.font = font(800, 46);
  ctx.fillText(lastDay.date, 0, 22);
  ctx.restore();
}

async function loadFonts() {
  if (!document.fonts?.load) return;
  try {
    await Promise.all([
      document.fonts.load(font(400, 42)),
      document.fonts.load(font(600, 28)),
      document.fonts.load(font(800, 80)),
    ]);
  } catch {
    // Fonts unavailable (offline): the system fallback is used instead.
  }
}

// Resolves to a PNG Blob of the note.
export async function drawNoteImage(note, lastDay) {
  await loadFonts();

  const canvas = document.createElement('canvas');
  canvas.width = W;
  let ctx = canvas.getContext('2d');
  const plan = layout(ctx, note);

  canvas.height = Math.max(MIN_H, plan.cardH + 2 * MARGIN);
  ctx = canvas.getContext('2d'); // resizing resets the context state
  const cardX = MARGIN;
  const cardY = Math.round((canvas.height - plan.cardH) / 2);
  const cardW = W - 2 * MARGIN;

  ctx.fillStyle = COLORS.mint;
  ctx.fillRect(0, 0, W, canvas.height);

  ctx.save();
  ctx.shadowColor = 'rgba(16, 48, 42, 0.28)';
  ctx.shadowBlur = 48;
  ctx.shadowOffsetY = 20;
  ctx.fillStyle = COLORS.pandan;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(cardX, cardY, cardW, plan.cardH, 36);
  else ctx.rect(cardX, cardY, cardW, plan.cardH);
  ctx.fill();
  ctx.restore();

  drawStamp(
    ctx,
    cardX + cardW - STAMP.inset - STAMP.size / 2,
    cardY + STAMP.inset + STAMP.size / 2,
    lastDay,
  );

  const x = cardX + PAD;
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';

  ctx.fillStyle = COLORS.text;
  ctx.font = font(TYPE.greeting.weight, TYPE.greeting.size);
  drawLines(ctx, plan.greeting, x, cardY + plan.greetingTop, TYPE.greeting.line);

  ctx.font = font(TYPE.body.weight, TYPE.body.size);
  drawLines(ctx, plan.wish, x, cardY + plan.wishTop, TYPE.body.line);
  drawLines(ctx, plan.position, x, cardY + plan.positionTop, TYPE.body.line);

  ctx.fillStyle = COLORS.rule;
  ctx.fillRect(x, cardY + plan.ruleY, CONTENT_W, 2);

  ctx.fillStyle = COLORS.muted;
  ctx.font = font(TYPE.signoff.weight, TYPE.signoff.size);
  drawLines(ctx, plan.signoff, x, cardY + plan.signoffTop, TYPE.signoff.line);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Could not create image'))), 'image/png');
  });
}

// "Lee Kah Kean" -> "note-for-lee-kah-kean.png"
export function imageFileName(name) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  return slug ? `note-for-${slug}.png` : 'thank-you-note.png';
}
