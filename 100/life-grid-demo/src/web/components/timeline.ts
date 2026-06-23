interface AttributeCurves {
  health: number[];
  wealth: number[];
  knowledge: number[];
  skill: number[];
  social: number[];
  happy: number[];
  charm: number[];
  luck: number[];
}

interface SeriesDef {
  key: keyof AttributeCurves;
  label: string;
  color: string;
  rightAxis?: boolean;
}

const SERIES: SeriesDef[] = [
  { key: 'health', label: '健康', color: '#e74c3c' },
  { key: 'wealth', label: '财富', color: '#f1c40f', rightAxis: true },
  { key: 'knowledge', label: '知识', color: '#3498db' },
  { key: 'skill', label: '技能', color: '#9b59b6' },
  { key: 'social', label: '人脉', color: '#2ecc71' },
  { key: 'happy', label: '幸福', color: '#ff69b4' },
  { key: 'charm', label: '魅力', color: '#e67e22' },
  { key: 'luck', label: '运势', color: '#1abc9c' },
];

const ENERGY_COLOR = '#34495e';
const ENERGY_FILL = 'rgba(52, 73, 94, 0.08)';

function setupCanvas(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.floor(rect.width * dpr));
  canvas.height = Math.max(1, Math.floor(rect.height * dpr));
  const ctx = canvas.getContext('2d')!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

export function renderTimeline(
  container: HTMLElement,
  energyCurve: number[],
  attributeCurves: AttributeCurves,
  currentAge: number,
  maxAge: number
): void {
  let canvas = container.querySelector('canvas') as HTMLCanvasElement | null;
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.className = 'timeline-canvas';
    container.innerHTML = '';
    container.appendChild(canvas);
  }

  requestAnimationFrame(() => {
    drawLifeCurves(canvas!, energyCurve, attributeCurves, currentAge, maxAge);
  });
}

function drawLifeCurves(
  canvas: HTMLCanvasElement,
  energyCurve: number[],
  attributeCurves: AttributeCurves,
  currentAge: number,
  maxAge: number
): void {
  const rect = canvas.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return;

  const ctx = setupCanvas(canvas);
  const width = rect.width;
  const height = rect.height;

  const padding = { top: 38, right: 64, bottom: 24, left: 44 };
  const chartWidth = Math.max(1, width - padding.left - padding.right);
  const chartHeight = Math.max(1, height - padding.top - padding.bottom);

  const ageCount = Math.max(1, maxAge);
  const visibleAge = Math.min(currentAge, ageCount);

  // 用于左轴的属性值统一限定在 0~100
  function getAttrY(value: number): number {
    const ratio = Math.max(0, Math.min(100, value)) / 100;
    return padding.top + (1 - ratio) * chartHeight;
  }

  function getX(age: number): number {
    if (ageCount <= 1) return padding.left + chartWidth / 2;
    return padding.left + ((age - 1) / (ageCount - 1)) * chartWidth;
  }

  // 财富使用右轴，保持原始数值可读性
  const wealthValues = attributeCurves.wealth.slice(0, visibleAge);
  const maxWealth = Math.max(1, ...wealthValues.map(Math.abs));
  const minWealth = Math.min(0, ...wealthValues);
  const wealthRange = Math.max(1, maxWealth - minWealth);

  function getWealthY(wealth: number): number {
    return padding.top + (1 - (wealth - minWealth) / wealthRange) * chartHeight;
  }

  // 能量曲线归一化到 0~100，作为人生综合走势的背景
  const visibleEnergy = energyCurve.slice(0, visibleAge);
  const maxEnergy = Math.max(100, ...visibleEnergy);
  function getEnergyY(value: number): number {
    const ratio = Math.max(0, value) / maxEnergy;
    return padding.top + (1 - ratio) * chartHeight;
  }

  // Clear
  ctx.clearRect(0, 0, width, height);

  // 空数据提示
  if (visibleAge <= 1) {
    ctx.fillStyle = 'rgba(139, 69, 19, 0.5)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '14px "PingFang SC", "Microsoft YaHei", sans-serif';
    ctx.fillText('人生刚刚开始，能量与状态曲线等待书写……', width / 2, height / 2);
    return;
  }

  // 背景网格（横向）
  ctx.strokeStyle = 'rgba(139, 69, 19, 0.08)';
  ctx.lineWidth = 1;
  const gridCount = 4;
  for (let i = 0; i <= gridCount; i++) {
    const y = padding.top + (chartHeight / gridCount) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
  }

  // 能量走势填充层
  ctx.beginPath();
  ctx.moveTo(getX(1), getAttrY(0));
  for (let age = 1; age <= visibleAge; age++) {
    const x = getX(age);
    const y = getEnergyY(energyCurve[age - 1] ?? 0);
    if (age === 1) {
      ctx.lineTo(x, y);
    } else {
      const prevX = getX(age - 1);
      const prevY = getEnergyY(energyCurve[age - 2] ?? 0);
      const cpX = (prevX + x) / 2;
      ctx.bezierCurveTo(cpX, prevY, cpX, y, x, y);
    }
  }
  ctx.lineTo(getX(visibleAge), getAttrY(0));
  ctx.closePath();
  const energyGradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
  energyGradient.addColorStop(0, 'rgba(52, 73, 94, 0.15)');
  energyGradient.addColorStop(1, 'rgba(52, 73, 94, 0.02)');
  ctx.fillStyle = energyGradient;
  ctx.fill();

  // 坐标轴
  ctx.strokeStyle = 'rgba(139, 69, 19, 0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding.left, padding.top);
  ctx.lineTo(padding.left, height - padding.bottom);
  ctx.lineTo(width - padding.right, height - padding.bottom);
  ctx.lineTo(width - padding.right, padding.top);
  ctx.stroke();

  // 左轴标签（属性 0~100）
  ctx.fillStyle = '#8b4513';
  ctx.font = '11px "PingFang SC", "Microsoft YaHei", sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (let i = 0; i <= gridCount; i++) {
    const value = 100 - (100 / gridCount) * i;
    const y = padding.top + (chartHeight / gridCount) * i;
    ctx.fillText(Math.round(value).toString(), padding.left - 8, y);
  }
  ctx.save();
  ctx.translate(12, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.fillText('属性指数', 0, 0);
  ctx.restore();

  // 右轴标签（财富）
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  for (let i = 0; i <= gridCount; i++) {
    const value = maxWealth - (wealthRange / gridCount) * i;
    const y = padding.top + (chartHeight / gridCount) * i;
    ctx.fillText(formatWealth(value), width - padding.right + 8, y);
  }
  ctx.save();
  ctx.translate(width - 12, height / 2);
  ctx.rotate(Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.fillText('财富', 0, 0);
  ctx.restore();

  // X 轴标签
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  const xSteps = 5;
  for (let i = 0; i <= xSteps; i++) {
    const age = Math.round(1 + (ageCount - 1) * (i / xSteps));
    const x = getX(age);
    ctx.fillText(`${age}岁`, x, height - padding.bottom + 6);
  }

  // 绘制各属性线
  for (const series of SERIES) {
    const values = attributeCurves[series.key].slice(0, visibleAge);
    ctx.beginPath();
    for (let age = 1; age <= visibleAge; age++) {
      const x = getX(age);
      const y = series.rightAxis ? getWealthY(values[age - 1] ?? 0) : getAttrY(values[age - 1] ?? 0);
      if (age === 1) {
        ctx.moveTo(x, y);
      } else {
        const prevX = getX(age - 1);
        const prevY = series.rightAxis
          ? getWealthY(values[age - 2] ?? 0)
          : getAttrY(values[age - 2] ?? 0);
        const cpX = (prevX + x) / 2;
        ctx.bezierCurveTo(cpX, prevY, cpX, y, x, y);
      }
    }
    ctx.strokeStyle = series.color;
    ctx.lineWidth = series.rightAxis ? 2.5 : 2;
    if (series.rightAxis) {
      ctx.setLineDash([5, 4]);
    } else {
      ctx.setLineDash([]);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // 能量线（略深，叠加显示）
  ctx.beginPath();
  for (let age = 1; age <= visibleAge; age++) {
    const x = getX(age);
    const y = getEnergyY(energyCurve[age - 1] ?? 0);
    if (age === 1) {
      ctx.moveTo(x, y);
    } else {
      const prevX = getX(age - 1);
      const prevY = getEnergyY(energyCurve[age - 2] ?? 0);
      const cpX = (prevX + x) / 2;
      ctx.bezierCurveTo(cpX, prevY, cpX, y, x, y);
    }
  }
  ctx.strokeStyle = ENERGY_COLOR;
  ctx.lineWidth = 2;
  ctx.setLineDash([2, 2]);
  ctx.stroke();
  ctx.setLineDash([]);

  // 当前年龄指示线
  if (currentAge >= 1 && currentAge <= ageCount) {
    const cx = getX(currentAge);
    ctx.strokeStyle = 'rgba(139, 69, 19, 0.35)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(cx, padding.top);
    ctx.lineTo(cx, height - padding.bottom);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#8b4513';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.font = '11px "PingFang SC", "Microsoft YaHei", sans-serif';
    ctx.fillText(`${currentAge}岁`, cx, padding.top - 4);
  }

  // 图例
  drawLegend(ctx, width, padding);
}

function drawLegend(
  ctx: CanvasRenderingContext2D,
  width: number,
  padding: { top: number; right: number; bottom: number; left: number }
): void {
  const legendY = 8;
  const boxSize = 10;
  const gap = 10;
  let x = padding.left;

  // 能量图例
  ctx.fillStyle = ENERGY_FILL;
  ctx.strokeStyle = ENERGY_COLOR;
  ctx.lineWidth = 1.5;
  ctx.fillRect(x, legendY, boxSize, boxSize);
  ctx.strokeRect(x, legendY, boxSize, boxSize);
  ctx.fillStyle = '#5d4037';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.font = '11px "PingFang SC", "Microsoft YaHei", sans-serif';
  ctx.fillText('人生能量', x + boxSize + 4, legendY + boxSize / 2);
  x += boxSize + 36;

  for (const series of SERIES) {
    ctx.fillStyle = series.color;
    ctx.fillRect(x, legendY, boxSize, boxSize);
    ctx.fillStyle = '#5d4037';
    ctx.fillText(series.label, x + boxSize + 4, legendY + boxSize / 2);
    x += boxSize + ctx.measureText(series.label).width + 18;
  }

  // 如果图例超出画布右边界，折到第二行
  if (x > width - padding.right) {
    // 简单处理：缩小字号或截断
    ctx.font = '9px "PingFang SC", "Microsoft YaHei", sans-serif';
  }
}

function formatWealth(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (abs >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return Math.round(value).toString();
}
