import Layout from "@/components/layout";

const AboutPage = (): JSX.Element => {
  return (
    <Layout>
      <section className="space-y-4 sm:space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Cashflow Dashboard</h1>
          <span className="inline-flex items-center rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
            v1.0.0
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8 dark:border-slate-800 dark:bg-slate-950">
          <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">
            Cashflow Dashboard helps teams track incoming and outgoing cash in one place.
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
            It provides a clear snapshot of balances, trends, and recent activity so decisions can be made quickly.
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
            The interface is designed for fast daily use, with responsive layouts and dark mode support.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;
