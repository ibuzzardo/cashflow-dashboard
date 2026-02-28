import * as Dialog from "@radix-ui/react-dialog";
import * as Select from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";

import {
  TRANSACTION_CATEGORIES,
  TRANSACTION_TYPES,
  parseTransactionInput,
  type TransactionCategory,
  type TransactionType,
} from "@/lib/validation";

type AddTransactionModalProps = {
  loading: boolean;
  onSave: (input: {
    description: string;
    amount: number;
    type: TransactionType;
    category: TransactionCategory;
    date: string;
    note?: string;
  }) => Promise<void>;
};

type FormErrors = Record<string, string[]>;

const buttonClassName =
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.99]";

const AddTransactionModal = ({ loading, onSave }: AddTransactionModalProps): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [type, setType] = useState<TransactionType>("expense");
  const [category, setCategory] = useState<TransactionCategory>("food");
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});

  const hasErrors = useMemo<boolean>(() => Object.keys(errors).length > 0, [errors]);

  const handleSubmit = async (): Promise<void> => {
    const payload = {
      description,
      amount: Number(amount),
      type,
      category,
      date,
      note,
    };

    const parsed = parseTransactionInput(payload);
    if (!parsed.success) {
      setErrors(parsed.fieldErrors);
      return;
    }

    setErrors({});
    try {
      await onSave(parsed.data);
      setOpen(false);
      setDescription("");
      setAmount("");
      setType("expense");
      setCategory("food");
      setDate(new Date().toISOString().slice(0, 10));
      setNote("");
    } catch {
      return;
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button type="button" className={`${buttonClassName} h-10 bg-primary px-4 text-primary-foreground`}>
          Add Transaction
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/45" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border border-muted bg-white p-0 shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="p-4 sm:p-6">
            <Dialog.Title className="text-lg font-medium">Add Transaction</Dialog.Title>
            <form
              className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2"
              onSubmit={(event) => {
                event.preventDefault();
                void handleSubmit();
              }}
            >
              <label className="sm:col-span-2 text-sm">
                Description
                <input
                  className="mt-1 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
                {errors.description?.[0] ? <span className="text-xs text-destructive">{errors.description[0]}</span> : null}
              </label>

              <label className="text-sm">
                Amount
                <input
                  className="mt-1 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  inputMode="decimal"
                />
                {errors.amount?.[0] ? <span className="text-xs text-destructive">{errors.amount[0]}</span> : null}
              </label>

              <div className="text-sm">
                Type
                <Select.Root value={type} onValueChange={(value: string) => setType(value as TransactionType)}>
                  <Select.Trigger className="mt-1 flex h-10 w-full items-center justify-between rounded-lg border border-input bg-background px-3 text-sm">
                    <Select.Value />
                    <Select.Icon>
                      <ChevronDown className="h-4 w-4" />
                    </Select.Icon>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="z-50 rounded-lg border border-muted bg-white p-1 shadow-md dark:bg-slate-900">
                      <Select.Viewport>
                        {TRANSACTION_TYPES.map((option) => (
                          <Select.Item key={option} value={option} className="cursor-pointer rounded-md px-2 py-1 text-sm">
                            <Select.ItemText>{option}</Select.ItemText>
                          </Select.Item>
                        ))}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>

              <div className="text-sm">
                Category
                <Select.Root
                  value={category}
                  onValueChange={(value: string) => setCategory(value as TransactionCategory)}
                >
                  <Select.Trigger className="mt-1 flex h-10 w-full items-center justify-between rounded-lg border border-input bg-background px-3 text-sm">
                    <Select.Value />
                    <Select.Icon>
                      <ChevronDown className="h-4 w-4" />
                    </Select.Icon>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="z-50 rounded-lg border border-muted bg-white p-1 shadow-md dark:bg-slate-900">
                      <Select.Viewport>
                        {TRANSACTION_CATEGORIES.map((option) => (
                          <Select.Item key={option} value={option} className="cursor-pointer rounded-md px-2 py-1 text-sm">
                            <Select.ItemText>{option}</Select.ItemText>
                          </Select.Item>
                        ))}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>

              <label className="text-sm">
                Date
                <input
                  type="date"
                  className="mt-1 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                />
                {errors.date?.[0] ? <span className="text-xs text-destructive">{errors.date[0]}</span> : null}
              </label>

              <label className="sm:col-span-2 text-sm">
                Note
                <input
                  className="mt-1 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                />
                {errors.note?.[0] ? <span className="text-xs text-destructive">{errors.note[0]}</span> : null}
              </label>

              <div className="sm:col-span-2 flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                <Dialog.Close asChild>
                  <button type="button" className={`${buttonClassName} h-10 border border-muted px-4`}>
                    Cancel
                  </button>
                </Dialog.Close>
                <button type="submit" className={`${buttonClassName} h-10 bg-primary px-4 text-primary-foreground`} disabled={loading}>
                  {loading ? "Saving..." : "Save Transaction"}
                </button>
              </div>
            </form>
            {hasErrors ? <p className="mt-3 text-xs text-destructive">Please resolve highlighted fields.</p> : null}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AddTransactionModal;
