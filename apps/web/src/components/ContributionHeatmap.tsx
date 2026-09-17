'use client';

import React, { useState } from 'react';

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface ContributionHeatmapProps {
  contributions: ContributionDay[];
  totalCommits?: number;
}

export function ContributionHeatmap({ contributions, totalCommits = 1248 }: ContributionHeatmapProps) {
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);

  // 53 weeks x 7 days
  const weeks: ContributionDay[][] = [];
  let currentWeek: ContributionDay[] = [];

  contributions.forEach((day, index) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || index === contributions.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  const getCellColor = (level: number) => {
    switch (level) {
      case 1:
        return 'bg-emerald-950/70 border-emerald-500/20';
      case 2:
        return 'bg-emerald-800/80 border-emerald-500/30';
      case 3:
        return 'bg-emerald-600 border-emerald-500/50';
      case 4:
        return 'bg-emerald-400 border-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.4)]';
      default:
        return 'bg-[#0c120e] border-emerald-500/10';
    }
  };

  return (
    <div className="border border-emerald-500/15 rounded-xl bg-[#080d0a]/85 backdrop-blur-xl p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm text-white font-mono flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span><strong className="text-emerald-400">{totalCommits}</strong> verified git commits in the last year</span>
        </h4>
        <div className="text-xs font-mono text-[#91a897] flex items-center gap-1.5">
          <span>Less</span>
          <span className="w-2.5 h-2.5 rounded-sm bg-[#0c120e] border border-emerald-500/10" />
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-950/70" />
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-800/80" />
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600" />
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.4)]" />
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-2 no-scrollbar">
        <div className="inline-flex gap-[3px]">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-[3px]">
              {week.map((day, dIdx) => (
                <div
                  key={dIdx}
                  onMouseEnter={() => setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  className={`w-3 h-3 rounded-[2.5px] border cursor-pointer transition-all duration-150 hover:scale-125 hover:z-20 ${getCellColor(
                    day.level
                  )}`}
                  title={`${day.date}: ${day.count} commits`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {hoveredDay ? (
        <div className="text-xs font-mono text-[#91a897] flex items-center justify-between pt-1 border-t border-emerald-500/10">
          <span>
            <strong className="text-emerald-400">{hoveredDay.count} commits</strong> on {hoveredDay.date}
          </span>
          <span className="text-[11px] text-[#91a897]">Activity Level: {hoveredDay.level}/4</span>
        </div>
      ) : (
        <div className="text-xs font-mono text-[#91a897] pt-1 border-t border-emerald-500/10">
          Hover over any matrix block to inspect daily commit density.
        </div>
      )}
    </div>
  );
}
