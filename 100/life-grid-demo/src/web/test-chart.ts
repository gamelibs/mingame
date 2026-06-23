import { renderEnergyChart, setupChartResize } from './components/chart';

export type RenderEnergyChartFn = typeof renderEnergyChart;
export type SetupChartResizeFn = typeof setupChartResize;

if (typeof window !== 'undefined') {
  const canvas = document.getElementById('energy-chart') as HTMLCanvasElement;
  if (canvas) {
    renderEnergyChart(canvas, [80, 75, 60, 45, 30, 55, 70, 85], 5);
  }
}

console.log('chart module imported successfully');
