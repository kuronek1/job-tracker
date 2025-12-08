"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useActionState, useState } from "react";
import { signInAction, signUpAction } from "../actions";
import { getDictionary } from "@/i18n/config";

const initialState = { error: undefined as string | undefined };

const fadeIn = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

export default function LoginPage() {
  const { dict } = getDictionary();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loginState, loginAction] = useActionState(signInAction, initialState);
  const [signupState, signupAction] = useActionState(signUpAction, initialState);

  const active =
    mode === "login"
      ? {
          title: dict.auth.loginTitle,
          subtitle: dict.auth.loginSubtitle,
          cta: dict.auth.loginCta,
          state: loginState,
          action: loginAction,
          toggleLabel: dict.auth.registerTitle,
        }
      : {
          title: dict.auth.registerTitle,
          subtitle: dict.auth.registerSubtitle,
          cta: dict.auth.registerCta,
          state: signupState,
          action: signupAction,
          toggleLabel: dict.auth.loginTitle,
        };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-slate-50">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-12 top-16 h-64 w-64 rounded-full bg-emerald-400/15 blur-3xl" />
        <div className="absolute right-4 top-24 h-56 w-56 rounded-full bg-cyan-500/12 blur-3xl" />
        <div className="absolute -left-16 bottom-0 h-80 w-80 rounded-full bg-indigo-500/12 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_45%)]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-4xl flex-col justify-center gap-10 px-6 py-14">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/8 px-4 py-2 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_8px_rgba(16,185,129,0.15)]" />
            <span className="text-sm font-semibold tracking-tight">{dict.appName}</span>
          </div>
          <Link
            href="/"
            className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-slate-50 shadow-lg shadow-emerald-500/10 transition hover:-translate-y-0.5 hover:border-white/30"
          >
            {dict.auth.backHome}
          </Link>
        </header>

        <motion.div
          key={mode}
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="overflow-hidden rounded-3xl border border-white/10 bg-white/8 p-8 shadow-2xl shadow-black/30 backdrop-blur"
        >
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-300">
              {mode === "login" ? dict.auth.loginTitle : dict.auth.registerTitle}
            </p>
            <h1 className="text-3xl font-semibold text-white">{active.title}</h1>
            <p className="max-w-2xl text-sm text-slate-200">{active.subtitle}</p>
          </div>

          <form action={active.action} className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="grid gap-3 md:col-span-2 md:grid-cols-2">
              {mode === "register" ? (
                <label className="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-slate-100">
                  {dict.auth.username}
                  <input
                    required
                    type="text"
                    name="username"
                    className="w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-base text-white outline-none transition focus:border-white/40 focus:ring-1 focus:ring-white/30"
                    placeholder="yourname"
                  />
                </label>
              ) : null}
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-100">
                {dict.auth.email}
                <input
                  required
                  type="email"
                  name="email"
                  className="w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-base text-white outline-none transition focus:border-white/40 focus:ring-1 focus:ring-white/30"
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
                  className="w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-base text-white outline-none transition focus:border-white/40 focus:ring-1 focus:ring-white/30"
                  placeholder="********"
                />
              </label>
            </div>

            {active.state.error ? (
              <p className="md:col-span-2 rounded-lg border border-rose-200/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
                {active.state.error}
              </p>
            ) : null}

            <div className="md:col-span-2 flex flex-col gap-3">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-emerald-400/10 transition hover:-translate-y-0.5 hover:shadow-emerald-300/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
              >
                {active.cta}
              </button>
              <button
                type="button"
                onClick={() => setMode(mode === "login" ? "register" : "login")}
                className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/30"
              >
                {mode === "login" ? dict.auth.registerTitle : dict.auth.loginTitle}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
