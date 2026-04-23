/*
 * Design: Obsidian Atlas — Dark Cartographic Intelligence Platform
 * Attributes: All 1,500 predictive attributes with category filtering, search, tier badges
 */
import Navbar from "@/components/Navbar";
import { DATA_URLS } from "@/lib/dataUrls";
import { useEffect, useState, useMemo } from "react";
import {
  Database,
  Search,
  ChevronDown,
  ChevronUp,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  AlertCircle,
  MinusCircle,
} from "lucide-react";

interface Attribute {
  id: number;
  category: string;
  attribute: string;
  source: string;
  tier: string;
  weight: number;
  recommendation: string;
  rationale: string;
}

const ITEMS_PER_PAGE = 50;

const tierColors: Record<string, string> = {
  "Tier 1": "bg-teal/20 text-teal border-teal/30",
  "Tier 2": "bg-teal/10 text-teal-dim border-teal-dim/30",
  "Tier 3": "bg-gold/10 text-gold border-gold/30",
  "Tier 4": "bg-secondary text-muted-foreground border-border/50",
  "Tier 5": "bg-secondary/50 text-muted-foreground/70 border-border/30",
};

const recIcons: Record<string, typeof CheckCircle2> = {
  Keep: CheckCircle2,
  "Low Priority": MinusCircle,
  "Consider Dropping": AlertCircle,
};

const recColors: Record<string, string> = {
  Keep: "text-teal",
  "Low Priority": "text-gold",
  "Consider Dropping": "text-destructive",
};

export default function Attributes() {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedTier, setSelectedTier] = useState<string>("All");
  const [selectedRec, setSelectedRec] = useState<string>("All");
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetch(DATA_URLS.attributes)
      .then((r) => r.json())
      .then(setAttributes);
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(attributes.map((a) => a.category))).sort()],
    [attributes]
  );

  const tiers = ["All", "Tier 1", "Tier 2", "Tier 3", "Tier 4", "Tier 5"];
  const recs = ["All", "Keep", "Low Priority", "Consider Dropping"];

  const filtered = useMemo(() => {
    return attributes.filter((a) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        a.attribute.toLowerCase().includes(q) ||
        a.source.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.rationale.toLowerCase().includes(q);
      const matchCat = selectedCategory === "All" || a.category === selectedCategory;
      const matchTier = selectedTier === "All" || a.tier === selectedTier;
      const matchRec = selectedRec === "All" || a.recommendation === selectedRec;
      return matchSearch && matchCat && matchTier && matchRec;
    });
  }, [attributes, search, selectedCategory, selectedTier, selectedRec]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => {
    setPage(1);
  }, [search, selectedCategory, selectedTier, selectedRec]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="pt-24 pb-12">
        <div className="container">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-teal/10 border border-teal/30 mb-4">
            <Database className="h-3.5 w-3.5 text-teal" />
            <span className="text-xs font-medium text-teal uppercase tracking-wider">
              {attributes.length.toLocaleString()} Attributes Catalogued
            </span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Predictive Attributes
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Complete taxonomy of 1,500 public data signals used to predict commercial
            property transactions. Each attribute is empirically weighted and categorized
            by predictive tier.
          </p>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="sticky top-16 z-40 border-y border-border/50 bg-background/95 backdrop-blur-sm">
        <div className="container py-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search attributes, sources, categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-border/50 rounded-sm text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-teal/50"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-sm border transition-colors ${
                showFilters
                  ? "border-teal/50 text-teal bg-teal/10"
                  : "border-border/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Filter className="h-3.5 w-3.5" />
              Filters
            </button>
            <div className="text-xs text-muted-foreground">
              {filtered.length.toLocaleString()} results
            </div>
          </div>

          {showFilters && (
            <div className="mt-3 pt-3 border-t border-border/30 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-1.5 bg-secondary/50 border border-border/50 rounded-sm text-sm text-foreground focus:outline-none focus:border-teal/50"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">
                  Tier
                </label>
                <select
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value)}
                  className="w-full px-3 py-1.5 bg-secondary/50 border border-border/50 rounded-sm text-sm text-foreground focus:outline-none focus:border-teal/50"
                >
                  {tiers.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">
                  Recommendation
                </label>
                <select
                  value={selectedRec}
                  onChange={(e) => setSelectedRec(e.target.value)}
                  className="w-full px-3 py-1.5 bg-secondary/50 border border-border/50 rounded-sm text-sm text-foreground focus:outline-none focus:border-teal/50"
                >
                  {recs.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Attribute List */}
      <section className="py-6">
        <div className="container">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-[60px_1fr_180px_100px_100px_120px] gap-4 px-5 py-2 text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border/30 mb-1">
            <div>#</div>
            <div>Attribute</div>
            <div>Source</div>
            <div>Tier</div>
            <div>Weight</div>
            <div>Action</div>
          </div>

          <div className="space-y-px">
            {paginated.map((attr) => {
              const isExpanded = expandedId === attr.id;
              const RecIcon = recIcons[attr.recommendation] || MinusCircle;
              const recColor = recColors[attr.recommendation] || "text-muted-foreground";

              return (
                <div
                  key={attr.id}
                  className="bg-card/50 border border-border/20 rounded-sm overflow-hidden hover:border-border/40 transition-colors"
                >
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : attr.id)}
                    className="w-full px-5 py-3 flex items-center gap-4 text-left md:grid md:grid-cols-[60px_1fr_180px_100px_100px_120px]"
                  >
                    <div className="text-xs font-mono text-muted-foreground">
                      {attr.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-foreground truncate">
                        {attr.attribute}
                      </div>
                      <div className="text-xs text-muted-foreground md:hidden mt-0.5">
                        {attr.category}
                      </div>
                    </div>
                    <div className="hidden md:block text-xs text-muted-foreground truncate">
                      {attr.source}
                    </div>
                    <div className="hidden md:block">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded-sm border ${
                          tierColors[attr.tier] || tierColors["Tier 4"]
                        }`}
                      >
                        {attr.tier}
                      </span>
                    </div>
                    <div className="hidden md:block">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-teal rounded-full"
                            style={{ width: `${Math.min(attr.weight * 100 * 50, 100)}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-muted-foreground w-10 text-right">
                          {(attr.weight * 100).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="hidden md:flex items-center gap-1.5">
                      <RecIcon className={`h-3.5 w-3.5 ${recColor}`} />
                      <span className={`text-xs ${recColor}`}>
                        {attr.recommendation}
                      </span>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-4 pt-1 border-t border-border/20">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                        <div className="bg-secondary/30 rounded-sm p-2">
                          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            Category
                          </div>
                          <div className="text-xs text-foreground mt-0.5">
                            {attr.category}
                          </div>
                        </div>
                        <div className="bg-secondary/30 rounded-sm p-2">
                          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            Data Source
                          </div>
                          <div className="text-xs text-foreground mt-0.5">
                            {attr.source}
                          </div>
                        </div>
                        <div className="bg-secondary/30 rounded-sm p-2">
                          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            Tier
                          </div>
                          <div className="text-xs text-foreground mt-0.5">
                            {attr.tier}
                          </div>
                        </div>
                        <div className="bg-secondary/30 rounded-sm p-2">
                          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            Weight
                          </div>
                          <div className="text-xs font-mono text-foreground mt-0.5">
                            {(attr.weight * 100).toFixed(4)}%
                          </div>
                        </div>
                      </div>
                      <div className="bg-secondary/20 rounded-sm p-3">
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                          Predictive Rationale
                        </div>
                        <p className="text-xs text-foreground/80 leading-relaxed">
                          {attr.rationale || "Empirically validated through historical backtesting against NYC commercial property transactions."}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/30">
              <div className="text-xs text-muted-foreground">
                Showing {(page - 1) * ITEMS_PER_PAGE + 1}–
                {Math.min(page * ITEMS_PER_PAGE, filtered.length)} of{" "}
                {filtered.length.toLocaleString()}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-xs font-medium rounded-sm border border-border/50 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 7) {
                    pageNum = i + 1;
                  } else if (page <= 4) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 3) {
                    pageNum = totalPages - 6 + i;
                  } else {
                    pageNum = page - 3 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`h-8 w-8 text-xs font-medium rounded-sm ${
                        page === pageNum
                          ? "bg-teal text-background"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 text-xs font-medium rounded-sm border border-border/50 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
