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
