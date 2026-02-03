import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import 'leaflet/dist/leaflet.css';

const styles = `
.cloud-regulations-page { min-height: 100vh; background: linear-gradient(to bottom, #f8fafc, #f1f5f9); }
.regulations-header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; padding: 24px 20px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); }
.header-content { max-width: 1200px; margin: 0 auto; }
.back-button { color: white !important; margin-bottom: 16px; }
.back-button:hover { background-color: rgba(255, 255, 255, 0.1) !important; }
.regulations-header h1 { font-size: 32px; font-weight: 600; margin-bottom: 8px; }
.regulations-header p { font-size: 16px; opacity: 0.85; color: #cbd5e1; }
.regulations-legend { background: white; padding: 32px 20px; margin: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05); }
.regulations-legend h3 { font-size: 20px; font-weight: 600; color: #0f172a; margin-bottom: 20px; }
.legend-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-bottom: 24px; }
.legend-item { display: flex; align-items: center; padding: 16px; border-radius: 8px; background: #f8fafc; border: 1px solid #e2e8f0; transition: all 0.2s; }
.legend-item:hover { background: #f1f5f9; border-color: #cbd5e1; }
.legend-color { width: 36px; height: 36px; border-radius: 50%; margin-right: 12px; flex-shrink: 0; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); }
.legend-text { flex: 1; }
.legend-text strong { display: block; font-size: 14px; color: #0f172a; margin-bottom: 4px; }
.legend-text span { font-size: 12px; color: #64748b; }
.legend-count { font-weight: 600; color: #1e293b; font-size: 20px; margin-left: 12px; min-width: 40px; text-align: right; }
.restrictions-info { background: #fef9c3; border: 1px solid #fde047; border-radius: 8px; padding: 16px; margin-bottom: 20px; }
.info-title { font-size: 13px; font-weight: 600; color: #78350f; margin-bottom: 12px; }
.flags-legend { display: flex; gap: 12px; flex-wrap: wrap; font-size: 11px; color: #555; margin-bottom: 10px; line-height: 1.6; }
.indicators { display: flex; gap: 20px; font-size: 11px; }
.indicator-dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; vertical-align: middle; margin-right: 4px; }
.filter-buttons { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-top: 20px; }
.filter-btn { padding: 10px 18px; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.2s; background: white; color: #0f172a; }
.filter-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border-color: #cbd5e1; }
.filter-btn.active { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); border-color: #94a3b8; }
.btn-all.active { background: #0f172a; color: white; border-color: #0f172a; }
.btn-amber.active { background: #FFD700; color: #7a5c00; border-color: #fcd34d; }
.btn-red.active { background: #FF6B6B; color: white; border-color: #ff5252; }
.btn-grey.active { background: #D3D3D3; color: #333; border-color: #bfbfbf; }
.map-container { height: 600px; margin: 0 20px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); }
.popup-content { min-width: 280px; padding: 0; }
.popup-content h4 { margin-bottom: 8px; color: #0f172a; font-size: 16px; font-weight: 600; }
.popup-content .status-badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; margin-bottom: 10px; text-transform: capitalize; }
.status-green { background: #90EE90; color: #2d5016; }
.status-amber { background: #FFD700; color: #7a5c00; }
.status-red { background: #FF6B6B; color: white; }
.status-grey { background: #D3D3D3; color: #444; }
.popup-content .region { font-size: 11px; color: #888; font-style: italic; margin-bottom: 8px; }
.popup-content p { font-size: 13px; line-height: 1.6; color: #555; margin-bottom: 8px; }
.flags-row { display: flex; gap: 5px; flex-wrap: wrap; margin: 8px 0 8px; }
.flag-chip { display: inline-flex; align-items: center; gap: 3px; font-size: 11px; font-weight: 600; padding: 2px 6px; border-radius: 10px; background: #eef2ff; color: #4338ca; border: 1px solid #c7d2fe; }
.flag-chip.partial { background: #fef3c7; color: #92400e; border-color: #fcd34d; }
.dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; }
.dot-yes { background: #22c55e; }
.dot-partial { background: #f59e0b; }
.scope-note { font-size: 11px; color: #b45309; background: #fef9c3; border: 1px solid #fde047; border-radius: 4px; padding: 3px 6px; margin-top: 4px; }
.regulations-stats { background: white; padding: 32px 20px; margin: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05); }
.regulations-stats h3 { font-size: 20px; font-weight: 600; color: #0f172a; margin-bottom: 20px; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
.stat-box { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; padding: 24px; border-radius: 8px; text-align: center; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); transition: all 0.2s; }
.stat-box:hover { transform: translateY(-4px); box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15); }
.stat-box .number { font-size: 40px; font-weight: 700; margin-bottom: 8px; }
.stat-box .label { font-size: 14px; opacity: 0.85; }
.leaflet-popup-content-wrapper { border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); }
.leaflet-popup-tip { background-color: white; }
@media (max-width: 768px) {
  .regulations-header h1 { font-size: 24px; }
  .regulations-header p { font-size: 14px; }
  .legend-grid { grid-template-columns: 1fr; }
  .filter-buttons { flex-direction: column; }
  .filter-btn { width: 100%; }
  .map-container { height: 400px; margin: 0 20px; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .flags-legend { font-size: 10px; }
}
`;

const countryData = [
  {name: "UAE", lat: 24.4539, lng: 54.3773, status: "amber", region: "Middle East", flags: {A:1, R:1, U:1, S:1, E:1, C:1}, details: "CBUAE Rulebook: dedicated Cloud Computing + Outsourcing sections. Prior approval required for material outsourcing. Data offshoring requires CB consultation. Exit planning mandatory (§2.19). Auditability requirement (§2.13)."},
  {name: "Saudi Arabia", lat: 23.8859, lng: 45.0792, status: "amber", region: "Middle East", flags: {A:1, R:1, U:1, S:1, E:1, C:1}, details: "SAMA approval required prior to signing cloud contract (hybrid/public). Data residency mandated for sensitive financial data. Cyber Security Framework governs third-party & cloud controls. Market: $14.55B → $38.23B by 2033."},
  {name: "Qatar", lat: 25.3548, lng: 51.1839, status: "amber", region: "Middle East", flags: {A:1, R:1, U:1, S:1, E:1, C:1}, details: "QCB Cloud Regulation (eff. 15 Apr 2024). §21.5: QCB approval required before any cloud arrangement. §21.4: PII & financial data must be processed within Qatar only. Termination & data-return provisions (§18.4–18.7). Sub-contractor controls in scope."},
  {name: "Kuwait", lat: 29.3117, lng: 47.4818, status: "amber", region: "Middle East", details: "4-level data classification. Levels 3-4 require localization in Kuwait. CITRA licensing."},
  {name: "Bahrain", lat: 26.0667, lng: 50.5577, status: "amber", region: "Middle East", flags: {A:1, R:1, U:1, S:1, E:1, C:1}, details: "CBB Cloud Outsourcing Control Guidelines (Appendix OM-2). Data location/transfer controls, governance framework, due diligence, subcontracting & exit provisions. Cloud-first policy. Data Embassy law."},
  {name: "Oman", lat: 21.4735, lng: 55.9754, status: "grey", region: "Middle East", details: "E-Transactions Law has privacy provisions. Cloud framework unclear."},
  {name: "Jordan", lat: 30.5852, lng: 36.2384, status: "grey", region: "Middle East", details: "No specific cloud regulations identified. Needs local language search."},
  {name: "Lebanon", lat: 33.8547, lng: 35.8623, status: "grey", region: "Middle East", details: "Economic crisis. Framework likely outdated."},
  {name: "Iraq", lat: 33.2232, lng: 43.6793, status: "grey", region: "Middle East", details: "Reforms underway but cloud regulations not identified."},
  {name: "Yemen", lat: 15.5527, lng: 48.5164, status: "grey", region: "Middle East", details: "No data available due to conflict."},
  {name: "Egypt", lat: 26.8206, lng: 30.8025, status: "amber", region: "North Africa", flags: {A:1, R:1, U:1, S:1, E:1, C:1}, scopeNote: "†CBE cloud reference is within PSP/PSO regulation, not a consolidated bank-cloud rulebook. Banks may have additional requirements.", details: "Cloud First Policy Aug 2024. CBE regulation for payment operators explicitly references cloud computing. Personal Data Protection Law 2020. Tier-3 license for government cloud."},
  {name: "Morocco", lat: 31.7917, lng: -7.0926, status: "amber", region: "North Africa", flags: {A:1, R:1, U:1, S:1, E:1, C:1}, details: "Bank Al-Maghrib Directive 4/W/2022: prior agreement required for outsourcing significant functions to cloud. Minimum rules cover data handling, governance, audit access, subcontracting & exit. Decree 2-24-921 (Nov 2024) for critical entities."},
  {name: "Nigeria", lat: 9.0820, lng: 8.6753, status: "amber", region: "West Africa", details: "STRICT: Mandatory data localization. NDPR/NDPA. $358K Fidelity fine 2024. Hybrid cloud required."},
  {name: "Ghana", lat: 7.9465, lng: -1.0232, status: "amber", region: "West Africa", flags: {A:1, R:1, U:1, S:1, E:1, C:1}, details: "BoG Outsourcing Directive (Nov 2024, eff. Jul 2025). Written CB approval required. Explicitly references cloud service providers — mandates disclosure of data type & storage locations. Materiality framework + full outsourcing lifecycle controls."},
  {name: "Senegal", lat: 14.4974, lng: -14.4524, status: "amber", region: "West Africa", details: "BCEAO regional framework. Huawei datacenter. Data sovereignty push."},
  {name: "Kenya", lat: -0.0236, lng: 37.9062, status: "amber", region: "East Africa", flags: {A:1, R:0.5, U:1, S:1, E:1, C:1}, scopeNote: "*R: CBK/PG/16 Part IV covers offshore outsourcing controls but no explicit standalone data-residency mandate equivalent to UAE/KSA/Qatar.", details: "CBK/PG/16 Outsourcing Guideline: approval required for material activities. Offshore outsourcing addressed in Part IV. Cybersecurity Guidance Note 2017. Subcontractor clause (§4.5.6.6(g)). Cloud Policy 2025. Record fines 2024."},
  {name: "Ethiopia", lat: 9.1450, lng: 40.4897, status: "red", region: "East Africa", details: "PROHIBITED: Crypto banned. No mobile money. Cloud for financial services likely not allowed."},
  {name: "Mauritius", lat: -20.3484, lng: 57.5522, status: "amber", region: "East Africa", flags: {A:1, R:1, U:1, S:1, E:1, C:1}, details: "BoM Guideline on Use of Cloud Services (eff. 7 Sep 2022). Dedicated sections: Data Location, Subcontracting, Exit Strategies, Audit/Testing, Security Management, Regulatory Notification. Risk-based approach. Annual cloud-services return required."},
  {name: "South Africa", lat: -30.5595, lng: 22.9375, status: "amber", region: "Southern Africa", flags: {A:1, R:1, U:1, S:1, E:1, C:1}, details: "POPIA 2021. Joint Communication 2 of 2025 (FSCA + PA, 25 Jul 2025): risk-based cloud & offshoring expectations, governance, due diligence. Directive 3 of 2018 binding for banks. Joint Standard in development. Penalties up to 10% turnover."},
];

const colors = {
  green: '#90EE90',
  amber: '#FFD700',
  red: '#FF6B6B',
  grey: '#D3D3D3'
};

function CountryPopup({ country }) {
  const statusBadge = `status-${country.status}`;
  const statusText = country.status.charAt(0).toUpperCase() + country.status.slice(1);
  const flagLabels = {A:'Approval', R:'Residency', U:'Audit', S:'Subcontracting', E:'Exit/BCP', C:'Security'};
  const flagKeys = ['A','R','U','S','E','C'];

  return (
    <div className="popup-content">
      <h4>{country.name}</h4>
      <div className={`status-badge ${statusBadge}`}>{statusText}</div>
      <p className="region">{country.region}</p>
      {country.flags && (
        <div className="flags-row">
          {flagKeys.map(k => {
            const val = country.flags[k];
            if (val === 1) {
              return <span key={k} className="flag-chip"><span className="dot dot-yes"></span>{k}: {flagLabels[k]}</span>;
            } else if (val === 0.5) {
              return <span key={k} className="flag-chip partial"><span className="dot dot-partial"></span>{k}: {flagLabels[k]}*</span>;
            }
            return null;
          })}
        </div>
      )}
      <p>{country.details}</p>
      {country.scopeNote && <div className="scope-note">{country.scopeNote}</div>}
    </div>
  );
}

export default function CloudRegulationsMap() {
  const [currentFilter, setCurrentFilter] = useState('all');

  React.useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
    return () => styleSheet.remove();
  }, []);

  const getStatusCounts = () => {
    const counts = { green: 0, amber: 0, red: 0, grey: 0 };
    countryData.forEach(c => counts[c.status]++);
    return counts;
  };

  const counts = getStatusCounts();
  const totalVerified = counts.green + counts.amber + counts.red;
  const coverage = Math.round((totalVerified / countryData.length) * 100);

  return (
    <div className="cloud-regulations-page">
      {/* Header */}
      <header className="regulations-header">
        <div className="header-content">
          <Link to={createPageUrl('Dashboard')}>
            <Button variant="ghost" className="back-button">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1>🌍 MEA Cloud Regulations Map</h1>
            <p>Financial Services Cloud Computing - Interactive Status by Country</p>
          </div>
        </div>
      </header>

      {/* Legend */}
      <div className="regulations-legend">
        <h3>Regulation Status Legend</h3>
        <div className="legend-grid">
          <div className="legend-item">
            <div className="legend-color" style={{background: '#90EE90'}}></div>
            <div className="legend-text">
              <strong>Green - Allowed</strong>
              <span>No significant restrictions</span>
            </div>
            <div className="legend-count">{counts.green}</div>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{background: '#FFD700'}}></div>
            <div className="legend-text">
              <strong>Amber - Restricted</strong>
              <span>Allowed with data localization/licensing</span>
            </div>
            <div className="legend-count">{counts.amber}</div>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{background: '#FF6B6B'}}></div>
            <div className="legend-text">
              <strong>Red - Not Allowed</strong>
              <span>Prohibited or severely restricted</span>
            </div>
            <div className="legend-count">{counts.red}</div>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{background: '#D3D3D3'}}></div>
            <div className="legend-text">
              <strong>Grey - No Info</strong>
              <span>Regulatory status unclear</span>
            </div>
            <div className="legend-count">{counts.grey}</div>
          </div>
        </div>

        <div className="restrictions-info">
          <div className="info-title">Restriction Flags (shown on verified countries)</div>
          <div className="flags-legend">
            <span><strong>A</strong> Approval / Notification &nbsp;</span>
            <span><strong>R</strong> Data Residency &nbsp;</span>
            <span><strong>U</strong> Audit / Supervisory Access &nbsp;</span>
            <span><strong>S</strong> Subcontracting Controls &nbsp;</span>
            <span><strong>E</strong> Exit Plan / BCP &nbsp;</span>
            <span><strong>C</strong> Security / Risk Controls</span>
          </div>
          <div className="indicators">
            <span><span className="indicator-dot" style={{background:'#22c55e'}}></span> Confirmed in regulation</span>
            <span><span className="indicator-dot" style={{background:'#f59e0b'}}></span> Partial / indirect coverage</span>
          </div>
        </div>

        <div className="filter-buttons">
          <button 
            className={`filter-btn btn-all ${currentFilter === 'all' ? 'active' : ''}`}
            onClick={() => setCurrentFilter('all')}
          >
            Show All ({countryData.length})
          </button>
          <button 
            className={`filter-btn btn-amber ${currentFilter === 'amber' ? 'active' : ''}`}
            onClick={() => setCurrentFilter('amber')}
          >
            Amber Only ({counts.amber})
          </button>
          <button 
            className={`filter-btn btn-red ${currentFilter === 'red' ? 'active' : ''}`}
            onClick={() => setCurrentFilter('red')}
          >
            Red Only ({counts.red})
          </button>
          <button 
            className={`filter-btn btn-grey ${currentFilter === 'grey' ? 'active' : ''}`}
            onClick={() => setCurrentFilter('grey')}
          >
            Grey Only ({counts.grey})
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="map-container">
        <MapContainer center={[15, 25]} zoom={3} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© OpenStreetMap contributors'
          />
          {countryData.map((country, idx) => {
            const shouldShow = currentFilter === 'all' || currentFilter === country.status;
            return (
              <CircleMarker
                key={idx}
                center={[country.lat, country.lng]}
                radius={8}
                fillColor={colors[country.status]}
                color="#fff"
                weight={2}
                opacity={shouldShow ? 1 : 0.3}
                fillOpacity={shouldShow ? 0.8 : 0.2}
              >
                <Popup className="country-popup">
                  <CountryPopup country={country} />
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

      {/* Stats */}
      <div className="regulations-stats">
        <h3>Coverage Statistics</h3>
        <div className="stats-grid">
          <div className="stat-box">
            <div className="number">{countryData.length}</div>
            <div className="label">Total Countries</div>
          </div>
          <div className="stat-box">
            <div className="number">{coverage}%</div>
            <div className="label">With Regulations</div>
          </div>
          <div className="stat-box">
            <div className="number">{100 - coverage}%</div>
            <div className="label">Information Gap</div>
          </div>
          <div className="stat-box">
            <div className="number">{counts.amber}</div>
            <div className="label">Tier 1 Markets</div>
          </div>
        </div>
      </div>
    </div>
  );
}