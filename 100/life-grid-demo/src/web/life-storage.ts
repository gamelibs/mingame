import { SavedLifeData, SavedLifeMeta } from './game-controller';

const STORAGE_KEY = 'life-grid-saved-lives';
const MAX_SAVES = 20;

export interface StoredLife {
  id: string;
  name: string;
  savedAt: string;
  data: SavedLifeData;
}

function generateId(): string {
  return `life_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function listSavedLives(): SavedLifeMeta[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: StoredLife[] = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => ({
      id: item.id,
      name: item.name,
      savedAt: item.savedAt,
      age: item.data.records.length > 0
        ? item.data.records[item.data.records.length - 1].age
        : 1,
      summary: `共 ${item.data.records.length} 年 · ${item.data.config.mode === 'modern' ? '现代' : '末世'}模式`,
    }));
  } catch {
    return [];
  }
}

export function loadSavedLife(id: string): SavedLifeData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: StoredLife[] = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    const item = parsed.find((p) => p.id === id);
    return item ? item.data : null;
  } catch {
    return null;
  }
}

export function saveLife(name: string, data: SavedLifeData): SavedLifeMeta {
  const stored: StoredLife = {
    id: generateId(),
    name: name.trim() || `人生 ${new Date().toLocaleString('zh-CN')}`,
    savedAt: data.savedAt,
    data,
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: StoredLife[] = raw ? JSON.parse(raw) : [];
    const list = Array.isArray(parsed) ? parsed : [];
    list.unshift(stored);
    if (list.length > MAX_SAVES) {
      list.length = MAX_SAVES;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // 本地存储失败时忽略
  }

  return {
    id: stored.id,
    name: stored.name,
    savedAt: stored.savedAt,
    age: data.records.length > 0 ? data.records[data.records.length - 1].age : 1,
    summary: `共 ${data.records.length} 年 · ${data.config.mode === 'modern' ? '现代' : '末世'}模式`,
  };
}

export function deleteSavedLife(id: string): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed: StoredLife[] = JSON.parse(raw);
    if (!Array.isArray(parsed)) return;
    const filtered = parsed.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch {
    // ignore
  }
}
