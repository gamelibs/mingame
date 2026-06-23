interface DrawerOptions {
  /** 是否在标题栏右侧显示设置/操作按钮 */
  showAction?: boolean;
  /** 操作按钮的文本或图标 */
  actionLabel?: string;
  /** 操作按钮点击回调 */
  onAction?: () => void;
}

interface ActiveDrawer {
  modal: HTMLElement;
  body: HTMLElement;
  render: (body: HTMLElement) => void;
}

let activeDrawer: ActiveDrawer | null = null;

function createDrawerModal(title: string, options?: DrawerOptions): { modal: HTMLElement; body: HTMLElement } {
  const modal = document.createElement('div');
  modal.className = 'drawer-modal';

  const backdrop = document.createElement('div');
  backdrop.className = 'drawer-backdrop';

  const content = document.createElement('div');
  content.className = 'drawer-content scroll-panel';

  const header = document.createElement('div');
  header.className = 'drawer-header';

  const titleEl = document.createElement('h3');
  titleEl.className = 'drawer-title';
  titleEl.textContent = title;

  const actions = document.createElement('div');
  actions.className = 'drawer-actions';

  if (options?.showAction && options.onAction) {
    const actionBtn = document.createElement('button');
    actionBtn.className = 'drawer-action-btn';
    actionBtn.textContent = options.actionLabel || '⚙️';
    actionBtn.title = '全局规则配置';
    actionBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      options.onAction!();
    });
    actions.appendChild(actionBtn);
  }

  const closeBtn = document.createElement('button');
  closeBtn.className = 'drawer-close';
  closeBtn.textContent = '×';
  closeBtn.setAttribute('aria-label', '关闭');
  closeBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    closeDrawer();
  });
  actions.appendChild(closeBtn);

  header.appendChild(titleEl);
  header.appendChild(actions);

  const body = document.createElement('div');
  body.className = 'drawer-body';

  content.appendChild(header);
  content.appendChild(body);
  modal.appendChild(backdrop);
  modal.appendChild(content);

  // 点击 backdrop 关闭
  modal.addEventListener('click', (event) => {
    if (event.target === modal || event.target === backdrop) {
      closeDrawer();
    }
  });

  document.body.appendChild(modal);
  return { modal, body };
}

export function openDrawer(
  title: string,
  render: (body: HTMLElement) => void,
  options?: DrawerOptions
): void {
  closeDrawer();
  const { modal, body } = createDrawerModal(title, options);
  activeDrawer = { modal, body, render };
  render(body);

  // 下一帧添加打开动画类
  requestAnimationFrame(() => {
    modal.classList.add('drawer-open');
  });
}

export function closeDrawer(): void {
  if (!activeDrawer) return;
  activeDrawer.modal.classList.remove('drawer-open');
  // 给过渡动画留出时间
  setTimeout(() => {
    if (activeDrawer) {
      activeDrawer.modal.remove();
      activeDrawer = null;
    }
  }, 200);
}

export function isDrawerOpen(): boolean {
  return activeDrawer !== null;
}

export function redrawDrawer(): void {
  if (!activeDrawer) return;
  activeDrawer.body.innerHTML = '';
  activeDrawer.render(activeDrawer.body);
}

export function setDrawerRender(render: (body: HTMLElement) => void): void {
  if (!activeDrawer) return;
  activeDrawer.render = render;
}

/** 关闭抽屉后执行回调（用于需要等待动画结束的清理） */
export function onDrawerClosed(callback: () => void): void {
  if (!activeDrawer) {
    callback();
    return;
  }
  const check = () => {
    if (!activeDrawer) {
      callback();
    } else {
      setTimeout(check, 50);
    }
  };
  setTimeout(check, 50);
}
