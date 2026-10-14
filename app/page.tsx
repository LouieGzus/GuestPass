
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ShieldCheck,
  Users,
  QrCode,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: CalendarDays,
    title: "Event management",
    description:
      "Organize your events, manage guest lists and keep essential details in one workspace.",
  },
  {
    icon: Users,
    title: "Guest experience",
    description:
      "Give guests a clear invitation journey, RSVP options and a place to confirm their information.",
  },
  {
    icon: QrCode,
    title: "Secure event access",
    description:
      "Prepare QR-based credentials and streamline guest validation and event check-in.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#090909] text-white">
      <header className="border-b border-white/[0.08]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d7b56d]/30 bg-[#d7b56d]/[0.08]">
              <Sparkles size={21} className="text-[#e8c982]" />
            </div>
            <div>
              <span className="block text-xl font-semibold tracking-tight">
                Guest<span className="text-[#e8c982]">Pass</span>
              </span>
              <span className="block text-[9px] uppercase tracking-[0.2em] text-stone-500">
                By Noskar Enterprise
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/auth/login"
              className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-stone-300 transition hover:border-[#d7b56d]/40 hover:text-white"
            >
              Sign in
            </Link>
            <Link
              href="/auth/sign-up"
              className="rounded-xl bg-[#d7b56d] px-4 py-2.5 text-sm font-semibold text-[#17130a] transition hover:bg-[#e8c982]"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[450px] w-[750px] -translate-x-1/2 rounded-full bg-[#d7b56d]/[0.07] blur-[130px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[1.15fr_0.85fr] lg:py-32">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#d7b56d]/20 bg-[#d7b56d]/[0.06] px-4 py-2 text-[10px] font-medium uppercase tracking-[0.18em] text-[#e8c982]">
              <Sparkles size={13} />
              Invitations. People. Experiences.
            </div>

            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.12] tracking-tight sm:text-6xl lg:text-7xl">
              Every guest.
              <br />
              Every moment.
              <br />
              <span className="text-[#e8c982]">One platform.</span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-stone-400 sm:text-lg sm:leading-8">
              From the first invitation to the final check-in, GuestPass helps
              you organize events, connect with guests and manage access from
              one secure workspace.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/auth/sign-up"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d7b56d] px-6 py-3.5 text-sm font-semibold text-[#17130a] transition hover:bg-[#e8c982]"
              >
                Create your workspace
                <ArrowRight size={17} />
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 px-6 py-3.5 text-sm font-medium text-stone-200 transition hover:border-[#d7b56d]/40"
              >
                Sign in to GuestPass
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-stone-500">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 size={15} className="text-[#d7b56d]" />
                Flexible event workspaces
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 size={15} className="text-[#d7b56d]" />
                QR-enabled access
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-5 rounded-[2rem] bg-[#d7b56d]/[0.05] blur-2xl" />

            <div className="relative rounded-3xl border border-[#d7b56d]/20 bg-gradient-to-br from-[#1b1812] via-[#111112] to-[#0d0d0e] p-6 shadow-2xl sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500">
                    The GuestPass experience
                  </p>
                  <h2 className="mt-2 text-xl font-semibold">
                    From invitation to arrival
                  </h2>
                </div>
                <div className="rounded-xl border border-[#d7b56d]/20 bg-[#d7b56d]/[0.08] p-3 text-[#e8c982]">
                  <ShieldCheck size={22} />
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {[
                  {
                    number: "01",
                    title: "Create your event",
                    detail: "Set up the details and guest experience",
                  },
                  {
                    number: "02",
                    title: "Invite your guests",
                    detail: "Manage invitations and responses",
                  },
                  {
                    number: "03",
                    title: "Welcome your guests",
                    detail: "Validate credentials and record attendance",
                  },
                ].map((step) => (
                  <div
                    key={step.number}
                    className="flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-black/30 p-4"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#d7b56d]/20 text-xs font-semibold text-[#e8c982]">
                      {step.number}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-stone-100">
                        {step.title}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-stone-500">
                        {step.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-3 rounded-xl border border-[#d7b56d]/15 bg-[#d7b56d]/[0.05] p-4">
                <ShieldCheck
                  size={19}
                  className="shrink-0 text-[#e8c982]"
                />
                <p className="text-xs leading-5 text-stone-400">
                  Built around organized guest journeys and controlled event
                  access.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.07] bg-[#0d0d0e]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="max-w-2xl">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#e8c982]">
              One connected journey
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              More than an invitation.
            </h2>
            <p className="mt-3 text-sm leading-6 text-stone-400">
              A foundation for managing the event experience before, during
              and after the occasion.
            </p>
          </div>

          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="rounded-2xl border border-white/[0.08] bg-[#111113] p-6 transition hover:border-[#d7b56d]/25"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#d7b56d]/15 bg-[#d7b56d]/[0.07] text-[#e8c982]">
                    <Icon size={21} />
                  </div>
                  <h3 className="mt-5 text-base font-semibold">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-stone-400">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.08]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-7 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © 2026 GuestPass · Noskar Enterprise
          </p>
          <p>Smart Event Invitation &amp; Access Management</p>
        </div>
      </footer>
    </main>
  );
}
