import { stages } from './digestive-data.js';

export function createUI(journey) {
  const get = id => document.getElementById(id);
  const progress = get('progress');
  const pause = get('pause');
  const resume = get('resume');
  const speed = get('speed');
  const buttons = stages.map((stage, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    const count = document.createElement('span');
    count.className = 'stage-count';
    count.textContent = String(index + 1).padStart(2, '0');
    button.append(count, stage.shortName);
    button.addEventListener('click', () => journey.seek(stage.start));
    get('stage-buttons').append(button);
    return button;
  });
  pause.addEventListener('click', () => { journey.playing = false; });
  resume.addEventListener('click', () => {
    if (journey.progress === 1) journey.seek(0);
    journey.playing = true;
  });
  speed.addEventListener('click', () => {
    journey.speed = journey.speed === 4 ? 1 : journey.speed * 2;
    speed.textContent = `Tua nhanh · ${journey.speed}×`;
  });
  get('restart').addEventListener('click', () => {
    journey.seek(0);
    journey.playing = true;
  });
  progress.addEventListener('input', () => journey.seek(Number(progress.value) / 1000));
  let lastStage = -1;
  let lastState = '';
  return {
    update() {
      progress.value = Math.round(journey.progress * 1000);
      get('progress-value').textContent = `${Math.round(journey.progress * 100)}%`;
      progress.setAttribute('aria-valuetext', `${Math.round(journey.progress * 100)}%, ${stages[journey.stageIndex].name}`);
      pause.disabled = !journey.playing;
      resume.disabled = journey.playing;
      const state = journey.progress === 1 ? 'Hoàn tất hành trình' : journey.playing ? 'Đang chạy' : 'Đã tạm dừng';
      if (state !== lastState) {
        get('playback-state').textContent = state;
        lastState = state;
      }
      if (lastStage === journey.stageIndex) return;
      lastStage = journey.stageIndex;
      const stage = stages[lastStage];
      get('stage-number').textContent = `${String(lastStage + 1).padStart(2, '0')} / 05`;
      get('organ-name').textContent = stage.name;
      get('organ-detail').textContent = stage.detail;
      get('organ-time').textContent = stage.time;
      get('organ-ph').textContent = stage.ph;
      get('organ-mechanism').textContent = stage.mechanism;
      get('ph-marker').style.left = `${stage.phValue / 14 * 100}%`;
      buttons.forEach((button, index) => {
        if (index === lastStage) button.setAttribute('aria-current', 'step');
        else button.removeAttribute('aria-current');
      });
    },
  };
}
