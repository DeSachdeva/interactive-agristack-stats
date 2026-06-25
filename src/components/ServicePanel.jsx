import React, { useState } from 'react';
import { SERVICES } from '../data/services';
import { ServiceIcon } from './ServiceIcon';
import { Sparkles, Grid, RotateCcw } from 'lucide-react';

export const ServicePanel = ({ counts, onServiceClick, totalClicks }) => {
  const [hoveredService, setHoveredService] = useState(null);
  const [layoutMode, setLayoutMode] = useState('circular'); // 'circular' or 'grid'

  const activeServices = SERVICES.filter(s => s.active);

  // SVG dimensions
  const centerSize = 290; // 580px width / 2

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
            {/* SVG Connecting Lines - placed behind buttons */}
            <svg className="connecting-lines-svg" width="580" height="580">
              {SERVICES.map((service, index) => {
                if (!service.active) return null;

                const angleDeg = (index * 45) - 90; // 8 items -> 45 deg step
                const radius = 220;
                const angleRad = (angleDeg * Math.PI) / 180;
                
                const x = Math.round(radius * Math.cos(angleRad));
                const y = Math.round(radius * Math.sin(angleRad));

                const startX = centerSize;
                const startY = centerSize;
                const endX = centerSize + x;
                const endY = centerSize + y;

                const isHovered = hoveredService === service.id;

                return (
                  <line
                    key={service.id}
                    x1={startX}
                    y1={startY}
                    x2={endX}
                    y2={endY}
                    className={`connecting-line ${isHovered ? 'line-hovered' : ''}`}
                    style={{ 
                      stroke: isHovered ? service.color : 'rgba(39, 174, 96, 0.25)',
                      '--service-color': service.color 
                    }}
                  />
                );
              })}
            </svg>

            {/* Central Farmer & Info */}
            <div className={`central-hub ${hoveredService ? 'hub-hovered' : ''}`}>
              <div className="hub-inner">
                <div className="farmer-avatar">
                  {/* Indian Farmer SVG Cut-out */}
                  <svg viewBox="0 0 64 64" width="58" height="58" className="farmer-cutout">
                    <circle cx="32" cy="32" r="30" fill="rgba(39, 174, 96, 0.1)" stroke="rgba(39, 174, 96, 0.25)" strokeWidth="1"/>
                    {/* Turban */}
                    <path d="M16 26 C 16 12, 48 12, 48 26 C 44 20, 20 20, 16 26 Z" fill="#e67e22" />
                    <path d="M18 22 C 20 10, 44 10, 46 22 C 40 16, 24 16, 18 22 Z" fill="#d35400" />
                    {/* Face */}
                    <circle cx="32" cy="33" r="13" fill="#f5cba7" />
                    {/* Eyes */}
                    <circle cx="27" cy="31" r="1.8" fill="#2c3e50" />
                    <circle cx="37" cy="31" r="1.8" fill="#2c3e50" />
                    {/* Mustache */}
                    <path d="M22 36 C 26 34, 30 36, 32 38 C 34 36, 38 34, 42 36 C 44 39, 38 39, 32 39 C 26 39, 20 39, 22 36 Z" fill="#2c3e50" />
                    {/* Turban Detail */}
                    <path d="M30 12 C 32 8, 36 8, 38 12 Z" fill="#e67e22" />
                    {/* Shoulders */}
                    <path d="M14 50 C 14 42, 50 42, 50 50 Z" fill="#ffffff" />
                    <path d="M28 42 L 32 48 L 36 42 Z" fill="#f5cba7" />
                  </svg>
                </div>
                <div className="farmer-text">
                  <span className="farmer-title">10+ Crore</span>
                  <span className="farmer-year">Indian Farmers</span>
                </div>
              </div>
              <div className="hub-glow"></div>
            </div>

            {/* Service Buttons placed in circle */}
            {SERVICES.map((service, index) => {
              const angleDeg = (index * 45) - 90; // 8 items -> 45 deg step
              const radius = 220;
              const angleRad = (angleDeg * Math.PI) / 180;
              
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
                      borderColor: service.active ? 'var(--theme-color)' : '#bbb'
                    }}
                  >
                    <div className="icon-box">
                      <ServiceIcon name={service.icon} size={28} color={service.active ? service.color : '#888'} />
                    </div>
                    {/* Badge counts removed on circular button items */}
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
                <Sparkles size={20} color="#27ae60" className="sparkle-icon" />
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
