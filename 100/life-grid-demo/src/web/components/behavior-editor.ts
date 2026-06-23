import { Behavior } from '../../types';
import { CATEGORY_ORDER, CATEGORY_ICONS } from '../../core/category';
import { GameMode } from '../game-controller';
import { BehaviorOverrideSet, createEmptyOverrideSet } from '../behavior-overrides';

interface EditorRow {
  id: string;
  name: HTMLInputElement;
  minAge: HTMLInputElement;
  maxAge: HTMLInputElement;
  riskLevel: HTMLInputElement;
  rewardLevel: HTMLInputElement;
  failureLevel: HTMLInputElement;
  unlockWealth: HTMLInputElement;
  balanceEffect: HTMLInputElement;
  tags: HTMLInputElement;
  description: HTMLInputElement;
  checkbox: HTMLInputElement;
}

function clampRisk(value: number): Behavior['riskLevel'] {
  return Math.max(1, Math.min(10, Math.round(value))) as Behavior['riskLevel'];
}

function readRow(row: EditorRow): Partial<Behavior> | null {
  const minAge = parseInt(row.minAge.value, 10);
  const maxAge = parseInt(row.maxAge.value, 10);
  const riskLevel = parseInt(row.riskLevel.value, 10);
  const rewardLevel = parseInt(row.rewardLevel.value, 10);
  const failureLevel = parseInt(row.failureLevel.value, 10);
  const unlockWealth = parseInt(row.unlockWealth.value, 10);
  const balanceEffect = parseInt(row.balanceEffect.value, 10);

  if (
    isNaN(minAge) ||
    isNaN(maxAge) ||
    isNaN(riskLevel) ||
    isNaN(rewardLevel) ||
    isNaN(failureLevel) ||
    isNaN(unlockWealth) ||
    isNaN(balanceEffect)
  ) {
    return null;
  }

  const tags = row.tags.value
    .split(/[,，、]/)
    .map((t) => t.trim())
    .filter(Boolean);

  return {
    name: row.name.value.trim(),
    minAge,
    maxAge,
    riskLevel: clampRisk(riskLevel),
    rewardLevel,
    failureLevel,
    unlockWealth,
    balanceEffect,
    tags,
    description: row.description.value.trim(),
  };
}

function createNumberInput(value: number | string): HTMLInputElement {
  const input = document.createElement('input');
  input.type = 'number';
  input.className = 'editor-table-input';
  input.value = String(value);
  return input;
}

function createTextInput(value: string, placeholder = ''): HTMLInputElement {
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'editor-table-input';
  input.value = value;
  if (placeholder) input.placeholder = placeholder;
  return input;
}

function createBehaviorRow(behavior: Behavior): { tr: HTMLTableRowElement; row: EditorRow } {
  const tr = document.createElement('tr');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'editor-row-checkbox';

  const name = createTextInput(behavior.name);
  const minAge = createNumberInput(behavior.minAge);
  const maxAge = createNumberInput(behavior.maxAge);
  const riskLevel = createNumberInput(behavior.riskLevel);
  riskLevel.min = '1';
  riskLevel.max = '10';
  const rewardLevel = createNumberInput(behavior.rewardLevel);
  const failureLevel = createNumberInput(behavior.failureLevel);
  const unlockWealth = createNumberInput(behavior.unlockWealth);
  const balanceEffect = createNumberInput(behavior.balanceEffect);
  const tags = createTextInput(behavior.tags.join('、'), '标签');
  const description = createTextInput(behavior.description, '描述');

  const cells: HTMLElement[] = [
    checkbox,
    name,
    minAge,
    maxAge,
    riskLevel,
    rewardLevel,
    failureLevel,
    unlockWealth,
    balanceEffect,
    tags,
    description,
  ];
  for (const cell of cells) {
    const td = document.createElement('td');
    td.appendChild(cell instanceof HTMLInputElement ? cell : document.createElement('span'));
    tr.appendChild(td);
  }

  return {
    tr,
    row: {
      id: behavior.id,
      name,
      minAge,
      maxAge,
      riskLevel,
      rewardLevel,
      failureLevel,
      unlockWealth,
      balanceEffect,
      tags,
      description,
      checkbox,
    },
  };
}

function createTable(behaviors: Behavior[]): { table: HTMLTableElement; rows: EditorRow[] } {
  const table = document.createElement('table');
  table.className = 'editor-table';

  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  const headers = [
    '',
    '名称',
    '最小年龄',
    '最大年龄',
    '风险',
    '收益',
    '失败',
    '解锁财富',
    '平衡影响',
    '标签',
    '描述',
  ];
  for (const text of headers) {
    const th = document.createElement('th');
    th.textContent = text;
    headerRow.appendChild(th);
  }
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  const rows: EditorRow[] = [];

  for (const behavior of behaviors) {
    const { tr, row } = createBehaviorRow(behavior);
    tbody.appendChild(tr);
    rows.push(row);
  }

  table.appendChild(tbody);
  return { table, rows };
}

function generateId(): string {
  return `new_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function createDefaultBehavior(category: string): Behavior {
  return {
    id: generateId(),
    name: '新行为',
    category,
    minAge: 1,
    maxAge: 120,
    riskLevel: 1,
    rewardLevel: 1,
    failureLevel: 1,
    unlockWealth: 0,
    balanceEffect: 0,
    tags: [category],
    description: '',
  };
}

function computeOverrideSet(
  baseBehaviors: Behavior[],
  effective: Behavior[]
): BehaviorOverrideSet {
  const baseMap = new Map(baseBehaviors.map((b) => [b.id, b]));
  const baseIds = new Set(baseMap.keys());
  const effectiveIds = new Set(effective.map((b) => b.id));

  const deleted: string[] = [];
  for (const id of baseIds) {
    if (!effectiveIds.has(id)) deleted.push(id);
  }

  const added: Behavior[] = [];
  const modified: Record<string, Partial<Behavior>> = {};

  for (const b of effective) {
    if (!baseIds.has(b.id)) {
      added.push(b);
      continue;
    }
    const original = baseMap.get(b.id)!;
    const changed: Partial<Behavior> = {};
    for (const key of Object.keys(b) as Array<keyof Behavior>) {
      if (JSON.stringify(b[key]) !== JSON.stringify(original[key])) {
        (changed as any)[key] = b[key];
      }
    }
    if (Object.keys(changed).length > 0) {
      modified[b.id] = changed;
    }
  }

  return { modified, deleted, added };
}

export function openBehaviorEditor(
  initialCategory: string,
  baseBehaviors: Behavior[],
  mode: GameMode,
  existingOverrides: BehaviorOverrideSet,
  onSave: (overrides: BehaviorOverrideSet) => void,
  onClose: () => void
): void {
  let currentCategory = initialCategory;
  let effective: Behavior[] = applyEffective(baseBehaviors, existingOverrides);
  let tableRows: EditorRow[] = [];
  let tableContainer: HTMLElement | null = null;

  function applyEffective(base: Behavior[], overrides: BehaviorOverrideSet): Behavior[] {
    const deletedSet = new Set(overrides.deleted);
    const result: Behavior[] = [];
    for (const b of base) {
      if (deletedSet.has(b.id)) continue;
      const patch = overrides.modified[b.id];
      if (patch) {
        result.push({ ...b, ...patch, id: b.id });
      } else {
        result.push(b);
      }
    }
    for (const b of overrides.added) {
      result.push(b);
    }
    return result;
  }

  const overlay = document.createElement('div');
  overlay.className = 'editor-modal';

  const backdrop = document.createElement('div');
  backdrop.className = 'editor-modal-backdrop';
  backdrop.addEventListener('click', closeEditor);

  const content = document.createElement('div');
  content.className = 'editor-modal-content';

  const header = document.createElement('div');
  header.className = 'editor-modal-header';

  const title = document.createElement('h2');
  title.textContent = '编辑行为数据库';

  const toolbar = document.createElement('div');
  toolbar.className = 'editor-toolbar';

  const categorySelect = document.createElement('select');
  categorySelect.className = 'editor-toolbar-select';
  for (const category of CATEGORY_ORDER) {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = `${CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS]} ${category}`;
    if (category === currentCategory) option.selected = true;
    categorySelect.appendChild(option);
  }
  categorySelect.addEventListener('change', () => {
    applyCurrentChanges();
    currentCategory = categorySelect.value;
    renderTable();
    updateCount();
  });

  const countEl = document.createElement('span');
  countEl.className = 'editor-modal-count';

  const addBtn = document.createElement('button');
  addBtn.className = 'seal-btn';
  addBtn.textContent = '+ 添加行为';
  addBtn.addEventListener('click', () => {
    applyCurrentChanges();
    const nb = createDefaultBehavior(currentCategory);
    effective.push(nb);
    renderTable();
    updateCount();
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'seal-btn secondary';
  deleteBtn.textContent = '删除选中';
  deleteBtn.addEventListener('click', () => {
    applyCurrentChanges();
    const selectedIds = new Set(tableRows.filter((r) => r.checkbox.checked).map((r) => r.id));
    if (selectedIds.size === 0) {
      alert('请先勾选要删除的行');
      return;
    }
    if (!confirm(`确定删除选中的 ${selectedIds.size} 条行为吗？`)) return;
    effective = effective.filter((b) => !selectedIds.has(b.id));
    renderTable();
    updateCount();
  });

  toolbar.appendChild(categorySelect);
  toolbar.appendChild(countEl);
  toolbar.appendChild(addBtn);
  toolbar.appendChild(deleteBtn);

  header.appendChild(title);
  header.appendChild(toolbar);

  const closeBtn = document.createElement('button');
  closeBtn.className = 'editor-modal-close';
  closeBtn.textContent = '✕';
  closeBtn.addEventListener('click', closeEditor);
  header.appendChild(closeBtn);

  const list = document.createElement('div');
  list.className = 'editor-behavior-list';
  tableContainer = list;

  const footer = document.createElement('div');
  footer.className = 'editor-modal-footer';

  const hint = document.createElement('span');
  hint.className = 'editor-modal-hint';
  hint.textContent = '修改后保存到浏览器本地，并立即刷新棋盘。';

  const resetBtn = document.createElement('button');
  resetBtn.className = 'seal-btn secondary';
  resetBtn.textContent = '恢复本类默认';
  resetBtn.addEventListener('click', () => {
    if (!confirm(`确定清空「${currentCategory}」的所有自定义修改吗？`)) return;
    applyCurrentChanges();
    const categoryIds = new Set(
      baseBehaviors.filter((b) => b.category === currentCategory).map((b) => b.id)
    );
    effective = effective.filter((b) => !categoryIds.has(b.id));
    // 同时移除新增的本类行为
    effective = effective.filter((b) => !(b.category === currentCategory && !baseBehaviors.some((base) => base.id === b.id)));
    renderTable();
    updateCount();
  });

  const saveBtn = document.createElement('button');
  saveBtn.className = 'seal-btn';
  saveBtn.textContent = '保存修改';
  saveBtn.addEventListener('click', () => {
    applyCurrentChanges();
    const next = computeOverrideSet(baseBehaviors, effective);
    onSave(next);
    closeEditor();
  });

  footer.appendChild(hint);
  footer.appendChild(resetBtn);
  footer.appendChild(saveBtn);

  content.appendChild(header);
  content.appendChild(list);
  content.appendChild(footer);
  overlay.appendChild(backdrop);
  overlay.appendChild(content);
  document.body.appendChild(overlay);

  function updateCount(): void {
    const count = effective.filter((b) => b.category === currentCategory).length;
    countEl.textContent = `共 ${count} 条`;
  }

  function applyCurrentChanges(): void {
    const currentRows = tableRows;
    const currentIds = new Set(currentRows.map((r) => r.id));

    const updates = new Map<string, Partial<Behavior>>();
    for (const row of currentRows) {
      const patch = readRow(row);
      if (!patch) continue;
      updates.set(row.id, patch);
    }

    effective = effective.map((b) => {
      if (!currentIds.has(b.id)) return b;
      const patch = updates.get(b.id);
      if (!patch) return b;
      return { ...b, ...patch, id: b.id, category: currentCategory };
    });
  }

  function renderTable(): void {
    if (!tableContainer) return;
    tableContainer.innerHTML = '';
    const categoryBehaviors = effective.filter((b) => b.category === currentCategory);
    const { table, rows } = createTable(categoryBehaviors);
    tableRows = rows;
    tableContainer.appendChild(table);
  }

  function closeEditor() {
    overlay.remove();
    onClose();
  }

  renderTable();
  updateCount();
}
