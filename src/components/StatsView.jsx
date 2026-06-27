import React, { useState } from 'react';
import { SERVICES } from '../data/services';
import { ServiceIcon } from './ServiceIcon';
import { TRANSLATIONS } from '../data/translations';
import { Trash2, AlertTriangle, X, Check, Download, FileSpreadsheet, FileJson, FileText } from 'lucide-react';

export const StatsView = ({ counts, onReset, totalClicks, lang = 'en' }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const t = TRANSLATIONS[lang];
  const activeServices = SERVICES.filter(s => s.active);

  const sortedServices = [...activeServices].sort((a, b) => {
    return (counts[b.id] || 0) - (counts[a.id] || 0);
  });

  const getPercentage = (count) => {
    if (totalClicks === 0) return 0;
    return Math.round((count / totalClicks) * 100);
  };

  const [hoveredSlice, setHoveredSlice] = useState(null);

  // Calculate SVG Pie slices scaled up to 320x320 viewport
  const cx = 160;
  const cy = 160;
  const innerR = 75;
  const baseOuterR = 105;

  let currentAngle = -90; // Start at top center (-90 deg)
  const activeSlicesCount = sortedServices.filter(s => (counts[s.id] || 0) > 0).length;
  
  const slices = sortedServices.map(service => {
    const count = counts[service.id] || 0;
    const percent = getPercentage(count);
    if (percent === 0) return null;
    
    const angleDelta = (percent / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angleDelta;
    currentAngle = endAngle;

    // Apply smart proportional gap spacing between slices
    const maxGap = activeSlicesCount > 1 ? 2.5 : 0;
    const currentGap = (angleDelta * 0.15) > maxGap ? maxGap : (angleDelta * 0.15);
    const adjustedStart = startAngle + currentGap;
    const adjustedEnd = endAngle - currentGap;

    const startRad = (adjustedStart * Math.PI) / 180;
    const endRad = (adjustedEnd * Math.PI) / 180;

    // Dynamic outer radius based on selection percentage (higher share sticks out more)
    const sliceR = baseOuterR + (percent / 100) * 30;

    const x_outer_start = cx + sliceR * Math.cos(startRad);
    const y_outer_start = cy + sliceR * Math.sin(startRad);
    const x_outer_end = cx + sliceR * Math.cos(endRad);
    const y_outer_end = cy + sliceR * Math.sin(endRad);

    const x_inner_start = cx + innerR * Math.cos(startRad);
    const y_inner_start = cy + innerR * Math.sin(startRad);
    const x_inner_end = cx + innerR * Math.cos(endRad);
    const y_inner_end = cy + innerR * Math.sin(endRad);

    const largeArcFlag = (adjustedEnd - adjustedStart) > 180 ? 1 : 0;

    // SVG path matching donut slice with arc logic
    const pathData = `M ${x_outer_start} ${y_outer_start} ` +
                     `A ${sliceR} ${sliceR} 0 ${largeArcFlag} 1 ${x_outer_end} ${y_outer_end} ` +
                     `L ${x_inner_end} ${y_inner_end} ` +
                     `A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${x_inner_start} ${y_inner_start} ` +
                     `Z`;

    // Midpoint angle for hover pop-out animation
    const midAngle = (adjustedStart + adjustedEnd) / 2;
    const midRad = (midAngle * Math.PI) / 180;
    const popX = 10 * Math.cos(midRad);
    const popY = 10 * Math.sin(midRad);

    return {
      id: service.id,
      path: pathData,
      color: service.color,
      name: t[service.id],
      count,
      percent,
      popX,
      popY
    };
  }).filter(Boolean);

  const activeDetail = hoveredSlice 
    ? slices.find(s => s.id === hoveredSlice) 
    : null;

  const handleResetConfirm = () => {
    onReset();
    setShowConfirmModal(false);
  };

  // Export functions
  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Service Name,Click Count,Percentage Share\n";
    
    activeServices.forEach(s => {
      const count = counts[s.id] || 0;
      const pct = getPercentage(count);
      csvContent += `"${t[s.id]}",${count},${pct}%\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `agristack_participation_report_${lang}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportModal(false);
  };

  const exportToJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      reportDate: new Date().toISOString(),
      language: lang,
      totalParticipations: totalClicks,
      metrics: activeServices.map(s => ({
        id: s.id,
        name: t[s.id],
        count: counts[s.id] || 0,
        percentage: getPercentage(counts[s.id] || 0)
      }))
    }, null, 2));

    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `agristack_participation_report_${lang}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportModal(false);
  };

  const exportToPDFReport = () => {
    // Generate a print-friendly document report
    let printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${t.analyticsDashboard}</title>
          <style>
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #1a202c; }
            h1 { color: #27ae60; font-size: 24px; border-bottom: 2px solid #27ae60; padding-bottom: 10px; }
            .meta { margin-bottom: 30px; font-size: 14px; color: #4a5568; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #e2e8f0; padding: 12px 16px; text-align: left; }
            th { background-color: #f7fafc; font-weight: bold; }
            .total { font-weight: bold; background-color: #edf2f7; }
          </style>
        </head>
        <body>
          <h1>${t.analyticsDashboard} - ${t.farmerId}</h1>
          <div class="meta">
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>${t.totalParticipations}:</strong> ${totalClicks}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Count</th>
                <th>Share</th>
              </tr>
            </thead>
            <tbody>
              ${activeServices.map(s => `
                <tr>
                  <td>${t[s.id]}</td>
                  <td>${counts[s.id] || 0}</td>
                  <td>${getPercentage(counts[s.id] || 0)}%</td>
                </tr>
              `).join('')}
              <tr class="total">
                <td>Total</td>
                <td>${totalClicks}</td>
                <td>100%</td>
              </tr>
            </tbody>
          </table>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
    setShowExportModal(false);
  };

  return (
    <div className="stats-container animate-fade-in">
      <div className="stats-header">
        <div>
          <h2 className="section-title">{t.analyticsDashboard}</h2>
          <p className="section-subtitle">{t.realtimeStats}</p>
        </div>
        
        <div className="stats-actions">
          <button 
            className="btn-secondary export-trigger-btn"
            onClick={() => setShowExportModal(true)}
          >
            <Download size={16} /> {t.exportData}
          </button>
          
          {totalClicks > 0 && (
            <button 
              className="btn-danger reset-trigger-btn"
              onClick={() => setShowConfirmModal(true)}
            >
              <Trash2 size={16} /> {t.resetStats}
            </button>
          )}
        </div>
      </div>

      <div className="stats-metrics-grid">
        <div className="metric-card gold-glow">
          <span className="metric-title">{t.totalParticipations}</span>
          <span className="metric-value">{totalClicks}</span>
          <span className="metric-footer">{t.totalChoicesFooter}</span>
        </div>
        
        <div className="metric-card green-glow">
          <span className="metric-title">{t.highestTraction}</span>
          <span className="metric-value">
            {totalClicks > 0 && sortedServices[0] && counts[sortedServices[0].id] > 0
              ? t[sortedServices[0].id] 
              : t.noSelections}
          </span>
          <span className="metric-footer">
            {totalClicks > 0 && sortedServices[0] && counts[sortedServices[0].id] > 0
              ? `${counts[sortedServices[0].id]} ${t.times} (${getPercentage(counts[sortedServices[0].id])}%)`
              : t.noSelections}
          </span>
        </div>
      </div>

      <div className="stats-details-layout">
        {/* Pie/Donut Chart Card */}
        <div className="chart-card flex-center-column">
          <h3>{lang === 'en' ? 'Share of Selections' : 'चयन का हिस्सा'}</h3>
          {totalClicks > 0 ? (
            <div className="donut-chart-container">
              <div className="svg-donut-wrapper">
                <svg viewBox="0 0 320 320" width="320" height="320" className="svg-donut-chart">
                  {/* Linear gradients defs for premium glow */}
                  <defs>
                    {slices.map(slice => (
                      <linearGradient id={`grad-${slice.id}`} key={slice.id} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
                        <stop offset="60%" stopColor={slice.color} stopOpacity="0.9" />
                        <stop offset="100%" stopColor={slice.color} stopOpacity="1" />
                      </linearGradient>
                    ))}
                  </defs>
                  
                  {slices.length === 1 ? (
                    <circle 
                      cx="160" 
                      cy="160" 
                      r="130" 
                      fill={`url(#grad-${slices[0].id})`} 
                      className="pie-slice"
                      onMouseEnter={() => setHoveredSlice(slices[0].id)}
                      onMouseLeave={() => setHoveredSlice(null)}
                    />
                  ) : (
                    slices.map(slice => {
                      const isHovered = hoveredSlice === slice.id;
                      return (
                        <path
                          key={slice.id}
                          d={slice.path}
                          fill={`url(#grad-${slice.id})`}
                          className={`pie-slice ${isHovered ? 'active-slice' : ''}`}
                          style={{
                            transform: isHovered ? `translate(${slice.popX}px, ${slice.popY}px)` : 'none'
                          }}
                          onMouseEnter={() => setHoveredSlice(slice.id)}
                          onMouseLeave={() => setHoveredSlice(null)}
                        />
                      );
                    })
                  )}

                  {/* Concentric Double Ring Mask/Borders */}
                  <circle cx="160" cy="160" r="70" fill="var(--bg-card)" stroke="var(--border-color)" strokeWidth="1.5" className="donut-hole-mask" />
                  <circle cx="160" cy="160" r="64" fill="none" stroke="#27ae60" strokeWidth="1" strokeDasharray="3,3" opacity="0.45" />
                </svg>
                <div className="donut-center-info">
                  {activeDetail ? (
                    <>
                      <span className="donut-detail-title" style={{ color: activeDetail.color }}>
                        {activeDetail.name}
                      </span>
                      <span className="donut-detail-value">
                        {activeDetail.count} {t.times} ({activeDetail.percent}%)
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="donut-total-clicks">{totalClicks}</span>
                      <span className="donut-total-label">{lang === 'en' ? 'Total' : 'कुल'}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="donut-legend-mini">
                {sortedServices.map(service => {
                  const count = counts[service.id] || 0;
                  if (count === 0) return null;
                  return (
                    <div 
                      key={service.id} 
                      className={`legend-mini-item ${hoveredSlice === service.id ? 'active' : ''}`}
                      onMouseEnter={() => setHoveredSlice(service.id)}
                      onMouseLeave={() => setHoveredSlice(null)}
                      style={{ cursor: 'default' }}
                    >
                      <span className="legend-dot" style={{ backgroundColor: service.color }}></span>
                      <span className="legend-label">{t[service.id]} ({getPercentage(count)}%)</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="chart-placeholder">
              <p>{t.noSelections}</p>
            </div>
          )}
        </div>

        {/* Popularity Progress List Card */}
        <div className="chart-card">
          <h3>{t.popularityIndex}</h3>
          <div className="custom-chart-list">
            {sortedServices.map((service) => {
              const count = counts[service.id] || 0;
              const percent = getPercentage(count);
              return (
                <div key={service.id} className="chart-row">
                  <div className="chart-row-info">
                    <div className="service-name-box">
                      <ServiceIcon name={service.icon} size={18} color={service.color} />
                      <span className="service-name">{t[service.id]}</span>
                    </div>
                    <span className="service-value">{count} {t.times} ({percent}%)</span>
                  </div>
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar-fill" 
                      style={{ 
                        width: `${percent || 1}%`, 
                        backgroundColor: service.color,
                        boxShadow: `0 0 10px ${service.color}80`
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Confirmation Reset Modal */}
      {showConfirmModal && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-content animate-scale-up">
            <div className="modal-header">
              <div className="warning-icon-wrapper">
                <AlertTriangle size={24} color="#f1c40f" />
              </div>
              <h3>{t.confirmReset}</h3>
              <button className="modal-close-btn" onClick={() => setShowConfirmModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p>{t.confirmBody}</p>
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowConfirmModal(false)}>
                <X size={16} /> {t.cancel}
              </button>
              <button className="btn-danger-confirm" onClick={handleResetConfirm}>
                <Check size={16} /> {t.yesReset}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Selection Modal */}
      {showExportModal && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-content animate-scale-up">
            <div className="modal-header">
              <div className="warning-icon-wrapper" style={{ background: 'rgba(39, 174, 96, 0.1)', borderColor: 'rgba(39, 174, 96, 0.2)' }}>
                <Download size={24} color="#27ae60" />
              </div>
              <h3>{t.exportData}</h3>
              <button className="modal-close-btn" onClick={() => setShowExportModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p>{t.selectExportFormat}:</p>
              <div className="export-options-list">
                <button className="export-option-btn" onClick={exportToCSV}>
                  <FileSpreadsheet size={20} color="#27ae60" />
                  <div className="export-text">
                    <strong>Excel / CSV</strong>
                    <span>Standard spreadsheet format</span>
                  </div>
                </button>
                
                <button className="export-option-btn" onClick={exportToPDFReport}>
                  <FileText size={20} color="#e74c3c" />
                  <div className="export-text">
                    <strong>PDF Report</strong>
                    <span>Printable document report</span>
                  </div>
                </button>

                <button className="export-option-btn" onClick={exportToJSON}>
                  <FileJson size={20} color="#3498db" />
                  <div className="export-text">
                    <strong>JSON Data</strong>
                    <span>Raw structured data format</span>
                  </div>
                </button>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowExportModal(false)}>
                <X size={16} /> {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
