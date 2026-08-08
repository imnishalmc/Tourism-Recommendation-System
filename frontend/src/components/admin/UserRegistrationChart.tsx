import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface UserRegistrationChartProps {
  data: Array<{
    month: string;
    users: number;
    admins: number;
  }>;
}

export default function UserRegistrationChart({ data }: UserRegistrationChartProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <h2 className="font-bold">User registrations</h2>
        <p className="text-sm text-muted-foreground">New user and administrator accounts created per month</p>
      </div>
      <div className="mt-5">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "#ffffff", 
                border: "1px solid #e2e8f0",
                borderRadius: "8px"
              }} 
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="users" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: "#3b82f6" }}
              activeDot={{ r: 6 }}
              name="Users"
            />
            <Line 
              type="monotone" 
              dataKey="admins" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ fill: "#10b981" }}
              activeDot={{ r: 6 }}
              name="Administrators"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
