
"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { Building2, Plus, RefreshCw, ShieldCheck } from "lucide-react";

type Organization = {
  id: string;
  name: string;
  organization_type: string;
  created_at: string;
};

const organizationTypes = [
  { value: "individual", label: "Individual / Private events" },
  { value: "event_company", label: "Event management company" },
  { value: "business", label: "Business / Corporate" },
  { value: "school", label: "School / Educational institution" },
  { value: "church", label: "Church / Religious institution" },
  { value: "government", label: "Government institution" },
  { value: "nonprofit", label: "Nonprofit / NGO" },
  { value: "other", label: "Other organization" },
];

export default function OrganizationPanel() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [name, setName] = useState("");
  const [organizationType, setOrganizationType] = useState("individual");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadOrganizations = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("organizations")
        .select("id, name, organization_type, created_at")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setOrganizations((data ?? []) as Organization[]);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to load your organizations.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOrganizations();
  }, [loadOrganizations]);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const trimmedName = name.trim();

    if (trimmedName.length < 2 || trimmedName.length > 150) {
      setErrorMessage("Enter an organization name between 2 and 150 characters.");
      return;
    }

    setCreating(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.rpc("create_organization", {
        organization_name: trimmedName,
        organization_type: organizationType,
      });

      if (error) throw error;

      setName("");
      setOrganizationType("individual");
      setSuccessMessage(
        "Organization created successfully. You are its owner.",
      );

      await loadOrganizations();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to create the organization. Please try again.",
      );
    } finally {
      setCreating(false);
    }
  }

  return (
    <section
      id="organizations"
      className="space-y-5 rounded-2xl border border-white/[0.08] bg-[#111113] p-6 sm:p-7"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#d7b56d]/15 bg-[#d7b56d]/[0.07] text-[#d7b56d]">
          <Building2 size={20} />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-stone-100">
            Your organizations
          </h2>
          <p className="mt-1 text-xs leading-5 text-stone-500">
            Create a workspace for your events or manage organizations you
            already belong to.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadOrganizations()}
          disabled={loading}
          aria-label="Refresh organizations"
          className="rounded-lg border border-white/10 p-2 text-stone-400 transition hover:border-[#d7b56d]/30 hover:text-[#e8c982] disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/20 bg-red-500/[0.07] p-3 text-sm text-red-300"
        >
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.07] p-3 text-sm text-emerald-300"
        >
          {successMessage}
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-stone-200">
          Create an organization
        </h3>

        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label
              htmlFor="organization-name"
              className="mb-2 block text-xs text-stone-400"
            >
              Organization name
            </label>
            <input
              id="organization-name"
              name="organization-name"
              type="text"
              autoComplete="organization"
              minLength={2}
              maxLength={150}
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Noskar Events"
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-stone-600 focus:border-[#d7b56d]/50"
            />
          </div>

          <div>
            <label
              htmlFor="organization-type"
              className="mb-2 block text-xs text-stone-400"
            >
              Organization type
            </label>
            <select
              id="organization-type"
              name="organization-type"
              value={organizationType}
              onChange={(event) => setOrganizationType(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#171719] px-4 py-3 text-sm text-stone-200 outline-none transition focus:border-[#d7b56d]/50"
            >
              {organizationTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={creating || loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#d7b56d] px-4 py-3 text-sm font-semibold text-[#17130a] transition hover:bg-[#e8c982] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            <Plus size={17} />
            {creating ? "Creating organization..." : "Create organization"}
          </button>
        </form>
      </div>

      <div className="border-t border-white/[0.08] pt-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-sm font-medium text-stone-200">
            Available workspaces
          </h3>
          {!loading && (
            <span className="text-xs text-stone-500">
              {organizations.length}{" "}
              {organizations.length === 1 ? "organization" : "organizations"}
            </span>
          )}
        </div>

        {loading ? (
          <p className="py-5 text-sm text-stone-500">
            Loading your organizations...
          </p>
        ) : organizations.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 px-4 py-6 text-center">
            <Building2 className="mx-auto text-stone-600" size={24} />
            <p className="mt-3 text-sm text-stone-300">
              No organizations yet
            </p>
            <p className="mt-1 text-xs text-stone-500">
              Create your first workspace using the form above.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {organizations.map((organization) => (
              <article
                key={organization.id}
                className="flex items-start gap-3 rounded-xl border border-white/[0.08] bg-black/20 p-4"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#d7b56d]/[0.08] text-[#d7b56d]">
                  <Building2 size={17} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="break-words text-sm font-medium text-stone-100">
                    {organization.name}
                  </p>
                  <p className="mt-1 text-xs text-stone-500">
                    {organizationTypes.find(
                      (type) => type.value === organization.organization_type,
                    )?.label ?? "Organization"}
                  </p>
                  <p className="mt-2 flex items-center gap-1.5 text-[11px] text-stone-500">
                    <ShieldCheck size={13} className="text-[#d7b56d]" />
                    Workspace member
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
