import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import 'leaflet/dist/leaflet.css';
import './CloudRegulationsMap.css';

const countryData = [
  // Middle East
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
  {name: "Syria", lat: 34.8021, lng: 38.9968, status: "grey", region: "Middle East", details: "No data available."},
  {name: "Israel", lat: 31.0461, lng: 34.8516, status: "grey", region: "Middle East", details: "Advanced tech sector but specific regulations not captured."},
  {name: "Palestine", lat: 31.9522, lng: 35.2332, status: "grey", region: "Middle East", details: "No information found."},
  {name: "Iran", lat: 32.4279, lng: 53.6880, status: "grey", region: "Middle East", details: "Under sanctions. Cloud likely restricted."},
  {name: "Turkey", lat: 38.9637, lng: 35.2433, status: "grey", region: "Middle East", details: "Large fintech market. Needs Turkish language search."},
  
  // North Africa
  {name: "Egypt", lat: 26.8206, lng: 30.8025, status: "amber", region: "North Africa", flags: {A:1, R:1, U:1, S:1, E:1, C:1}, scopeNote: "†CBE cloud reference is within PSP/PSO regulation, not a consolidated bank-cloud rulebook. Banks may have additional requirements.", details: "Cloud First Policy Aug 2024. CBE regulation for payment operators explicitly references cloud computing. Personal Data Protection Law 2020. Tier-3 license for government cloud."},
  {name: "Morocco", lat: 31.7917, lng: -7.0926, status: "amber", region: "North Africa", flags: {A:1, R:1, U:1, S:1, E:1, C:1}, details: "Bank Al-Maghrib Directive 4/W/2022: prior agreement required for outsourcing significant functions to cloud. Minimum rules cover data handling, governance, audit access, subcontracting & exit. Decree 2-24-921 (Nov 2024) for critical entities."},
  {name: "Libya", lat: 26.3351, lng: 17.2283, status: "grey", region: "North Africa", details: "Political instability. No framework."},
  {name: "Tunisia", lat: 33.8869, lng: 9.5375, status: "grey", region: "North Africa", details: "South-MED reforms. Need French/Arabic search."},
  {name: "Algeria", lat: 28.0339, lng: 1.6596, status: "grey", region: "North Africa", details: "FATF grey list. AML regulations but no cloud framework."},
  {name: "Sudan", lat: 12.8628, lng: 30.2176, status: "grey", region: "North Africa", details: "No information available."},
  {name: "South Sudan", lat: 6.8770, lng: 31.3070, status: "grey", region: "North Africa", details: "No information available."},
  
  // West Africa
  {name: "Nigeria", lat: 9.0820, lng: 8.6753, status: "amber", region: "West Africa", details: "STRICT: Mandatory data localization. NDPR/NDPA. $358K Fidelity fine 2024. Hybrid cloud required."},
  {name: "Ghana", lat: 7.9465, lng: -1.0232, status: "amber", region: "West Africa", flags: {A:1, R:1, U:1, S:1, E:1, C:1}, details: "BoG Outsourcing Directive (Nov 2024, eff. Jul 2025). Written CB approval required. Explicitly references cloud service providers — mandates disclosure of data type & storage locations. Materiality framework + full outsourcing lifecycle controls."},
  {name: "Senegal", lat: 14.4974, lng: -14.4524, status: "amber", region: "West Africa", details: "BCEAO regional framework. Huawei datacenter. Data sovereignty push."},
  {name: "Côte d'Ivoire", lat: 7.5400, lng: -5.5471, status: "amber", region: "West Africa", details: "BCEAO framework. IBM Cloud for Financial Services. UEMOA strategy."},
  {name: "Mali", lat: 17.5707, lng: -3.9962, status: "grey", region: "West Africa", details: "BCEAO member. Limited cloud regulations."},
  {name: "Burkina Faso", lat: 12.2383, lng: -1.5616, status: "grey", region: "West Africa", details: "BCEAO member. No specific framework."},
  {name: "Niger", lat: 17.6078, lng: 8.0817, status: "grey", region: "West Africa", details: "No information found."},
  {name: "Guinea", lat: 9.9456, lng: -9.6966, status: "grey", region: "West Africa", details: "No information found."},
  {name: "Sierra Leone", lat: 8.4606, lng: -11.7799, status: "grey", region: "West Africa", details: "Banned crypto. Cloud framework unknown."},
  {name: "Liberia", lat: 6.4281, lng: -9.4295, status: "grey", region: "West Africa", details: "No information found."},
  {name: "Mauritania", lat: 21.0079, lng: -10.9408, status: "grey", region: "West Africa", details: "No information found."},
  {name: "Gambia", lat: 13.4432, lng: -15.3101, status: "grey", region: "West Africa", details: "No information found."},
  {name: "Guinea-Bissau", lat: 11.8037, lng: -15.1804, status: "grey", region: "West Africa", details: "No information found."},
  {name: "Cape Verde", lat: 16.5388, lng: -23.0418, status: "grey", region: "West Africa", details: "CBDC research. No cloud regulations."},
  {name: "Benin", lat: 9.3077, lng: 2.3158, status: "grey", region: "West Africa", details: "High mobile money. No cloud regs."},
  {name: "Togo", lat: 8.6195, lng: 0.8248, status: "grey", region: "West Africa", details: "DPA established. No cloud-specific regs."},
  
  // Central Africa
  {name: "Cameroon", lat: 7.3697, lng: 12.3547, status: "grey", region: "Central Africa", details: "New Data Protection Law 2024. No cloud framework."},
  {name: "Chad", lat: 15.4542, lng: 18.7322, status: "grey", region: "Central Africa", details: "No information found."},
  {name: "CAR", lat: 6.6111, lng: 20.9394, status: "grey", region: "Central Africa", details: "No information found."},
  {name: "Eq. Guinea", lat: 1.6508, lng: 10.2679, status: "grey", region: "Central Africa", details: "No mobile money. No framework."},
  {name: "Gabon", lat: -0.8037, lng: 11.6094, status: "grey", region: "Central Africa", details: "No information found."},
  {name: "Rep. Congo", lat: -0.2280, lng: 15.8277, status: "grey", region: "Central Africa", details: "DPA established 2024. No cloud regs."},
  {name: "DR Congo", lat: -4.0383, lng: 21.7587, status: "grey", region: "Central Africa", details: "DPA 2024. New datacenters in Kinshasa. No regulatory framework yet."},
  {name: "São Tomé", lat: 0.1864, lng: 6.6131, status: "grey", region: "Central Africa", details: "No information found."},
  
  // East Africa
  {name: "Kenya", lat: -0.0236, lng: 37.9062, status: "amber", region: "East Africa", flags: {A:1, R:0.5, U:1, S:1, E:1, C:1}, scopeNote: "*R: CBK/PG/16 Part IV covers offshore outsourcing controls but no explicit standalone data-residency mandate equivalent to UAE/KSA/Qatar.", details: "CBK/PG/16 Outsourcing Guideline: approval required for material activities. Offshore outsourcing addressed in Part IV. Cybersecurity Guidance Note 2017. Subcontractor clause (§4.5.6.6(g)). Cloud Policy 2025. Record fines 2024."},
  {name: "Tanzania", lat: -6.3690, lng: 34.8888, status: "grey", region: "East Africa", details: "Crypto banned. 2% digital tax. Cloud framework unclear."},
  {name: "Uganda", lat: 1.3733, lng: 32.2903, status: "grey", region: "East Africa", details: "5% non-resident tax. Data law revision planned."},
  {name: "Rwanda", lat: -1.9403, lng: 29.8739, status: "amber", region: "East Africa", details: "Tier 1 cybersecurity. SCCs published. Cyber Security Strategy 2024-2029."},
  {name: "Burundi", lat: -3.3731, lng: 29.9189, status: "grey", region: "East Africa", details: "No information found."},
  {name: "Ethiopia", lat: 9.1450, lng: 40.4897, status: "red", region: "East Africa", details: "PROHIBITED: Crypto banned. No mobile money. Cloud for financial services likely not allowed."},
  {name: "Eritrea", lat: 15.1794, lng: 39.7823, status: "grey", region: "East Africa", details: "No information found."},
  {name: "Djibouti", lat: 11.8251, lng: 42.5903, status: "grey", region: "East Africa", details: "No information found."},
  {name: "Somalia", lat: 5.1521, lng: 46.1996, status: "grey", region: "East Africa", details: "DPA 2024. Limited infrastructure."},
  {name: "Seychelles", lat: -4.6796, lng: 55.4920, status: "grey", region: "East Africa", details: "Low mobile money. No framework."},
  {name: "Comoros", lat: -11.6455, lng: 43.3333, status: "grey", region: "East Africa", details: "Building datacenter. No framework."},
  {name: "Mauritius", lat: -20.3484, lng: 57.5522, status: "amber", region: "East Africa", flags: {A:1, R:1, U:1, S:1, E:1, C:1}, details: "BoM Guideline on Use of Cloud Services (eff. 7 Sep 2022). Dedicated sections: Data Location, Subcontracting, Exit Strategies, Audit/Testing, Security Management, Regulatory Notification. Risk-based approach. Annual cloud-services return required."},
  {name: "Madagascar", lat: -18.7669, lng: 46.8691, status: "grey", region: "East Africa", details: "CBDC research. No cloud framework."},
  
  // Southern Africa
  {name: "South Africa", lat: -30.5595, lng: 22.9375, status: "amber", region: "Southern Africa", flags: {A:1, R:1, U:1, S:1, E:1, C:1}, details: "POPIA 2021. Joint Communication 2 of 2025 (FSCA + PA, 25 Jul 2025): risk-based cloud & offshoring expectations, governance, due diligence. Directive 3 of 2018 binding for banks. Joint Standard in development. Penalties up to 10% turnover."},
  {name: "Botswana", lat: -22.3285, lng: 24.6849, status: "grey", region: "Southern Africa", details: "Amended data law 2024. No cloud framework."},
  {name: "Namibia", lat: -22.9576, lng: 18.4904, status: "grey", region: "Southern Africa", details: "CBDC research. No cloud regs."},
  {name: "Zimbabwe", lat: -19.0154, lng: 29.1549, status: "grey", region: "Southern Africa", details: "CBDC research. No framework."},
  {name: "Zambia", lat: -13.1339, lng: 27.8493, status: "grey", region: "Southern Africa", details: "CBDC research. No cloud regs."},
  {name: "Mozambique", lat: -18.6657, lng: 35.5296, status: "grey", region: "Southern Africa", details: "No information found."},
  {name: "Malawi", lat: -13.2543, lng: 34.3015, status: "grey", region: "Southern Africa", details: "Data Protection Law 2024. No cloud framework."},
  {name: "Angola", lat: -11.2027, lng: 17.8739, status: "grey", region: "Southern Africa", details: "Low mobile money. No framework."},
  {name: "Lesotho", lat: -29.6100, lng: 28.2336, status: "grey", region: "Southern Africa", details: "No information found."},
  {name: "Eswatini", lat: -26.5225, lng: 31.4659, status: "grey", region: "Southern Africa", details: "Enforcement notices 2024. No framework."}
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