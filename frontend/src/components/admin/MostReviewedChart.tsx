import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface MostReviewedChartProps {
  data: Array<{
    id: number;
    name: string;
    district: string;
    review_total: number;
  }>;
}

export default function MostReviewedChart({ data }: MostReviewedChartProps) {
  const chartData = data.map(item => ({
    name: item.name,
    reviews: item.review_total,
  }));

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <h2 className="font-bold">Most reviewed destinations this month</h2>
        <p className="text-sm text-muted-foreground">Review volume for the current calendar month</p>
      </div>
      <div className="mt-5">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#64748b" angle={-45} textAnchor="end" height={80} />
            <YAxis stroke="#64748b" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "#ffffff", 
                border: "1px solid #e2e8f0",
                borderRadius: "8px"
              }}
            />
            <Bar dataKey="reviews" fill="#059669" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
