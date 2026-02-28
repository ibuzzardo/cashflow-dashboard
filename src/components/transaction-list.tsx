import type { Transaction } from "@/types";

type TransactionListProps = {
  loading: boolean;
  errorMessage: string | null;
  transactions: Transaction[];
  onDelete: (id: string) => Promise<void>;
};

const TransactionList = ({ loading, errorMessage, transactions, onDelete }: TransactionListProps): JSX.Element => {
  return (
    <section className="rounded-xl border border-muted/70 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <header className="border-b border-muted/70 px-4 py-3 dark:border-slate-800 sm:px-5">
        <h3 className="text-base font-semibold">Recent Transactions</h3>
      </header>
      <div className="p-4 sm:p-5">
        {loading ? <p className="text-sm text-muted-foreground">Loading transactions...</p> : null}
        {!loading && errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
        {!loading && !errorMessage && transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No transactions yet.</p>
        ) : null}

        {!loading && !errorMessage && transactions.length > 0 ? (
          <ul className="space-y-3">
            {transactions.map((tx) => (
              <li
                key={tx.id}
                className="flex flex-col gap-2 rounded-lg border border-muted/70 p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium">{tx.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {tx.category} • {new Date(tx.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={
                      tx.type === "income"
                        ? "rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                        : "rounded-md bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive"
                    }
                  >
                    {tx.type === "income" ? "+" : "-"}${tx.amount.toFixed(2)}
                  </span>
                  <button
                    type="button"
                    className="inline-flex h-8 items-center justify-center rounded-md px-2 text-xs font-medium text-muted-foreground hover:bg-muted"
                    onClick={() => void onDelete(tx.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
};

export default TransactionList;
