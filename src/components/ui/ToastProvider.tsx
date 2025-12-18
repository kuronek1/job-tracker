"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ToastVariant = "success" | "error" | "info";

type Toast = {
  id: number;
  message: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  addToast: (message: string, variant?: ToastVariant) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

type ToastProviderProps = {
  children: ReactNode;
};

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, variant: ToastVariant = "success") => {
    setToasts((prev) => {
      const id = (prev.at(-1)?.id ?? 0) + 1;
      return [...prev, { id, message, variant }];
    });
  }, []);

  useEffect(() => {
    if (toasts.length === 0) return;

    // TODO: consider moving timeout duration into a constant and allowing per-toast custom duration if needed.
    const timers = toasts.map((toast) =>
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 3500),
    );

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [toasts]);

  const value = useMemo<ToastContextValue>(
    () => ({
      addToast,
    }),
    [addToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-0 z-60 flex flex-col items-end gap-3 p-4">
        {toasts.map((toast) => {
          const base =
            "pointer-events-auto max-w-sm rounded-xl border px-4 py-3 text-sm shadow-lg shadow-black/40 backdrop-blur-md";

          const variantClass =
            toast.variant === "error"
              ? "border-rose-400/60 bg-rose-950/90 text-rose-50"
              : toast.variant === "info"
                ? "border-sky-400/60 bg-slate-900/90 text-slate-50"
                : "border-emerald-400/60 bg-slate-900/90 text-emerald-50";

          return (
            <div
              key={toast.id}
              className={`${base} ${variantClass}`}
            >
              {toast.message}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}
