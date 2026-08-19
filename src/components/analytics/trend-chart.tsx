import {
  Area,
  AreaChart,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { TrendPoint } from "@/lib/analytics-data";

export function Sparkline({ points, stroke }: { points: TrendPoint[]; stroke: string }) {
  const id = `spark-${stroke.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <div className="h-16 w-full">
      <ResponsiveContainer width="99%" height="100%" debounce={1}>
        <AreaChart data={points} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity={0.35} />
              <stop offset="100%" stopColor={stroke} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Tooltip
            cursor={{ stroke: "var(--color-border)" }}
            contentStyle={{
              background: "var(--color-popover)",
              border: "1px solid var(--color-border)",
              borderRadius: 8,
              fontSize: 12,
              color: "var(--color-popover-foreground)",
            }}
          />
          <Area type="monotone" dataKey="value" stroke={stroke} strokeWidth={2} fill={`url(#${id})`} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DualTrendChart({
  points,
  primaryLabel,
  secondaryLabel,
}: {
  points: TrendPoint[];
  primaryLabel: string;
  secondaryLabel: string;
}) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="99%" height="100%" debounce={1}>
        <ComposedChart data={points} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <defs>
            <linearGradient id="macroPrimary" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.4} />
              <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={11} stroke="var(--color-muted-foreground)" />
          <YAxis yAxisId="left" tickLine={false} axisLine={false} fontSize={11} stroke="var(--color-muted-foreground)" />
          <YAxis
            yAxisId="right"
            orientation="right"
            width={40}
            domain={["dataMin - 8", "dataMax + 8"]}
            tickLine={false}
            axisLine={false}
            fontSize={11}
            stroke="var(--color-muted-foreground)"
          />
          <Tooltip
            contentStyle={{
              background: "var(--color-popover)",
              border: "1px solid var(--color-border)",
              borderRadius: 8,
              fontSize: 12,
              color: "var(--color-popover-foreground)",
            }}
          />
          <Area
            yAxisId="left"
            type="monotone"
            name={primaryLabel}
            dataKey="value"
            stroke="var(--color-chart-1)"
            strokeWidth={2}
            fill="url(#macroPrimary)"
          />
          <Line
            yAxisId="right"
            type="monotone"
            name={secondaryLabel}
            dataKey="secondary"
            stroke="var(--color-chart-2)"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
