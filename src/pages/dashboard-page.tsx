import AddTransactionModal from "@/components/add-transaction-modal";
import DonutChart from "@/components/donut-chart";
import Layout from "@/components/layout";
import StatCard from "@/components/stat-card";
import TransactionList from "@/components/transaction-list";
import TrendChart from "@/components/trend-chart";
import { useTransactions } from "@/hooks/use-transactions";

const money = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
};

const DashboardPage = (): JSX.Element => {
  const {
    transactions,
    loading,
    error,
    stats,
    donutData,
    trendData,
    addTransaction,
    removeTransaction,
  } = useTransactions();

  return (
    <Layout>
      <section className="space-y-6 sm:space-y-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Overview</h2>
          <AddTransactionModal loading={loading} onSave={addTransaction} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Income" value={money(stats.income)} />
          <StatCard label="Expenses" value={money(stats.expense)} />
          <StatCard label="Net Balance" value={money(stats.balance)} />
          <StatCard label="Transactions" value={String(stats.transactionCount)} />
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
          <div className="xl:col-span-2">
            <DonutChart data={donutData} />
          </div>
          <div className="xl:col-span-3">
            <TrendChart data={trendData} />
          </div>
        </div>

        <TransactionList
          loading={loading}
          errorMessage={error?.message ?? null}
          transactions={transactions}
          onDelete={removeTransaction}
        />
      </section>
    </Layout>
  );
};

export default DashboardPage;
