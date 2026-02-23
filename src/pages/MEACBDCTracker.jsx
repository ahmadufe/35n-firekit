import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

MEACBDCTracker.public = true;

const cbdcData = {
  gcc: [
    {
      flag: "🇦🇪",
      country: "United Arab Emirates",
      cbdcName: "Digital Dirham",
      status: "pilot",
      statusLabel: "Pilot → Pre-Launch",
      types: ["Retail", "Wholesale"],
      tags: [
        { text: "mBridge MVP", highlight: true },
        { text: "Project Aber", highlight: false },
        { text: "Retail Q4 2025", highlight: false },
        { text: "FIT Programme", highlight: false }
      ],
      summary: "Most advanced CBDC in MEA. Retail launch targeted Q4 2025 under Financial Infrastructure Transformation (FIT) Programme. First live cross-border Digital Dirham payment (AED 50M) executed via mBridge in Jan 2024. 85% of FIT Programme complete as of Jan 2025.",
      milestones: [
        "2021: Joined mBridge (BIS, China, HK, Thailand)",
        "Jan 2024: First live cross-border Digital Dirham (AED 50M via mBridge)",
        "Jun 2024: mBridge reached MVP — BIS stepped back",
        "Jan 2025: FIT Programme 85% complete; target full integration 2026",
        "Q4 2025: Retail Digital Dirham launch planned",
        "Project Aber: UAE–Saudi bilateral wholesale CBDC PoC (2019)"
      ],
      regulatoryPosture: "Progressive / First-Mover",
      regulatoryDetails: "CBUAE aims for cashless society. Digital Dirham will be legal tender. First Arab central bank to sign FX Global Code. UAE crypto/stablecoin framework (DFSA) among region's most developed. 241% surge in crypto app downloads 2023–24.",
      strategicDriver: "Cross-border payment efficiency + de-dollarization optionality (mBridge) + domestic payment modernization + monetary sovereignty",
      source: "https://www.centralbank.ae/media/lczb23l4/cbdc-short-report_july.pdf"
    },
    {
      flag: "🇸🇦",
      country: "Saudi Arabia",
      cbdcName: "SAMA Digital Currency / Project Aber",
      status: "pilot",
      statusLabel: "Pilot",
      types: ["Wholesale"],
      tags: [
        { text: "mBridge Full Member Jun 2024", highlight: true },
        { text: "Project Aber (UAE)", highlight: false },
        { text: "Vision 2030", highlight: false }
      ],
      summary: "Joined mBridge as full participant in June 2024, alongside China, UAE, HK & Thailand. Prior to this, completed bilateral wholesale CBDC interoperability test with UAE via Project Aber (2019). Focus remains wholesale/cross-border — no retail CBDC announced.",
      milestones: [
        "2019: Project Aber — bilateral wholesale CBDC with CBUAE",
        "2021–2024: Observer/participant in mBridge development",
        "Jun 2024: Full mBridge participant at MVP stage",
        "Wholesale CBDC focus — enables oil/commodity settlement in non-USD rails"
      ],
      regulatoryPosture: "Cautious / Strategic",
      regulatoryDetails: "Banks prohibited from crypto without SAMA approval. Crypto transaction volume 153% YoY growth (2023–24). 11.4% of Saudis own crypto. CBDC interest geopolitically strategic — commodity settlement de-dollarization angle. Vision 2030 fintech push.",
      strategicDriver: "Oil commodity settlement efficiency + SWIFT dependency reduction + Vision 2030 financial modernization + cross-border GCC payment interoperability",
      source: "https://www.bis.org/about/bisih/topics/cbdc/mcbdc_bridge.htm"
    },
    {
      flag: "🇧🇭",
      country: "Bahrain",
      cbdcName: "CBB Digital Currency (Prototype)",
      status: "dev",
      statusLabel: "Development",
      types: ["Wholesale"],
      tags: [
        { text: "JP Morgan interop tests", highlight: false },
        { text: "Fintech hub strategy", highlight: true },
        { text: "Sandbox active", highlight: false },
        { text: "Stablecoin framework 2025", highlight: false }
      ],
      summary: "Central Bank of Bahrain developing CBDC prototype with JP Morgan interoperability tests completed. Positioned as GCC's most open regulatory sandbox, hosting 50+ crypto/fintech firms including Binance and Crypto.com. Stablecoin framework introduced 2025.",
      milestones: [
        "CBDC prototype development underway (wholesale-first)",
        "Interoperability tests completed with JP Morgan",
        "2025: Stablecoin regulatory framework introduced",
        "Retail CBDC expansion under evaluation post-wholesale pilot",
        "50+ financial firms in talks to set up in Bahrain (2025)"
      ],
      regulatoryPosture: "Progressive / Open",
      regulatoryDetails: "Most crypto-permissive GCC jurisdiction. Binance and Crypto.com licensed. CBB fintech sandbox well-established. Financial hub strategy drives digital currency ambition. Fiscal deficit pressures create urgency for financial innovation.",
      strategicDriver: "IFC positioning + cross-border payment efficiency + diversification from oil revenue + GCC financial integration"
    },
    {
      flag: "🇶🇦",
      country: "Qatar",
      cbdcName: "QCB CBDC Study",
      status: "research",
      statusLabel: "Research",
      types: ["Wholesale"],
      tags: [
        { text: "Experimental phase mid-2024", highlight: false },
        { text: "2027 blockchain target", highlight: false },
        { text: "QFC digital assets 2025", highlight: false }
      ],
      summary: "QCB launched CBDC project in mid-2024, entered experimental phase. Blockchain development timeline estimated to 2027. Qatar Financial Centre introduced digital assets legal framework Q2 2025. Distinct regulatory zone for DeFi and tokenized assets established.",
      milestones: [
        "Jul 2024: QCB CBDC project announced — experimental phase launched",
        "QFC digital assets framework finalized Q2 2025",
        "Separate regulatory zone for digital assets innovation",
        "Wholesale CBDC infrastructure target: 2027",
        "Retail CBDC possible post-wholesale infrastructure"
      ],
      regulatoryPosture: "Cautious / Deliberate",
      regulatoryDetails: "Previously restrictive on crypto; QFC now creating innovation zone while CBQ remains conservative. Smart contracts legally recognized under QFC. Cross-border payment focus aligned with LNG trade corridors.",
      strategicDriver: "LNG/commodity trade settlement efficiency + Qatar National Vision 2030 + cross-border GCC payments + financial diversification",
      source: "https://mecouncil.org/publication/cbdc-global-pioneers-a-roadmap-for-gulf-countries/"
    },
    {
      flag: "🇴🇲",
      country: "Oman",
      cbdcName: "Central Bank of Oman",
      status: "research",
      statusLabel: "Research",
      types: ["Wholesale"],
      tags: [
        { text: "Early exploration", highlight: false },
        { text: "GCC coordination", highlight: false },
        { text: "India CEPA 2024", highlight: false }
      ],
      summary: "Oman in research/early exploration stage. Some sources suggest early wholesale pilot involvement. India CEPA (2024) creates strong cross-border payment incentive given large South Asian expat workforce. GCC peer pressure accelerating timeline.",
      milestones: [
        "Research phase — no formal development programme announced",
        "Oman-India CEPA entered force 2024 — remittance corridor incentive",
        "Large expat workforce (40%+ of population) drives remittance use case",
        "Carnegie (2025): referenced in wholesale pilot discussions"
      ],
      regulatoryPosture: "Exploratory",
      regulatoryDetails: "Conservative financial regulator. Digital currency not near-term priority but GCC peer pressure and India trade corridor create structural incentive. Likely to follow UAE/Saudi model once feasibility demonstrated.",
      strategicDriver: "GCC payment interoperability + India remittance corridor + expat workforce financial services"
    },
    {
      flag: "🇰🇼",
      country: "Kuwait",
      cbdcName: "Central Bank of Kuwait",
      status: "research",
      statusLabel: "Research",
      types: ["Wholesale"],
      tags: [
        { text: "Crypto mining crackdowns", highlight: false, warn: true },
        { text: "Slow progress", highlight: false },
        { text: "GCC observer", highlight: false }
      ],
      summary: "Progressing slowest among GCC peers. Crypto mining banned (55% electricity drop in Al-Wafrah). IMF survey confirms active CBDC interest. No formal development programme. Conservative approach likely to shift as GCC-wide momentum builds.",
      milestones: [
        "IMF survey: CBDC interest confirmed, early research stage",
        "Crypto mining crackdown signals control-oriented approach",
        "No formal CBDC development programme as of 2025",
        "Cross-border payments key driver given large expat remittance flows"
      ],
      regulatoryPosture: "Conservative / Restrictive",
      regulatoryDetails: "Most conservative GCC regulator on digital assets. Crypto restrictions in place. CBDC interest framed around payment efficiency, not financial inclusion. GCC-wide CBDC coordination will likely be the trigger for acceleration.",
      strategicDriver: "GCC peer alignment + cross-border payment modernization + remittance corridor efficiency (South Asia)"
    }
  ],
  mena: [
    {
      flag: "🇪🇬",
      country: "Egypt",
      cbdcName: "E-Pound (Digital EGP)",
      status: "research",
      statusLabel: "Research → PoC",
      types: ["Retail", "Wholesale"],
      tags: [
        { text: "PBOC MoU Jul 2025", highlight: true },
        { text: "Morocco+World Bank pilot", highlight: false },
        { text: "Target: 2030", highlight: false }
      ],
      summary: "CBE completed Phase 1 CBDC study; preparing PoC phase. July 2025 MoU with PBOC includes CBDC cooperation provisions. Collaborating with Morocco and World Bank on cross-border CBDC use case. E-Pound launch targeted 2030.",
      milestones: [
        "2024: CBE financial stability report confirms CBDC exploration active",
        "Phase 1 CBDC study complete; PoC phase preparation underway",
        "Jul 2025: CBDC cooperation MoU with People's Bank of China signed",
        "Active experiment: Morocco + World Bank on cross-border CBDC transfers",
        "Target retail launch: 2030"
      ],
      regulatoryPosture: "Cautious / State-Controlled",
      regulatoryDetails: "CBE frames CBDC partly as crypto displacement tool. Currency deregulation reforms since 2024 signal broader payment modernization readiness. IMF Article IV consultations ongoing. HRF flags surveillance risk given political context.",
      strategicDriver: "Diaspora remittances (Gulf + EU corridor) + crypto displacement + reduce informal cash economy + China strategic alignment",
      source: "https://cbdctracker.hrf.org/currency/egypt"
    },
    {
      flag: "🇲🇦",
      country: "Morocco",
      cbdcName: "Bank Al-Maghrib CBDC",
      status: "research",
      statusLabel: "Research",
      types: ["Retail"],
      tags: [
        { text: "Egypt cross-border experiment", highlight: true },
        { text: "IMF + World Bank collab", highlight: false },
        { text: "Crypto ban since 2017", highlight: false }
      ],
      summary: "Bank Al-Maghrib collaborating with IMF/World Bank on payment system implications and with Egypt/World Bank on cross-border CBDC transfers. Crypto banned since 2017 but ~6M underground users. Crypto regulation bill under Parliament review. Significant France diaspora remittance corridor.",
      milestones: [
        "IMF capacity development on CBDC design implications (ongoing)",
        "Nov 2024: Crypto regulation framework announced at Rabat conference",
        "2025: Live experiment with Egypt + World Bank on cross-border CBDC",
        "Crypto regulation bill under Ministry of Finance review → Parliament"
      ],
      regulatoryPosture: "Cautious / Transitioning",
      regulatoryDetails: "Moving from crypto ban to regulated framework. CBDC positioned as government-sanctioned digital alternative. Crypto market projected at $278M by 2025 despite ban. Remittance pressure (6M+ Moroccan diaspora in France) driving cross-border CBDC interest.",
      strategicDriver: "France diaspora remittances + financial inclusion + crypto regulation alternative + North-South Africa payment integration",
      source: "https://thepaypers.com/crypto-web3-and-cbdc/news/moroccos-central-bank-advances-digital-currency"
    },
    {
      flag: "🇹🇳",
      country: "Tunisia",
      cbdcName: "Banque Centrale de Tunisie",
      status: "research",
      statusLabel: "Research",
      types: ["Retail"],
      tags: [
        { text: "Banque de France diaspora pilot", highlight: false },
        { text: "IMF case study", highlight: false },
        { text: "High cash use", highlight: false }
      ],
      summary: "Expressed intent to explore CBDC. Collaborated with Banque de France on diaspora remittance experiments. IMF modelling (2024) shows an unremunerated CBDC could capture ~10% of money supply in Tunisia's cash-heavy economy — highest adoption potential in ME&CA modelling.",
      milestones: [
        "Collaboration with Banque de France on remittance CBDC use case",
        "IMF ME&CA 2024 paper: Tunisia modelled as key case study",
        "Intent to explore CBDC expressed — no formal programme",
        "eCFA (Senegal/BCEAO) precedent in West Africa provides regional context"
      ],
      regulatoryPosture: "Exploratory",
      regulatoryDetails: "High cash economy with significant financial inclusion opportunity. IMF analysis most bullish on adoption potential of any ME&CA country (10% money supply capture estimate). Political instability is the key risk to sustained development programme.",
      strategicDriver: "Financial inclusion + France/Italy diaspora remittances + cash displacement + IMF-supported payment modernization",
      source: "https://www.elibrary.imf.org/view/journals/087/2024/004/article-A001-en.xml"
    },
    {
      flag: "🇯🇴",
      country: "Jordan",
      cbdcName: "Central Bank of Jordan",
      status: "research",
      statusLabel: "Research",
      types: ["Retail"],
      tags: [
        { text: "IMF ME&CA case study", highlight: false },
        { text: "Remittance corridor", highlight: false }
      ],
      summary: "Jordan is one of IMF's ME&CA CBDC case study countries. CBJ engaged with payment system modernization. Large refugee and expat population create compelling remittance and G2P payment use cases. Formal CBDC programme not yet launched.",
      milestones: [
        "IMF ME&CA 2024: Jordan listed as key case study for early exploration",
        "CBJ advancing payment system digitization generally",
        "No formal CBDC development programme announced",
        "Large refugee population (3rd highest per capita) creates G2P CBDC case"
      ],
      regulatoryPosture: "Exploratory",
      regulatoryDetails: "Moderate regulator with growing fintech sector. IMF technical assistance ongoing. Jordan's dollarization exposure and remittance dependency make CBDC strategically relevant but not yet a priority.",
      strategicDriver: "Remittances (Gulf corridor) + G2P humanitarian payments + IMF-supported financial inclusion agenda"
    }
  ],
  africa: [
    {
      flag: "🇳🇬",
      country: "Nigeria",
      cbdcName: "eNaira — Launched Oct 2021",
      status: "launched",
      statusLabel: "Launched",
      types: ["Retail"],
      tags: [
        { text: "First African CBDC", highlight: true },
        { text: "⚠ 98.5% wallets inactive", highlight: false, warn: true },
        { text: "Wholesale pivot 2025", highlight: false },
        { text: "0.37% of money supply", highlight: false }
      ],
      summary: "Africa's first CBDC, world's second (after Bahamas). 13M wallets created but 98.5% inactive per IMF. eNaira = only 0.37% of currency in circulation (Feb 2025). CBN official at Nov 2025 conference: \"not a rosy story.\" Central bank pivoting to wholesale CBDC focus.",
      milestones: [
        "In circulation: N18.31B ($11.4M) — 0.37% of total currency",
        "Wallets: 13 million (98.5% inactive per IMF)",
        "Total transactions: ~854,512 since Oct 2021 launch",
        "Merchants registered: 3,320 | Banks integrated: 33"
      ],
      whyFailed: [
        "Existing instant payment rails (NIBSS) already widespread",
        "Trust deficit in government-controlled digital currency",
        "Bank account required — excluded the unbanked (target audience)",
        "No compelling use case vs mobile money / existing digital payments",
        "Governance crisis: CBN Governor Emefiele arrested (corruption)",
        "Cashless compulsion (2022 cash restrictions) created artificial adoption spike"
      ],
      regulatoryPosture: "State-Led / Recalibrating",
      regulatoryDetails: "CBN declared \"cashless economy\" goal but trust eroded. New Governor Cardoso announced wholesale pivot Nov 2025. MoU with Gluwa (blockchain firm) signed Mar 2024 to attempt retail revival. VASP licensing active under SEC Nigeria.",
      strategicDriver: "Shifting from failed retail inclusion model → wholesale settlement efficiency + cross-border CBDC integration + institutional fintech infrastructure",
      source: "https://cbdctracker.hrf.org/currency/nigeria"
    },
    {
      flag: "🇿🇦",
      country: "South Africa",
      cbdcName: "Project Khokha / Digital Rand",
      status: "pilot",
      statusLabel: "Pilot",
      types: ["Wholesale"],
      tags: [
        { text: "Khokha 1, 2, 2x", highlight: true },
        { text: "Project Dunbar (BIS)", highlight: false },
        { text: "Digital Payments Roadmap 2024", highlight: false }
      ],
      summary: "Africa's most technically advanced wholesale CBDC programme. SARB completed Projects Khokha 1&2 (interbank DLT settlement) and participated in multi-CBDC Project Dunbar (BIS). 2024 Digital Payments Roadmap recommends 2-year retail CBDC feasibility study. Nov 2025: SARB position paper published.",
      milestones: [
        "2018: Khokha 1 — wholesale DLT payments PoC on Quorum",
        "2021–22: Khokha 2 — wCBDC + tokenized bonds with FirstRand, Absa, Standard Bank, Nedbank, JSE",
        "Mar 2022: Project Dunbar (BIS, Australia, Malaysia, Singapore) — multi-CBDC platform",
        "Apr 2024: SARB Digital Payments Roadmap — 17 action items including 2-year retail CBDC study",
        "2024+: Khokha 2x — wholesale CBDC + bank stablecoins for African regional payments",
        "Nov 2025: SARB retail CBDC necessity position paper published"
      ],
      regulatoryPosture: "Deliberate / Fast-Follower",
      regulatoryDetails: "SARB governor committed to \"fast-follower\" approach — observe then act. Crypto exchanges formally licensed 2024. FSCA co-regulates digital assets. Technology-neutral stance but not technology-blind. Standard Bank CEO pushed back on retail CBDC (deposit competition concern).",
      strategicDriver: "Interbank settlement modernization + African regional payment corridors (Khokha 2x) + tokenized asset infrastructure (JSE) + cross-border settlement with Kenya, other EAC markets",
      source: "https://www.ledgerinsights.com/south-africa-wholesale-cbdc-trials-bank-stablecoins/"
    },
    {
      flag: "🇬🇭",
      country: "Ghana",
      cbdcName: "eCedi",
      status: "pilot",
      statusLabel: "Pilot",
      types: ["Retail"],
      tags: [
        { text: "G+D Filia DLT platform", highlight: true },
        { text: "QR + feature phone", highlight: false },
        { text: "3-phase rollout", highlight: false }
      ],
      summary: "Bank of Ghana partnered with G+D (Giesecke+Devrient) to build eCedi on Filia DLT. Designed for QR code payments and feature-phone compatibility — targeting financial inclusion. Three-phase rollout ongoing; awareness and logistics challenges reported in pilot.",
      milestones: [
        "Bank of Ghana – G+D partnership for eCedi on Filia DLT",
        "3-phase approach: design → implementation → pilot (ongoing)",
        "QR-based + feature phone compatibility for unbanked population",
        "Aug 2025: VASP registration deadline; full licensing bill pending Parliament",
        "Challenges: logistical issues + low public awareness + mobile money incumbency"
      ],
      regulatoryPosture: "Cautious / Progressive",
      regulatoryDetails: "Ghana has one of West Africa's largest mobile money ecosystems (25M+ users). eCedi designed to complement M-Pesa/MTN MoMo, not replace. VASP Bill drafted and in Parliament. Ghana among highest mobile money transaction/GDP ratios in Africa (with Cameroon, Uganda).",
      strategicDriver: "Financial inclusion (large unbanked population) + leapfrog to retail digital payments + compete with mobile money for G2P payments",
      source: "https://odi.org/en/insights/cbdcs-in-africa-catalysts-for-financial-sector-deepening-and-inclusion/"
    },
    {
      flag: "🇺🇬",
      country: "Uganda",
      cbdcName: "Digital Uganda Shilling",
      status: "pilot",
      statusLabel: "Pilot — Oct 2025",
      types: ["Retail"],
      tags: [
        { text: "Launched pilot Oct 2025", highlight: true },
        { text: "GSN permissioned blockchain", highlight: false },
        { text: "Treasury bond-backed", highlight: false },
        { text: "Asset tokenization", highlight: false }
      ],
      summary: "Uganda launched CBDC pilot in October 2025 on GSN permissioned blockchain via Diacente Group. Backed by Ugandan treasury bonds and accessible via smartphone. KYC/AML compliant. Simultaneously tokenizing agro-processing, mining, and solar infrastructure assets.",
      milestones: [
        "Oct 2025: CBDC pilot live on GSN permissioned blockchain",
        "Digital shilling backed by Ugandan treasury bonds — innovative collateral model",
        "Smartphone access with embedded KYC/AML compliance",
        "Asset tokenization initiative: agro-processing hubs, mines, solar plants",
        "Uganda 7th largest SSA stablecoin market (Chainalysis 2025)"
      ],
      regulatoryPosture: "Progressive (Recent)",
      regulatoryDetails: "Uganda emerging as crypto-active market. AML obligations apply to VASPs. Treasury bond-backing represents novel approach to CBDC collateral. Tokenization of real assets is distinctive — more ambitious than peer economies at same stage.",
      strategicDriver: "Asset tokenization for infrastructure investment + financial inclusion + East African Community payment integration",
      source: "https://cointelegraph.com/news/uganda-cbdc-tokenization-crypto-regulation-kenya"
    },
    {
      flag: "🇿🇼",
      country: "Zimbabwe",
      cbdcName: "ZiG (Zimbabwe Gold)",
      status: "dev",
      statusLabel: "Launched (Gold-Backed)",
      types: ["Retail"],
      tags: [
        { text: "ZiG launched Apr 2024", highlight: true },
        { text: "Non-standard CBDC design", highlight: false, warn: true },
        { text: "Gold + forex reserves", highlight: false }
      ],
      summary: "Zimbabwe launched ZiG (Zimbabwe Gold) in April 2024 — a gold and forex-backed digital currency. Structurally distinct from standard CBDC. Some global trackers classify as CBDC launch. Designed to stabilize a hyperinflationary economy. Adoption and convertibility challenges persist.",
      milestones: [
        "Apr 2024: ZiG launched as official currency replacing RTGS dollar/ZWL",
        "Backed by gold reserves + foreign currency holdings",
        "Digital and physical versions available",
        "Classified as CBDC by some trackers (Atlantic Council includes)",
        "Adoption challenges: convertibility, merchant acceptance, trust deficit"
      ],
      regulatoryPosture: "State-Driven / Stability-Seeking",
      regulatoryDetails: "Monetary stability is primary driver — not financial inclusion or payment efficiency. Gold-backing model could serve as template for other commodity-rich African economies (DRC, Zambia, Ghana) seeking alternative monetary anchors. Historical trust deficit remains central challenge.",
      strategicDriver: "Hyperinflation stabilization + monetary sovereignty + gold reserve monetization + escape from USD dependency"
    },
    {
      flag: "🇰🇪",
      country: "Kenya",
      cbdcName: "CBK CBDC Research",
      status: "research",
      statusLabel: "Research",
      types: ["Retail"],
      tags: [
        { text: "Public consultation", highlight: false },
        { text: "VASP Act signed 2025", highlight: true },
        { text: "M-Pesa incumbent", highlight: false }
      ],
      summary: "CBK in research and public consultation phase. Recently passed Virtual Asset Service Providers Act 2025 (CMA regulates trading; CBK regulates payments). M-Pesa's dominance creates complex design challenge — CBDC must demonstrate marginal value over existing rails.",
      milestones: [
        "CBK public consultation on CBDC feasibility (ongoing)",
        "2025: VASP Act signed — dual regulation (CMA + CBK)",
        "M-Pesa: 25M+ users in Kenya — world's most embedded mobile money",
        "No formal CBDC development programme announced",
        "EAC membership creates cross-border payment coordination incentive"
      ],
      regulatoryPosture: "Progressive on Fintech / Deliberate on CBDC",
      regulatoryDetails: "Kenya most advanced fintech regulator in East Africa. VASP Act among most comprehensive on continent. However, CBDC cautioned by M-Pesa incumbency — CBK research focuses on whether CBDC adds marginal value over existing fast payment rails.",
      strategicDriver: "East African Community cross-border payments + financial inclusion beyond M-Pesa reach + G2P government payment channels"
    },
    {
      flag: "🇷🇼",
      country: "Rwanda",
      cbdcName: "National Bank of Rwanda",
      status: "research",
      statusLabel: "Research",
      types: ["Retail"],
      tags: [
        { text: "IMF SSA survey", highlight: false },
        { text: "Kigali tech hub", highlight: false },
        { text: "Pilot within 2yrs", highlight: false }
      ],
      summary: "Rwanda in research phase per IMF SSA CBDC survey. Expressed intent to begin pilot within 2 years. Kigali's growing status as East Africa tech hub aligns with CBDC ambition. Advanced cash management infrastructure and high mobile penetration provide strong foundation.",
      milestones: [
        "IMF SSA survey: engaged, planning pilot within 2 years",
        "No formal CBDC name or programme timeline yet published",
        "Strong digital ecosystem + tech hub positioning",
        "EAC membership creates cross-border payment corridor incentive"
      ],
      regulatoryPosture: "Exploratory / Progressive",
      regulatoryDetails: "NBR modernization-focused. Virtual assets: AML applicable but no formal licensing req. Rwanda increasingly positioned as East Africa HQ for tech companies — CBDC aligned with this vision. GDP-per-capita growth creating middle-class digital payment demand.",
      strategicDriver: "East Africa tech hub positioning + financial inclusion + EAC payment integration + G2P social payments"
    },
    {
      flag: "🇪🇹",
      country: "Ethiopia",
      cbdcName: "National Bank of Ethiopia",
      status: "research",
      statusLabel: "Research",
      types: ["Retail"],
      tags: [
        { text: "IMF survey", highlight: false },
        { text: "Crypto prohibited", highlight: false, warn: true },
        { text: "Telebirr 40M+ users", highlight: false }
      ],
      summary: "Early research phase. Crypto prohibited. Telebirr (Ethio Telecom, 40M+ users) is dominant payment platform and the context for any CBDC strategy. Large unbanked population (80%+) represents significant inclusion opportunity. CBDC must navigate Telebirr ecosystem and state enterprise structure.",
      milestones: [
        "IMF SSA CBDC survey: research stage, crypto prohibitionist",
        "Telebirr has 40M+ users — largest mobile money in East Africa",
        "80%+ population unbanked — theoretically strong inclusion opportunity",
        "No formal CBDC name or programme announced"
      ],
      regulatoryPosture: "Restrictive / State-Controlled",
      regulatoryDetails: "State telecom (Ethio Telecom) controls dominant payments infrastructure. Any CBDC likely to be integrated with or leverage Telebirr infrastructure. Prohibition on crypto reflects control-oriented digital finance approach.",
      strategicDriver: "Financial inclusion (large unbanked) + government payment channels + state-controlled digital economy infrastructure"
    },
    {
      flag: "🇹🇿",
      country: "Tanzania",
      cbdcName: "Bank of Tanzania",
      status: "research",
      statusLabel: "Research",
      types: ["Retail"],
      tags: [
        { text: "IMF SSA survey", highlight: false },
        { text: "Mobile money leader", highlight: false },
        { text: "Crypto tax ruling 2024", highlight: false }
      ],
      summary: "Bank of Tanzania in research phase. High mobile money penetration (M-Pesa major market). Recent court ruling treating crypto as taxable income signals gradual movement toward digital asset recognition. AML framework now covers VASPs. EAC integration incentive.",
      milestones: [
        "IMF SSA survey: research, planning pilot within 2 years",
        "No dedicated VASP licensing regime; AML applies broadly",
        "2024: Court decision — crypto treated as taxable income (landmark)",
        "Mobile money among East Africa leaders in transaction volume"
      ],
      regulatoryPosture: "Cautious / Developing",
      regulatoryDetails: "Gradual digital asset recognition without formal framework. EAC membership + cross-border integration with Kenya/Uganda will drive CBDC interest. Likely follower once Kenya or Uganda demonstrates viable model.",
      strategicDriver: "EAC cross-border payments + financial inclusion + G2P payment efficiency"
    },
    {
      flag: "🇿🇲",
      country: "Zambia",
      cbdcName: "Bank of Zambia",
      status: "research",
      statusLabel: "Research",
      types: ["Retail"],
      tags: [
        { text: "IMF survey", highlight: false },
        { text: "Top 5 SSA stablecoin market", highlight: false }
      ],
      summary: "Zambia in IMF SSA CBDC survey — research/planning phase. High stablecoin usage (5th largest SSA stablecoin market by volume per Chainalysis 2025). G2P payment modernization particularly relevant for Zambia's social benefit programs. Copper economy creates cross-border settlement interest.",
      milestones: [
        "IMF SSA survey participant — research/planning phase",
        "5th largest SSA stablecoin market (Chainalysis 2025)",
        "G2P payments: strong social transfer use case",
        "Copper exports create cross-border commodity settlement incentive"
      ],
      regulatoryPosture: "Exploratory",
      regulatoryDetails: "Developing regulatory framework with IMF support. Stablecoin demand suggests public appetite for digital payment alternatives. Commodity economy may look to Zimbabwe ZiG-style gold/resource backing as model.",
      strategicDriver: "G2P payment modernization + commodity settlement + financial inclusion"
    },
    {
      flag: "🇲🇺",
      country: "Mauritius",
      cbdcName: "Bank of Mauritius CBDC",
      status: "dev",
      statusLabel: "Development",
      types: ["Retail"],
      tags: [
        { text: "IMF design collaboration", highlight: false },
        { text: "IFC hub strategy", highlight: true },
        { text: "Announced 2021", highlight: false }
      ],
      summary: "Bank of Mauritius announced CBDC development plans in 2021 with IMF collaboration. As Africa's leading International Financial Centre, Mauritius positions CBDC within financial hub ambitions. FSC (Financial Services Commission) is among Africa's most sophisticated digital asset regulators. Rollout timeline still pending.",
      milestones: [
        "2021: Governor Seegolam announced CBDC — targeting year-end rollout (delayed)",
        "IMF closely involved in design and planning process",
        "IFC positioning drives cross-border settlement priority",
        "FSC: one of Africa's most advanced digital asset licensing regimes"
      ],
      regulatoryPosture: "Progressive / IFC-Driven",
      regulatoryDetails: "Mauritius positioned as Africa's most sophisticated IFC. CBDC aligns with financial hub strategy — primarily for cross-border institutional settlement rather than domestic inclusion. Small domestic market limits retail CBDC priority.",
      strategicDriver: "IFC cross-border settlement infrastructure + institutional investor services + Africa-Asia payment corridor development"
    },
    {
      flag: "🇸🇿",
      country: "Eswatini",
      cbdcName: "Central Bank of Eswatini",
      status: "research",
      statusLabel: "Research",
      types: ["Retail"],
      tags: [
        { text: "Feasibility testing", highlight: false },
        { text: "ZAR peg", highlight: false }
      ],
      summary: "Eswatini at research and feasibility testing stage. Lilangeni is pegged to the South African Rand, making SARB's CBDC trajectory directly relevant to Eswatini's monetary policy. Small economy likely to follow or integrate with South African CBDC infrastructure.",
      milestones: [
        "Research and feasibility testing per Atlantic Council tracker",
        "Lilangeni pegged to ZAR — SARB CBDC directly relevant",
        "Likely to mirror or integrate with SARB Khokha infrastructure"
      ],
      regulatoryPosture: "Exploratory / Dependent",
      regulatoryDetails: "Small economy with monetary sovereignty constraints given ZAR peg. CBDC development unlikely to proceed independently of South African framework.",
      strategicDriver: "Follow South Africa's CBDC roadmap + regional payment integration + financial inclusion"
    }
  ]
};

const statusColors = {
  launched: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
  pilot: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700 border-amber-300' },
  dev: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700 border-orange-300' },
  research: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700 border-blue-300' }
};

const regulatoryColors = {
  'Progressive / First-Mover': 'bg-green-100 text-green-700 border-green-300',
  'Progressive / Open': 'bg-green-100 text-green-700 border-green-300',
  'Cautious / Strategic': 'bg-yellow-100 text-yellow-700 border-yellow-300',
  'Cautious / Deliberate': 'bg-yellow-100 text-yellow-700 border-yellow-300',
  'Cautious / Progressive': 'bg-yellow-100 text-yellow-700 border-yellow-300',
  'Cautious / State-Controlled': 'bg-yellow-100 text-yellow-700 border-yellow-300',
  'Cautious / Transitioning': 'bg-yellow-100 text-yellow-700 border-yellow-300',
  'Cautious / Developing': 'bg-yellow-100 text-yellow-700 border-yellow-300',
  'Exploratory': 'bg-blue-100 text-blue-700 border-blue-300',
  'Exploratory / Progressive': 'bg-blue-100 text-blue-700 border-blue-300',
  'Exploratory / Dependent': 'bg-blue-100 text-blue-700 border-blue-300',
  'Conservative / Restrictive': 'bg-red-100 text-red-700 border-red-300',
  'State-Led / Recalibrating': 'bg-purple-100 text-purple-700 border-purple-300',
  'State-Driven / Stability-Seeking': 'bg-purple-100 text-purple-700 border-purple-300',
  'Deliberate / Fast-Follower': 'bg-indigo-100 text-indigo-700 border-indigo-300',
  'Progressive (Recent)': 'bg-green-100 text-green-700 border-green-300',
  'Restrictive / State-Controlled': 'bg-red-100 text-red-700 border-red-300',
  'Progressive / IFC-Driven': 'bg-green-100 text-green-700 border-green-300',
  'Progressive on Fintech / Deliberate on CBDC': 'bg-teal-100 text-teal-700 border-teal-300'
};

function CountryCard({ country, expanded, onToggle }) {
  const colors = statusColors[country.status];
  
  return (
    <Card 
      className={`overflow-hidden border-2 ${colors.border} ${colors.bg} hover:shadow-lg transition-all duration-300 ${expanded ? 'col-span-full md:col-span-2' : ''}`}
    >
      <div className="border-t-4 ${colors.border.replace('border-', 'bg-')}" style={{ backgroundColor: `var(--${country.status})` }} />
      
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="text-3xl mb-2">{country.flag}</div>
            <h3 className="text-xl font-bold text-slate-900">{country.country}</h3>
            <p className="text-xs text-blue-600 mt-1 font-medium">{country.cbdcName}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={`${colors.badge} border text-xs font-bold uppercase tracking-wide`}>
              {country.statusLabel}
            </Badge>
            <div className="flex gap-1.5">
              {country.types.map((type, idx) => (
                <Badge 
                  key={idx}
                  variant="outline" 
                  className={`text-xs ${type === 'Retail' ? 'text-pink-600 border-pink-300' : 'text-cyan-600 border-cyan-300'}`}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {country.tags.map((tag, idx) => (
            <Badge
              key={idx}
              variant="outline"
              className={`text-xs ${
                tag.highlight 
                  ? 'bg-blue-50 text-blue-700 border-blue-300' 
                  : tag.warn
                    ? 'bg-red-50 text-red-700 border-red-300'
                    : 'bg-slate-100 text-slate-700 border-slate-300'
              }`}
            >
              {tag.text}
            </Badge>
          ))}
        </div>

        {/* Summary */}
        <p className="text-sm text-slate-700 leading-relaxed mb-4 border-t border-slate-200 pt-4">
          {country.summary}
        </p>

        {/* Expanded Details */}
        {expanded && (
          <div className="border-t-2 border-slate-200 pt-6 mt-4 grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                {country.whyFailed ? 'Why It Struggled' : 'Key Milestones'}
              </h4>
              <ul className="space-y-2">
                {(country.whyFailed || country.milestones).map((item, idx) => (
                  <li key={idx} className="text-sm text-slate-700 flex gap-2">
                    <span className="text-blue-500 mt-0.5">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Regulatory Posture
              </h4>
              <Badge className={`${regulatoryColors[country.regulatoryPosture] || 'bg-slate-100 text-slate-700 border-slate-300'} mb-3 border`}>
                {country.regulatoryPosture}
              </Badge>
              <p className="text-sm text-slate-700 leading-relaxed mb-4">
                {country.regulatoryDetails}
              </p>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Strategic Driver
              </h4>
              <p className="text-sm text-slate-700">
                {country.strategicDriver}
              </p>
              {country.source && (
                <a 
                  href={country.source} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 mt-3"
                >
                  <ExternalLink className="h-3 w-3" />
                  Source Document
                </a>
              )}
            </div>
          </div>
        )}

        {/* Toggle Button */}
        <Button
          variant="ghost"
          onClick={onToggle}
          className="w-full mt-4 text-xs text-slate-600 hover:text-slate-900 border-t border-slate-200"
        >
          {expanded ? '▲ Close Profile' : '▼ View Full Profile'}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function MEACBDCTracker() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [expandedCard, setExpandedCard] = useState(null);

  const filterButtons = [
    { value: 'all', label: 'All', color: 'slate' },
    { value: 'launched', label: '● Launched', color: 'emerald' },
    { value: 'pilot', label: '● Pilot/PoC', color: 'amber' },
    { value: 'dev', label: '● Development', color: 'orange' },
    { value: 'research', label: '● Research', color: 'blue' }
  ];

  const regionButtons = [
    { value: 'all', label: 'All' },
    { value: 'gcc', label: 'GCC' },
    { value: 'mena', label: 'MENA' },
    { value: 'africa', label: 'Africa' }
  ];

  const getFilteredData = (region) => {
    if (statusFilter === 'all') return cbdcData[region];
    return cbdcData[region].filter(c => c.status === statusFilter);
  };

  const shouldShowRegion = (region) => {
    if (regionFilter !== 'all' && regionFilter !== region) return false;
    return getFilteredData(region).length > 0;
  };

  const stats = {
    launched: Object.values(cbdcData).flat().filter(c => c.status === 'launched').length,
    pilot: Object.values(cbdcData).flat().filter(c => c.status === 'pilot').length,
    dev: Object.values(cbdcData).flat().filter(c => c.status === 'dev').length,
    research: Object.values(cbdcData).flat().filter(c => c.status === 'research').length,
    total: Object.values(cbdcData).flat().length
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 mt-12 sm:mt-16">
          <Link to={createPageUrl('Dashboard')}>
            <Button variant="ghost" size="icon" className="hover:bg-slate-100 mb-4">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-orange-600 uppercase tracking-wider mb-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                Live Intelligence Tracker · MEA Region · Updated Feb 2025
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-3">
                CBDC Progress<br />Middle East & Africa
              </h1>
              <p className="text-slate-600 max-w-2xl leading-relaxed">
                Mapping 22 countries by exploration stage, pilots, launches & regulatory posture — with implications for financial institutions, fintechs & policymakers.
              </p>
            </div>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-3">
              <div className="bg-white rounded-lg border-2 border-emerald-200 p-4 text-center min-w-[80px]">
                <div className="text-2xl font-bold text-emerald-600">{stats.launched}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wide">Launched</div>
              </div>
              <div className="bg-white rounded-lg border-2 border-amber-200 p-4 text-center min-w-[80px]">
                <div className="text-2xl font-bold text-amber-600">{stats.pilot}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wide">Pilot/PoC</div>
              </div>
              <div className="bg-white rounded-lg border-2 border-orange-200 p-4 text-center min-w-[80px]">
                <div className="text-2xl font-bold text-orange-600">{stats.dev}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wide">Development</div>
              </div>
              <div className="bg-white rounded-lg border-2 border-blue-200 p-4 text-center min-w-[80px]">
                <div className="text-2xl font-bold text-blue-600">{stats.research}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wide">Research</div>
              </div>
              <div className="bg-white rounded-lg border-2 border-slate-200 p-4 text-center min-w-[80px]">
                <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wide">Countries</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Status:</div>
              <div className="flex flex-wrap gap-2">
                {filterButtons.map(btn => (
                  <Button
                    key={btn.value}
                    variant={statusFilter === btn.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter(btn.value)}
                    className={statusFilter === btn.value ? `bg-${btn.color}-600 hover:bg-${btn.color}-700` : ''}
                  >
                    {btn.label}
                  </Button>
                ))}
              </div>
            </div>
            <div className="w-px bg-slate-200 hidden md:block" />
            <div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Region:</div>
              <div className="flex flex-wrap gap-2">
                {regionButtons.map(btn => (
                  <Button
                    key={btn.value}
                    variant={regionFilter === btn.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setRegionFilter(btn.value)}
                    className={regionFilter === btn.value ? 'bg-slate-900 hover:bg-slate-800' : ''}
                  >
                    {btn.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mb-8 p-4 bg-slate-100 rounded-lg border border-slate-200 flex flex-wrap gap-4">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-emerald-500 rounded-full" />
            <span className="text-slate-700">Launched</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-amber-500 rounded-full" />
            <span className="text-slate-700">Pilot / PoC</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-orange-500 rounded-full" />
            <span className="text-slate-700">Development</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span className="text-slate-700">Research</span>
          </div>
          <div className="w-px bg-slate-300 mx-2" />
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-pink-500 rounded-sm" />
            <span className="text-slate-700">Retail CBDC</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-cyan-500 rounded-sm" />
            <span className="text-slate-700">Wholesale CBDC</span>
          </div>
        </div>

        {/* GCC */}
        {shouldShowRegion('gcc') && (
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                Gulf Cooperation Council (GCC)
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent" />
              <Badge variant="outline" className="text-xs">
                {getFilteredData('gcc').length} Countries
              </Badge>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getFilteredData('gcc').map((country, idx) => (
                <CountryCard
                  key={idx}
                  country={country}
                  expanded={expandedCard === `gcc-${idx}`}
                  onToggle={() => setExpandedCard(expandedCard === `gcc-${idx}` ? null : `gcc-${idx}`)}
                />
              ))}
            </div>
          </div>
        )}

        {/* MENA */}
        {shouldShowRegion('mena') && (
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                MENA (North Africa + Levant)
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent" />
              <Badge variant="outline" className="text-xs">
                {getFilteredData('mena').length} Countries
              </Badge>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getFilteredData('mena').map((country, idx) => (
                <CountryCard
                  key={idx}
                  country={country}
                  expanded={expandedCard === `mena-${idx}`}
                  onToggle={() => setExpandedCard(expandedCard === `mena-${idx}` ? null : `mena-${idx}`)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Africa */}
        {shouldShowRegion('africa') && (
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                Sub-Saharan, East & Southern Africa
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent" />
              <Badge variant="outline" className="text-xs">
                {getFilteredData('africa').length} Countries
              </Badge>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getFilteredData('africa').map((country, idx) => (
                <CountryCard
                  key={idx}
                  country={country}
                  expanded={expandedCard === `africa-${idx}`}
                  onToggle={() => setExpandedCard(expandedCard === `africa-${idx}` ? null : `africa-${idx}`)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Strategic Implications */}
        <div className="mt-16 pt-12 border-t-2 border-slate-200">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">
              Strategic Implications
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-t-4 border-emerald-500">
              <CardContent className="p-6">
                <div className="text-3xl mb-3">🏦</div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">For Financial Institutions</h3>
                <ul className="space-y-3 text-sm text-slate-700">
                  <li><strong>Disintermediation risk:</strong> Retail CBDCs (UAE Digital Dirham, Ghana eCedi) threaten deposit bases. IMF models suggest CBDC captures up to 10% of money supply in cash-heavy markets.</li>
                  <li><strong>Wholesale opportunity:</strong> Wholesale CBDCs (SA Khokha, mBridge) create new DLT infrastructure layers. Banks investing early in settlement technology secure first-mover advantage.</li>
                  <li><strong>Correspondent banking disruption:</strong> mBridge + bilateral CBDC rails reduce need for USD-clearing correspondent networks.</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-amber-500">
              <CardContent className="p-6">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">For Fintechs</h3>
                <ul className="space-y-3 text-sm text-slate-700">
                  <li><strong>Don't assume demand (Nigeria lesson):</strong> eNaira's 98.5% inactive wallets prove CBDC infrastructure ≠ automatic market.</li>
                  <li><strong>Cross-border corridor plays:</strong> Morocco–Egypt–France, Tunisia–France, Gulf–South Asia CBDC pilots create regulated remittance infrastructure.</li>
                  <li><strong>Programmable money use cases:</strong> Build on-top use cases: agricultural subsidies, trade finance, SME payroll, social benefits.</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-blue-500">
              <CardContent className="p-6">
                <div className="text-3xl mb-3">🔬</div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">For Policymakers</h3>
                <ul className="space-y-3 text-sm text-slate-700">
                  <li><strong>Nigeria's cautionary design lesson:</strong> Retail CBDC without compelling use case over incumbents fails. Wholesale-first model now emerging as MEA consensus.</li>
                  <li><strong>Mobile money coexistence:</strong> Africa's CBDC challenge is Kenya (M-Pesa), Ethiopia (Telebirr), Ghana (MTN MoMo). Policy design must define complementarity clearly.</li>
                  <li><strong>Geopolitics of mBridge:</strong> UAE + Saudi in China-led mBridge MVP creates de-dollarization infrastructure optionality.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-slate-200 text-center text-xs text-slate-500">
          <p className="leading-relaxed">
            Data compiled February 2025 · Sources: Atlantic Council, IMF, BIS, CBUAE, HRF CBDC Tracker, Carnegie Endowment, ODI Global, Middle East Council on Global Affairs, Ledger Insights<br />
            Country statuses evolve rapidly — verify against primary sources for time-sensitive decisions.
          </p>
        </div>
      </div>
    </div>
  );
}