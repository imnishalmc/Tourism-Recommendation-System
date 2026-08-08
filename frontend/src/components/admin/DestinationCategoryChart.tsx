import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface DestinationCategoryChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

export default function DestinationCategoryChart({ data }: DestinationCategoryChartProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <h2 className="font-bold">Destination categories</h2>
        <p className="text-sm text-muted-foreground">Published listings grouped by travel category</p>
      </div>
      <div className="mt-5">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 12, right: 20, left: 20, bottom: 88 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#64748b" angle={-22} textAnchor="end" interval={0} height={100} tick={{ fontSize: 12 }} />
            <YAxis stroke="#64748b" allowDecimals={false} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "#ffffff", 
                border: "1px solid #e2e8f0",
                borderRadius: "8px"
              }}
            />
            <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
