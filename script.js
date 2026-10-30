const colorPicker = document.getElementById('color-picker');
const colorDisplay = document.getElementById('color-display');
const hexVal = document.getElementById('hex-val');
const rgbVal = document.getElementById('rgb-val');
const hslVal = document.getElementById('hsl-val');

const previewBtnPrimary = document.getElementById('preview-btn-primary');
const previewBtnSecondary = document.getElementById('preview-btn-secondary');
const previewCard = document.getElementById('preview-card');
const previewCardTitle = document.getElementById('preview-card-title');

const shadesContainer = document.getElementById('shades-container');
const historyContainer = document.getElementById('history-container');
const eyedropperBtn = document.getElementById('eyedropper-btn');

let history = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'];

function hexToRgb(hex) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

function updateColor(hex) {
  colorDisplay.style.backgroundColor = hex;
  colorPicker.value = hex;
  hexVal.value = hex;

  const { r, g, b } = hexToRgb(hex);
  rgbVal.value = `rgb(${r}, ${g}, ${b})`;

  const { h, s, l } = rgbToHsl(r, g, b);
  hslVal.value = `hsl(${h}, ${s}%, ${l}%)`;

  previewBtnPrimary.style.backgroundColor = hex;
  previewBtnSecondary.style.borderColor = hex;
  previewBtnSecondary.style.color = hex;
  previewCard.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.1)`;
  previewCard.style.borderColor = `rgba(${r}, ${g}, ${b}, 0.3)`;
  previewCardTitle.style.color = hex;

  generateShades(h, s);
  addToHistory(hex);
}

function generateShades(h, s) {
  shadesContainer.innerHTML = '';
  const lightnessLevels = [20, 35, 50, 65, 80];

  lightnessLevels.forEach(l => {
    const shadeHex = hslToHex(h, s, l);
    const box = document.createElement('div');
    box.className = 'h-12 rounded-xl cursor-pointer transition-transform hover:scale-105 border border-white/10';
    box.style.backgroundColor = shadeHex;
    box.title = shadeHex;
    box.onclick = () => updateColor(shadeHex);
    shadesContainer.appendChild(box);
  });
}

function hslToHex(h, s, l) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function addToHistory(hex) {
  if (!history.includes(hex)) {
    history.unshift(hex);
    if (history.length > 8) history.pop();
    renderHistory();
  }
}

function renderHistory() {
  historyContainer.innerHTML = '';
  history.forEach(color => {
    const item = document.createElement('div');
    item.className = 'w-9 h-9 rounded-xl flex-shrink-0 cursor-pointer border border-white/20 transition-transform hover:scale-110';
    item.style.backgroundColor = color;
    item.onclick = () => updateColor(color);
    historyContainer.appendChild(item);
  });
}

function copyToClipboard(elementId) {
  const input = document.getElementById(elementId);
  navigator.clipboard.writeText(input.value);
  showToast();
}

function showToast() {
  const toast = document.getElementById('toast');
  toast.classList.remove('opacity-0');
  toast.classList.add('opacity-100');
  setTimeout(() => {
    toast.classList.remove('opacity-100');
    toast.classList.add('opacity-0');
  }, 2000);
}

colorPicker.addEventListener('input', (e) => updateColor(e.target.value));
hexVal.addEventListener('change', (e) => {
  if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
    updateColor(e.target.value);
  }
});

eyedropperBtn.addEventListener('click', async () => {
  if ('EyeDropper' in window) {
    try {
      const eyeDropper = new EyeDropper();
      const result = await eyeDropper.open();
      updateColor(result.sRGBHex);
    } catch (e) {
      console.log('EyeDropper error:', e);
    }
  } else {
    alert('EyeDropper API is not supported in this browser.');
  }
});

updateColor('#6366f1');
renderHistory();
