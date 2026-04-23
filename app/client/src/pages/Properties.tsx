/*
 * Design: Obsidian Atlas — Dark Cartographic Intelligence Platform
 * Properties: 34 target properties with pricing, UBO profiles, and DISC analysis
 * integrated side-by-side so users see everything on one page.
 */
import Navbar from "@/components/Navbar";
import { DATA_URLS } from "@/lib/dataUrls";
import { useEffect, useState } from "react";
// Simple markdown renderer for DISC profiles
const renderMarkdown = (text: string) => {
  return text
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>');
};
import {
  Building2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Search,
  ArrowUpDown,
  MapPin,
  DollarSign,
  TrendingUp,
  User,
  Mail,
  Phone,
  Linkedin,
  Shield,
  MessageSquare,
  Target,
  Calendar,
  Layers,
  Ruler,
} from "lucide-react";

const googleMapsUrl = (address: string, zip: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${address}, New York, NY ${String(zip).replace(/\.0$/, "")}`
  )}`;

interface Property {
  id: string;
  address: string;
  zipcode: string;
  buildingClass: string;
  buildingClassDesc: string;
  owner: string;
  numFloors: string;
  totalUnits: string;
  lotArea: string;
  bldgArea: string;
  yearBuilt: string;
  saleProbability: number;
  guesstimate: string;
  guesstimateLow: string;
  guesstimateHigh: string;
  modelEstimate: string;
  compMedian: string;
  psfEstimate: string;
  assessedEstimate: string;
  lastSaleAdjusted: string;
  uboName: string;
  uboTitle: string;
  uboEntity: string;
  uboEmail: string;
  uboPhone: string;
  uboLinkedin: string;
  uboDiscProfile: string;
}

type SortKey = "saleProbability" | "guesstimate" | "address";

function parseDollar(val: string): number {
  if (!val) return 0;
  const cleaned = val.replace(/[$,M]/g, "");
  const num = parseFloat(cleaned);
  if (val.includes("M")) return num * 1_000_000;
  return num || 0;
}

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("saleProbability");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"property" | "ubo" | "disc">("property");

  useEffect(() => {
    fetch(DATA_URLS.properties)
      .then((r) => r.json())
      .then(setProperties);
  }, []);

  // Reset tab when expanding a different property
  useEffect(() => {
    setActiveTab("property");
  }, [expandedId]);

  const filtered = properties
    .filter((p) => {
      const q = search.toLowerCase();
      return (
        p.address.toLowerCase().includes(q) ||
        p.owner.toLowerCase().includes(q) ||
        p.buildingClassDesc.toLowerCase().includes(q) ||
        p.zipcode.includes(q) ||
        (p.uboName && p.uboName.toLowerCase().includes(q)) ||
        (p.uboEntity && p.uboEntity.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      let aVal: number, bVal: number;
      if (sortKey === "saleProbability") {
        aVal = a.saleProbability;
        bVal = b.saleProbability;
      } else if (sortKey === "guesstimate") {
        aVal = parseDollar(a.guesstimate);
        bVal = parseDollar(b.guesstimate);
      } else {
        return sortDir === "asc"
          ? a.address.localeCompare(b.address)
          : b.address.localeCompare(a.address);
      }
      return sortDir === "asc" ? aVal - bVal : bVal - aVal;
    });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section
        className="pt-24 pb-16 relative"
        style={{
          backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663273828100/TGXiHvr84EAkLUDM6xxp9j/manhattan-grid-dark-dr7YnXwFMqktLzgSrxkmdF.webp)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-background/80" />
        <div className="relative container">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-teal/10 border border-teal/30 mb-4">
            <Building2 className="h-3.5 w-3.5 text-teal" />
            <span className="text-xs font-medium text-teal uppercase tracking-wider">
              {filtered.length} Off-Market Targets
            </span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Target Properties & Owner Intelligence
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Manhattan commercial properties with 80%+ predicted sale probability,
            valued at $10M+. Each property includes the UBO identity, contact info,
            and DISC personality profile for optimized outreach.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 z-40 border-b border-border/50 bg-background/95 backdrop-blur-sm">
        <div className="container py-3 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by address, owner, UBO name, or entity..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-border/50 rounded-sm text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-teal/50"
            />
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Sort:</span>
            {(
              [
                ["saleProbability", "Probability"],
                ["guesstimate", "Value"],
                ["address", "Address"],
              ] as [SortKey, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => toggleSort(key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-sm border transition-colors flex items-center gap-1 ${
                  sortKey === key
                    ? "border-teal/50 text-teal bg-teal/10"
                    : "border-border/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
                {sortKey === key && <ArrowUpDown className="h-3 w-3" />}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Property List */}
      <section className="py-8">
        <div className="container">
          <div className="space-y-3">
            {filtered.map((prop, i) => {
              const isExpanded = expandedId === prop.id;
              const hasUbo = !!prop.uboName;
              const hasEmail = prop.uboEmail && prop.uboEmail !== "NOT FOUND";
              const hasPhone = prop.uboPhone && prop.uboPhone !== "NOT FOUND";
              const hasLinkedin = prop.uboLinkedin && prop.uboLinkedin !== "NOT FOUND" && prop.uboLinkedin !== "";
              const hasDisc = !!prop.uboDiscProfile;

              return (
                <div
                  key={prop.id || i}
                  className={`bg-card border rounded-sm overflow-hidden transition-colors ${
                    isExpanded ? "border-teal/30" : "border-border/30"
                  }`}
                >
                  {/* Collapsed Row */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : prop.id)}
                    className="w-full px-6 py-4 flex items-center gap-5 hover:bg-secondary/20 transition-colors text-left"
                  >
                    {/* Rank */}
                    <div className="hidden sm:flex h-8 w-8 items-center justify-center text-xs font-mono text-muted-foreground border border-border/50 rounded-sm shrink-0">
                      {i + 1}
                    </div>

                    {/* Probability badge */}
                    <div
                      className={`shrink-0 w-16 text-center px-2 py-1 rounded-sm text-xs font-mono font-bold ${
                        prop.saleProbability >= 0.95
                          ? "bg-teal/20 text-teal"
                          : prop.saleProbability >= 0.85
                          ? "bg-teal/10 text-teal-dim"
                          : "bg-gold/10 text-gold"
                      }`}
                    >
                      {(prop.saleProbability * 100).toFixed(1)}%
                    </div>

                    {/* Address & details */}
                    <div className="flex-1 min-w-0">
                      <a
                        href={googleMapsUrl(prop.address, prop.zipcode)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm font-semibold text-foreground truncate hover:text-teal transition-colors flex items-center gap-1.5 group"
                      >
                        {prop.address}
                        <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </a>
                      <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 shrink-0" />
                          {String(prop.zipcode).replace(/\.0$/, "")}
                        </span>
                        <span className="text-border">|</span>
                        <span>{prop.buildingClassDesc || prop.buildingClass}</span>
                        {hasUbo && (
                          <>
                            <span className="text-border">|</span>
                            <span className="flex items-center gap-1 text-teal/70">
                              <User className="h-3 w-3" />
                              {prop.uboName}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Contact badges */}
                    <div className="hidden lg:flex items-center gap-1.5 shrink-0">
                      {hasEmail && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-teal/10 text-teal text-[10px] rounded-sm">
                          <Mail className="h-2.5 w-2.5" />
                        </span>
                      )}
                      {hasPhone && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-teal/10 text-teal text-[10px] rounded-sm">
                          <Phone className="h-2.5 w-2.5" />
                        </span>
                      )}
                      {hasLinkedin && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-teal/10 text-teal text-[10px] rounded-sm">
                          <Linkedin className="h-2.5 w-2.5" />
                        </span>
                      )}
                    </div>

                    {/* Value */}
                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold font-mono text-foreground">
                        {prop.guesstimate}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        Est. Value
                      </div>
                    </div>

                    {/* Expand */}
                    <div className="shrink-0">
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-teal" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Detail — Tabbed Layout */}
                  {isExpanded && (
                    <div className="border-t border-border/30">
                      {/* Tab Navigation */}
                      <div className="flex border-b border-border/30 bg-secondary/10">
                        {[
                          { key: "property" as const, label: "Property Details", icon: Building2 },
                          { key: "ubo" as const, label: "Owner / UBO", icon: User },
                          { key: "disc" as const, label: "DISC Profile & Outreach", icon: MessageSquare },
                        ].map((tab) => (
                          <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-2 px-5 py-3 text-xs font-medium transition-colors border-b-2 ${
                              activeTab === tab.key
                                ? "border-teal text-teal bg-teal/5"
                                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/20"
                            }`}
                          >
                            <tab.icon className="h-3.5 w-3.5" />
                            {tab.label}
                          </button>
                        ))}
                      </div>

                      {/* Tab Content */}
                      <div className="px-6 py-6">
                        {/* ===== PROPERTY DETAILS TAB ===== */}
                        {activeTab === "property" && (
                          <div>
                            {/* Key Metrics Row */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
                              {[
                                { label: "Year Built", value: prop.yearBuilt || "N/A", icon: Calendar },
                                { label: "Floors", value: prop.numFloors || "N/A", icon: Layers },
                                { label: "Building Area", value: prop.bldgArea ? `${parseInt(prop.bldgArea).toLocaleString()} SF` : "N/A", icon: Ruler },
                                { label: "Lot Area", value: prop.lotArea ? `${parseInt(prop.lotArea).toLocaleString()} SF` : "N/A", icon: Ruler },
                                { label: "Probability", value: `${(prop.saleProbability * 100).toFixed(1)}%`, icon: Target },
                                { label: "Value Range", value: `${prop.guesstimateLow} – ${prop.guesstimateHigh}`, icon: DollarSign },
                              ].map((item, j) => (
                                <div key={j} className="bg-secondary/30 rounded-sm p-3">
                                  <div className="flex items-center gap-1.5 mb-1.5">
                                    <item.icon className="h-3 w-3 text-teal/60" />
                                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                      {item.label}
                                    </span>
                                  </div>
                                  <div className="text-sm font-mono font-medium text-foreground">
                                    {item.value}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Valuation Breakdown */}
                            <h4 className="text-xs uppercase tracking-wider text-teal font-medium mb-3 flex items-center gap-2">
                              <DollarSign className="h-3.5 w-3.5" />
                              Valuation Breakdown
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                              {[
                                { label: "ML Model", value: prop.modelEstimate },
                                { label: "Comp Median", value: prop.compMedian },
                                { label: "Price/SF", value: prop.psfEstimate },
                                { label: "Assessed Value", value: prop.assessedEstimate },
                                { label: "Last Sale Adj.", value: prop.lastSaleAdjusted },
                              ].map((item, j) => (
                                <div key={j} className="bg-secondary/20 rounded-sm p-3 border border-border/30">
                                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                                    {item.label}
                                  </div>
                                  <div className="text-sm font-mono font-medium text-foreground">
                                    {item.value || "N/A"}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Blended Guesstimate callout */}
                            <div className="mt-4 p-4 bg-teal/5 border border-teal/20 rounded-sm flex items-center justify-between">
                              <div>
                                <div className="text-[10px] uppercase tracking-wider text-teal mb-1">
                                  Blended Guesstimate
                                </div>
                                <div className="text-2xl font-bold font-mono text-teal">
                                  {prop.guesstimate}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                                  Confidence Range
                                </div>
                                <div className="text-sm font-mono text-foreground">
                                  {prop.guesstimateLow || "N/A"} — {prop.guesstimateHigh || "N/A"}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* ===== UBO / OWNER TAB ===== */}
                        {activeTab === "ubo" && (
                          <div>
                            {hasUbo ? (
                              <>
                                {/* UBO Identity Card */}
                                <div className="flex items-start gap-5 mb-6 p-5 bg-secondary/20 rounded-sm border border-border/30">
                                  <div className="shrink-0 h-16 w-16 rounded-sm bg-teal/10 border border-teal/20 flex items-center justify-center">
                                    <User className="h-8 w-8 text-teal" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="text-xl font-bold text-foreground mb-1">
                                      {prop.uboName}
                                    </h3>
                                    <div className="text-sm text-muted-foreground mb-2">
                                      {prop.uboTitle}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                      <Shield className="h-3 w-3 text-teal/60" />
                                      <span>{prop.uboEntity}</span>
                                    </div>
                                  </div>
                                  <div className="hidden md:block text-right shrink-0">
                                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                                      Property Value
                                    </div>
                                    <div className="text-lg font-bold font-mono text-teal">
                                      {prop.guesstimate}
                                    </div>
                                  </div>
                                </div>

                                {/* Contact Cards */}
                                <h4 className="text-xs uppercase tracking-wider text-teal font-medium mb-3 flex items-center gap-2">
                                  <Mail className="h-3.5 w-3.5" />
                                  Direct Contact Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                                  <div className="bg-secondary/30 rounded-sm p-4 flex items-center gap-4">
                                    <div className={`h-10 w-10 rounded-sm flex items-center justify-center ${hasEmail ? "bg-teal/15 border border-teal/30" : "bg-secondary border border-border/30"}`}>
                                      <Mail className={`h-5 w-5 ${hasEmail ? "text-teal" : "text-muted-foreground/40"}`} />
                                    </div>
                                    <div>
                                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
                                        Email
                                      </div>
                                      {hasEmail ? (
                                        <a
                                          href={`mailto:${prop.uboEmail}`}
                                          onClick={(e) => e.stopPropagation()}
                                          className="text-sm text-teal hover:underline font-medium"
                                        >
                                          {prop.uboEmail}
                                        </a>
                                      ) : (
                                        <span className="text-sm text-muted-foreground/50">
                                          Not available
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="bg-secondary/30 rounded-sm p-4 flex items-center gap-4">
                                    <div className={`h-10 w-10 rounded-sm flex items-center justify-center ${hasPhone ? "bg-teal/15 border border-teal/30" : "bg-secondary border border-border/30"}`}>
                                      <Phone className={`h-5 w-5 ${hasPhone ? "text-teal" : "text-muted-foreground/40"}`} />
                                    </div>
                                    <div>
                                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
                                        Phone
                                      </div>
                                      {hasPhone ? (
                                        <a
                                          href={`tel:${prop.uboPhone}`}
                                          onClick={(e) => e.stopPropagation()}
                                          className="text-sm text-teal hover:underline font-medium"
                                        >
                                          {prop.uboPhone}
                                        </a>
                                      ) : (
                                        <span className="text-sm text-muted-foreground/50">
                                          Not available
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="bg-secondary/30 rounded-sm p-4 flex items-center gap-4">
                                    <div className={`h-10 w-10 rounded-sm flex items-center justify-center ${hasLinkedin ? "bg-teal/15 border border-teal/30" : "bg-secondary border border-border/30"}`}>
                                      <Linkedin className={`h-5 w-5 ${hasLinkedin ? "text-teal" : "text-muted-foreground/40"}`} />
                                    </div>
                                    <div>
                                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
                                        LinkedIn
                                      </div>
                                      {hasLinkedin ? (
                                        <a
                                          href={prop.uboLinkedin.startsWith("http") ? prop.uboLinkedin : `https://linkedin.com/in/${prop.uboLinkedin}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          onClick={(e) => e.stopPropagation()}
                                          className="text-sm text-teal hover:underline font-medium"
                                        >
                                          View Profile
                                        </a>
                                      ) : (
                                        <span className="text-sm text-muted-foreground/50">
                                          Not available
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Property context */}
                                <div className="p-4 bg-secondary/10 border border-border/20 rounded-sm">
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                                    <div>
                                      <span className="text-muted-foreground">Property:</span>
                                      <a
                                        href={googleMapsUrl(prop.address, prop.zipcode)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-medium text-foreground mt-0.5 block hover:text-teal transition-colors"
                                      >{prop.address}</a>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Building Type:</span>
                                      <div className="font-medium text-foreground mt-0.5">{prop.buildingClassDesc}</div>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Sale Probability:</span>
                                      <div className="font-medium text-teal mt-0.5">{(prop.saleProbability * 100).toFixed(1)}%</div>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Est. Value:</span>
                                      <div className="font-medium text-foreground mt-0.5">{prop.guesstimate}</div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="text-center py-12 text-muted-foreground">
                                <User className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                                <p className="text-sm">No UBO information available for this property.</p>
                                <p className="text-xs mt-1">The beneficial owner could not be identified through public records.</p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* ===== DISC PROFILE & OUTREACH TAB ===== */}
                        {activeTab === "disc" && (
                          <div>
                            {hasUbo && hasDisc ? (
                              <>
                                {/* Quick reference header */}
                                <div className="flex items-center gap-4 mb-5 p-4 bg-teal/5 border border-teal/20 rounded-sm">
                                  <div className="shrink-0 h-12 w-12 rounded-sm bg-teal/10 border border-teal/20 flex items-center justify-center">
                                    <MessageSquare className="h-6 w-6 text-teal" />
                                  </div>
                                  <div>
                                    <h3 className="text-base font-semibold text-foreground">
                                      Outreach Strategy for {prop.uboName}
                                    </h3>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                      AI-generated DISC personality analysis based on LinkedIn profile and public data.
                                      Use this to tailor your approach when reaching out about {prop.address}.
                                    </p>
                                  </div>
                                  {/* Quick contact buttons */}
                                  <div className="hidden md:flex items-center gap-2 shrink-0 ml-auto">
                                    {hasEmail && (
                                      <a
                                        href={`mailto:${prop.uboEmail}`}
                                        className="flex items-center gap-1.5 px-3 py-2 bg-teal text-background text-xs font-semibold rounded-sm hover:bg-teal/90 transition-colors"
                                      >
                                        <Mail className="h-3.5 w-3.5" />
                                        Email
                                      </a>
                                    )}
                                    {hasPhone && (
                                      <a
                                        href={`tel:${prop.uboPhone}`}
                                        className="flex items-center gap-1.5 px-3 py-2 border border-teal/50 text-teal text-xs font-semibold rounded-sm hover:bg-teal/10 transition-colors"
                                      >
                                        <Phone className="h-3.5 w-3.5" />
                                        Call
                                      </a>
                                    )}
                                  </div>
                                </div>

                                {/* DISC Profile Content */}
                                <div className="bg-secondary/20 rounded-sm p-6 border border-border/30">
                                  <div className="prose prose-sm prose-invert max-w-none text-foreground/80 [&_h1]:text-lg [&_h1]:font-bold [&_h1]:text-foreground [&_h1]:mt-6 [&_h1]:mb-3 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-5 [&_h2]:mb-2 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-foreground/90 [&_h3]:mt-4 [&_h3]:mb-2 [&_h4]:text-xs [&_h4]:font-semibold [&_h4]:text-teal [&_h4]:mt-3 [&_h4]:mb-1 [&_p]:text-xs [&_p]:leading-relaxed [&_p]:mb-2 [&_li]:text-xs [&_li]:leading-relaxed [&_strong]:text-foreground [&_ul]:space-y-1 [&_ul]:mb-3 [&_ol]:space-y-1 [&_ol]:mb-3 [&_hr]:border-border/30 [&_hr]:my-4">
                                    <div dangerouslySetInnerHTML={{ __html: renderMarkdown(prop.uboDiscProfile) }} />
                                  </div>
                                </div>
                              </>
                            ) : hasUbo && !hasDisc ? (
                              <div className="text-center py-12 text-muted-foreground">
                                <MessageSquare className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                                <p className="text-sm">DISC profile not available for {prop.uboName}.</p>
                                <p className="text-xs mt-1">Insufficient public data to generate a personality analysis.</p>
                              </div>
                            ) : (
                              <div className="text-center py-12 text-muted-foreground">
                                <User className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                                <p className="text-sm">No owner identified for this property.</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              No properties match your search criteria.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
