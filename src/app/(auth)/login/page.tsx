"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useActionState, useState } from "react";
import Button from "@/components/Button";
import PageLayout from "@/components/PageLayout";
import { getDictionary } from "@/i18n/config";
import { signInAction, signUpAction } from "../actions";

const initialState = { error: undefined as string | undefined };

const contentVariants = {
  initial: { opacity: 0, y: 22, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -18, scale: 0.99 },
};

const playfulCopy = {
  login: "Here we go again - back to the grind and one step closer to the offer.",
  register: "New quest unlocked. Create an account and let's roll.",
};

const panelTransition = { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const };

export default function AuthPage() {
  const { dict } = getDictionary();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loginState, loginAction] = useActionState(signInAction, initialState);
  const [signupState, signupAction] = useActionState(signUpAction, initialState);

  const activeForm =
    mode === "login"
      ? {
          title: dict.auth.loginTitle,
          subtitle: dict.auth.loginSubtitle,
          cta: dict.auth.loginCta,
          state: loginState,
          action: loginAction,
        }
      : {
          title: dict.auth.registerTitle,
          subtitle: dict.auth.registerSubtitle,
          cta: dict.auth.registerCta,
          state: signupState,
          action: signupAction,
        };

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(52,211,153,0.18),transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_10%,rgba(56,189,248,0.12),transparent_35%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(99,102,241,0.14),transparent_45%)]" />
      </div>

      <PageLayout
        contentClassName="relative flex flex-col gap-8 pb-10"
        rightSlot={
          <Button href="/" variant="secondary" size="sm">
            {dict.auth.backHome}
          </Button>
        }
      >
        <div className="relative w-full h-auto min-h-[calc(100vh-220px)] lg:h-[calc(100vh-180px)] lg:min-h-[620px]">
          <div className="grid w-full grid-cols-1 items-stretch gap-6 lg:h-full lg:grid-cols-2">
            <motion.section
              layout
              transition={panelTransition}
              className={`relative flex w-full flex-col overflow-hidden rounded-3xl bg-white/5 p-8 sm:p-10 lg:h-full lg:p-12 text-white shadow-[0_25px_120px_-35px_rgba(0,0,0,0.8)] backdrop-blur ${
                mode === "register" ? "order-2" : "order-1"
              }`}
            >
              <div className="absolute inset-0 bg-linear-to-br from-emerald-400/30 via-cyan-400/20 to-slate-900/40 opacity-60" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.18),transparent_55%)]" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode === "login" ? "accent-login" : "accent-register"}
                  variants={contentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="relative flex h-full flex-col justify-between gap-10"
                >
                  <div className="space-y-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                      {mode === "login" ? "Welcome back" : "First time here"}
                    </p>
                    <h2 className="text-4xl font-semibold leading-tight text-white">{activeForm.title}</h2>
                    <p className="max-w-xl text-base text-white/85">
                      {mode === "login" ? dict.auth.loginSubtitle : dict.auth.registerSubtitle}
                    </p>
                    <p className="text-sm text-white/80">
                      {mode === "login" ? playfulCopy.login : playfulCopy.register}
                    </p>
                    <p className="text-sm text-white/80">
                      {mode === "login"
                        ? "Grab your coffee and dive back in."
                        : "Fresh start! Pick a password you won't forget (or will you?)."}
                    </p>
                  </div>

                  <Button onClick={() => setMode(mode === "login" ? "register" : "login")} size="md" variant="secondary">
                    {mode === "login" ? dict.auth.registerTitle : dict.auth.loginTitle}
                  </Button>
                </motion.div>
              </AnimatePresence>
            </motion.section>

            <motion.section
              layout
              transition={panelTransition}
              className={`relative flex w-full flex-col overflow-hidden rounded-3xl bg-black/30 p-8 sm:p-10 lg:h-full lg:p-12 text-white shadow-[0_25px_120px_-35px_rgba(0,0,0,0.8)] backdrop-blur ${
                mode === "register" ? "order-1" : "order-2"
              }`}
            >
              <AnimatePresence mode="wait">
                <motion.form
                  key={mode}
                  variants={contentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  action={activeForm.action}
                  className="flex flex-col gap-6 lg:h-full"
                >
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                      {mode === "login" ? "Back in action" : "Join the crew"}
                    </p>
                    <h1 className="text-3xl font-semibold text-white">{activeForm.title}</h1>
                  </div>

                  <div className="grid gap-4">
                    {mode === "register" ? (
                      <label className="flex flex-col gap-2 text-sm font-medium text-slate-100">
                        {dict.auth.username}
                        <input
                          required
                          type="text"
                          name="username"
                          className="w-full rounded-xl bg-white/5 px-3 py-3 text-base text-white outline-none ring-1 ring-inset ring-white/15 transition focus:ring-white/40"
                          placeholder="User name"
                        />
                      </label>
                    ) : null}

                    <label className="flex flex-col gap-2 text-sm font-medium text-slate-100">
                      {dict.auth.email}
                      <input
                        required
                        type="email"
                        name="email"
                        className="w-full rounded-xl bg-white/5 px-3 py-3 text-base text-white outline-none ring-1 ring-inset ring-white/15 transition focus:ring-white/40"
                        placeholder="you@example.com"
                      />
                    </label>

                    <label className="flex flex-col gap-2 text-sm font-medium text-slate-100">
                      {dict.auth.password}
                      <input
                        required
                        minLength={6}
                        type="password"
                        name="password"
                        className="w-full rounded-xl bg-white/5 px-3 py-3 text-base text-white outline-none ring-1 ring-inset ring-white/15 transition focus:ring-white/40"
                        placeholder="********"
                      />
                    </label>
                  </div>

                  {activeForm.state.error ? (
                    <p className="rounded-xl bg-rose-500/15 px-3 py-2 text-sm text-rose-100">{activeForm.state.error}</p>
                  ) : null}

                  <div className="mt-auto flex flex-col gap-3">
                    <Button type="submit" variant="primary" size="md">
                      {activeForm.cta}
                    </Button>
                  </div>
                </motion.form>
              </AnimatePresence>
            </motion.section>
          </div>
        </div>
      </PageLayout>
    </div>
  );
}
