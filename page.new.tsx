"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import { Activity, ArrowDownRight, ArrowUpRight, BadgeAlert, Clock3, CloudLightning, Crosshair, Droplets, Gauge, Layers3, MapPinned, Radio, Route, ShieldAlert, Siren, Sparkles, Users, Waves, Wind, Zap, type LucideIcon } from "lucide-react";

const StormMap = dynamic(() => import("@/components/StormMap"), { ssr: false, loading: () => <div className="map-loading"><span className="spinner" /> Preparing geospatial layers…</div> });
type ScenarioId = "fani" | "amphan" | "live";
type ViewTab = "advisories" | "sar";
const scenarios: Record<ScenarioId, { title: string; detail: string; tag: string }> = {
  fani: { title: "Cyclone Fani Scenario", detail: "Historical replay · 03 May 2019", tag: "HISTORICAL" },
  amphan: { title: "Cyclone Amphan Scenario", detail: "Historical replay · 20 May 2020", tag: "HISTORICAL" },
  live: { title: "Category 4 Live Simulation", detail: "Synthetic forecast · Bay of Bengal", tag: "SIMULATION" },
};
const advisories = [
  { number: "01", title: "Infrastructure hardening protocols", icon: ShieldAlert, tone: "red", priority: "IMMEDIATE · 0–2 HRS", summary: "Isolate exposed feeders at the regional grid substation ahead of the surge window. Stage mobile generators at the district hospital and verify fuel autonomy for 72 hours.", action: "Power-grid isolation + shelter staging", owner: "Power utility · District EOC" },
  { number: "02", title: "Evacuation routing strategy", icon: Route, tone: "amber", priority: "HIGH · 2–6 HRS", summary: "Divert coastal traffic inland before the red-zone threshold is reached. Keep Route 16 access clear for emergency vehicles; dispatch wardens to low-lying junctions and bridge approaches.", action: "Reroute traffic away from red-zone roads", owner: "Traffic control · Police" },
  { number: "03", title: "Parametric risk & resource allocation", icon: Droplets, tone: "blue", priority: "HIGH · PRE-LANDFALL", summary: "Pre-position trauma kits, IV fluids, potable water and cold-chain supplies at the district hospital. Hold one ambulance at the coastal shelter; trigger replenishment when occupancy exceeds 90%.", action: "Dispatch medical supplies to priority sites", owner: "Health department · Logistics cell" },
];
const metrics: { label: string; value: string; context: string; icon: LucideIcon; tone: string; delta?: string }[] = [
  { label: "Active cyclone", value: "Category 4 Cyclone", context: "Simulated: Bay of Bengal", icon: CloudLightning, tone: "red", delta: "SEVERE" },
  { label: "Max sustained wind", value: "185 km/h", context: "Gusts: 210 km/h", icon: Wind, tone: "amber", delta: "CAT 4" },
  { label: "Projected landfall", value: "12 Hours", context: "Odisha / North AP Coast", icon: Clock3, tone: "blue", delta: "T−12:00" },
  { label: "High-vulnerability population at risk", value: "2.4 Million", context: "Coastal districts · modeled exposure", icon: Users, tone: "mint", delta: "AT RISK" },
];
function MetricCard({ metric }: { metric: (typeof metrics)[number] }) {
  const Icon = metric.icon;
  return <article className={`metric-card metric-${metric.tone}`}><div className="metric-topline"><span className="metric-icon"><Icon size={17} strokeWidth={1.8} /></span><span className="metric-delta">{metric.delta}</span></div><p className="metric-label">{metric.label}</p><p className="metric-value">{metric.value}</p><p className="metric-context">{metric.context}</p></article>;
}

export default function Home() {
  const [scenario, setScenario] = useState<ScenarioId>("live");
  const [view, setView] = useState<ViewTab>("advisories");
  const [assessmentReady, setAssessmentReady] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [assessedAt, setAssessedAt] = useState("");
  const runAssessment = () => {
    if (isRunning) return;
    setIsRunning(true); setView("advisories"); setAssessmentReady(false);
    window.setTimeout(() => {
      setAssessmentReady(true);
      setAssessedAt(new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" }).format(new Date()));
      setIsRunning(false);
    }, 850);
  };
  const changeScenario = (next: ScenarioId) => { setScenario(next); setAssessmentReady(false); setView("advisories"); };

  return <main className="app-shell">
    <header className="topbar">
      <a className="brand-lockup" href="#overview" aria-label="AegisStorm AI home"><span className="brand-mark"><ShieldAlert size={22} strokeWidth={1.7} /></span><span className="brand-name">AEGIS<span>STORM</span><sup>AI</sup></span></a>
      <nav className="top-nav" aria-label="Dashboard sections"><a className="nav-link active" href="#overview">Overview</a><a className="nav-link" href="#risk-map">Risk map</a><a className="nav-link" href="#advisory-panel">Advisory engine</a></nav>
      <div className="topbar-status"><span className="status-pulse" /><span>SIMULATION ACTIVE</span><span className="status-divider" /><span className="topbar-region"><MapPinned size={13} /> EASTERN COAST</span></div>
    </header>
    <div className="content-wrap" id="overview">
      <section className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> DISASTER INTELLIGENCE / BAY OF BENGAL</div><h1>AegisStorm AI <span>— Cyclone Risk &amp; Vulnerability Intelligence Platform</span></h1><p className="page-subtitle">Pre-Landfall Anticipatory Action &amp; Predictive Risk Modeling</p></div><div className="forecast-stamp"><span className="stamp-icon"><Crosshair size={18} /></span><span><b>FORECAST WINDOW</b><small>Next 12 hours · Odisha coast</small></span></div></section>
      <section className="metrics-grid" aria-label="Cyclone quick metrics">{metrics.map((metric) => <MetricCard metric={metric} key={metric.label} />)}</section>
      <section className="dashboard-grid">
        <section className="panel map-panel" id="risk-map" aria-labelledby="map-heading">
          <div className="panel-heading map-heading"><div className="panel-title-wrap"><span className="section-index">01</span><div><h2 id="map-heading">Cyclone hazard footprint</h2><p>Storm surge zones · Critical infrastructure · Odisha, India</p></div></div><div className="map-heading-actions"><span className="map-mode-pill"><Layers3 size={13} /> MULTI-HAZARD</span><span className="map-coordinates">19.8°N&nbsp; 85.8°E</span></div></div>
          <div className="map-frame"><StormMap /></div>
          <div className="map-footer"><div className="legend-group" aria-label="Map hazard zone legend"><span className="legend-item"><i className="legend-dot legend-red" /> HIGH · 3–5m surge</span><span className="legend-item"><i className="legend-dot legend-orange" /> MODERATE · 1.5–3m</span><span className="legend-item"><i className="legend-dot legend-yellow" /> WIND BUFFER · 60km</span></div><span className="map-footer-note"><span className="tiny-live-dot" /> 4 ASSETS TRACKED</span></div>
        </section>
        <aside className="panel advisory-panel" id="advisory-panel" aria-labelledby="advisory-heading">
          <div className="panel-heading advisory-heading"><div className="panel-title-wrap"><span className="section-index">02</span><div><h2 id="advisory-heading">AI advisory engine</h2><p>Decision support for municipal authorities</p></div></div><span className="engine-status"><span className="engine-dot" /> READY</span></div>
          <div className="scenario-control"><label htmlFor="scenario-select">SCENARIO SELECTOR</label><div className="select-wrap"><select id="scenario-select" value={scenario} onChange={(event) => changeScenario(event.target.value as ScenarioId)}><option value="fani">Cyclone Fani Scenario</option><option value="amphan">Cyclone Amphan Scenario</option><option value="live">Category 4 Live Simulation</option></select><span className="select-chevron">⌄</span></div><div className="scenario-detail"><span className={`scenario-tag ${scenario === "live" ? "tag-live" : "tag-history"}`}>{scenarios[scenario].tag}</span><span>{scenarios[scenario].detail}</span></div></div>
          <button className={`run-button ${isRunning ? "is-running" : ""}`} onClick={runAssessment} disabled={isRunning}>{isRunning ? <><span className="spinner spinner-light" /> Assessing vulnerability…</> : <><Zap size={16} fill="currentColor" /> Run Gemini Multimodal Vulnerability Assessment <ArrowUpRight size={15} /></>}</button>
          <p className="simulation-note"><Sparkles size={12} /> Local demo assessment · illustrative, not connected to Gemini</p>
          <div className="output-toolbar"><div><h3>Live output</h3><p>{assessmentReady ? `Generated ${assessedAt} IST · ${scenarios[scenario].title}` : "Municipal early-warning advisories"}</p></div><div className="view-tabs" role="tablist" aria-label="Advisory output view"><button role="tab" aria-selected={view === "advisories"} className={view === "advisories" ? "selected" : ""} onClick={() => setView("advisories")}>Advisories</button><button role="tab" aria-selected={view === "sar"} className={view === "sar" ? "selected" : ""} onClick={() => setView("sar")}>SAR index</button></div></div>
          <div className="output-content" aria-live="polite">{view === "advisories" ? assessmentReady ? <div className="advisory-list"><div className="priority-banner"><span><Siren size={15} /> HIGH PRIORITY</span><span>PRE-LANDFALL ACTION WINDOW</span></div>{advisories.map((item) => { const Icon = item.icon; return <article className="advisory-card" key={item.number}><div className={`advisory-icon tone-${item.tone}`}><Icon size={17} /></div><div className="advisory-body"><div className="advisory-meta"><span>{item.number} / {item.priority}</span><BadgeAlert size={13} /></div><h4>{item.title}</h4><p>{item.summary}</p><div className="action-chip"><Zap size={11} /> {item.action}</div><div className="advisory-owner">LEAD: {item.owner}</div></div></article>; })}</div> : <div className="empty-output"><div className="empty-icon"><Sparkles size={20} /></div><div className="empty-title">Assessment standing by</div><p>Run the vulnerability assessment to generate prioritized infrastructure, evacuation and resource-allocation advisories for this scenario.</p><div className="empty-tags"><span><ShieldAlert size={12} /> HARDENING</span><span><Route size={12} /> ROUTING</span><span><Activity size={12} /> RESOURCES</span></div></div> : <div className="sar-card"><div className="sar-title-row"><div><span className="sar-kicker">MOCK GOOGLE EARTH ENGINE</span><h4>SAR flood inundation index</h4></div><span className="sar-live"><Radio size={12} /> MODEL</span></div><p className="sar-description">Synthetic exposure score by modeled hazard footprint. Higher index indicates greater surface-water signal.</p><div className="chart-area" role="img" aria-label="Mock SAR inundation index chart: Red zone 84 percent, moderate zone 62 percent, coastal buffer 38 percent"><div className="chart-y-labels"><span>100</span><span>75</span><span>50</span><span>25</span><span>0</span></div><div className="chart-plot">{[100, 75, 50, 25, 0].map((tick) => <span className="chart-gridline" style={{ bottom: `${tick}%` }} key={tick} />)}<div className="bar-set"><div className="bar bar-red" style={{ height: "84%" }}><b>84</b></div><span>RED ZONE</span></div><div className="bar-set"><div className="bar bar-orange" style={{ height: "62%" }}><b>62</b></div><span>MODERATE</span></div><div className="bar-set"><div className="bar bar-blue" style={{ height: "38%" }}><b>38</b></div><span>COASTAL</span></div></div></div><div className="sar-metrics"><div><span>EST. INUNDATION</span><b>1,280 km²</b><small><ArrowUpRight size={11} /> +18% vs. baseline</small></div><div><span>EXPOSURE INDEX</span><b>0.78 <em>/ 1.00</em></b><small><ArrowDownRight size={11} /> High confidence</small></div></div><div className="sar-disclaimer"><Waves size={13} /> Illustrative mock values · not live Earth Engine data</div></div>}</div>
          <div className="storm-context"><div className="storm-image"><Image src="/images/cyclone-fani.webp" alt="Satellite view of Cyclone Fani approaching Odisha's coast" fill sizes="(max-width: 900px) 100vw, 430px" /></div><div className="storm-context-copy"><span>STORM CONTEXT</span><strong>{scenario === "fani" ? "Cyclone Fani" : scenario === "amphan" ? "Cyclone Amphan" : "Bay of Bengal · Cat 4"}</strong><small>{scenario === "fani" ? "Historical satellite reference · 2019" : scenario === "amphan" ? "Historical scenario replay · 2020" : "Scenario footprint · synthetic forecast"}</small></div><span className="context-arrow"><ArrowUpRight size={15} /></span></div>
          <div className="panel-footnote"><span><Gauge size={12} /> MODEL CONFIDENCE: 82%</span><span>Illustrative decision support only</span></div>
        </aside>
      </section>
      <footer className="page-footer"><span><span className="footer-mark"><ShieldAlert size={13} /></span> AEGISSTORM AI <i /> ANTICIPATORY ACTION INTELLIGENCE</span><span>SIMULATED SCENARIO · NOT AN OFFICIAL WARNING</span></footer>
    </div>
  </main>;
}
