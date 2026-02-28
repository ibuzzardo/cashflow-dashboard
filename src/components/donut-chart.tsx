import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import type { DonutPoint } from "@/types";

type DonutChartProps = {
  data: DonutPoint[];
};

const COLORS = ["#0F766E", "#334155", "#F59E0B", "#DC2626", "#14B8A6", "#64748B"];

const DonutChart = ({ data }: DonutChartProps): JSX.Element => {
  return (
    <section className="rounded-xl border border-muted/70 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <h3 className="text-base font-semibold">Spending by Category</h3>
      <div className="mt-4 h-64 w-full">
        {data.length === 0 ? (
          <p className="flex h-full items-center justify-center text-sm text-muted-foreground">No expense data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="category" innerRadius={58} outerRadius={92} paddingAngle={2}>
                {data.map((entry, index) => (
                  <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
};

export default DonutChart;
