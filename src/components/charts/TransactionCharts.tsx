// components/TransactionCharts.tsx
'use client'; // Importante para componentes que usan hooks

import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

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

//const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function TransactionCharts({ data }: { data: TransactionData }) {
  // Preparar datos para gráficos

  console.log(data);

  const dailyData = Object.values(data.transactionsByDay);
  //const checkTypesData = Object.entries(data.checkTypes).map(([name, value]) => ({ name, value }));
/*   const topCustomers = Object.entries(data.mostActiveCustomers)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));
 */
  return (
      <div className="bg-white p-4 rounded-lg shadow">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="amountChecks" name="Monto Cheques" stroke="#8884d8" />
            <Line type="monotone" dataKey="amountWires" name="Monto Transferencias" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
  );
}
