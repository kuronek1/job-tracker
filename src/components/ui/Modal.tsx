"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import Button from "./Button";
import { FaX } from "react-icons/fa6";

type ModalSize = "sm" | "md" | "lg" | "xl";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  description?: string;
  size?: ModalSize;
  className?: string;
  hideCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
};

function cn(...values: Array<string | undefined | false | null>) {
  return values.filter(Boolean).join(" ");
}

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export default function Modal(props: ModalProps) {
  const {
    open,
    onClose,
    children,
    title,
    description,
    size = "md",
    className,
    hideCloseButton,
    closeOnOverlayClick = true,
    closeOnEsc = true,
  } = props;

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const lastActiveElementRef = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    lastActiveElementRef.current = document.activeElement as HTMLElement | null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timeoutId = window.setTimeout(() => {
      dialogRef.current?.focus();
    }, 10);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!closeOnEsc) return;
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(timeoutId);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);

      if (lastActiveElementRef.current) {
        lastActiveElementRef.current.focus();
      }
    };
  }, [open, closeOnEsc, onClose]);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0"
            onClick={closeOnOverlayClick ? onClose : undefined}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
            aria-describedby={description ? "modal-description" : undefined}
            ref={dialogRef}
            tabIndex={-1}
            className={cn(
              "relative z-10 flex max-h-[min(90vh,700px)] w-full flex-col rounded-2xl border border-white/12 bg-slate-900/95 p-6 text-slate-50 shadow-2xl shadow-black/50 backdrop-blur-md",
              sizeClasses[size],
              className
            )}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {(title || !hideCloseButton) && (
              <div className="mb-4 flex items-start justify-between gap-4">
                {title ? (
                  <div className="space-y-1">
                    <h2 id="modal-title" className="text-lg font-semibold">
                      {title}
                    </h2>
                    {description ? (
                      <p
                        id="modal-description"
                        className="text-sm text-slate-300"
                      >
                        {description}
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <div />
                )}

                {!hideCloseButton ? (
                  <Button
                    variant="ghost"
                    onClick={onClose}
                    aria-label="Close dialog"
                  >
                    <FaX size={15} />
                  </Button>
                ) : null}
              </div>
            )}

            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
