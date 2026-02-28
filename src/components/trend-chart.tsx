import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { TrendPoint } from "@/types";

type TrendChartProps = {
  data: TrendPoint[];
};

const TrendChart = ({ data }: TrendChartProps): JSX.Element => {
  return (
    <section className="rounded-xl border border-muted/70 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <h3 className="text-base font-semibold">Balance Trend</h3>
      <div className="mt-4 h-64 w-full">
        {data.length === 0 ? (
          <p className="flex h-full items-center justify-center text-sm text-muted-foreground">No trend data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
              <Line type="monotone" dataKey="income" stroke="#0F766E" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="expense" stroke="#DC2626" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="balance" stroke="#334155" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
};

export default TrendChart;
