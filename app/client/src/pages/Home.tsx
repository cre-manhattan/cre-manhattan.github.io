/*
 * Design: Obsidian Atlas — Dark Cartographic Intelligence Platform
 * Home/Dashboard: Hero with Manhattan skyline, key stats, top properties preview
 */
import Navbar from "@/components/Navbar";
import { DATA_URLS } from "@/lib/dataUrls";
import { Link } from "wouter";
import { useEffect, useState } from "react";
import {
  Building2,
  TrendingUp,
  Target,
  DollarSign,
  ArrowRight,
  Database,
  Users,
  BarChart3,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

const googleMapsUrl = (address: string, zip: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${address}, New York, NY ${String(zip || "").replace(/\.0$/, "")}`
  )}`;

interface Stats {
  auc: number;
  accuracy: number;
  totalProperties: number;
  propertiesScored: number;
  totalAttributes: number;
  uboIdentified: number;
  totalPortfolioValue: string;
  medianPropertyValue: string;
  predictionWindow: string;
  lastRefresh: string;
  dataSources: number;
  featuresUsed: number;
}

interface Property {
  id: string;
  address: string;
  zipcode: string;
  buildingClassDesc: string;
  owner: string;
  saleProbability: number;
  guesstimate: string;
}

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const duration = 1500;
    const steps = 40;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);
  return <>{count.toLocaleString()}{suffix}</>;
}

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    fetch(DATA_URLS.stats).then((r) => r.json()).then(setStats);
    fetch(DATA_URLS.properties).then((r) => r.json()).then((data) => {
      setProperties(data.sort((a: Property, b: Property) => b.saleProbability - a.saleProbability).slice(0, 8));
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663273828100/TGXiHvr84EAkLUDM6xxp9j/hero-manhattan-skyline-ACdSFmXsLwRH4wqMaMNGyd.webp)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

        <div className="relative container pt-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-teal/10 border border-teal/30 mb-6">
              <div className="h-1.5 w-1.5 rounded-full bg-teal animate-pulse" />
              <span className="text-xs font-medium text-teal uppercase tracking-wider">
                Live Predictions — {stats?.predictionWindow || "Loading..."}
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.05] mb-6">
              Manhattan
              <br />
              <span className="text-teal">Off-Market</span>
              <br />
              Intelligence
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mb-8">
              Predictive analytics engine scoring {stats?.totalProperties?.toLocaleString() || "5,927"} commercial
              properties across {stats?.totalAttributes?.toLocaleString() || "1,500"} attributes to identify
              high-probability off-market transactions before they happen.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/properties"
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal text-background font-semibold text-sm rounded-sm hover:bg-teal/90 transition-colors"
              >
                View Target Properties
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/attributes"
                className="inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground font-medium text-sm rounded-sm hover:bg-secondary/50 transition-colors"
              >
                Explore 1,500 Attributes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative -mt-20 z-10">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border/50 rounded-sm overflow-hidden border border-border/50">
            {[
              {
                icon: Target,
                value: stats?.propertiesScored || 34,
                label: "Target Properties",
                suffix: "",
              },
              {
                icon: DollarSign,
                value: 948,
                label: "Portfolio Value",
                suffix: "M",
                prefix: "$",
              },
              {
                icon: BarChart3,
                value: Math.round((stats?.auc || 0.887) * 100),
                label: "Model AUC",
                suffix: "%",
              },
              {
                icon: Database,
                value: stats?.totalAttributes || 1500,
                label: "Predictive Attributes",
                suffix: "",
              },
            ].map((stat, i) => (
              <div key={i} className="bg-card p-6 flex flex-col items-center text-center">
                <stat.icon className="h-5 w-5 text-teal mb-3" />
                <div className="text-3xl font-bold text-foreground font-mono">
                  {stat.prefix || ""}
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Properties Preview */}
      <section className="py-24">
        <div className="container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Highest Probability Targets
              </h2>
              <p className="text-muted-foreground">
                Properties with 80%+ predicted sale probability in the next 6 months
              </p>
            </div>
            <Link
              href="/properties"
              className="hidden md:inline-flex items-center gap-2 text-sm text-teal hover:text-teal/80 font-medium"
            >
              View all {stats?.propertiesScored || 34} properties
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border/30 rounded-sm overflow-hidden border border-border/50">
            {properties.map((prop, i) => (
              <div
                key={prop.id || i}
                className="bg-card p-5 hover:bg-secondary/30 transition-colors group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`px-2 py-0.5 rounded-sm text-xs font-mono font-bold ${
                      prop.saleProbability >= 0.95
                        ? "bg-teal/20 text-teal"
                        : prop.saleProbability >= 0.85
                        ? "bg-teal/10 text-teal-dim"
                        : "bg-gold/10 text-gold"
                    }`}
                  >
                    {(prop.saleProbability * 100).toFixed(1)}%
                  </div>
                  <Building2 className="h-4 w-4 text-muted-foreground group-hover:text-teal transition-colors" />
                </div>

                <a
                  href={googleMapsUrl(prop.address, prop.zipcode)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-sm font-semibold text-foreground mb-1 leading-tight hover:text-teal transition-colors flex items-center gap-1 group/addr"
                >
                  {prop.address}
                  <ExternalLink className="h-2.5 w-2.5 text-muted-foreground opacity-0 group-hover/addr:opacity-100 transition-opacity shrink-0" />
                </a>
                <p className="text-xs text-muted-foreground mb-3">
                  {prop.buildingClassDesc || "Commercial"}
                </p>

                <div className="flex items-baseline justify-between pt-3 border-t border-border/50">
                  <span className="text-lg font-bold font-mono text-foreground">
                    {prop.guesstimate}
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Est. Value
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Model Performance Section */}
      <section
        className="py-24 relative"
        style={{
          backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663273828100/TGXiHvr84EAkLUDM6xxp9j/data-pattern-bg-5TVkLFYXa5zSweD5C8MSXy.webp)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-background/85" />
        <div className="relative container">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Model Performance
          </h2>
          <p className="text-muted-foreground mb-10 max-w-2xl">
            Validated against 650,000+ property observations across 11 NYC Open Data sources
            using time-series cross-validation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                metric: "AUC Score",
                value: "0.887",
                desc: "Area Under the ROC Curve — measures the model's ability to distinguish properties that will sell from those that won't.",
                bar: 88.7,
              },
              {
                metric: "Accuracy",
                value: "91.1%",
                desc: "Overall prediction accuracy across all time-series cross-validation folds.",
                bar: 91.1,
              },
              {
                metric: "Top-Decile Lift",
                value: "5.0x",
                desc: "The top 10% of scored properties are 5x more likely to sell than a randomly selected property.",
                bar: 100,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-card/80 border border-border/50 rounded-sm p-6"
              >
                <div className="text-xs uppercase tracking-wider text-teal mb-2 font-medium">
                  {item.metric}
                </div>
                <div className="text-4xl font-bold font-mono text-foreground mb-3">
                  {item.value}
                </div>
                <div className="h-1 bg-secondary rounded-full mb-4 overflow-hidden">
                  <div
                    className="h-full bg-teal rounded-full transition-all duration-1000"
                    style={{ width: `${item.bar}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-24">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Building2,
                title: "34 Target Properties",
                desc: "Off-market commercial assets with 80%+ predicted sale probability and detailed pricing estimates.",
                href: "/properties",
              },
              {
                icon: Database,
                title: "1,500 Attributes",
                desc: "Empirically weighted predictive signals across 15 categories, each validated against historical data.",
                href: "/attributes",
              },
              {
                icon: Users,
                title: "UBO Profiles",
                desc: "Ultimate Beneficial Owners identified with contact information and DISC personality analysis.",
                href: "/profiles",
              },
            ].map((card, i) => (
              <Link
                key={i}
                href={card.href}
                className="group bg-card border border-border/50 rounded-sm p-8 hover:border-teal/30 transition-all"
              >
                <card.icon className="h-8 w-8 text-teal mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-teal transition-colors">
                  {card.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {card.desc}
                </p>
                <span className="inline-flex items-center gap-1 text-sm text-teal font-medium">
                  Explore <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <RefreshCw className="h-3.5 w-3.5" />
            Last data refresh: {stats?.lastRefresh || "2026-04-23"} — {stats?.dataSources || 11} NYC Open Data sources
          </div>
          <div className="text-xs text-muted-foreground">
            Predictive model for informational purposes only. Not investment advice.
          </div>
        </div>
      </footer>
    </div>
  );
}
