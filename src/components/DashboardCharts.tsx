
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip as ReTooltip, Cell, PieChart, Pie } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const categoryData = [
  { name: 'Complaint', value: 45, color: '#1F509F' },
  { name: 'Academic', value: 30, color: '#E4B32E' },
  { name: 'Facilities', value: 25, color: '#64748b' },
  { name: 'Appreciation', value: 20, color: '#22c55e' },
  { name: 'Recs', value: 15, color: '#ec4899' },
];

const trendData = [
  { month: 'Jun', suggestions: 40 },
  { month: 'Jul', suggestions: 55 },
  { month: 'Aug', suggestions: 45 },
  { month: 'Sep', suggestions: 70 },
  { month: 'Oct', suggestions: 90 },
  { month: 'Nov', suggestions: 120 },
];

export function CategoryStats() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <ReTooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-2 mt-4">
        {categoryData.map(item => (
          <div key={item.name} className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
            <span className="text-muted-foreground truncate">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SuggestionTrend() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" />
          <YAxis />
          <ReTooltip />
          <Bar dataKey="suggestions" fill="#1F509F" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
