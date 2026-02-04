import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const styles = `
.cloud-regulations-page { min-height: 100vh; background: linear-gradient(to bottom, #f8fafc, #f1f5f9); }
.regulations-header { background: white; border-bottom: 1px solid #e2e8f0; padding: 16px 24px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05); }
.header-content { max-width: 1400px; margin: 0 auto; }
.regulations-header h1 { font-size: 28px; font-weight: 600; text-slate-900 margin-bottom: 4px; }
.regulations-header p { font-size: 14px; color: #64748b; }
.regulations-stats { background: white; padding: 20px; margin: 28px 24px 24px; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05); }
.regulations-stats h3 { font-size: 16px; font-weight: 600; color: #0f172a; margin-bottom: 16px; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; }
.stat-box { background: #f8fafc; border: 1px solid #e2e8f0; color: #0f172a; padding: 10px 14px; border-radius: 6px; display: flex; align-items: center; justify-content: space-between; transition: all 0.3s; }
.stat-box:hover { background: #f1f5f9; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08); }
.stat-box .number { font-size: 24px; font-weight: 700; color: #0f172a; }
.stat-box .label { font-size: 13px; color: #64748b; font-weight: 500; }
.regulations-legend { background: white; padding: 20px; margin: 0 24px 24px; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05); }
.regulations-legend h3 { font-size: 16px; font-weight: 600; color: #0f172a; margin-bottom: 16px; }
.legend-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; }
.legend-item { display: flex; align-items: center; padding: 12px; border-radius: 6px; background: #f8fafc; border: 1px solid #e2e8f0; transition: all 0.3s; }
.legend-item:hover { background: #f1f5f9; }
.legend-color { width: 28px; height: 28px; border-radius: 50%; margin-right: 10px; flex-shrink: 0; }
.legend-text { flex: 1; }
.legend-text strong { display: block; font-size: 12px; color: #0f172a; margin-bottom: 2px; font-weight: 600; }
.legend-text span { font-size: 11px; color: #64748b; }
.legend-count { font-weight: 600; color: #1e293b; font-size: 16px; margin-left: 10px; min-width: 30px; text-align: right; }
.filter-buttons { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-top: 16px; }
.filter-btn { padding: 8px 14px; border: 1px solid #e2e8f0; border-radius: 6px; cursor: pointer; font-size: 11px; font-weight: 600; transition: all 0.2s; background: white; color: #0f172a; }
.filter-btn:hover { background: #f8fafc; border-color: #cbd5e1; }
.filter-btn.active { background: #0f172a; color: white; border-color: #0f172a; }
.map-container { height: 700px; margin: 0 24px 24px; border-radius: 8px; overflow: hidden; position: relative; background: white; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05); }
.map-image { width: 100%; height: 100%; object-fit: contain; object-position: center; }
.map-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; }
.country-overlay { position: absolute; cursor: pointer; pointer-events: auto; transition: all 0.2s; }
.country-overlay:hover { filter: brightness(1.2); z-index: 10; }
.map-tooltip { position: absolute; background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); pointer-events: none; z-index: 1000; max-width: 350px; font-size: 12px; }
.map-tooltip h4 { font-size: 14px; font-weight: 600; color: #0f172a; margin-bottom: 6px; }
.map-tooltip .status-badge { display: inline-block; padding: 2px 8px; border-radius: 8px; font-size: 10px; font-weight: 600; margin-bottom: 8px; }
.map-tooltip .region { font-size: 10px; color: #64748b; font-style: italic; margin-bottom: 6px; }
.map-tooltip p { line-height: 1.4; color: #475569; margin-bottom: 6px; }
.map-tooltip .flags-row { display: flex; gap: 3px; flex-wrap: wrap; margin: 6px 0; }
.map-tooltip .scope-note { font-size: 9px; color: #b45309; background: #fef9c3; border: 1px solid #fde047; border-radius: 4px; padding: 2px 4px; margin-top: 4px; }
.restrictions-info { margin: 24px 24px; }
.info-title { font-size: 13px; font-weight: 600; color: #0f172a; margin-bottom: 12px; }
.flags-legend-container { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
.flag-item { background: #fafaf9; padding: 10px 14px; border-radius: 8px; border: 1px solid #e7e5e4; display: flex; flex-direction: column; align-items: center; text-align: center; min-width: 80px; }
.flag-acronym { font-size: 16px; font-weight: 700; color: #0f172a; line-height: 1.2; }
.flag-label { font-size: 10px; color: #64748b; margin-top: 4px; line-height: 1.3; }
.indicators { display: flex; gap: 18px; font-size: 11px; margin-top: 12px; }
.indicator-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; vertical-align: middle; margin-right: 4px; }
.verified-table { background: white; margin: 0 24px 24px; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05); }
.verified-table h3 { font-size: 16px; font-weight: 600; color: #0f172a; margin-bottom: 16px; }
.table-wrapper { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 11px; }
.data-table thead { background: #f8fafc; }
.data-table th { padding: 10px 8px; text-align: left; font-weight: 600; color: #475569; border-bottom: 2px solid #e2e8f0; }
.data-table td { padding: 10px 8px; border-bottom: 1px solid #f1f5f9; vertical-align: top; }
.data-table tr:hover { background: #fafafa; }
.table-country { font-weight: 600; color: #0f172a; }
.table-status { text-align: center; }
.table-flag { text-align: center; font-size: 14px; }
.table-notes { font-size: 10px; color: #64748b; line-height: 1.4; }
.popup-content { min-width: 280px; padding: 0; font-size: 13px; }
.popup-content h4 { margin-bottom: 6px; color: #0f172a; font-size: 15px; font-weight: 600; }
.popup-content .status-badge { display: inline-block; padding: 3px 10px; border-radius: 10px; font-size: 11px; font-weight: 600; margin-bottom: 8px; text-transform: capitalize; }
.status-green { background: #90EE90; color: #2d5016; }
.status-amber { background: #FFD700; color: #7a5c00; }
.status-red { background: #FF6B6B; color: white; }
.status-grey { background: #D3D3D3; color: #444; }
.popup-content .region { font-size: 10px; color: #888; font-style: italic; margin-bottom: 6px; }
.popup-content p { font-size: 12px; line-height: 1.5; color: #555; margin-bottom: 6px; }
.flags-row { display: flex; gap: 4px; flex-wrap: wrap; margin: 6px 0; }
.flag-chip { display: inline-flex; align-items: center; gap: 3px; font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 8px; background: #eef2ff; color: #4338ca; border: 1px solid #c7d2fe; }
.flag-chip.partial { background: #fef3c7; color: #92400e; border-color: #fcd34d; }
.dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
.dot-yes { background: #22c55e; }
.dot-partial { background: #f59e0b; }
.scope-note { font-size: 10px; color: #b45309; background: #fef9c3; border: 1px solid #fde047; border-radius: 4px; padding: 3px 5px; margin-top: 4px; }
.leaflet-popup-content-wrapper { border-radius: 6px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12); }
.leaflet-popup-tip { background-color: white; }
@media (max-width: 768px) {
  .regulations-header h1 { font-size: 22px; }
  .regulations-header p { font-size: 13px; }
  .legend-grid { grid-template-columns: 1fr; }
  .filter-buttons { flex-direction: column; }
  .filter-btn { width: 100%; }
  .map-container { height: 450px; margin: 0 16px 24px; }
  .regulations-legend { margin: 0 16px 20px; padding: 16px; }
  .regulations-stats { margin: 20px 16px 16px; padding: 16px; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .restrictions-info { margin: 20px 16px; }
  .verified-table { margin: 0 16px 20px; padding: 16px; }
  .flags-legend-container { gap: 6px; }
  .flag-item { min-width: 70px; padding: 8px 10px; }
}
`;

const countryData = [
  {name: "UAE", lat: 24.4539, lng: 54.3773, status: "amber", region: "Middle East", flags: {A:1, R:1, U:1, S:1, E:1, C:1}, details: "CBUAE Rulebook Cloud Computing + Outsourcing sections. Material outsourcing requires prior approval. Data offshoring requires CB consultation (§3.26). Auditability (§2.13). Exit planning (§2.19). Subcontracting governance (§2.14). Risk assessment + security (§3.41–53)."},
  {name: "Saudi Arabia", lat: 23.8859, lng: 45.0792, status: "amber", region: "Middle East", flags: {A:1, R:1, U:1, S:1, E:1, C:1}, details: "SAMA Cyber Security Framework + Outsourcing Rules. SAMA approval required prior to signing cloud contract for hybrid/public. Data residency for sensitive financial data. Regulator access. Subcontractor controls. Exit provisions. Due diligence + risk assessment. Market: $14.55B → $38.23B by 2033."},
  {name: "Qatar", lat: 25.3548, lng: 51.1839, status: "amber", region: "Middle East", flags: {A:1, R:1, U:1, S:1, E:1, C:1}, details: "QCB Cloud Regulation (eff. 15 Apr 2024). §21.5: QCB approval required. §21.4: PII & financial data processed within Qatar only. Audit rights (§22). Subcontractor controls. Exit + data return (§18.4–7). Security assessments."},
  {name: "Kuwait", lat: 29.3117, lng: 47.4818, status: "amber", region: "Middle East", flags: {A:0, R:0, U:0, S:0, E:0, C:0}, flagNote: "INFERRED", details: "4-level data classification. Levels 3-4 require localization in Kuwait. CITRA licensing for cloud providers handling sensitive data. Flags inferred from classification framework, not verified from primary rulebook."},
  {name: "Bahrain", lat: 26.0667, lng: 50.5577, status: "amber", region: "Middle East", flags: {A:1, R:1, U:1, S:1, E:1, C:1}, details: "CBB Cloud Outsourcing Control Guidelines (Appendix OM-2). Data location/transfer controls. Governance. Due diligence. Subcontracting. Exit strategy. Security controls. Cloud-first policy + Data Embassy law."},
  {name: "Oman", lat: 21.4735, lng: 55.9754, status: "grey", region: "Middle East", details: "E-Transactions Law has privacy provisions. Cloud framework unclear."},
  {name: "Jordan", lat: 30.5852, lng: 36.2384, status: "grey", region: "Middle East", details: "No specific cloud regulations identified."},
  {name: "Lebanon", lat: 33.8547, lng: 35.8623, status: "grey", region: "Middle East", details: "Economic crisis. Framework likely outdated."},
  {name: "Iraq", lat: 33.2232, lng: 43.6793, status: "grey", region: "Middle East", details: "Reforms underway but cloud regulations not identified."},
  {name: "Yemen", lat: 15.5527, lng: 48.5164, status: "grey", region: "Middle East", details: "No data available due to conflict."},
  {name: "Syria", lat: 34.8021, lng: 38.9968, status: "grey", region: "Middle East", details: "No data available."},
  {name: "Israel", lat: 31.0461, lng: 34.8516, status: "grey", region: "Middle East", details: "Advanced tech sector but specific regulations not captured in English sources."},
  {name: "Palestine", lat: 31.9522, lng: 35.2332, status: "grey", region: "Middle East", details: "No information found."},
  {name: "Iran", lat: 32.4279, lng: 53.6880, status: "grey", region: "Middle East", details: "Under sanctions. Cloud likely restricted."},
  {name: "Turkey", lat: 38.9637, lng: 35.2433, status: "grey", region: "Middle East", details: "Large fintech market. Turkish language research needed."},
  {name: "Egypt", lat: 26.8206, lng: 30.8025, status: "amber", region: "North Africa", flags: {A:1, R:1, U:1, S:1, E:1, C:1}, scopeNote: "†Scope caveat: Cloud reference in PSP/PSO regulation, not consolidated bank-cloud rulebook. Banks may have additional requirements.", details: "CBE regulation for payment operators explicitly references cloud computing. Cloud First Policy (Aug 2024). PDPL 2020. Tier-3 license for government cloud."},
  {name: "Morocco", lat: 31.7917, lng: -7.0926, status: "amber", region: "North Africa", flags: {A:1, R:1, U:1, S:1, E:1, C:1}, details: "Bank Al-Maghrib Directive 4/W/2022: prior agreement required for outsourcing significant functions to cloud. Minimum rules: data handling + location, governance, regulator/audit access, subcontracting, exit, risk + security. Decree 2-24-921 (Nov 2024) for critical entities."},
  {name: "Libya", lat: 26.3351, lng: 17.2283, status: "grey", region: "North Africa", details: "Political instability. No framework."},
  {name: "Tunisia", lat: 33.8869, lng: 9.5375, status: "grey", region: "North Africa", details: "South-MED reforms underway. French/Arabic research needed."},
  {name: "Algeria", lat: 28.0339, lng: 1.6596, status: "grey", region: "North Africa", details: "FATF grey list. AML regulations but no cloud framework identified."},
  {name: "Sudan", lat: 12.8628, lng: 30.2176, status: "grey", region: "North Africa", details: "No information available."},
  {name: "South Sudan", lat: 6.8770, lng: 31.3070, status: "grey", region: "East Africa", details: "No information available."},
  {name: "Nigeria", lat: 9.0820, lng: 8.6753, status: "amber", region: "West Africa", flags: {A:0, R:0, U:0, S:0, E:0, C:0}, flagNote: "INFERRED", details: "STRICT - Mandatory data localization. NDPR/NDPA. NITDA framework (Feb 2025) requires local hosting for financial/healthcare data. $358K Fidelity Bank fine 2024. Hybrid cloud required. Flags inferred from NDPA + NITDA requirements, not verified from primary CBN cloud rulebook."},
  {name: "Ghana", lat: 7.9465, lng: -1.0232, status: "amber", region: "West Africa", flags: {A:1, R:1, U:1, S:1, E:1, C:1}, details: "BoG Outsourcing Directive (Nov 2024, eff. Jul 2025). Written BoG approval required. Explicitly references cloud service providers — requires detail on data type + storage locations. Materiality framework. Due diligence. Subcontracting. Exit. Full lifecycle controls."},
  {name: "Senegal", lat: 14.4974, lng: -14.4524, status: "amber", region: "West Africa", flags: {A:0, R:0, U:0, S:0, E:0, C:0}, flagNote: "INFERRED", details: "BCEAO regional payment services framework (applies to 8 UEMOA countries). Huawei datacenter for government. Data sovereignty push. Flags inferred from BCEAO framework, not verified from Senegal-specific CB cloud directive."},
  {name: "Côte d'Ivoire", lat: 7.5400, lng: -5.5471, status: "amber", region: "West Africa", flags: {A:0, R:0, U:0, S:0, E:0, C:0}, flagNote: "INFERRED", details: "BCEAO framework applies. IBM Cloud for Financial Services present. UEMOA regional strategy. Flags inferred from BCEAO framework, not verified from local CB cloud directive."},
  {name: "Kenya", lat: -0.0236, lng: 37.9062, status: "amber", region: "East Africa", flags: {A:1, R:0.5, U:1, S:1, E:1, C:1}, scopeNote: "*R: CBK/PG/16 Part IV covers offshore outsourcing controls but no explicit standalone data-residency mandate equivalent to UAE/KSA/Qatar.", details: "CBK/PG/16 Outsourcing Guideline + Cybersecurity Guidance Note 2017. Approval required for material outsourcing. Part IV addresses offshore but no explicit data-residency mandate equivalent to Qatar/UAE/KSA (R = partial). Audit rights. Subcontractor clause (§4.5.6.6(g)). Exit. Due diligence + security. Cloud Policy 2025. Record fines 2024."},
  {name: "Ethiopia", lat: 9.1450, lng: 40.4897, status: "red", region: "East Africa", details: "PROHIBITED: Crypto banned. No mobile money. Cloud for financial services likely not allowed."},
  {name: "Rwanda", lat: -1.9403, lng: 29.8739, status: "amber", region: "East Africa", flags: {A:0, R:0, U:0, S:0, E:0, C:0}, flagNote: "INFERRED", details: "BNR Cybersecurity Directive 2023. Approval required for outsourcing to third parties. Data localization push. Kigali Internet City + African Data Centre. Flags inferred from Cybersecurity Directive + outsourcing requirements, not verified from dedicated cloud rulebook."},
  {name: "Uganda", lat: 1.3733, lng: 32.2903, status: "grey", region: "East Africa", details: "Data Protection Act 2019. No specific cloud framework identified."},
  {name: "Tanzania", lat: -6.3690, lng: 34.8888, status: "amber", region: "East Africa", flags: {A:0, R:0, U:0, S:0, E:0, C:0}, flagNote: "INFERRED", details: "BoT Outsourcing Guidelines (Dec 2023) Section 4.3 covers cloud arrangements. Requires approval, documentation, SLAs, audit + exit. Data storage location must be disclosed. Flags inferred from outsourcing guidelines, not verified from dedicated cloud rulebook."},
  {name: "Burundi", lat: -3.3731, lng: 29.9189, status: "grey", region: "East Africa", details: "No information found."},
  {name: "Somalia", lat: 5.1521, lng: 46.1996, status: "grey", region: "East Africa", details: "Conflict-affected. No framework."},
  {name: "Djibouti", lat: 11.8251, lng: 42.5903, status: "grey", region: "East Africa", details: "Large datacenters (Africa Data Centres). No regulatory framework identified."},
  {name: "Eritrea", lat: 15.1794, lng: 39.7823, status: "grey", region: "East Africa", details: "No information available."},
  {name: "Seychelles", lat: -4.6796, lng: 55.4920, status: "grey", region: "East Africa", details: "Offshore finance hub. No cloud regulations identified."},
  {name: "Comoros", lat: -11.6455, lng: 43.3333, status: "grey", region: "East Africa", details: "No information found."},
  {name: "Mauritius", lat: -20.3484, lng: 57.5522, status: "amber", region: "East Africa", flags: {A:1, R:1, U:1, S:1, E:1, C:1}, details: "BoM Guideline on Use of Cloud Services (eff. 7 Sep 2022). Dedicated sections: Data Location, Subcontracting, Exit Strategies, Audit/Testing, Security Management, Regulatory Notification. Risk-based approach. Annual cloud-services return required."},
  {name: "South Africa", lat: -30.5595, lng: 22.9375, status: "amber", region: "Southern Africa", flags: {A:1, R:1, U:1, S:1, E:1, C:1}, details: "POPIA 2021. Joint Communication 2 of 2025 (FSCA + PA, 25 Jul 2025): risk-based cloud & offshoring expectations, governance, due diligence. Directive 3 of 2018 binding for banks. Joint Standard in development. Penalties up to 10% turnover."},
  {name: "Botswana", lat: -22.3285, lng: 24.6849, status: "grey", region: "Southern Africa", details: "Data protection framework. No cloud regulations identified."},
  {name: "Namibia", lat: -22.9576, lng: 18.4904, status: "grey", region: "Southern Africa", details: "Data protection discussions ongoing. No cloud framework."},
  {name: "Lesotho", lat: -29.6100, lng: 28.2336, status: "grey", region: "Southern Africa", details: "No information found."},
  {name: "Eswatini", lat: -26.5225, lng: 31.4659, status: "grey", region: "Southern Africa", details: "No information found."},
  {name: "Zimbabwe", lat: -19.0154, lng: 29.1549, status: "grey", region: "Southern Africa", details: "Data Protection Act 2021. No cloud-specific framework."},
  {name: "Zambia", lat: -13.1339, lng: 27.8493, status: "grey", region: "Southern Africa", details: "Data protection law. No cloud regulations identified."},
  {name: "Malawi", lat: -13.2543, lng: 34.3015, status: "grey", region: "Southern Africa", details: "Data protection discussions. No cloud framework."},
  {name: "Mozambique", lat: -18.6657, lng: 35.5296, status: "grey", region: "Southern Africa", details: "Data protection law. No cloud regulations identified."},
  {name: "Angola", lat: -11.2027, lng: 17.8739, status: "grey", region: "Southern Africa", details: "Oil-dependent economy. No cloud framework identified."},
  {name: "Madagascar", lat: -18.7669, lng: 46.8691, status: "grey", region: "East Africa", details: "No information found."}
];

const colors = {
  green: '#90EE90',
  amber: '#FFD700',
  red: '#FF6B6B',
  grey: '#D3D3D3'
};

function MapTooltip({ country, position }) {
  if (!country || !position) return null;
  
  const statusBadge = `status-${country.status}`;
  const statusText = country.status.charAt(0).toUpperCase() + country.status.slice(1);
  const flagLabels = {A:'Approval', R:'Residency', U:'Audit', S:'Subcontracting', E:'Exit/BCP', C:'Security'};
  const flagKeys = ['A','R','U','S','E','C'];

  return (
    <div className="map-tooltip" style={{ left: position.x + 15, top: position.y + 15 }}>
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
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState(null);

  React.useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
    return () => styleSheet.remove();
  }, []);

  const handleCountryHover = (country, event) => {
    const container = event.currentTarget.closest('.map-container');
    const rect = container.getBoundingClientRect();
    setHoveredCountry(country);
    setTooltipPosition({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  };

  const handleCountryLeave = () => {
    setHoveredCountry(null);
    setTooltipPosition(null);
  };

  // Country clickable areas as percentages (x, y, width, height)
  const countryAreas = {
    'Turkey': { left: '66%', top: '4%', width: '13%', height: '9%' },
    'Morocco': { left: '12%', top: '14%', width: '8%', height: '9%' },
    'Tunisia': { left: '20%', top: '13%', width: '4%', height: '6%' },
    'Algeria': { left: '14%', top: '19%', width: '15%', height: '13%' },
    'Libya': { left: '29%', top: '21%', width: '13%', height: '11%' },
    'Egypt': { left: '42%', top: '21%', width: '9%', height: '13%' },
    'Syria': { left: '55%', top: '11%', width: '5%', height: '5%' },
    'Lebanon': { left: '54%', top: '14%', width: '2%', height: '2%' },
    'Israel': { left: '53%', top: '16%', width: '2%', height: '3%' },
    'Palestine': { left: '53%', top: '16%', width: '2%', height: '2%' },
    'Jordan': { left: '54%', top: '17%', width: '4%', height: '5%' },
    'Iraq': { left: '58%', top: '12%', width: '7%', height: '10%' },
    'Kuwait': { left: '61%', top: '19%', width: '2.5%', height: '2%' },
    'Saudi Arabia': { left: '56%', top: '22%', width: '14%', height: '16%' },
    'Bahrain': { left: '62%', top: '23%', width: '1.5%', height: '1.5%' },
    'Qatar': { left: '63%', top: '23%', width: '1.5%', height: '2%' },
    'UAE': { left: '66%', top: '24%', width: '4%', height: '3%' },
    'Oman': { left: '67%', top: '26%', width: '6%', height: '8%' },
    'Yemen': { left: '60%', top: '33%', width: '7%', height: '8%' },
    'Iran': { left: '70%', top: '8%', width: '13%', height: '12%' },
    'Sudan': { left: '44%', top: '34%', width: '12%', height: '14%' },
    'South Sudan': { left: '45%', top: '46%', width: '7%', height: '6%' },
    'Senegal': { left: '8%', top: '38%', width: '5%', height: '5%' },
    'Ghana': { left: '16%', top: '46%', width: '4%', height: '4%' },
    'Nigeria': { left: '20%', top: '45%', width: '7%', height: '7%' },
    'Ethiopia': { left: '55%', top: '45%', width: '9%', height: '9%' },
    'Kenya': { left: '54%', top: '54%', width: '7%', height: '8%' },
    'Rwanda': { left: '48%', top: '57%', width: '2.5%', height: '2.5%' },
    'Uganda': { left: '49%', top: '53%', width: '5%', height: '5%' },
    'Tanzania': { left: '50%', top: '59%', width: '8%', height: '9%' },
    'Somalia': { left: '61%', top: '51%', width: '7%', height: '11%' },
    'Djibouti': { left: '59%', top: '42%', width: '2%', height: '2%' },
    'Eritrea': { left: '55%', top: '40%', width: '5%', height: '5%' },
    'South Africa': { left: '33%', top: '80%', width: '12%', height: '11%' },
    'Mauritius': { left: '66%', top: '80%', width: '2%', height: '2%' },
    'Madagascar': { left: '60%', top: '77%', width: '6%', height: '9%' },
    'Mozambique': { left: '51%', top: '74%', width: '7%', height: '11%' },
    'Zimbabwe': { left: '47%', top: '77%', width: '5%', height: '5%' },
    'Zambia': { left: '43%', top: '71%', width: '6%', height: '7%' },
    'Angola': { left: '30%', top: '70%', width: '10%', height: '11%' },
    'Namibia': { left: '30%', top: '78%', width: '7%', height: '9%' },
    'Botswana': { left: '37%', top: '78%', width: '6%', height: '5%' },
    'Côte d\'Ivoire': { left: '15%', top: '47%', width: '4%', height: '5%' },
    'Malawi': { left: '51%', top: '70%', width: '3%', height: '6%' },
    'Burundi': { left: '48%', top: '58%', width: '2%', height: '2%' },
    'Lesotho': { left: '40%', top: '84%', width: '2%', height: '2%' },
    'Eswatini': { left: '43%', top: '81%', width: '2%', height: '2%' },
    'Seychelles': { left: '68%', top: '58%', width: '1.5%', height: '1.5%' },
    'Comoros': { left: '59%', top: '68%', width: '1.5%', height: '1.5%' }
  };

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
            <Button variant="ghost" size="sm" className="mb-3 -ml-2">
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              Back to Dashboard
            </Button>
          </Link>
          <h1>Cloud Regulations Matrix for Financial Services in MEA</h1>
          <p className="text-sm text-slate-600 mt-2 max-w-4xl">All information here are based on our best effort to collect information from publicly available sources. Mistakes could occur. While we aim to refresh this on quarterly basis, information could change after our search has been completed.</p>
          </div>
          </header>

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



      {/* Restriction Flags */}
      <div className="restrictions-info">
        <div className="info-title">Restriction Flags Legend</div>
        <div className="flags-legend-container">
          <div className="flag-item">
            <div className="flag-acronym">A</div>
            <div className="flag-label">Approval /<br/>Notification</div>
          </div>
          <div className="flag-item">
            <div className="flag-acronym">R</div>
            <div className="flag-label">Data<br/>Residency</div>
          </div>
          <div className="flag-item">
            <div className="flag-acronym">U</div>
            <div className="flag-label">Audit /<br/>Access</div>
          </div>
          <div className="flag-item">
            <div className="flag-acronym">S</div>
            <div className="flag-label">Subcontracting<br/>Controls</div>
          </div>
          <div className="flag-item">
            <div className="flag-acronym">E</div>
            <div className="flag-label">Exit Plan /<br/>BCP</div>
          </div>
          <div className="flag-item">
            <div className="flag-acronym">C</div>
            <div className="flag-label">Security /<br/>Risk Controls</div>
          </div>
        </div>
        <div className="indicators">
          <span><span className="indicator-dot" style={{background:'#22c55e'}}></span> Confirmed in regulation</span>
          <span><span className="indicator-dot" style={{background:'#f59e0b'}}></span> Partial / indirect coverage</span>
        </div>
      </div>

      {/* All Countries Table */}
      <div className="verified-table">
        <h3>Complete MEA Cloud Regulations Analysis</h3>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Region</th>
                <th>Country</th>
                <th className="table-status">Status</th>
                <th className="table-flag">A</th>
                <th className="table-flag">R</th>
                <th className="table-flag">U</th>
                <th className="table-flag">S</th>
                <th className="table-flag">E</th>
                <th className="table-flag">C</th>
                <th>Key Regulations & Notes</th>
              </tr>
            </thead>
            <tbody>
              {countryData
                .filter(country => currentFilter === 'all' || currentFilter === country.status)
                .map((country, idx) => {
                  const getFlag = (val) => {
                    if (val === 1) return '✅';
                    if (val === 0.5) return '⚪*';
                    if (val === 0 && country.flagNote === 'INFERRED') return '🔹';
                    return '—';
                  };
                  
                  return (
                    <tr key={idx}>
                      <td>{country.region}</td>
                      <td className="table-country">{country.name}</td>
                      <td className="table-status">
                        {country.status === 'amber' ? '🟠' : country.status === 'red' ? '🔴' : '⚪'}
                        {country.scopeNote && '†'}
                      </td>
                      <td className="table-flag">{country.flags ? getFlag(country.flags.A) : '—'}</td>
                      <td className="table-flag">{country.flags ? getFlag(country.flags.R) : '—'}</td>
                      <td className="table-flag">{country.flags ? getFlag(country.flags.U) : '—'}</td>
                      <td className="table-flag">{country.flags ? getFlag(country.flags.S) : '—'}</td>
                      <td className="table-flag">{country.flags ? getFlag(country.flags.E) : '—'}</td>
                      <td className="table-flag">{country.flags ? getFlag(country.flags.C) : '—'}</td>
                      <td className="table-notes">
                        {country.flagNote && <span style={{color: '#0ea5e9', fontWeight: 600}}>{country.flagNote}: </span>}
                        {country.details}
                        {country.scopeNote && <div style={{marginTop: '4px', fontSize: '9px', color: '#b45309'}}>{country.scopeNote}</div>}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}