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
        return 'bg-[#0e4429] border-[#006d32]/50';
      case 2:
        return 'bg-[#006d32] border-[#26a641]/50';
      case 3:
        return 'bg-[#26a641] border-[#39d353]/50';
      case 4:
        return 'bg-[#39d353] border-emerald-300 shadow-[0_0_8px_rgba(57,211,83,0.5)]';
      default:
        return 'bg-[#161b22] border-[#21262d]';
    }
  };

  return (
    <div className="border border-[#30363d] rounded-xl bg-[#0d1117] p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm text-white">
          {totalCommits} contributions in the last year
        </h4>
        <div className="text-xs text-[#8b949e] flex items-center gap-1.5">
          <span>Less</span>
          <span className="w-2.5 h-2.5 rounded-sm bg-[#161b22] border border-[#21262d]" />
          <span className="w-2.5 h-2.5 rounded-sm bg-[#0e4429]" />
          <span className="w-2.5 h-2.5 rounded-sm bg-[#006d32]" />
          <span className="w-2.5 h-2.5 rounded-sm bg-[#26a641]" />
          <span className="w-2.5 h-2.5 rounded-sm bg-[#39d353]" />
          <span>More</span>
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="inline-flex gap-1">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1">
              {week.map((day, dIdx) => (
                <div
                  key={dIdx}
                  onMouseEnter={() => setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  className={`w-3 h-3 rounded-sm border transition-all cursor-pointer ${getCellColor(day.level)} hover:scale-125 hover:z-10`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip detail bar */}
      <div className="h-4 text-xs text-[#8b949e]">
        {hoveredDay ? (
          <span>
            <strong className="text-white">{hoveredDay.count} contributions</strong> on {new Date(hoveredDay.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        ) : (
          <span>Hover over squares to inspect daily activity</span>
        )}
      </div>
    </div>
  );
}
