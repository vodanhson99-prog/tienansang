import { stages, getToxicReaction } from './digestive-data.js';

export function createUI(journey) {
  const get = id => document.getElementById(id);
  const progress = get('progress');
  const pause = get('pause');
  const resume = get('resume');
  const speed = get('speed');
  const navigate = value => {
    journey.direction = 1;
    journey.contraction = 0;
    journey.seek(value);
  };
  const restart = () => {
    journey.setMode(journey.mode, journey.response);
    journey.playing = true;
  };
  const buttons = stages.map((stage, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    const count = document.createElement('span');
    count.className = 'stage-count';
    count.textContent = String(index + 1).padStart(2, '0');
    button.append(count, stage.shortName);
    button.addEventListener('click', () => navigate(stage.start));
    get('stage-buttons').append(button);
    return button;
  });
  pause.addEventListener('click', () => { journey.playing = false; });
  resume.addEventListener('click', () => {
    if (journey.progress === 1 || (journey.direction < 0 && journey.progress === 0)) restart();
    journey.playing = true;
  });
  speed.addEventListener('click', () => {
    journey.speed = journey.speed === 2 ? 1 : 2;
    speed.textContent = journey.speed === 2 ? 'Tốc độ 2× · Về 1×' : 'Tua 2×';
    speed.setAttribute('aria-pressed', String(journey.speed === 2));
  });
  get('restart').addEventListener('click', restart);
  get('mode-normal').addEventListener('click', () => { journey.setMode('normal'); });
  get('mode-toxic').addEventListener('click', () => { journey.setMode('toxic', get('response').value); });
  get('response').addEventListener('change', event => { journey.setMode('toxic', event.target.value); });
  progress.addEventListener('input', () => navigate(Number(progress.value) / 1000));
  let lastKey = '';
  let lastState = '';
  return {
    update() {
      progress.value = Math.round(journey.progress * 1000);
      get('progress-value').textContent = `${Math.round(journey.progress * 100)}%`;
      progress.setAttribute('aria-valuetext', `${Math.round(journey.progress * 100)}%, ${stages[journey.stageIndex].name}`);
      pause.disabled = !journey.playing;
      resume.disabled = journey.playing;
      const expelled = journey.mode === 'toxic' && journey.direction < 0 && journey.progress === 0;
      const state = expelled ? 'Đã nôn ra ngoài' : journey.progress === 1 ? 'Hoàn tất hành trình' : journey.playing ? journey.direction < 0 ? 'Đang trào ngược' : 'Đang chạy' : 'Đã tạm dừng';
      if (state !== lastState) {
        get('playback-state').textContent = state;
        lastState = state;
      }
      const key = `${journey.stageIndex}:${journey.mode}:${journey.response}:${journey.direction}`;
      if (key === lastKey) return;
      lastKey = key;
      const index = journey.stageIndex;
      const stage = stages[index];
      const reaction = journey.mode === 'toxic' ? getToxicReaction(index, journey.response, journey.direction) : null;
      get('mode-normal').setAttribute('aria-pressed', String(journey.mode === 'normal'));
      get('mode-toxic').setAttribute('aria-pressed', String(journey.mode === 'toxic'));
      get('response-options').hidden = journey.mode !== 'toxic';
      document.body.classList.toggle('toxic-mode', journey.mode === 'toxic');
      get('stage-number').textContent = `${String(index + 1).padStart(2, '0')} / 07`;
      get('organ-name').textContent = stage.name;
      get('organ-detail').textContent = reaction ? reaction.name : stage.detail;
      get('organ-time').textContent = journey.mode === 'toxic' ? 'Biến thiên theo tác nhân và cơ địa' : stage.time;
      get('organ-ph').textContent = stage.ph;
      get('organ-mechanism').textContent = reaction ? reaction.mechanism : stage.mechanism;
      get('organ-symptoms').textContent = reaction ? reaction.symptom : 'Không minh họa triệu chứng bệnh lý';
      get('ph-marker').style.left = `${stage.phValue / 14 * 100}%`;
      buttons.forEach((button, i) => {
        if (i === index) button.setAttribute('aria-current', 'step');
        else button.removeAttribute('aria-current');
      });
    },
  };
}
