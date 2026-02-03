css
.cloud-regulations-page {
  min-height: 100vh;
  background: linear-gradient(to bottom, #f8fafc, #f1f5f9);
}

/* Header */
.regulations-header {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: white;
  padding: 24px 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
}

.back-button {
  color: white !important;
  margin-bottom: 16px;
}

.back-button:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

.regulations-header h1 {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 8px;
  /* tracking: -0.5px; No direct CSS property for 'tracking', assuming letter-spacing if needed */
}

.regulations-header p {
  font-size: 16px;
  opacity: 0.85;
  color: #cbd5e1;
}

/* Legend */
.regulations-legend {
  background: white;
  padding: 32px 20px;
  margin: 20px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.regulations-legend h3 {
  font-size: 20px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 20px;
}

.legend-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.legend-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  transition: all 0.2s;
}

.legend-item:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.legend-color {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 12px;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.legend-text {
  flex: 1;
}

.legend-text strong {
  display: block;
  font-size: 14px;
  color: #0f172a;
  margin-bottom: 4px;
}

.legend-text span {
  font-size: 12px;
  color: #64748b;
}

.legend-count {
  font-weight: 600;
  color: #1e293b;
  font-size: 20px;
  margin-left: 12px;
  min-width: 40px;
  text-align: right;
}

/* Restrictions Info */
.restrictions-info {
  background: #fef9c3;
  border: 1px solid #fde047;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

.info-title {
  font-size: 13px;
  font-weight: 600;
  color: #78350f;
  margin-bottom: 12px;
}

.flags-legend {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  font-size: 11px;
  color: #555;
  margin-bottom: 10px;
  line-height: 1.6;
}

.indicators {
  display: flex;
  gap: 20px;
  font-size: 11px;
}

.indicator-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  vertical-align: middle;
  margin-right: 4px;
}

/* Filter Buttons */
.filter-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 20px;
}

.filter-btn {
  padding: 10px 18px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s;
  background: white;
  color: #0f172a;
}

.filter-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #cbd5e1;
}

.filter-btn.active {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: #94a3b8;
}

.btn-all.active {
  background: #0f172a;
  color: white;
  border-color: #0f172a;
}

.btn-amber.active {
  background: #FFD700;
  color: #7a5c00;
  border-color: #fcd34d;
}

.btn-red.active {
  background: #FF6B6B;
  color: white;
  border-color: #ff5252;
}

.btn-grey.active {
  background: #D3D3D3;
  color: #333;
  border-color: #bfbfbf;
}

/* Map Container */
.map-container {
  height: 600px;
  margin: 0 20px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* Popup Styling */
.popup-content {
  min-width: 280px;
  padding: 0;
}

.popup-content h4 {
  margin-bottom: 8px;
  color: #0f172a;
  font-size: 16px;
  font-weight: 600;
}

.popup-content .status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 10px;
  text-transform: capitalize;
}

.status-green {
  background: #90EE90;
  color: #2d5016;
}

.status-amber {
  background: #FFD700;
  color: #7a5c00;
}

.status-red {
  background: #FF6B6B;
  color: white;
}

.status-grey {
  background: #D3D3D3;
  color: #444;
}

.popup-content .region {
  font-size: 11px;
  color: #888;
  font-style: italic;
  margin-bottom: 8px;
}

.popup-content p {
  font-size: 13px;
  line-height: 1.6;
  color: #555;
  margin-bottom: 8px;
}

.flags-row {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  margin: 8px 0 8px;
}

.flag-chip {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  background: #eef2ff;
  color: #4338ca;
  border: 1px solid #c7d2fe;
}

.flag-chip.partial {
  background: #fef3c7;
  color: #92400e;
  border-color: #fcd34d;
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  display: inline-block;
}

.dot-yes {
  background: #22c55e;
}

.dot-partial {
  background: #f59e0b;
}

.scope-note {
  font-size: 11px;
  color: #b45309;
  background: #fef9c3;
  border: 1px solid #fde047;
  border-radius: 4px;
  padding: 3px 6px;
  margin-top: 4px;
}

/* Stats */
.regulations-stats {
  background: white;
  padding: 32px 20px;
  margin: 20px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.regulations-stats h3 {
  font-size: 20px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-box {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: white;
  padding: 24px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.stat-box:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.stat-box .number {
  font-size: 40px;
  font-weight: 700;
  margin-bottom: 8px;
}

.stat-box .label {
  font-size: 14px;
  opacity: 0.85;
}

/* Leaflet Overrides */
.leaflet-popup-content-wrapper {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.leaflet-popup-tip {
  background-color: white;
}

@media (max-width: 768px) {
  .regulations-header h1 {
    font-size: 24px;
  }

  .regulations-header p {
    font-size: 14px;
  }

  .legend-grid {
    grid-template-columns: 1fr;
  }

  .filter-buttons {
    flex-direction: column;
  }

  .filter-btn {
    width: 100%;
  }

  .map-container {
    height: 400px;
    margin: 0 20px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .flags-legend {
    font-size: 10px;
  }
}
