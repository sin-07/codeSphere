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
        return 'bg-[#052e16] border-[#00ff66]/20';
      case 2:
        return 'bg-[#15803d] border-[#00ff66]/40';
      case 3:
        return 'bg-[#22c55e] border-[#00ff66]/60 shadow-[0_0_6px_rgba(0,255,102,0.3)]';
      case 4:
        return 'bg-[#00ff66] border-[#00ff66] shadow-[0_0_12px_rgba(0,255,102,0.7)]';
      default:
        return 'bg-[#000000] border-[#131f13]';
    }
  };

  return (
    <div className="border border-[#1a2c1a] rounded-xl bg-[#040604]/90 backdrop-blur-md p-5 space-y-4 shadow-[0_4px_25px_rgba(0,0,0,0.8)]">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm text-white font-mono flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00ff66] shadow-[0_0_8px_#00ff66]" />
          <span><strong className="text-[#00ff66]">{totalCommits}</strong> verified git commits in the last year</span>
        </h4>
        <div className="text-xs font-mono text-[#86a686] flex items-center gap-1.5">
          <span>Less</span>
          <span className="w-2.5 h-2.5 rounded-sm bg-[#000000] border border-[#131f13]" />
          <span className="w-2.5 h-2.5 rounded-sm bg-[#052e16]" />
          <span className="w-2.5 h-2.5 rounded-sm bg-[#15803d]" />
          <span className="w-2.5 h-2.5 rounded-sm bg-[#22c55e]" />
          <span className="w-2.5 h-2.5 rounded-sm bg-[#00ff66] shadow-[0_0_6px_#00ff66]" />
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
                  className={`w-3 h-3 rounded-[2.5px] border cursor-pointer transition-all duration-200 hover:scale-125 hover:z-20 ${getCellColor(
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
        <div className="text-xs font-mono text-[#86a686] flex items-center justify-between pt-1 border-t border-[#1a2c1a]">
          <span>
            <strong className="text-[#00ff66]">{hoveredDay.count} commits</strong> on {hoveredDay.date}
          </span>
          <span className="text-[11px] text-[#86a686]">Activity Level: {hoveredDay.level}/4</span>
        </div>
      ) : (
        <div className="text-xs font-mono text-[#86a686] pt-1 border-t border-[#1a2c1a]">
          Hover over any matrix block to inspect daily commit density.
        </div>
      )}
    </div>
  );
}
