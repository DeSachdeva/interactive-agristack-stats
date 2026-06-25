import React, { useState } from 'react';
import { SERVICES } from '../data/services';
import { ServiceIcon } from './ServiceIcon';
import { Trash2, AlertTriangle, X, Check } from 'lucide-react';

export const StatsView = ({ counts, onReset, totalClicks }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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

  return (
    <div className="stats-container animate-fade-in">
      <div className="stats-header">
        <h2 className="section-title">Analytics Dashboard</h2>
        <p className="section-subtitle">Real-time statistics of farmer selections and preferences.</p>
        
        {totalClicks > 0 && (
          <button 
            className="btn-danger reset-trigger-btn"
            onClick={() => setShowConfirmModal(true)}
          >
            <Trash2 size={16} /> Reset Statistics
          </button>
        )}
      </div>

      <div className="stats-metrics-grid">
        <div className="metric-card gold-glow">
          <span className="metric-title">Total Participations</span>
          <span className="metric-value">{totalClicks}</span>
          <span className="metric-footer">Total accumulated user choices</span>
        </div>
        
        <div className="metric-card green-glow">
          <span className="metric-title">Highest Traction</span>
          <span className="metric-value">
            {totalClicks > 0 && sortedServices[0] && counts[sortedServices[0].id] > 0
              ? sortedServices[0].title 
              : "None"}
          </span>
          <span className="metric-footer">
            {totalClicks > 0 && sortedServices[0] && counts[sortedServices[0].id] > 0
              ? `${counts[sortedServices[0].id]} selections (${getPercentage(counts[sortedServices[0].id])}%)`
              : "No selections recorded yet"}
          </span>
        </div>
      </div>

      <div className="stats-details-layout">
        <div className="chart-card">
          <h3>Popularity Index</h3>
          <div className="custom-chart-list">
            {sortedServices.map((service) => {
              const count = counts[service.id] || 0;
              const percent = getPercentage(count);
              return (
                <div key={service.id} className="chart-row">
                  <div className="chart-row-info">
                    <div className="service-name-box">
                      <ServiceIcon name={service.icon} size={18} color={service.color} />
                      <span className="service-name">{service.title}</span>
                    </div>
                    <span className="service-value">{count} clicks ({percent}%)</span>
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

        <div className="table-card">
          <h3>Detailed Metrics</h3>
          <div className="table-responsive">
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Status</th>
                  <th>Press Count</th>
                  <th>Share</th>
                </tr>
              </thead>
              <tbody>
                {SERVICES.map((service) => {
                  const count = counts[service.id] || 0;
                  const percent = getPercentage(count);
                  return (
                    <tr key={service.id} className={service.active ? 'row-active' : 'row-inactive'}>
                      <td>
                        <div className="table-service-cell">
                          <ServiceIcon name={service.icon} size={16} color={service.active ? service.color : '#888'} />
                          <span>{service.title}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${service.active ? 'active' : 'inactive'}`}>
                          {service.active ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="font-mono">{service.active ? count : '-'}</td>
                      <td className="font-mono">{service.active ? `${percent}%` : '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-content animate-scale-up">
            <div className="modal-header">
              <div className="warning-icon-wrapper">
                <AlertTriangle size={24} color="#f1c40f" />
              </div>
              <h3>Confirm Reset</h3>
              <button className="modal-close-btn" onClick={() => setShowConfirmModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to reset all service selection counters? This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowConfirmModal(false)}>
                <X size={16} /> Cancel
              </button>
              <button className="btn-danger-confirm" onClick={handleResetConfirm}>
                <Check size={16} /> Yes, Reset Stats
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
