"use client";

import React, { useState, useEffect, useMemo } from "react";
import { formatGBP } from "@/lib/rates";

interface HistoryPoint {
  date: string;
  label: string;
  goldGram: number;
  silverGram: number;
  goldOunce: number;
  silverOunce: number;
  goldTola: number;
}

export default function PriceHistoryChart({
  liveGoldGram = 93.47,
  liveSilverGram = 1.2,
}: {
  liveGoldGram?: number;
  liveSilverGram?: number;
}) {
  const [metal, setMetal] = useState<"gold" | "silver">("gold");
  const [timeframe, setTimeframe] = useState<7 | 30 | 180 | 365>(30);
  const [unit, setUnit] = useState<"gram" | "tola" | "ounce">("gram");
  const [series, setSeries] = useState<HistoryPoint[]>([]);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    fetch(
      `/api/rates/history?days=${timeframe}&gold=${liveGoldGram}&silver=${liveSilverGram}`
    )
      .then((r) => r.json())
      .then((res) => {
        if (active && res.success && Array.isArray(res.series)) {
          setSeries(res.series);
          setHoverIdx(null);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [timeframe, liveGoldGram, liveSilverGram]);

  const unitMultiplier = useMemo(() => {
    if (unit === "tola") return 11.6638;
    if (unit === "ounce") return 31.1035;
    return 1;
  }, [unit]);

  const unitLabel = useMemo(() => {
    if (unit === "tola") return "per Tola (11.66g)";
    if (unit === "ounce") return "per Troy Ounce";
    return "per Gram (24K)";
  }, [unit]);

  const values = useMemo(() => {
    return series.map((pt) => {
      const base = metal === "gold" ? pt.goldGram : pt.silverGram;
      return Number((base * unitMultiplier).toFixed(2));
    });
  }, [series, metal, unitMultiplier]);

  const stats = useMemo(() => {
    if (values.length === 0) {
      const fallback = (metal === "gold" ? liveGoldGram : liveSilverGram) * unitMultiplier;
      return {
        min: fallback,
        max: fallback,
        avg: fallback,
        first: fallback,
        last: fallback,
        changeAmt: 0,
        changePct: 0,
      };
    }
    const min = Math.min(...values);
    const max = Math.max(...values);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const first = values[0];
    const last = values[values.length - 1];
    const changeAmt = last - first;
    const changePct = first > 0 ? (changeAmt / first) * 100 : 0;

    return { min, max, avg, first, last, changeAmt, changePct };
  }, [values, metal, liveGoldGram, liveSilverGram, unitMultiplier]);

  const activeIdx = hoverIdx !== null && series[hoverIdx] ? hoverIdx : series.length - 1;
  const activePoint = series[activeIdx];
  const activeValue = values[activeIdx] ?? stats.last;

  // Build SVG path coordinates (width: 760, height: 220)
  const chartW = 760;
  const chartH = 220;
  const padX = 14;
  const padY = 20;

  const { linePath, areaPath, coords } = useMemo(() => {
    if (values.length < 2) {
      return { linePath: "", areaPath: "", coords: [] as { x: number; y: number }[] };
    }
    const range = Math.max(stats.max - stats.min, 0.01);
    const usableW = chartW - padX * 2;
    const usableH = chartH - padY * 2;

    const pts = values.map((v, i) => {
      const x = padX + (i / (values.length - 1)) * usableW;
      const y = padY + usableH - ((v - stats.min) / range) * usableH;
      return { x, y };
    });

    const line = pts
      .map((p, idx) => `${idx === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
      .join(" ");
    const area = `${line} L${pts[pts.length - 1].x.toFixed(1)},${chartH} L${pts[0].x.toFixed(1)},${chartH} Z`;

    return { linePath: line, areaPath: area, coords: pts };
  }, [values, stats.min, stats.max]);

  const isPositive = stats.changePct >= 0;
  const strokeColor = metal === "gold" ? "#8b6914" : "#475569";

  return (
    <section className="bg-white border border-[#dfcca6] rounded-2xl p-4 sm:p-6 shadow-xs">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#dfcca6]/50">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#faf5ea] text-[#8b6914] border border-[#dfcca6]">
              London Fix Historical Index
            </span>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                isPositive
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-rose-50 text-rose-700 border-rose-200"
              }`}
            >
              {isPositive ? "+" : ""}
              {stats.changePct.toFixed(2)}% ({timeframe}D)
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-serif font-bold text-slate-900 mt-1.5">
            {metal === "gold" ? "24K Fine Gold" : "999 Fine Silver"} Price Trend ({unitLabel})
          </h2>
        </div>

        {/* Switchers: Metal + Unit + Timeframe */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Metal Toggle */}
          <div className="inline-flex bg-[#faf8f5] p-1 rounded-xl border border-[#dfcca6]">
            <button
              type="button"
              onClick={() => setMetal("gold")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                metal === "gold"
                  ? "bg-[#8b6914] text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Gold
            </button>
            <button
              type="button"
              onClick={() => setMetal("silver")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                metal === "silver"
                  ? "bg-slate-800 text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Silver
            </button>
          </div>

          {/* Unit Selector */}
          <div className="inline-flex bg-[#faf8f5] p-1 rounded-xl border border-[#dfcca6]">
            {(["gram", "tola", "ounce"] as const).map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setUnit(u)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium capitalize transition-all cursor-pointer ${
                  unit === u
                    ? "bg-[#faf5ea] text-[#8b6914] font-bold border border-[#dfcca6]"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {u}
              </button>
            ))}
          </div>

          {/* Timeframe Selector */}
          <div className="inline-flex bg-[#faf8f5] p-1 rounded-xl border border-[#dfcca6]">
            {([7, 30, 180, 365] as const).map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  timeframe === tf
                    ? "bg-[#8b6914] text-white font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tf === 7 ? "7D" : tf === 30 ? "1M" : tf === 180 ? "6M" : "1Y"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main KPI Spotlight */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-b border-[#dfcca6]/40">
        <div>
          <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-medium">
            {hoverIdx !== null ? activePoint?.label : "Current Value"}
          </p>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
            {formatGBP(activeValue)}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-medium">High ({timeframe}D)</p>
          <p className="text-sm sm:text-base font-semibold text-emerald-700 mt-1">
            {formatGBP(stats.max)}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-medium">Low ({timeframe}D)</p>
          <p className="text-sm sm:text-base font-semibold text-rose-700 mt-1">
            {formatGBP(stats.min)}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-medium">Average Price</p>
          <p className="text-sm sm:text-base font-semibold text-slate-700 mt-1">
            {formatGBP(stats.avg)}
          </p>
        </div>
      </div>

      {/* SVG Interactive Chart Canvas */}
      <div className="relative mt-4 w-full h-[220px]">
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center z-20">
            <div className="flex items-center gap-2 text-xs text-[#8b6914] font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8b6914] animate-ping" />
              Loading chart data...
            </div>
          </div>
        )}

        <svg
          viewBox={`0 0 ${chartW} ${chartH}`}
          className="w-full h-full overflow-visible select-none"
          preserveAspectRatio="none"
          onMouseLeave={() => setHoverIdx(null)}
        >
          <defs>
            <linearGradient id="chartGoldGradLight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#caa771" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#caa771" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="chartSilverGradLight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1={padX}
            y1={padY}
            x2={chartW - padX}
            y2={padY}
            stroke="#dfcca6"
            strokeOpacity="0.4"
            strokeDasharray="4 4"
          />
          <line
            x1={padX}
            y1={chartH / 2}
            x2={chartW - padX}
            y2={chartH / 2}
            stroke="#dfcca6"
            strokeOpacity="0.4"
            strokeDasharray="4 4"
          />
          <line
            x1={padX}
            y1={chartH - padY}
            x2={chartW - padX}
            y2={chartH - padY}
            stroke="#dfcca6"
            strokeOpacity="0.4"
            strokeDasharray="4 4"
          />

          {/* Area Fill */}
          {areaPath && (
            <path
              d={areaPath}
              fill={metal === "gold" ? "url(#chartGoldGradLight)" : "url(#chartSilverGradLight)"}
            />
          )}

          {/* Trend Line */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke={strokeColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Interactive Hover Point and Crosshair */}
          {coords[activeIdx] && (
            <g>
              <line
                x1={coords[activeIdx].x}
                y1={padY}
                x2={coords[activeIdx].x}
                y2={chartH}
                stroke="#8b6914"
                strokeOpacity="0.6"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <circle
                cx={coords[activeIdx].x}
                cy={coords[activeIdx].y}
                r="5"
                fill="#8b6914"
                stroke="#ffffff"
                strokeWidth="2"
              />
            </g>
          )}

          {/* Transparent Hover Hitboxes */}
          {coords.map((c, i) => {
            const stepW = chartW / coords.length;
            return (
              <rect
                key={i}
                x={Math.max(0, c.x - stepW / 2)}
                y="0"
                width={stepW}
                height={chartH}
                fill="transparent"
                className="cursor-crosshair"
                onMouseEnter={() => setHoverIdx(i)}
                onTouchStart={() => setHoverIdx(i)}
              />
            );
          })}
        </svg>
      </div>

      {/* Footer Meta */}
      <div className="flex items-center justify-between text-[11px] text-zinc-500 mt-3 pt-3 border-t border-[#dfcca6]/30">
        <span>Source: London Bullion Wholesale Market (LBMA Fixings)</span>
        <span className="font-medium text-[#8b6914]">All rates shown in GBP (£)</span>
      </div>
    </section>
  );
}
