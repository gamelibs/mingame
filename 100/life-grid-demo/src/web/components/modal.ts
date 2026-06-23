import { Behavior, PlayerState } from '../../types';

export interface ModalCallbacks {
  onConfirm: (weight: number) => void;
  onCancel: () => void;
}

const DECISION_DURATION = 5000;

let currentCallbacks: ModalCallbacks | null = null;
let rafId: number | null = null;
let timeoutId: number | null = null;
let startTime = 0;

function getModalElements() {
  const modal = document.getElementById('behavior-modal');
  if (!modal) {
    throw new Error('behavior-modal element not found');
  }

  const titleEl = modal.querySelector<HTMLElement>('#modal-title')!;
  const descEl = modal.querySelector<HTMLElement>('#modal-description')!;
  const infoEl = modal.querySelector<HTMLElement>('#modal-info')!;
  const actionsEl = modal.querySelector<HTMLElement>('.modal-actions')!;

  let countdownEl = modal.querySelector<HTMLElement>('#modal-countdown');
  if (!countdownEl) {
    countdownEl = document.createElement('div');
    countdownEl.id = 'modal-countdown';
    actionsEl.parentNode?.insertBefore(countdownEl, actionsEl);
  }

  const confirmBtn = modal.querySelector<HTMLButtonElement>('#modal-confirm')!;
  const cancelBtn = modal.querySelector<HTMLButtonElement>('#modal-cancel')!;

  return {
    modal,
    titleEl,
    descEl,
    infoEl,
    countdownEl,
    confirmBtn,
    cancelBtn,
  };
}

function clearTimers(): void {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  if (timeoutId !== null) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
}

export function hideBehaviorModal(): void {
  clearTimers();
  currentCallbacks = null;
  const modal = document.getElementById('behavior-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

function confirmWithWeight(weight: number): void {
  if (!currentCallbacks) return;
  const callbacks = currentCallbacks;
  hideBehaviorModal();
  callbacks.onConfirm(weight);
}

function cancelBehaviorModal(): void {
  if (!currentCallbacks) return;
  const callbacks = currentCallbacks;
  hideBehaviorModal();
  callbacks.onCancel();
}

export function showBehaviorModal(
  behavior: Behavior,
  state: PlayerState,
  callbacks: ModalCallbacks
): void {
  currentCallbacks = callbacks;

  const {
    modal,
    titleEl,
    descEl,
    infoEl,
    countdownEl,
    confirmBtn,
    cancelBtn,
  } = getModalElements();

  modal.classList.remove('hidden');

  titleEl.textContent = behavior.name;
  descEl.textContent = behavior.description;
  infoEl.innerHTML = [
    `风险等级：n${behavior.riskLevel}`,
    `收益等级：${behavior.rewardLevel}`,
    `失败等级：${behavior.failureLevel}`,
    `当前年龄：${state.age} 岁`,
  ].join('<br>');

  // 倒计时进度条
  countdownEl.innerHTML = '<div>模拟 5 秒决策时间</div>';
  const bar = document.createElement('div');
  bar.className = 'progress-bar';
  const fill = document.createElement('div');
  fill.className = 'progress-fill';
  fill.style.width = '0%';
  bar.appendChild(fill);
  countdownEl.appendChild(bar);

  clearTimers();
  startTime = performance.now();

  function updateProgress(now: number): void {
    const elapsed = now - startTime;
    const ratio = Math.min(1, Math.max(0, elapsed / DECISION_DURATION));
    fill.style.width = `${ratio * 100}%`;
    if (ratio < 1) {
      rafId = requestAnimationFrame(updateProgress);
    }
  }
  rafId = requestAnimationFrame(updateProgress);

  timeoutId = window.setTimeout(() => {
    confirmWithWeight(1.0);
  }, DECISION_DURATION);

  // 克隆按钮，避免重复绑定监听器
  const newConfirmBtn = confirmBtn.cloneNode(true) as HTMLButtonElement;
  const newCancelBtn = cancelBtn.cloneNode(true) as HTMLButtonElement;
  confirmBtn.parentNode?.replaceChild(newConfirmBtn, confirmBtn);
  cancelBtn.parentNode?.replaceChild(newCancelBtn, cancelBtn);

  newConfirmBtn.addEventListener('click', () => {
    const elapsed = performance.now() - startTime;
    const ratio = Math.min(1, Math.max(0, elapsed / DECISION_DURATION));
    const weight = 0.5 + ratio * 0.5;
    confirmWithWeight(weight);
  });

  newCancelBtn.addEventListener('click', () => {
    cancelBehaviorModal();
  });

  modal.onclick = (event) => {
    if (event.target === modal) {
      cancelBehaviorModal();
    }
  };
}
