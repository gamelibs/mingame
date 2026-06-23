import './style.css';
import { createGameController } from './game-controller';
import { Behavior } from '../types';
import { LifeStageConfig } from './components/life-stages';
import {
  renderAttributes,
  type AttributeSummary,
  openStateEditor,
  renderEventCard,
  renderGrid,
  renderBoardLegend,
  bindGridClick,
  renderLifeStages,
  renderLogs,
  scrollLogsToBottom,
  renderCardLibrary,
  renderTimeline,
  renderLifeGoalModal,
  renderLifeGoalEvaluation,
  openDrawer,
  closeDrawer,
  isDrawerOpen,
  redrawDrawer,
  setDrawerRender,
  renderShowcaseGrid,
  renderShowcasePagination,
  renderRiskGrid,
  isMajorEvent,
  openBehaviorEditor,
} from './components';
import { BehaviorOverrideSet, loadBehaviorOverrides } from './behavior-overrides';
import { SavedLifeData, SavedLifeMeta } from './game-controller';
import { LifeGoal, LIFE_GOALS } from '../core/life-goals';
import { fetchLifeGoalOpening, fetchChoiceFeedback } from '../services/ai';
import {
  listSavedLives,
  loadSavedLife,
  saveLife,
  deleteSavedLife,
} from './life-storage';

const controller = createGameController({ mode: 'modern', maxAge: 100 });

const lifeStagesEl = document.getElementById('life-stages') as HTMLElement;
const gridEl = document.getElementById('grid') as HTMLElement;
const boardLegendEl = document.getElementById('board-legend') as HTMLElement;
const attributesContentEl = document.getElementById('attributes-content') as HTMLElement;
const currentAgeEl = document.getElementById('current-age') as HTMLElement;
const logsContentEl = document.getElementById('logs-content') as HTMLElement;

const libraryStatsEl = document.getElementById('library-stats') as HTMLElement;
const libraryTagsEl = document.getElementById('library-tags') as HTMLElement;
const timelineEl = document.getElementById('timeline') as HTMLElement;
const loadLifeBtn = document.getElementById('load-life-btn') as HTMLButtonElement;
const saveLifeBtn = document.getElementById('save-life-btn') as HTMLButtonElement;
const autoPlayBtn = document.getElementById('auto-play-btn') as HTMLButtonElement;
const resetBtn = document.getElementById('reset-btn') as HTMLButtonElement;

const loadLifeModal = document.getElementById('load-life-modal') as HTMLElement;
const loadLifeModalClose = document.getElementById('load-life-modal-close') as HTMLElement;
const generatedCasesListEl = document.getElementById('generated-cases-list') as HTMLElement;
const toggleGeneratedCasesBtn = document.getElementById('toggle-generated-cases-btn') as HTMLButtonElement;
const savedLifeListEl = document.getElementById('saved-life-list') as HTMLElement;
const importLifeFileEl = document.getElementById('import-life-file') as HTMLInputElement;

const stateEditorBtn = document.getElementById('state-editor-btn') as HTMLButtonElement;
const saveLifeModal = document.getElementById('save-life-modal') as HTMLElement;
const saveLifeModalClose = document.getElementById('save-life-modal-close') as HTMLElement;
const saveLifeNameEl = document.getElementById('save-life-name') as HTMLInputElement;
const confirmSaveLifeBtn = document.getElementById('confirm-save-life-btn') as HTMLButtonElement;
const downloadLifeBtn = document.getElementById('download-life-btn') as HTMLButtonElement;
const speedSelect = document.getElementById('speed-select') as HTMLSelectElement;
const eventModal = document.getElementById('event-modal') as HTMLElement;
const eventModalBody = document.getElementById('event-modal-body') as HTMLElement;
const eventModalClose = document.getElementById('event-modal-close') as HTMLElement;

const lifeGoalModal = document.getElementById('life-goal-modal') as HTMLElement;
const lifeGoalModalBody = document.getElementById('life-goal-modal-body') as HTMLElement;

const aiOpeningModal = document.getElementById('ai-opening-modal') as HTMLElement;
const aiOpeningModalBody = document.getElementById('ai-opening-modal-body') as HTMLElement;
const aiOpeningModalStart = document.getElementById('ai-opening-modal-start') as HTMLButtonElement;

const evaluationModal = document.getElementById('evaluation-modal') as HTMLElement;
const evaluationModalBody = document.getElementById('evaluation-modal-body') as HTMLElement;
const evaluationModalClose = document.getElementById('evaluation-modal-close') as HTMLElement;

let autoPlayInterval: number | null = null;
let showcaseMode = false;
let showcasePage = 0;
let selectedStageKey: string | null = null;
let stagePage = 0;
const riskOffsets: Record<number, number> = {};

type MobileDrawerType = 'timeline' | 'attributes' | 'logs' | 'stages' | 'library';
let mobileDrawerType: MobileDrawerType | null = null;

function isMobile(): boolean {
  return window.matchMedia('(max-width: 768px)').matches;
}

function showLifeGoalModal(): void {
  lifeGoalModal.classList.remove('hidden');
  renderLifeGoalModal(lifeGoalModalBody, (goal) => {
    controller.setLifeGoal(goal);
    hideLifeGoalModal();
    void showAiOpening(goal);
  }, () => {
    const randomGoal = LIFE_GOALS[Math.floor(Math.random() * LIFE_GOALS.length)];
    controller.setLifeGoal(randomGoal);
    hideLifeGoalModal();
    void showAiOpening(randomGoal);
  });
}

async function showAiOpening(goal: LifeGoal): Promise<void> {
  aiOpeningModalBody.textContent = '正在书写你的人生开场白……';
  aiOpeningModalBody.classList.add('loading');
  aiOpeningModalStart.disabled = true;
  aiOpeningModal.classList.remove('hidden');

  try {
    const state = controller.getState();
    const attributes: Record<string, number> = {
      健康: state.health,
      财富: state.wealth,
      知识: state.knowledge,
      技能: state.skill,
      人脉: state.social,
      幸福: state.happy,
      魅力: state.charm,
      运势: state.luck,
    };
    const opening = await fetchLifeGoalOpening(goal.name, goal.description, attributes);
    aiOpeningModalBody.textContent = opening;
  } catch (err: any) {
    aiOpeningModalBody.textContent = `AI 寄语加载失败：${err.message}`;
  } finally {
    aiOpeningModalBody.classList.remove('loading');
    aiOpeningModalStart.disabled = false;
  }
}

function hideAiOpeningModal(): void {
  aiOpeningModal.classList.add('hidden');
}

function hideLifeGoalModal(): void {
  lifeGoalModal.classList.add('hidden');
}

const LIFE_STAGES: LifeStageConfig[] = [
  { key: 'birth', icon: '👶', title: '出生', subtitle: '人生的起点', minAge: 0, maxAge: 5 },
  { key: 'growth', icon: '📚', title: '成长', subtitle: '学习与成长', minAge: 6, maxAge: 22 },
  { key: 'work', icon: '💼', title: '工作', subtitle: '事业与打拼', minAge: 16, maxAge: 65 },
  { key: 'family', icon: '👨‍👩‍👧', title: '家庭', subtitle: '组建与责任', minAge: 20, maxAge: 70 },
  { key: 'middle', icon: '🌟', title: '中年', subtitle: '稳定与积累', minAge: 40, maxAge: 65 },
  { key: 'old', icon: '🌴', title: '晚年', subtitle: '回顾与传承', minAge: 60, maxAge: 100 },
  { key: 'end', icon: '⏳', title: '终点', subtitle: '生命的终章', minAge: 90, maxAge: 120 },
];

function buildBehaviorNameMap(): Map<string, Behavior> {
  const map = new Map<string, Behavior>();
  for (const behavior of controller.getAllBehaviors()) {
    map.set(behavior.name, behavior);
  }
  return map;
}

function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function selectRecommendedEvent(): { x: number; y: number; behavior: Behavior } | null {
  const grid = controller.getGrid();
  const options: { x: number; y: number; behavior: Behavior }[] = [];

  for (let y = 1; y <= 10; y++) {
    for (let x = 1; x <= 10; x++) {
      const b = grid[y - 1][x - 1];
      if (b) options.push({ x, y, behavior: b });
    }
  }

  if (options.length === 0) return null;

  const major = options.filter((o) => isMajorEvent(o.behavior));
  return shuffle(major.length > 0 ? major : options)[0];
}

function getAutoPlaySpeed(): number {
  return parseInt(speedSelect.value, 10) || 500;
}

function updateAutoPlayButton(running: boolean): void {
  if (controller.isReplaying()) {
    autoPlayBtn.textContent = running ? '停止回放' : '开始回放';
  } else {
    autoPlayBtn.textContent = running ? '停止人生' : '自动人生';
  }
  autoPlayBtn.classList.toggle('running', running);
}

function stopAutoPlay(): void {
  if (autoPlayInterval !== null) {
    window.clearInterval(autoPlayInterval);
    autoPlayInterval = null;
  }
  updateAutoPlayButton(false);
}

function startAutoPlay(): void {
  if (controller.isGameOver()) return;

  updateAutoPlayButton(true);

  const tick = () => {
    if (controller.isGameOver()) {
      stopAutoPlay();
      return;
    }
    const event = selectRecommendedEvent();
    if (!event) {
      stopAutoPlay();
      return;
    }
    executeEvent(event.x, event.y, event.behavior, 1.0);
  };

  tick();
  autoPlayInterval = window.setInterval(tick, getAutoPlaySpeed());
}

function toggleAutoPlay(): void {
  if (autoPlayInterval !== null) {
    stopAutoPlay();
  } else {
    startAutoPlay();
  }
}

let replayInterval: number | null = null;

function stopReplay(): void {
  if (replayInterval !== null) {
    window.clearInterval(replayInterval);
    replayInterval = null;
  }
  controller.stopReplay();
  updateAutoPlayButton(false);
}

function startReplay(): void {
  if (!controller.isReplaying()) return;

  updateAutoPlayButton(true);

  const tick = () => {
    if (!controller.isReplaying()) {
      stopReplay();
      return;
    }
    const hasNext = controller.replayStep();
    renderAll();
    if (!hasNext) {
      stopReplay();
    }
  };

  tick();
  replayInterval = window.setInterval(tick, getAutoPlaySpeed());
}

function downloadLifeData(name: string, json: string): void {
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name.replace(/\s+/g, '_')}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function renderLifeList(
  container: HTMLElement,
  items: { data?: SavedLifeData; meta?: SavedLifeMeta; isSample?: boolean }[],
  onSelect: (data: SavedLifeData | undefined, meta: SavedLifeMeta) => void,
  onDelete?: (id: string) => void
): void {
  container.innerHTML = '';
  if (items.length === 0) {
    container.innerHTML = '<div class="life-empty">暂无数据</div>';
    return;
  }

  for (const item of items) {
    const meta = item.isSample
      ? {
          id: 'sample',
          name: '示例人生',
          savedAt: item.data!.savedAt,
          age: item.data!.records.length > 0 ? item.data!.records[item.data!.records.length - 1].age : 1,
          summary: `共 ${item.data!.records.length} 年 · 示例模式`,
        }
      : item.meta!;

    const el = document.createElement('div');
    el.className = 'life-list-item';
    el.innerHTML = `
      <div class="life-list-info">
        <div class="life-list-name">${meta.name}</div>
        <div class="life-list-meta">${meta.summary} · ${meta.age}岁 · ${new Date(meta.savedAt).toLocaleString('zh-CN')}</div>
      </div>
      <div class="life-list-actions">
        <button class="seal-btn secondary life-load-btn">加载回放</button>
        ${!item.isSample && onDelete ? '<button class="seal-btn secondary life-delete-btn">删除</button>' : ''}
      </div>
    `;

    el.querySelector('.life-load-btn')!.addEventListener('click', () => {
      onSelect(item.data, meta);
    });

    if (!item.isSample && onDelete) {
      el.querySelector('.life-delete-btn')!.addEventListener('click', () => {
        onDelete(meta.id);
        renderLoadModal();
      });
    }

    container.appendChild(el);
  }
}

interface GeneratedCaseManifestItem {
  file: string;
  name: string;
  age: number;
  reason: string;
  summary: string;
}

let generatedCasesMeta: SavedLifeMeta[] | null = null;
const generatedCaseFileMap = new Map<string, string>();
const generatedCaseDataCache = new Map<string, SavedLifeData>();

async function fetchGeneratedCases(): Promise<SavedLifeMeta[]> {
  if (generatedCasesMeta) return generatedCasesMeta;
  try {
    const response = await fetch('/cases/manifest.json');
    if (!response.ok) return [];
    const list = (await response.json()) as GeneratedCaseManifestItem[];
    generatedCasesMeta = list.map((item) => {
      const id = `case-${item.file}`;
      generatedCaseFileMap.set(id, item.file);
      return {
        id,
        name: item.name,
        savedAt: new Date().toISOString(),
        age: item.age,
        summary: `共 ${item.age} 年 · ${item.reason} · ${item.summary}`,
      };
    });
    return generatedCasesMeta;
  } catch {
    return [];
  }
}

async function fetchGeneratedCaseData(file: string): Promise<SavedLifeData | null> {
  if (generatedCaseDataCache.has(file)) return generatedCaseDataCache.get(file)!;
  try {
    const response = await fetch(`/cases/${file}`);
    if (!response.ok) return null;
    const data = (await response.json()) as SavedLifeData;
    generatedCaseDataCache.set(file, data);
    return data;
  } catch {
    return null;
  }
}

function showLoadModal(): void {
  loadLifeModal.classList.remove('hidden');
  renderLoadModal();
}

function hideLoadModal(): void {
  loadLifeModal.classList.add('hidden');
}

async function renderLoadModal(): Promise<void> {
  toggleGeneratedCasesBtn.textContent = '删除全部案例';

  const generatedCases = await fetchGeneratedCases();
  generatedCasesListEl.innerHTML = '';
  if (generatedCases.length > 0) {
    toggleGeneratedCasesBtn.classList.remove('hidden');
    renderLifeList(
      generatedCasesListEl,
      generatedCases.map((meta) => ({ meta })),
      async (_, meta) => {
        const file = generatedCaseFileMap.get(meta.id);
        if (!file) return;
        const data = await fetchGeneratedCaseData(file);
        if (!data) return;
        hideLoadModal();
        controller.startReplay(data);
        startReplay();
      }
    );
  } else {
    toggleGeneratedCasesBtn.classList.add('hidden');
    generatedCasesListEl.innerHTML = '<div class="life-empty">未找到自动人生案例</div>';
  }

  const saved = listSavedLives();
  savedLifeListEl.innerHTML = '';
  renderLifeList(
    savedLifeListEl,
    saved.map((meta) => ({ meta })),
    (_, meta) => {
      const data = loadSavedLife(meta.id);
      if (!data) return;
      hideLoadModal();
      controller.startReplay(data);
      startReplay();
    },
    (id) => deleteSavedLife(id)
  );
}

function handleImportFile(file: File): void {
  const reader = new FileReader();
  reader.onload = () => {
    const json = String(reader.result);
    const data = controller.importLifeData(json);
    if (!data) {
      alert('导入失败：文件格式不正确');
      return;
    }
    hideLoadModal();
    controller.startReplay(data);
    startReplay();
  };
  reader.readAsText(file);
}

function showSaveModal(): void {
  if (controller.isReplaying()) {
    alert('回放过程中无法保存，请先停止回放');
    return;
  }
  if (controller.getState().history.length === 0) {
    alert('当前还没有任何人生记录，请先进行游戏');
    return;
  }
  saveLifeNameEl.value = `人生 ${new Date().toLocaleString('zh-CN')}`;
  saveLifeModal.classList.remove('hidden');
}

function hideSaveModal(): void {
  saveLifeModal.classList.add('hidden');
}

function confirmSaveLife(): void {
  const name = saveLifeNameEl.value.trim();
  const data = controller.getLifeData();
  saveLife(name, data);
  hideSaveModal();
  alert('人生数据已保存到本地');
}

function handleDownloadLife(): void {
  const name = saveLifeNameEl.value.trim() || '人生数据';
  const json = controller.exportLifeData();
  downloadLifeData(name, json);
  hideSaveModal();
}

function executeEvent(x: number, y: number, behavior: Behavior, weight: number): void {
  if (controller.isGameOver()) return;

  const result = controller.selectBehavior(x, y, weight);
  if (!result.success || !result.log) {
    console.warn('执行失败：', result.message);
    return;
  }

  hideEventModal();
  renderAll();

  // 手动操作时，请求 AI 对本次选择给出评语
  if (autoPlayInterval === null) {
    const goal = controller.getConfig().lifeGoal;
    const state = controller.getState();
    const historyNames = state.history.map((h) => h.behaviorName);
    fetchChoiceFeedback(
      goal?.name || '未知目标',
      state.age,
      behavior.name,
      behavior.category,
      historyNames
    )
      .then((feedback) => {
        result.log!.aiComment = feedback.comment;
        renderAll();
      })
      .catch(() => {
        // AI 失败时静默，不影响游戏流程
      });
  }
}

function showEventModal(x: number, y: number, behavior: Behavior): void {
  if (controller.isGameOver()) return;

  eventModal.classList.remove('hidden');
  const successRate = controller.getSuccessRate(behavior, behavior.riskLevel);

  renderEventCard(
    eventModalBody,
    controller.getState(),
    behavior,
    successRate,
    () => executeEvent(x, y, behavior, 1.0),
    () => hideEventModal()
  );
}

function hideEventModal(): void {
  eventModal.classList.add('hidden');
  eventModalBody.innerHTML = '';
}

function handleGridClick(x: number, y: number, behavior: Behavior | null): void {
  if (showcaseMode || selectedStageKey) return;
  if (!behavior) return;
  showEventModal(x, y, behavior);
}

function showEvaluationModal(): void {
  const evaluation = controller.evaluateLifeGoal();
  if (!evaluation) return;
  evaluationModal.classList.remove('hidden');
  renderLifeGoalEvaluation(evaluationModalBody, evaluation);
}

function hideEvaluationModal(): void {
  evaluationModal.classList.add('hidden');
}

function renderGameOver(): void {
  const reason = controller.getGameOverReason();
  const existing = document.querySelector('.game-over-reason');

  if (reason && !existing) {
    const overEl = document.createElement('div');
    overEl.className = 'game-over-reason';
    overEl.textContent = `人生落幕：${reason}`;
    gridEl.parentElement?.appendChild(overEl);

    // 死亡后弹出目标评价弹窗，并已在人生日志中生成总结条目
    if (evaluationModal.classList.contains('hidden')) {
      showEvaluationModal();
    }
  } else if (!reason && existing) {
    existing.remove();
  }

  if (reason) {
    stopAutoPlay();
  }
}

let editorOpen = false;

function openCategoryEditor(category: string): void {
  if (editorOpen) return;
  editorOpen = true;
  const mode = controller.getConfig().mode;
  const existingOverrides = loadBehaviorOverrides(mode);

  openBehaviorEditor(
    category,
    controller.getBaseBehaviors(),
    mode,
    existingOverrides,
    (overrides: BehaviorOverrideSet) => {
      controller.applyBehaviorOverrides(overrides);
      renderAll();
    },
    () => {
      editorOpen = false;
    }
  );
}

function getStageBehaviors(): Behavior[] {
  if (!selectedStageKey) return [];
  const stage = LIFE_STAGES.find((s) => s.key === selectedStageKey);
  if (!stage) return [];
  return controller.getAllBehaviors().filter(
    (b) => stage.minAge <= b.maxAge && stage.maxAge >= b.minAge
  );
}

function selectStage(key: string): void {
  if (selectedStageKey === key) {
    selectedStageKey = null;
  } else {
    selectedStageKey = key;
    stopAutoPlay();
  }
  stagePage = 0;
  for (let r = 1; r <= 10; r++) riskOffsets[r] = 0;
  renderAll();
}

function toggleShowcase(): void {
  showcaseMode = !showcaseMode;
  showcasePage = 0;
  selectedStageKey = null;
  if (showcaseMode) stopAutoPlay();
  renderAll();
}

function createMobileDrawerRender(type: MobileDrawerType): (body: HTMLElement) => void {
  return (body: HTMLElement) => {
    const state = controller.getState();
    const logs = controller.getLogs();
    const behaviorMap = buildBehaviorNameMap();
    const allBehaviors = controller.getAllBehaviors();
    const annualSummary = controller.getAnnualSummary();

    switch (type) {
      case 'timeline': {
        const timelineContainer = document.createElement('div');
        timelineContainer.className = 'timeline';
        body.appendChild(timelineContainer);
        renderTimeline(
          timelineContainer,
          controller.getEnergyCurve(),
          controller.getAttributeCurves(),
          state.age,
          controller.getConfig().maxAge
        );
        break;
      }
      case 'attributes':
        renderAttributes(body, state, annualSummary);
        break;
      case 'logs':
        renderLogs(body, logs, behaviorMap);
        scrollLogsToBottom(body);
        break;
      case 'stages':
        renderLifeStages(body, LIFE_STAGES, selectedStageKey, selectStage);
        break;
      case 'library': {
        const wrapper = document.createElement('div');
        wrapper.className = 'card-library';
        const statsEl = document.createElement('span');
        const tagsEl = document.createElement('div');
        wrapper.appendChild(statsEl);
        wrapper.appendChild(tagsEl);
        body.appendChild(wrapper);
        renderCardLibrary(
          statsEl,
          tagsEl,
          state.history,
          allBehaviors,
          openCategoryEditor,
          showcaseMode || selectedStageKey !== null,
          toggleShowcase
        );
        break;
      }
    }
  };
}

function openMobileDrawer(type: MobileDrawerType): void {
  mobileDrawerType = type;
  const titleMap: Record<MobileDrawerType, string> = {
    timeline: '人生时间轴',
    attributes: '当前状态',
    logs: '人生日志',
    stages: '人生阶段',
    library: '人生卡牌库',
  };

  const options: Parameters<typeof openDrawer>[2] =
    type === 'attributes'
      ? {
          showAction: true,
          actionLabel: '⚙️',
          onAction: () => {
            stopAutoPlay();
            stopReplay();
            openStateEditor(controller.getGameRules(), (rules) => {
              controller.setGameRules(rules);
              controller.reset();
              showcaseMode = false;
              showcasePage = 0;
              selectedStageKey = null;
              stagePage = 0;
              for (let r = 1; r <= 10; r++) riskOffsets[r] = 0;
              const existing = document.querySelector('.game-over-reason');
              if (existing) existing.remove();
              hideEventModal();
              hideEvaluationModal();
              renderAll();
            }, () => {});
          },
        }
      : undefined;

  openDrawer(titleMap[type], createMobileDrawerRender(type), options);
}

function renderAll(): void {
  const state = controller.getState();
  const logs = controller.getLogs();
  const behaviorMap = buildBehaviorNameMap();
  const allBehaviors = controller.getAllBehaviors();
  const stageBehaviors = selectedStageKey ? getStageBehaviors() : [];

  if (!isMobile()) {
    renderLifeStages(lifeStagesEl, LIFE_STAGES, selectedStageKey, selectStage);
  }

  if (selectedStageKey) {
    renderRiskGrid(gridEl, stageBehaviors, riskOffsets, (riskLevel) => {
      const total = stageBehaviors.filter((b) => b.riskLevel === riskLevel).length;
      const next = (riskOffsets[riskLevel] || 0) + 9;
      riskOffsets[riskLevel] = next >= total ? 0 : next;
      renderAll();
    });
  } else if (showcaseMode) {
    renderShowcaseGrid(gridEl, allBehaviors, showcasePage);
  } else {
    renderGrid(gridEl, controller.getGrid());
  }

  renderBoardLegend(boardLegendEl);

  if (showcaseMode) {
    renderShowcasePagination(boardLegendEl, allBehaviors, showcasePage, (page) => {
      showcasePage = page;
      renderAll();
    });
  }

  const annualSummary = controller.getAnnualSummary();
  currentAgeEl.textContent = `年龄：${state.age} 岁`;

  if (!isMobile()) {
    renderAttributes(attributesContentEl, state, annualSummary);
    renderLogs(logsContentEl, logs, behaviorMap);
    scrollLogsToBottom(logsContentEl);
    renderCardLibrary(
      libraryStatsEl,
      libraryTagsEl,
      state.history,
      allBehaviors,
      openCategoryEditor,
      showcaseMode || selectedStageKey !== null,
      toggleShowcase
    );
  } else if (isDrawerOpen() && mobileDrawerType) {
    setDrawerRender(createMobileDrawerRender(mobileDrawerType));
    redrawDrawer();
  }

  if (!isMobile()) {
    renderTimeline(
      timelineEl,
      controller.getEnergyCurve(),
      controller.getAttributeCurves(),
      state.age,
      controller.getConfig().maxAge
    );
  }
  renderGameOver();
}

autoPlayBtn.addEventListener('click', () => {
  if (controller.isReplaying()) {
    stopReplay();
  } else {
    toggleAutoPlay();
  }
});

loadLifeBtn.addEventListener('click', showLoadModal);
saveLifeBtn.addEventListener('click', showSaveModal);

resetBtn.addEventListener('click', () => {
  stopAutoPlay();
  stopReplay();
  showcaseMode = false;
  showcasePage = 0;
  selectedStageKey = null;
  stagePage = 0;
  for (let r = 1; r <= 10; r++) riskOffsets[r] = 0;
  hideEventModal();
  hideLoadModal();
  hideSaveModal();
  hideEvaluationModal();
  showLifeGoalModal();
});

stateEditorBtn.addEventListener('click', () => {
  stopAutoPlay();
  stopReplay();
  openStateEditor(controller.getGameRules(), (rules) => {
    controller.setGameRules(rules);
    // 规则改变后重置人生，确保新规则生效
    controller.reset();
    showcaseMode = false;
    showcasePage = 0;
    selectedStageKey = null;
    stagePage = 0;
    for (let r = 1; r <= 10; r++) riskOffsets[r] = 0;
    const existing = document.querySelector('.game-over-reason');
    if (existing) existing.remove();
    hideEventModal();
    hideEvaluationModal();
    renderAll();
  }, () => {
    // 关闭弹窗无额外操作
  });
});

speedSelect.addEventListener('change', () => {
  if (autoPlayInterval !== null) {
    stopAutoPlay();
    startAutoPlay();
  }
  if (replayInterval !== null) {
    stopReplay();
    startReplay();
  }
});

eventModalClose.addEventListener('click', hideEventModal);

eventModal.addEventListener('click', (event) => {
  if (event.target === eventModal || event.target === eventModal.querySelector('.event-modal-backdrop')) {
    hideEventModal();
  }
});

loadLifeModalClose.addEventListener('click', hideLoadModal);
toggleGeneratedCasesBtn.addEventListener('click', async () => {
  if (!confirm('确定要删除全部自动人生案例吗？此操作不可恢复。')) return;
  try {
    const res = await fetch('/api/clear-cases', { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      // 清空内存缓存，避免删除后仍能从缓存加载
      generatedCaseFileMap.clear();
      generatedCaseDataCache.clear();
      generatedCasesMeta = null;
      renderLoadModal();
    } else {
      alert('删除失败：' + (data.message || '未知错误'));
    }
  } catch {
    alert('删除请求失败，请确认当前在开发/预览服务器环境下运行。');
  }
});
loadLifeModal.addEventListener('click', (event) => {
  if (event.target === loadLifeModal || event.target === loadLifeModal.querySelector('.life-modal-backdrop')) {
    hideLoadModal();
  }
});

importLifeFileEl.addEventListener('change', (event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) handleImportFile(file);
});

saveLifeModalClose.addEventListener('click', hideSaveModal);
confirmSaveLifeBtn.addEventListener('click', confirmSaveLife);
downloadLifeBtn.addEventListener('click', handleDownloadLife);
saveLifeModal.addEventListener('click', (event) => {
  if (event.target === saveLifeModal || event.target === saveLifeModal.querySelector('.life-modal-backdrop')) {
    hideSaveModal();
  }
});

// 移动端面板抽屉触发按钮
document.getElementById('mobile-timeline-btn')?.addEventListener('click', () => {
  openMobileDrawer('timeline');
});

document.getElementById('mobile-status-btn')?.addEventListener('click', () => {
  openMobileDrawer('attributes');
});

document.querySelectorAll('[data-drawer]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const target = (btn as HTMLElement).dataset.drawer as MobileDrawerType;
    if (target) openMobileDrawer(target);
  });
});

// 窗口尺寸跨越断点时重置移动端状态
window.matchMedia('(max-width: 768px)').addEventListener('change', () => {
  if (!isMobile() && isDrawerOpen()) {
    closeDrawer();
    mobileDrawerType = null;
  }
  renderAll();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (!eventModal.classList.contains('hidden')) hideEventModal();
    if (!loadLifeModal.classList.contains('hidden')) hideLoadModal();
    if (!saveLifeModal.classList.contains('hidden')) hideSaveModal();
    if (!lifeGoalModal.classList.contains('hidden')) hideLifeGoalModal();
    if (!evaluationModal.classList.contains('hidden')) hideEvaluationModal();
    if (isDrawerOpen()) closeDrawer();
  }
});

evaluationModalClose.addEventListener('click', hideEvaluationModal);

evaluationModal.addEventListener('click', (event) => {
  if (event.target === evaluationModal || event.target === evaluationModal.querySelector('.evaluation-modal-backdrop')) {
    hideEvaluationModal();
  }
});

lifeGoalModal.addEventListener('click', (event) => {
  if (event.target === lifeGoalModal || event.target === lifeGoalModal.querySelector('.life-goal-modal-backdrop')) {
    // 人生目标是强制选择，点击背景不关闭
  }
});

aiOpeningModalStart.addEventListener('click', () => {
  hideAiOpeningModal();
  renderAll();
});

aiOpeningModal.addEventListener('click', (event) => {
  if (event.target === aiOpeningModal || event.target === aiOpeningModal.querySelector('.ai-opening-modal-backdrop')) {
    // 必须点击“开始人生”才能关闭
  }
});

bindGridClick(gridEl, handleGridClick);

showLifeGoalModal();
