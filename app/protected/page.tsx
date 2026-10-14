import OrganizationPanel from "./organization-panel";
import {
  ArrowUpRight,
  CalendarDays,
  Users,
  Mail,
  ClipboardCheck,
  Plus,
  Clock3,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const metrics = [
  {
    label: "Total events",
    value: "0",
    note: "No events created yet",
    icon: CalendarDays,
  },
  {
    label: "Guest profiles",
    value: "0",
    note: "Your guest directory starts here",
    icon: Users,
  },
  {
    label: "Invitations sent",
    value: "0",
    note: "No invitations sent yet",
    icon: Mail,
  },
  {
    label: "Guests checked in",
    value: "0",
    note: "Attendance will appear here",
    icon: ClipboardCheck,
  },
];

export default function ProtectedPage() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl border border-[#d7b56d]/20 bg-gradient-to-br from-[#211b10] via-[#151310] to-[#101012] p-6 sm:p-9">
        <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-[#d7b56d]/[0.07] blur-3xl" />

        <div className="relative max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d7b56d]/20 bg-black/20 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.15em] text-[#e8c982]">
            <Sparkles size={13} />
            Your event workspace
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Every guest.
            <br />
            <span className="text-[#e8c982]">Every moment.</span>
          </h1>

          <p className="mt-4 max-w-lg text-sm leading-6 text-stone-400">
            Manage invitations, guest information and event access from one
            secure workspace. Your GuestPass journey starts here.
          </p>

          <div className="mt-7 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-stone-300">
            <ShieldCheck size={17} className="text-[#d7b56d]" />
            Your workspace is ready to configure
          </div>
        </div>
      </section>
      <OrganizationPanel />

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-stone-100">
              At a glance
            </h2>
            <p className="mt-1 text-xs text-stone-500">
              Your event activity will appear here as you use GuestPass.
            </p>
          </div>
          <span className="hidden rounded-full border border-white/[0.08] px-3 py-1.5 text-[10px] text-stone-500 sm:inline-flex">
            Live data will appear here
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;

            return (
              <article
                key={metric.label}
                className="rounded-2xl border border-white/[0.08] bg-[#111113] p-5 transition hover:border-[#d7b56d]/25"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d7b56d]/15 bg-[#d7b56d]/[0.07] text-[#d7b56d]">
                    <Icon size={19} strokeWidth={1.7} />
                  </div>
                  <ArrowUpRight size={16} className="text-stone-700" />
                </div>

                <p className="mt-5 text-sm text-stone-400">{metric.label}</p>
                <p className="mt-1 text-3xl font-semibold tracking-tight text-white">
                  {metric.value}
                </p>
                <p className="mt-2 text-[11px] text-stone-600">
                  {metric.note}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <article className="rounded-2xl border border-white/[0.08] bg-[#111113] p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-stone-100">
                Get started
              </h2>
              <p className="mt-1 text-xs text-stone-500">
                Your first steps toward managing an event.
              </p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#d7b56d]/[0.08] text-[#d7b56d]">
              <Plus size={19} />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#d7b56d]/25 text-xs text-[#e8c982]">
                1
              </div>
              <div>
                <p className="text-sm font-medium text-stone-200">
                  Set up your organization
                </p>
                <p className="mt-1 text-xs leading-5 text-stone-500">
                  Establish your workspace and access permissions.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 text-xs text-stone-500">
                2
              </div>
              <div>
                <p className="text-sm font-medium text-stone-300">
                  Create your first event
                </p>
                <p className="mt-1 text-xs leading-5 text-stone-500">
                  Configure event details, invitations and guest policies.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 text-xs text-stone-500">
                3
              </div>
              <div>
                <p className="text-sm font-medium text-stone-300">
                  Invite and welcome guests
                </p>
                <p className="mt-1 text-xs leading-5 text-stone-500">
                  Build your guest list and prepare secure event access.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-3 text-xs leading-5 text-stone-500">
            Organization and event setup will become interactive in the next
            development milestones.
          </div>
        </article>

        <article className="rounded-2xl border border-white/[0.08] bg-[#111113] p-6 sm:p-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d7b56d]/15 bg-[#d7b56d]/[0.07] text-[#d7b56d]">
              <Clock3 size={19} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-stone-100">
                Recent activity
              </h2>
              <p className="mt-1 text-xs text-stone-500">
                Your workspace timeline
              </p>
            </div>
          </div>

          <div className="flex min-h-48 flex-col items-center justify-center py-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.02]">
              <Clock3 size={20} className="text-stone-600" />
            </div>
            <p className="mt-4 text-sm font-medium text-stone-300">
              Nothing to report yet
            </p>
            <p className="mt-2 max-w-[230px] text-xs leading-5 text-stone-500">
              Event creation, invitations and check-in activity will be
              recorded here when those features are connected.
            </p>
          </div>
        </article>
      </section>

      <footer className="flex flex-col gap-2 border-t border-white/[0.07] pt-5 text-[10px] text-stone-600 sm:flex-row sm:items-center sm:justify-between">
        <p>GuestPass · Smart Event Invitation &amp; Access Management</p>
        <p>Secure event management by Noskar Enterprise</p>
      </footer>
    </div>
  );
}