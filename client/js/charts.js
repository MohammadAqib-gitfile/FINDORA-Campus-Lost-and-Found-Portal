// FINDORA Premium White & Blue Charts Module
// Lightweight, responsive SVG/Canvas visual charts

const Charts = {
  // Render monthly trend chart with Royal Blue & Navy curves
  renderTrendChart(containerId, data = []) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!data || data.length === 0) {
      container.innerHTML = '<div class="chart-empty">No trend data available</div>';
      return;
    }

    const width = 560;
    const height = 220;
    const padding = { top: 20, right: 20, bottom: 35, left: 35 };

    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const maxVal = Math.max(...data.map(d => Math.max(d.reported, d.reunited)), 10) * 1.15;

    const getX = (index) => padding.left + (index / (data.length - 1)) * chartWidth;
    const getY = (val) => padding.top + chartHeight - (val / maxVal) * chartHeight;

    // Build path points
    const reportedPoints = data.map((d, i) => `${getX(i)},${getY(d.reported)}`);
    const reunitedPoints = data.map((d, i) => `${getX(i)},${getY(d.reunited)}`);

    // SVG Gradient and Paths
    const svg = `
      <svg viewBox="0 0 ${width} ${height}" class="blue-trend-svg" preserveAspectRatio="none" style="width: 100%; height: auto;">
        <defs>
          <linearGradient id="primaryBlueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#2563EB" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="#2563EB" stop-opacity="0.0"/>
          </linearGradient>
          <linearGradient id="navyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#64748B" stop-opacity="0.15"/>
            <stop offset="100%" stop-color="#64748B" stop-opacity="0.0"/>
          </linearGradient>
        </defs>

        <!-- Horizontal grid lines -->
        ${[0, 0.33, 0.66, 1].map(ratio => {
          const y = padding.top + chartHeight * (1 - ratio);
          const val = Math.round(maxVal * ratio);
          return `
            <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="#E2E8F0" stroke-dasharray="3,3" />
            <text x="${padding.left - 8}" y="${y + 4}" fill="#94A3B8" font-size="10" font-weight="500" text-anchor="end">${val}</text>
          `;
        }).join('')}

        <!-- Reported Area and Line (Navy / Slate) -->
        <polygon points="${getX(0)},${padding.top + chartHeight} ${reportedPoints.join(' ')} ${getX(data.length - 1)},${padding.top + chartHeight}" fill="url(#navyGrad)" />
        <polyline points="${reportedPoints.join(' ')}" fill="none" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" />

        <!-- Reunited Area and Line (Royal Blue) -->
        <polygon points="${getX(0)},${padding.top + chartHeight} ${reunitedPoints.join(' ')} ${getX(data.length - 1)},${padding.top + chartHeight}" fill="url(#primaryBlueGrad)" />
        <polyline points="${reunitedPoints.join(' ')}" fill="none" stroke="#2563EB" stroke-width="2.8" stroke-linecap="round" />

        <!-- Interactive Data Points -->
        ${data.map((d, i) => {
          const x = getX(i);
          const yRep = getY(d.reported);
          const yReun = getY(d.reunited);
          return `
            <circle cx="${x}" cy="${yRep}" r="3" fill="#FFFFFF" stroke="#94A3B8" stroke-width="2" class="chart-point" />
            <circle cx="${x}" cy="${yReun}" r="4" fill="#FFFFFF" stroke="#2563EB" stroke-width="2.5" class="chart-point" />
            <text x="${x}" y="${height - 12}" fill="#64748B" font-size="11" font-weight="600" text-anchor="middle">${d.month}</text>
          `;
        }).join('')}
      </svg>
    `;

    container.innerHTML = svg;
  },

  // Render category distribution bars
  renderCategoryBars(containerId, breakdown = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const entries = Object.entries(breakdown);
    if (entries.length === 0) {
      container.innerHTML = '<div class="chart-empty">No category data available</div>';
      return;
    }

    const total = entries.reduce((sum, [, count]) => sum + count, 0);

    const colors = {
      'Electronics': '#2563EB',
      'Accessories': '#3B82F6',
      'Books': '#6366F1',
      'ID & Cards': '#0EA5E9',
      'Clothing': '#10B981',
      'Other': '#8B5CF6'
    };

    const html = entries.map(([cat, count]) => {
      const pct = total > 0 ? Math.round((count / total) * 100) : 0;
      const color = colors[cat] || '#2563EB';

      return `
        <div class="cat-bar-item">
          <div class="cat-bar-header">
            <span class="cat-bar-name">
              <span class="cat-dot" style="background:${color}"></span>
              ${cat}
            </span>
            <span class="cat-bar-count">${count} <small>(${pct}%)</small></span>
          </div>
          <div class="cat-progress-track">
            <div class="cat-progress-fill" style="width: ${pct}%; background: ${color};"></div>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = html;
  }
};
