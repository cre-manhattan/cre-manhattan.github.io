/*
 * Design: Obsidian Atlas — Dark Cartographic Intelligence Platform
 * UBO Profiles: Beneficial owner dossiers with DISC personality profiles
 */
import Navbar from "@/components/Navbar";
import { DATA_URLS } from "@/lib/dataUrls";
import { useEffect, useState } from "react";
import {
  Users,
  Search,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  Linkedin,
  Building2,
  DollarSign,
  User,
  Shield,
  ExternalLink,
} from "lucide-react";

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

const googleMapsUrl = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${address}, Manhattan, New York, NY`
  )}`;

interface UBO {
  address: string;
  entity: string;
  ubo: string;
  title: string;
  email: string;
  phone: string;
  linkedin: string;
  guesstimate: string;
  discProfile: string;
}

export default function UBOProfiles() {
  const [ubos, setUbos] = useState<UBO[]>([]);
  const [search, setSearch] = useState("");
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  useEffect(() => {
    fetch(DATA_URLS.ubos)
      .then((r) => r.json())
      .then(setUbos);
  }, []);

  const filtered = ubos.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.ubo.toLowerCase().includes(q) ||
      u.entity.toLowerCase().includes(q) ||
      u.address.toLowerCase().includes(q) ||
      u.title.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section
        className="pt-24 pb-16 relative"
        style={{
          backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663273828100/TGXiHvr84EAkLUDM6xxp9j/ubo-section-bg-WMNtv2QPvM6z448B4scPrX.webp)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-background/85" />
        <div className="relative container">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-teal/10 border border-teal/30 mb-4">
            <Users className="h-3.5 w-3.5 text-teal" />
            <span className="text-xs font-medium text-teal uppercase tracking-wider">
              {ubos.length} Decision-Makers Identified
            </span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            UBO Profiles & DISC Analysis
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Ultimate Beneficial Owners behind each target property, with direct contact
            information and AI-generated DISC personality profiles for optimized outreach.
          </p>
        </div>
      </section>

      {/* Search */}
      <section className="sticky top-16 z-40 border-b border-border/50 bg-background/95 backdrop-blur-sm">
        <div className="container py-3 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, entity, address, or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-border/50 rounded-sm text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-teal/50"
            />
          </div>
          <div className="text-xs text-muted-foreground">
            {filtered.length} profiles
          </div>
        </div>
      </section>

      {/* Profile Cards */}
      <section className="py-8">
        <div className="container space-y-3">
          {filtered.map((ubo, i) => {
            const isExpanded = expandedIdx === i;
            const hasEmail = ubo.email && ubo.email !== "NOT FOUND";
            const hasPhone = ubo.phone && ubo.phone !== "NOT FOUND";
            const hasLinkedin = ubo.linkedin && ubo.linkedin !== "NOT FOUND" && ubo.linkedin !== "";

            return (
              <div
                key={i}
                className="bg-card border border-border/30 rounded-sm overflow-hidden"
              >
                {/* Summary Row */}
                <button
                  onClick={() => setExpandedIdx(isExpanded ? null : i)}
                  className="w-full px-6 py-5 flex items-start gap-5 hover:bg-secondary/20 transition-colors text-left"
                >
                  {/* Avatar */}
                  <div className="shrink-0 h-12 w-12 rounded-sm bg-teal/10 border border-teal/20 flex items-center justify-center">
                    <User className="h-6 w-6 text-teal" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-base font-semibold text-foreground">
                        {ubo.ubo}
                      </h3>
                      {hasEmail && (
                        <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 bg-teal/10 text-teal text-[10px] rounded-sm">
                          <Mail className="h-2.5 w-2.5" /> Email
                        </span>
                      )}
                      {hasPhone && (
                        <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 bg-teal/10 text-teal text-[10px] rounded-sm">
                          <Phone className="h-2.5 w-2.5" /> Phone
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mb-1">
                      {ubo.title}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        {ubo.entity}
                      </span>
                      <span className="text-border">|</span>
                      <a
                        href={googleMapsUrl(ubo.address)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-teal transition-colors group/addr"
                      >
                        <Building2 className="h-3 w-3" />
                        {ubo.address}
                        <ExternalLink className="h-2.5 w-2.5 opacity-0 group-hover/addr:opacity-100 transition-opacity" />
                      </a>
                    </div>
                  </div>

                  {/* Value */}
                  <div className="hidden md:block text-right shrink-0">
                    <div className="text-sm font-bold font-mono text-foreground">
                      {ubo.guesstimate}
                    </div>
                    <div className="text-[10px] text-muted-foreground">Est. Value</div>
                  </div>

                  <div className="shrink-0 pt-1">
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {/* Expanded Profile */}
                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-border/30">
                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 py-4">
                      <div className="bg-secondary/30 rounded-sm p-3 flex items-center gap-3">
                        <Mail className={`h-4 w-4 ${hasEmail ? "text-teal" : "text-muted-foreground/40"}`} />
                        <div>
                          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            Email
                          </div>
                          {hasEmail ? (
                            <a
                              href={`mailto:${ubo.email}`}
                              className="text-sm text-teal hover:underline"
                            >
                              {ubo.email}
                            </a>
                          ) : (
                            <span className="text-sm text-muted-foreground/50">
                              Not available
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="bg-secondary/30 rounded-sm p-3 flex items-center gap-3">
                        <Phone className={`h-4 w-4 ${hasPhone ? "text-teal" : "text-muted-foreground/40"}`} />
                        <div>
                          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            Phone
                          </div>
                          {hasPhone ? (
                            <a
                              href={`tel:${ubo.phone}`}
                              className="text-sm text-teal hover:underline"
                            >
                              {ubo.phone}
                            </a>
                          ) : (
                            <span className="text-sm text-muted-foreground/50">
                              Not available
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="bg-secondary/30 rounded-sm p-3 flex items-center gap-3">
                        <Linkedin className={`h-4 w-4 ${hasLinkedin ? "text-teal" : "text-muted-foreground/40"}`} />
                        <div>
                          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            LinkedIn
                          </div>
                          {hasLinkedin ? (
                            <a
                              href={ubo.linkedin.startsWith("http") ? ubo.linkedin : `https://linkedin.com/in/${ubo.linkedin}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-teal hover:underline"
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

                    {/* DISC Profile */}
                    {ubo.discProfile && (
                      <div className="bg-secondary/20 rounded-sm p-5 border border-border/30">
                        <h4 className="text-xs uppercase tracking-wider text-teal font-medium mb-3 flex items-center gap-2">
                          <Shield className="h-3.5 w-3.5" />
                          DISC Personality Profile & Outreach Strategy
                        </h4>
                        <div className="prose prose-sm prose-invert max-w-none text-foreground/80 [&_h1]:text-lg [&_h1]:font-bold [&_h1]:text-foreground [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-foreground/90 [&_h4]:text-xs [&_h4]:font-semibold [&_h4]:text-teal [&_p]:text-xs [&_p]:leading-relaxed [&_li]:text-xs [&_strong]:text-foreground [&_ul]:space-y-1 [&_ol]:space-y-1">
                          <div dangerouslySetInnerHTML={{ __html: renderMarkdown(ubo.discProfile) }} />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              No profiles match your search criteria.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
