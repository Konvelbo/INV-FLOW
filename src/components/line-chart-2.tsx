"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Badge } from "@/src/components/ui/badge";
import { useInvoice } from "@/src/context/InvoiceContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardToolbar,
} from "@/src/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/src/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/src/components/ui/select";
import { TrendingUp } from "lucide-react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";

// Cashflow data for 12 months
const cashflowData: Array<{ month: string; value: number }> = [];

// Use custom or Tailwind standard colors: https://tailwindcss.com/docs/colors
const chartConfig = {
  revenus: {
    label: "Revenus",
    color: "var(--primary)",
  },
  depenses: {
    label: "Dépenses",
    color: "hsl(var(--destructive, 0 84.2% 60.2%))",
  },
  profit: {
    label: "Profit",
    color: "hsl(var(--chart-2, 160 60% 45%))",
  }
} satisfies ChartConfig;

// Custom Tooltip
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    color: string;
    payload: {
      month: string;
      [key: string]: any;
    };
  }>;
  label?: string;
}

const CustomTooltip = ({
  active,
  payload,
  currency,
}: TooltipProps & { currency: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl bg-card border border-border/50 text-foreground p-3 shadow-2xl backdrop-blur-md">
        <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2 font-sans">
          {payload[0].payload.month}
        </div>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-xs text-muted-foreground uppercase tracking-widest">{chartConfig[entry.dataKey as keyof typeof chartConfig]?.label || entry.dataKey}:</span>
            <span className="text-sm font-bold font-mono tracking-tight" style={{ color: entry.color }}>
              {entry.value.toLocaleString()} {currency}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Period configuration
const currentYear = new Date().getFullYear();
const prevYear = currentYear - 1;

const PERIODS = {
  "6m": {
    key: "6m",
    label: "6 mois",
    dateRange: `Jan 01 - Juin 30, ${currentYear}`,
  },
  "12m": {
    key: "12m",
    label: "12 mois",
    dateRange: `Jan 01 - Déc 31, ${currentYear}`,
  },
  "2y": {
    key: "2y",
    label: "2 ans",
    dateRange: `Jan 01, ${prevYear} - Déc 31, ${currentYear}`,
  },
} as const;

type PeriodKey = keyof typeof PERIODS;

export default function LineChart2({ externalData }: { externalData?: any[] }) {
  const [mounted, setMounted] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodKey>("12m");
  const { currency } = useInvoice();

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentYearStr = useMemo(() => new Date().getFullYear(), []);
  const prevYearStr = useMemo(() => currentYearStr - 1, [currentYearStr]);

  // Filter data based on selected period - MEMOIZED
  const filteredData = useMemo(() => {
    const baseData =
      externalData && externalData.length > 0
        ? externalData.map((d) => ({
          month: d.name.toUpperCase(),
          revenus: d.Revenus,
          depenses: d.Dépenses,
          profit: d.Profit,
        }))
        : [];

    switch (selectedPeriod) {
      case "6m":
        return baseData.slice(-6);
      case "12m":
        return baseData;
      case "2y":
        // Simulate 2 years data logic if needed, simplify for now
        return baseData;
      default:
        return baseData;
    }
  }, [externalData, selectedPeriod]);

  // Memoize aggregates
  const stats = useMemo(() => {
    const totalCash = filteredData.reduce((sum, item) => sum + (item.profit || 0), 0);
    const lastValue = filteredData[filteredData.length - 1]?.profit || 0;
    const previousValue = filteredData[filteredData.length - 2]?.profit || 0;
    const percentageChange =
      previousValue !== 0
        ? ((lastValue - previousValue) / Math.abs(previousValue)) * 100
        : (lastValue > 0 ? 100 : 0);

    return { totalCash, percentageChange };
  }, [filteredData]);

  if (!mounted) return null;

  // Get current period configuration
  const currentPeriod = PERIODS[selectedPeriod];

  const { totalCash, percentageChange } = stats;

  return (
    <div className="flex items-center justify-center ">
      <Card className="w-full bg-card border-border/50 backdrop-blur-xl shadow-2xl">
        <CardHeader className="border-0 min-h-auto pt-6 pb-4">
          <CardTitle className="text-lg font-bold flex items-center gap-3 text-foreground font-sans tracking-tight">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <TrendingUp className="w-5 h-5" />
            </div>
            Performance Financière
          </CardTitle>
          <CardToolbar>
            <Select
              value={selectedPeriod}
              onValueChange={(value) => setSelectedPeriod(value as PeriodKey)}
            >
              <SelectTrigger>{currentPeriod.label}</SelectTrigger>
              <SelectContent align="end">
                {Object.values(PERIODS).map((period) => (
                  <SelectItem key={period.key} value={period.key}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardToolbar>
        </CardHeader>

        <CardContent className="px-0">
          {/* Stats Section */}
          <div className="px-5 mb-8">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-3">
              {currentPeriod.dateRange}
            </div>
            <div className="flex items-center gap-4 overflow-hidden">
              <div className="text-4xl font-black text-foreground font-mono tracking-tighter truncate">
                {totalCash.toLocaleString()}
                <span className="text-sm ml-1 text-muted-foreground font-medium uppercase">
                  {currency}
                </span>
              </div>
              <Badge
                variant="success"
                className="bg-primary/10 text-primary border-primary/20 font-bold font-mono"
              >
                <TrendingUp className="size-3 mr-1" />
                {Math.abs(percentageChange).toFixed(2)}%
              </Badge>
            </div>
          </div>

          {/* Chart */}
          <div className="relative">
            <ChartContainer
              config={chartConfig}
              className="h-[300px] w-full ps-1.5 pe-2.5 overflow-visible [&_.recharts-curve.recharts-tooltip-cursor]:stroke-initial"
            >
              <ComposedChart
                data={filteredData}
                margin={{
                  top: 25,
                  right: 25,
                  left: 0,
                  bottom: 25,
                }}
                style={{ overflow: "visible" }}
              >
                {/* Gradient */}
                <defs>
                  <linearGradient
                    id="cashflowGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={chartConfig.revenus.color}
                      stopOpacity={0.15}
                    />
                    <stop
                      offset="100%"
                      stopColor={chartConfig.revenus.color}
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <filter
                    id="dotShadow"
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                  >
                    <feDropShadow
                      dx="2"
                      dy="2"
                      stdDeviation="3"
                      floodColor="rgba(0,0,0,0.5)"
                    />
                  </filter>
                </defs>

                <CartesianGrid
                  strokeDasharray="4 12"
                  stroke="var(--input)"
                  strokeOpacity={1}
                  horizontal={true}
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  tickMargin={12}
                  dy={10}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#64748b" }}
                  tickFormatter={(value) => `${value / 1000}K`}
                  domain={[0, "dataMax + 1000"]}
                  tickCount={6}
                  tickMargin={12}
                />

                <ChartTooltip
                  content={<CustomTooltip currency={currency} />}
                  cursor={{ stroke: "rgba(255,255,255,0.2)", strokeWidth: 1, strokeDasharray: "3 3" }}
                />

                {/* Gradient areas */}
                <Area
                  type="monotone"
                  dataKey="revenus"
                  stroke="transparent"
                  fill="url(#cashflowGradient)"
                  strokeWidth={0}
                  dot={false}
                />

                {/* Main lines */}
                <Line
                  type="monotone"
                  dataKey="revenus"
                  stroke={chartConfig.revenus.color}
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, fill: chartConfig.revenus.color, stroke: "white", strokeWidth: 2, filter: "url(#dotShadow)" }}
                />
                <Line
                  type="monotone"
                  dataKey="depenses"
                  stroke={chartConfig.depenses.color}
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, fill: chartConfig.depenses.color, stroke: "white", strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke={chartConfig.profit.color}
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, fill: chartConfig.profit.color, stroke: "white", strokeWidth: 2 }}
                />
              </ComposedChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
