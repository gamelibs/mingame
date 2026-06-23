import { Behavior } from '../types';
import { GameMode } from './game-controller';

const STORAGE_KEY = 'life-grid-behavior-overrides';

export interface BehaviorOverrideSet {
  /** 对基础行为的字段覆盖 */
  modified: Record<string, Partial<Behavior>>;
  /** 被删除的基础行为 id */
  deleted: string[];
  /** 新增的行为（完整对象） */
  added: Behavior[];
}

function getStorageKey(mode: GameMode): string {
  return `${STORAGE_KEY}-${mode}`;
}

export function createEmptyOverrideSet(): BehaviorOverrideSet {
  return { modified: {}, deleted: [], added: [] };
}

export function loadBehaviorOverrides(mode: GameMode): BehaviorOverrideSet {
  try {
    const raw = localStorage.getItem(getStorageKey(mode));
    if (!raw) return createEmptyOverrideSet();
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return {
        modified: parsed.modified || {},
        deleted: Array.isArray(parsed.deleted) ? parsed.deleted : [],
        added: Array.isArray(parsed.added) ? parsed.added : [],
      };
    }
  } catch {
    // ignore
  }
  return createEmptyOverrideSet();
}

export function saveBehaviorOverrides(
  mode: GameMode,
  overrides: BehaviorOverrideSet
): void {
  try {
    localStorage.setItem(getStorageKey(mode), JSON.stringify(overrides));
  } catch {
    // ignore
  }
}

function asRiskLevel(value: number): Behavior['riskLevel'] {
  const level = Math.max(1, Math.min(10, Math.round(value)));
  return level as Behavior['riskLevel'];
}

function mergeBehavior(base: Behavior, patch: Partial<Behavior>): Behavior {
  return {
    ...base,
    ...patch,
    id: base.id,
    riskLevel:
      patch.riskLevel !== undefined
        ? asRiskLevel(Number(patch.riskLevel))
        : base.riskLevel,
    tags: patch.tags
      ? patch.tags.map((t) => String(t).trim()).filter(Boolean)
      : base.tags,
  };
}

export function applyBehaviorOverrides(
  baseBehaviors: Behavior[],
  overrides: BehaviorOverrideSet
): Behavior[] {
  const deletedSet = new Set(overrides.deleted);
  const result: Behavior[] = [];

  for (const b of baseBehaviors) {
    if (deletedSet.has(b.id)) continue;
    const patch = overrides.modified[b.id];
    result.push(patch ? mergeBehavior(b, patch) : b);
  }

  for (const b of overrides.added) {
    result.push({
      ...b,
      riskLevel: asRiskLevel(Number(b.riskLevel)),
      tags: b.tags ? b.tags.map((t) => String(t).trim()).filter(Boolean) : [],
    });
  }

  return result;
}
