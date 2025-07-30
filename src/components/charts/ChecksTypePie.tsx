// components/TransactionCharts.tsx
"use client"; // Importante para componentes que usan hooks

import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

type DailyTransactionData = {
  date: string;
  checks: number;
  wires: number;
  total: number;
  amountChecks: number;
  amountWires: number;
  totalAmount: number;
};

type TransactionAmountSummary = {
  checks: number;
  wires: number;
  total: number;
};

// Y luego redefinir el tipo principal usando estos subtipos:
type TransactionAnalysisResult = {
  totalTransactions: number;
  totalAmount: TransactionAmountSummary;
  transactionsByDay: Record<string, DailyTransactionData>;
  checkTypes: Record<string, number>;
  mostActiveCustomers: Record<string, number>;
  companiesInvolved: Set<string>;
};

type TransactionData = TransactionAnalysisResult;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function ChecksTypePie({ data }: { data: TransactionData }) {
  //const checkTypesData = Object.values(data.totalAmount);

  const checkTypesData = Object.entries(data.totalAmount).map(([name, value]) => ({ name, value }));

  console.log(checkTypesData);


  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={checkTypesData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) =>
              `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`
            }
          >
            {checkTypesData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
