import React, { useState } from 'react';
import { SERVICES } from '../data/services';
import { ServiceIcon } from './ServiceIcon';
import { Sparkles, Grid, RotateCcw } from 'lucide-react';

export const ServicePanel = ({ counts, onServiceClick, totalClicks }) => {
  const [hoveredService, setHoveredService] = useState(null);
  const [layoutMode, setLayoutMode] = useState('circular'); // 'circular' or 'grid'

  const activeServices = SERVICES.filter(s => s.active);
  const inactiveServices = SERVICES.filter(s => !s.active);

  return (
    <div className="panel-container">
      <div className="panel-header">
        <div className="badge-container">
          <span className="badge">CHOOSE • PLACE • DISCOVER</span>
        </div>
        <h2 className="panel-subtitle">Your choices. Stronger farmers. Better future.</h2>
        
        <div className="layout-toggle">
          <button 
            className={`toggle-btn ${layoutMode === 'circular' ? 'active' : ''}`}
            onClick={() => setLayoutMode('circular')}
            title="Circular Layout"
          >
            <RotateCcw size={16} /> Radial Dial
          </button>
          <button 
            className={`toggle-btn ${layoutMode === 'grid' ? 'active' : ''}`}
            onClick={() => setLayoutMode('grid')}
            title="Grid Layout"
          >
            <Grid size={16} /> Grid Layout
          </button>
        </div>
      </div>

      {layoutMode === 'circular' ? (
        <div className="circular-wrapper">
          {/* Circular dial container */}
          <div className="dial-container">
            {/* Central Farmer & Info */}
            <div className="central-hub">
              <div className="hub-inner">
                <div className="farmer-avatar">
                  <ServiceIcon name="User" size={48} color="#2ecc71" />
                </div>
                <div className="farmer-text">
                  <span className="farmer-title">FARMER</span>
                  <span className="farmer-year">@2026</span>
                </div>
              </div>
              <div className="hub-glow"></div>
            </div>

            {/* Service Buttons placed in circle */}
            {SERVICES.map((service, index) => {
              const angleDeg = (index * 30) - 90; // 12 items -> 30 deg each, starting at 12 o'clock (-90deg)
              const radius = 220; // Radius in pixels
              const angleRad = (angleDeg * Math.PI) / 180;
              
              // Position math
              const x = Math.round(radius * Math.cos(angleRad));
              const y = Math.round(radius * Math.sin(angleRad));

              return (
                <div 
                  key={service.id}
                  className="dial-item-wrapper"
                  style={{
                    transform: `translate(${x}px, ${y}px)`
                  }}
                >
                  <button
                    className={`dial-item ${service.active ? 'active' : 'disabled'} ${hoveredService === service.id ? 'hovered' : ''}`}
                    onClick={() => service.active && onServiceClick(service.id)}
                    onMouseEnter={() => setHoveredService(service.id)}
                    onMouseLeave={() => setHoveredService(null)}
                    style={{
                      '--theme-color': service.color,
                      borderColor: service.active ? 'var(--theme-color)' : '#444'
                    }}
                  >
                    <div className="icon-box">
                      <ServiceIcon name={service.icon} size={28} color={service.active ? service.color : '#888'} />
                    </div>
                    {service.active && counts[service.id] > 0 && (
                      <span className="badge-count animate-pop">{counts[service.id]}</span>
                    )}
                  </button>
                  <div className="dial-label-container">
                    <span className="dial-label">{service.title}</span>
                  </div>
                </div>
              );
            })}

            {/* Circular Orbit Rings */}
            <div className="orbit-ring ring-1"></div>
            <div className="orbit-ring ring-2"></div>
            <div className="orbit-ring ring-3"></div>
          </div>

          {/* Service detail card below the dial on hover */}
          <div className="service-details-card">
            {hoveredService ? (
              (() => {
                const s = SERVICES.find(x => x.id === hoveredService);
                return (
                  <div className="detail-content animate-fade-in">
                    <div className="detail-header" style={{ color: s.color }}>
                      <ServiceIcon name={s.icon} size={20} color={s.color} />
                      <h3>{s.title}</h3>
                      {!s.active && <span className="disabled-tag">Inactive</span>}
                    </div>
                    <p>{s.description}</p>
                    {s.active && (
                      <div className="presses-stat">
                        Pressed: <strong>{counts[s.id] || 0} times</strong>
                      </div>
                    )}
                  </div>
                );
              })()
            ) : (
              <div className="detail-content placeholder animate-fade-in">
                <Sparkles size={20} color="#2ecc71" className="sparkle-icon" />
                <p>Hover over any service button to learn more or click to register interest.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid-wrapper animate-fade-in">
          <div className="services-grid">
            {SERVICES.map((service) => (
              <div 
                key={service.id} 
                className={`grid-card ${service.active ? 'active' : 'disabled'}`}
                style={{ '--theme-color': service.color }}
                onClick={() => service.active && onServiceClick(service.id)}
              >
                <div className="grid-card-icon">
                  <ServiceIcon name={service.icon} size={32} color={service.active ? service.color : '#666'} />
                  {service.active && counts[service.id] > 0 && (
                    <span className="badge-count">{counts[service.id]}</span>
                  )}
                </div>
                <div className="grid-card-content">
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
                {service.active ? (
                  <div className="grid-card-action">
                    Click to Select
                  </div>
                ) : (
                  <div className="grid-card-action disabled-text">
                    Unavailable
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
