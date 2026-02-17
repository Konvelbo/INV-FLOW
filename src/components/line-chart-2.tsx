"use client";

import React, { useState } from "react";
import { Badge } from "@/src/components/ui/badge";
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
const cashflowData = [
  // { month: "JAN", value: 2100 },
  // { month: "FEB", value: 2300 },
  // { month: "MAR", value: 1900 },
  // { month: "APR", value: 4800 },
  // { month: "MAY", value: 5200 },
  // { month: "JUN", value: 8900 },
  // { month: "JUL", value: 6200 },
  // { month: "AUG", value: 7100 },
  // { month: "SEP", value: 9400 },
  // { month: "OCT", value: 10200 },
  // { month: "NOV", value: 11100 },
  // { month: "DEC", value: 11800 },
];

// Use custom or Tailwind standard colors: https://tailwindcss.com/docs/colors
const chartConfig = {
  value: {
    label: "Revenu",
    color: "var(--color-blue-500)",
  },
} satisfies ChartConfig;

// Custom Tooltip
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <>
        <div className="rounded-xl bg-slate-900 border border-slate-800 text-white p-3 shadow-2xl backdrop-blur-md">
          <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1">
            Total HT:
          </div>
          <div className="text-sm font-bold text-emerald-400">
            {payload[0].value.toLocaleString()} FCFA
          </div>
        </div>
      </>
    );
  }
  return null;
};

// Period configuration
const PERIODS = {
  "6m": {
    key: "6m",
    label: "6 months",
    dateRange: "Jul 01 - Dec 31, 2024",
  },
  "12m": {
    key: "12m",
    label: "12 months",
    dateRange: "Jan 01 - Dec 31, 2024",
  },
  "2y": {
    key: "2y",
    label: "2 years",
    dateRange: "Jan 01, 2023 - Dec 31, 2024",
  },
} as const;

type PeriodKey = keyof typeof PERIODS;

export default function LineChart2({ externalData }: { externalData?: any[] }) {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodKey>("12m");

  // Filter data based on selected period
  const getFilteredData = () => {
    const baseData =
      externalData && externalData.length > 0
        ? externalData.map((d) => ({
            month: d.name.toUpperCase(),
            value: d.total,
          }))
        : cashflowData;

    switch (selectedPeriod) {
      case "6m":
        return baseData.slice(-6);
      case "12m":
        return baseData;
      case "2y":
        // Simulate 2 years data by duplicating and modifying the current year
        const previousYear = baseData.map((item) => ({
          month: `${item.month} '23`,
          value: Math.round(item.value * 0.85), // 15% lower for previous year
        }));
        const currentYear = baseData.map((item) => ({
          month: `${item.month} '24`,
          value: item.value,
        }));
        return [...previousYear, ...currentYear];
      default:
        return baseData;
    }
  };

  const filteredData = getFilteredData();

  // Get current period configuration
  const currentPeriod = PERIODS[selectedPeriod];

  // Calculate total and percentage based on filtered data
  const totalCash = filteredData.reduce((sum, item) => sum + item.value, 0);
  const lastValue = filteredData[filteredData.length - 1]?.value || 0;
  const previousValue = filteredData[filteredData.length - 2]?.value || 0;
  const percentageChange =
    previousValue > 0 ? ((lastValue - previousValue) / previousValue) * 100 : 0;

  return (
    <div className="flex items-center justify-center p-6 lg:p-8">
      <Card className="w-full bg-slate-900/40 border-slate-800 backdrop-blur-md">
        <CardHeader className="border-0 min-h-auto pt-6 pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
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
            <div className="text-xs font-medium text-muted-foreground tracking-wide mb-2">
              {currentPeriod.dateRange}
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl font-bold">
                {totalCash.toLocaleString()} FCFA
              </div>
              <Badge variant="success" appearance="light">
                <TrendingUp className="size-3" />
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
                      stopColor={chartConfig.value.color}
                      stopOpacity={0.15}
                    />
                    <stop
                      offset="100%"
                      stopColor={chartConfig.value.color}
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
                  content={<CustomTooltip />}
                  cursor={{
                    stroke: chartConfig.value.color,
                    strokeWidth: 1,
                    strokeDasharray: "none",
                  }}
                />

                {/* Gradient area */}
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="transparent"
                  fill="url(#cashflowGradient)"
                  strokeWidth={0}
                  dot={false}
                />

                {/* Main cashflow line */}
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={chartConfig.value.color}
                  strokeWidth={3}
                  dot={false}
                  activeDot={{
                    r: 6,
                    fill: chartConfig.value.color,
                    stroke: "white",
                    strokeWidth: 2,
                    filter: "url(#dotShadow)",
                  }}
                />
              </ComposedChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
