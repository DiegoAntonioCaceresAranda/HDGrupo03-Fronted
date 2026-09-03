import type { FC, ReactElement } from "react";
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  percentageChange?: number;
  caption?: string;
}

const StatCard: FC<StatCardProps> = ({ title, value, icon: Icon, percentageChange, caption }): ReactElement => {
  const isPositive = (percentageChange ?? 0) >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className="admin-card rounded-4 p-4 border h-100 d-flex flex-column justify-content-between">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <h3 style={{ fontFamily: "var(--admin-font-display)", fontSize: 18, fontWeight: 600, color: "var(--admin-on-surface-variant)" }}>
          {title}
        </h3>
        <div
          className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
          style={{ width: 40, height: 40, backgroundColor: "var(--admin-secondary-container)" }}
        >
          <Icon size={20} color="var(--admin-secondary)" />
        </div>
      </div>
      <div>
        <div className="mb-2" style={{ fontFamily: "var(--admin-font-display)", fontSize: 32, lineHeight: 1.1, fontWeight: 700, color: "var(--admin-primary)" }}>
          {value}
        </div>
        <div className="d-flex align-items-center gap-2">
          {percentageChange !== undefined && (
            <span
              className="d-inline-flex align-items-center px-2 py-1 rounded-pill"
              style={{
                backgroundColor: isPositive
                  ? "color-mix(in srgb, var(--admin-secondary-container) 80%, transparent)"
                  : "#fdecea",
                color: isPositive ? "var(--admin-secondary)" : "#b3261e",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              <TrendIcon size={14} className="me-1" />
              {isPositive ? "+" : ""}
              {percentageChange.toFixed(1)}%
            </span>
          )}
          <span style={{ color: "var(--admin-on-surface-variant)", fontSize: 13 }}>
            {caption ?? "vs. periodo anterior"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
