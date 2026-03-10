import { useMemo, useState } from "react";

import Layout from "@/components/layout";
import type { FAQ, FAQCategory } from "@/types/faq";

type CategoryFilter = "All" | FAQCategory;

const FAQ_ITEMS: FAQ[] = [
  {
    id: "faq-1",
    category: "Getting Started",
    question: "How do I add my first transaction?",
    answer:
      "Open the dashboard and select Add Transaction. Fill in amount, type, category, and date, then save to include it in your totals.",
  },
  {
    id: "faq-2",
    category: "Getting Started",
    question: "Can I track both income and expenses?",
    answer:
      "Yes. Choose income or expense when creating a transaction. The dashboard automatically updates balance, charts, and recent activity.",
  },
  {
    id: "faq-3",
    category: "Getting Started",
    question: "What categories should I use first?",
    answer:
      "Start with broad categories like food, housing, transportation, and salary. You can adjust your approach later as your reporting needs evolve.",
  },
  {
    id: "faq-4",
    category: "Account",
    question: "How do I update my account details?",
    answer:
      "Go to account settings from the dashboard navigation. From there, you can edit profile details and save your changes.",
  },
  {
    id: "faq-5",
    category: "Account",
    question: "I forgot my password. What should I do?",
    answer:
      "Use the password reset option on the sign-in screen. Follow the reset link sent to your email to create a new password.",
  },
  {
    id: "faq-6",
    category: "Account",
    question: "How can I secure my account?",
    answer:
      "Use a unique password, keep recovery details current, and enable extra verification methods if they are available in your settings.",
  },
  {
    id: "faq-7",
    category: "Billing",
    question: "Where can I view billing invoices?",
    answer:
      "Open the billing section in your dashboard to review invoices, payment history, and current plan details.",
  },
  {
    id: "faq-8",
    category: "Billing",
    question: "What payment methods are supported?",
    answer:
      "Most major debit and credit cards are supported. Availability can vary by region and account configuration.",
  },
];

const CATEGORIES: CategoryFilter[] = ["All", "Getting Started", "Account", "Billing"];

const HelpPage = (): JSX.Element => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set<string>());

  const filteredFaqs = useMemo<FAQ[]>(() => {
    const normalized = searchQuery.trim().toLowerCase();

    return FAQ_ITEMS.filter((faq: FAQ) => {
      const categoryMatch = activeCategory === "All" || faq.category === activeCategory;
      if (!categoryMatch) {
        return false;
      }

      if (normalized.length === 0) {
        return true;
      }

      const haystack = `${faq.question} ${faq.answer} ${faq.category}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [activeCategory, searchQuery]);

  const toggleExpanded = (id: string): void => {
    setExpandedIds((previous: Set<string>) => {
      const next = new Set<string>(previous);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10 font-sans">
          <header className="mb-6 space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">Help Center</h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Find quick answers about setup, account settings, and billing.
            </p>
          </header>

          <section className="mb-4 space-y-3">
            <label htmlFor="faq-search" className="text-sm font-medium text-slate-800 dark:text-slate-200">
              Search FAQs
            </label>
            <input
              id="faq-search"
              type="search"
              aria-label="Search frequently asked questions"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.currentTarget.value)}
              placeholder="Search by keyword"
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm placeholder:text-slate-500 transition-colors hover:border-slate-400 focus-visible:border-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />

            <div role="tablist" aria-label="FAQ categories" className="inline-flex w-full flex-wrap gap-2 rounded-xl border border-slate-200 bg-slate-100 p-1.5 sm:w-auto sm:flex-nowrap dark:border-slate-800 dark:bg-slate-900">
              {CATEGORIES.map((category: CategoryFilter) => {
                const isActive = activeCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveCategory(category)}
                    className="h-9 rounded-lg px-3 text-sm font-medium text-slate-700 transition-all hover:bg-white hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 active:scale-[0.98] data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
                    data-state={isActive ? "active" : "inactive"}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </section>

          <section aria-live="polite" className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-700">
                No FAQs match your current filters.
              </div>
            ) : (
              filteredFaqs.map((faq: FAQ) => {
                const isExpanded = expandedIds.has(faq.id);
                const buttonId = `faq-button-${faq.id}`;
                const panelId = `faq-panel-${faq.id}`;

                return (
                  <article key={faq.id} className="group rounded-xl border border-slate-200 bg-white shadow-sm transition-colors hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                    <h2>
                      <button
                        id={buttonId}
                        type="button"
                        aria-expanded={isExpanded}
                        aria-controls={panelId}
                        onClick={() => toggleExpanded(faq.id)}
                        className="w-full flex items-center justify-between gap-3 px-4 py-4 text-left text-sm font-medium text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 active:bg-slate-50 dark:text-slate-100"
                      >
                        <span>{faq.question}</span>
                        <span aria-hidden="true" className="text-slate-500">
                          {isExpanded ? "−" : "+"}
                        </span>
                      </button>
                    </h2>
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      hidden={!isExpanded}
                      data-state={isExpanded ? "open" : "closed"}
                      className="px-4 pb-4 text-sm leading-6 text-slate-700 data-[state=closed]:hidden data-[state=open]:block dark:text-slate-300"
                    >
                      {faq.answer}
                    </div>
                  </article>
                );
              })
            )}
          </section>
        </main>
      </div>
    </Layout>
  );
};

export default HelpPage;
