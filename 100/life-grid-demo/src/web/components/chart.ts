const MARGIN = { left: 50, right: 20, top: 20, bottom: 40 };
const LINE_WIDTH = 2;
const POINT_RADIUS = 3;
const CURRENT_RADIUS = 6;
const TICK_COLOR = '#aaa';
const GRID_COLOR = 'rgba(255, 255, 255, 0.12)';
const AXIS_COLOR = '#666';

function resizeCanvas(canvas: HTMLCanvasElement): {
  width: number;
  height: number;
  dpr: number;
} {
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
  }

  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  return { width, height, dpr };
}

function energyColor(value: number): string {
  if (value < 30) return '#e74c3c';
  if (value < 60) return '#f1c40f';
  if (value <= 80) return '#2ecc71';
  return '#00ff88';
}

function niceMax(value: number): number {
  if (value <= 0) return 100;
  const ceil = Math.ceil(value / 10) * 10;
  return Math.max(100, ceil);
}

export function renderEnergyChart(
  canvas: HTMLCanvasElement,
  energyCurve: number[],
  currentAge: number
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const { width, height } = resizeCanvas(canvas);
  if (width === 0 || height === 0) return;

  ctx.clearRect(0, 0, width, height);

  if (energyCurve.length < 2) {
    ctx.font = '14px "PingFang SC", "Microsoft YaHei", sans-serif';
    ctx.fillStyle = '#aaa';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('暂无数据，开始你的人生选择', width / 2, height / 2);
    return;
  }

  const chartWidth = width - MARGIN.left - MARGIN.right;
  const chartHeight = height - MARGIN.top - MARGIN.bottom;

  const maxEnergy = niceMax(Math.max(...energyCurve));
  const n = energyCurve.length;

  const mapX = (index: number): number =>
    MARGIN.left + (index / (n - 1)) * chartWidth;
  const mapY = (value: number): number =>
    MARGIN.top + chartHeight - (value / maxEnergy) * chartHeight;

  // 水平网格线与 Y 轴刻度
  const ySteps = 4;
  ctx.font = '12px "PingFang SC", "Microsoft YaHei", sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.lineWidth = 1;

  for (let i = 0; i <= ySteps; i++) {
    const value = (maxEnergy / ySteps) * i;
    const y = mapY(value);

    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = GRID_COLOR;
    ctx.moveTo(MARGIN.left, y);
    ctx.lineTo(width - MARGIN.right, y);
    ctx.stroke();

    ctx.fillStyle = TICK_COLOR;
    ctx.fillText(String(Math.round(value)), MARGIN.left - 8, y);
  }

  // 垂直网格线与 X 轴刻度（每 10 年）
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  for (let age = 10; age <= n; age += 10) {
    const index = age - 1;
    const x = mapX(index);

    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = GRID_COLOR;
    ctx.moveTo(x, MARGIN.top);
    ctx.lineTo(x, height - MARGIN.bottom);
    ctx.stroke();

    ctx.fillStyle = TICK_COLOR;
    ctx.fillText(String(age), x, height - MARGIN.bottom + 6);
  }

  // 坐标轴
  ctx.beginPath();
  ctx.setLineDash([]);
  ctx.strokeStyle = AXIS_COLOR;
  ctx.lineWidth = 1;
  ctx.moveTo(MARGIN.left, MARGIN.top);
  ctx.lineTo(MARGIN.left, height - MARGIN.bottom);
  ctx.lineTo(width - MARGIN.right, height - MARGIN.bottom);
  ctx.stroke();

  // 计算折线路径
  const points = energyCurve.map((value, index) => ({
    x: mapX(index),
    y: mapY(value),
    value,
  }));

  // 填充折线下方的半透明渐变区域
  const avgEnergy = energyCurve.reduce((a, b) => a + b, 0) / n;
  const baseColor = energyColor(avgEnergy);

  ctx.beginPath();
  ctx.moveTo(points[0].x, height - MARGIN.bottom);
  for (const p of points) {
    ctx.lineTo(p.x, p.y);
  }
  ctx.lineTo(points[points.length - 1].x, height - MARGIN.bottom);
  ctx.closePath();

  const fillGradient = ctx.createLinearGradient(
    0,
    MARGIN.top,
    0,
    height - MARGIN.bottom
  );
  fillGradient.addColorStop(0, baseColor + '33');
  fillGradient.addColorStop(1, baseColor + '05');
  ctx.fillStyle = fillGradient;
  ctx.fill();

  // 折线（按能量区间分段着色）
  ctx.lineWidth = LINE_WIDTH;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const segmentColor = energyColor((p1.value + p2.value) / 2);

    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.strokeStyle = segmentColor;
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }

  // 普通数据点
  for (const p of points) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, POINT_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = energyColor(p.value);
    ctx.fill();
  }

  // 当前年龄发光标记
  const currentIndex = Math.min(Math.max(currentAge - 1, 0), n - 1);
  const currentPoint = points[currentIndex];
  const currentColor = energyColor(currentPoint.value);

  ctx.save();
  ctx.shadowColor = currentColor;
  ctx.shadowBlur = 15;
  ctx.beginPath();
  ctx.arc(currentPoint.x, currentPoint.y, CURRENT_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = currentColor;
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.arc(currentPoint.x, currentPoint.y, CURRENT_RADIUS / 2, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.restore();
}

export function setupChartResize(
  canvas: HTMLCanvasElement,
  getEnergyCurve: () => number[],
  getCurrentAge: () => number
): () => void {
  let rafId = 0;

  function draw(): void {
    renderEnergyChart(canvas, getEnergyCurve(), getCurrentAge());
  }

  function handleResize(): void {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', handleResize);

  return () => {
    window.removeEventListener('resize', handleResize);
    cancelAnimationFrame(rafId);
  };
}
