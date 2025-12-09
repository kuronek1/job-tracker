"use client";

import { motion } from "framer-motion";
import PageLayout from "./PageLayout";
import Button from "./Button";
import { cards, highlights, steps } from "@/mock/landing";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-slate-900 via-slate-800 to-slate-950 text-slate-50">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-10 top-10 h-56 w-56 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute -right-10 top-32 h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute -bottom-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-500/12 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_45%)]" />
      </div>

      <PageLayout
        contentClassName="pb-20 pt-4 space-y-16"
        rightSlot={
          <Button href="/login" size="sm">
            Login
          </Button>
        }
      >
        <section className="grid items-center gap-10 md:grid-cols-[1.05fr_0.95fr] lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-xs uppercase tracking-[0.25em] text-slate-200">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              CRM для всей команды найма
            </div>
            <h1 className="text-balance text-4xl font-semibold leading-tight md:text-5xl">
              Единый центр правды по воронке: вакансии, контакты, касания и
              результат.
            </h1>
            <p className="max-w-2xl text-lg text-slate-200">
              Мы объединили канбан, коммуникации и аналитику, чтобы ваш найм
              перестал жить в таблицах. Поддерживаем Supabase + Postgres, так
              что данные остаются у вас.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button href="/login" size="lg">
                Let`s start
              </Button>
              <Button href="#features" variant="secondary" size="lg">
                How it works
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {highlights.map((item, index) => (
                <motion.div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index + 0.2, duration: 0.5 }}
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                    {item.label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {item.value}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-3xl bg-white/8 blur-2xl" />
            <div className="relative rounded-3xl border border-white/10 bg-white/8 p-6 shadow-2xl shadow-black/40 backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-300">
                    Превью CRM
                  </p>
                  <h3 className="text-lg font-semibold">Рабочая панель</h3>
                </div>
                <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-200">
                  Живые статусы
                </span>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {["New", "Interview", "Offer"].map((column, columnIndex) => (
                  <motion.div
                    key={column}
                    className="rounded-2xl border border-white/10 bg-black/10 p-3"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.15 * columnIndex + 0.3,
                      duration: 0.5,
                    }}
                  >
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span className="font-semibold uppercase tracking-[0.15em]">
                        {column}
                      </span>
                      <span className="rounded-full bg-white/8 px-2 py-0.5 text-[10px] text-slate-200">
                        {columnIndex === 0
                          ? "5"
                          : columnIndex === 1
                          ? "3"
                          : "2"}
                      </span>
                    </div>
                    <div className="mt-3 space-y-2">
                      {["Frontend", "Backend", "Data"].map(
                        (role, roleIndex) => (
                          <motion.div
                            key={`${column}-${role}-${roleIndex}`}
                            className="rounded-xl border border-white/10 bg-white/8 px-3 py-2 text-sm text-white shadow-inner shadow-black/30"
                            whileHover={{
                              y: -4,
                              borderColor: "rgba(52,211,153,0.5)",
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 260,
                              damping: 16,
                            }}
                          >
                            {role} ·{" "}
                            {column === "New"
                              ? "Acme"
                              : column === "Interview"
                              ? "Lumen"
                              : "SkyLab"}
                          </motion.div>
                        )
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-3 text-xs text-slate-200">
                <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-emerald-100">
                  Next step · Обзвон
                </span>
                <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-cyan-100">
                  Напоминание · 24ч
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-slate-100">
                  История касаний
                </span>
              </div>
            </div>
          </motion.div>
        </section>

        <section id="features" className="space-y-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-300">
                Возможности
              </p>
              <h2 className="text-3xl font-semibold">
                Все, что нужно для предсказуемого найма
              </h2>
            </div>
            <Button href="/login" variant="secondary" size="sm">
              Перейти в CRM
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {cards.map((card, index) => (
              <motion.div
                key={card.title}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/8 p-5 shadow-lg shadow-black/30 backdrop-blur"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  delay: index * 0.05,
                  duration: 0.5,
                  ease: "easeOut",
                }}
                whileHover={{
                  translateY: -6,
                  borderColor: "rgba(255,255,255,0.3)",
                }}
              >
                <div className="absolute inset-0 bg-linear-to-br from-emerald-400/0 via-emerald-400/0 to-emerald-400/10 opacity-0 transition group-hover:opacity-100" />
                <span className="relative inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-emerald-100">
                  {card.badge}
                </span>
                <h3 className="relative mt-4 text-xl font-semibold text-white">
                  {card.title}
                </h3>
                <p className="relative mt-2 text-sm text-slate-200">
                  {card.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="grid gap-8 rounded-3xl border border-white/10 bg-white/8 p-8 shadow-inner shadow-black/20 backdrop-blur lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-300">
              Процесс
            </p>
            <h2 className="text-3xl font-semibold">
              Как CRM собирает вашу воронку
            </h2>
            <p className="text-slate-200">
              От импорта вакансий до аналитики по закрытию — все шаги связаны,
              чтобы команда двигалась в одном темпе.
            </p>
          </div>
          <div className="grid gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                className="flex gap-4 rounded-2xl border border-white/10 bg-black/12 p-4"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: index * 0.1 + 0.1, duration: 0.5 }}
              >
                <div className="flex size-10 items-center justify-center rounded-2xl bg-white/10 text-sm font-semibold text-white">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-200">{step.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-r from-emerald-500/20 via-cyan-500/15 to-indigo-500/20 p-10 shadow-2xl shadow-emerald-500/10 backdrop-blur">
          <div className="absolute left-8 top-8 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -right-10 bottom-0 h-52 w-52 rounded-full bg-white/8 blur-3xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-2">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-200">
                Готовы стартовать
              </p>
              <h2 className="text-3xl font-semibold text-white">
                Запустите Job Tracker CRM и соберите воронку в одном месте
              </h2>
              <p className="text-slate-100">
                Логин занимает меньше минуты. Добавьте свою первую вакансию,
                импортируйте контакты и включите напоминания — мы ведем вас по
                пути из хаоса к предсказуемости.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href="/login" size="lg">
                Перейти ко входу
              </Button>
              <Button href="#features" variant="secondary" size="lg">
                Посмотреть возможности
              </Button>
            </div>
          </div>
        </section>
      </PageLayout>
    </div>
  );
}
