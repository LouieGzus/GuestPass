
"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  CalendarDays,
  Plus,
  RefreshCw,
  MapPin,
  Clock3,
  Building2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Organization = {
  id: string;
  name: string;
};

type EventRecord = {
  id: string;
  organization_id: string;
  name: string;
  event_type: string;
  description: string | null;
  venue: string | null;
  starts_at: string;
  ends_at: string;
  timezone: string;
  status: "draft" | "published" | "completed" | "cancelled";
};

const eventTypes = [
  { value: "wedding", label: "Wedding" },
  { value: "birthday", label: "Birthday" },
  { value: "corporate", label: "Corporate event" },
  { value: "conference", label: "Conference" },
  { value: "graduation", label: "Graduation" },
  { value: "religious", label: "Religious event" },
  { value: "government", label: "Government / Institutional" },
  { value: "cultural", label: "Cultural event" },
  { value: "private", label: "Private event" },
  { value: "other", label: "Other" },
];

const statuses = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
] as const;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-ZA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function EventsPanel() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [organizationId, setOrganizationId] = useState("");
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [name, setName] = useState("");
  const [eventType, setEventType] = useState("private");
  const [description, setDescription] = useState("");
  const [venue, setVenue] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const supabase = createClient();

      const { data: orgData, error: orgError } = await supabase
        .from("organizations")
        .select("id, name")
        .order("created_at", { ascending: false });

      if (orgError) throw orgError;

      const availableOrganizations = (orgData ?? []) as Organization[];
      setOrganizations(availableOrganizations);

      const validOrganizationId = availableOrganizations.some(
        (org) => org.id === organizationId,
      )
        ? organizationId
        : (availableOrganizations[0]?.id ?? "");

      if (validOrganizationId !== organizationId) {
        setOrganizationId(validOrganizationId);
      }

      if (!validOrganizationId) {
        setEvents([]);
        return;
      }

      const { data: eventData, error: eventError } = await supabase
        .from("events")
        .select(
          "id, organization_id, name, event_type, description, venue, starts_at, ends_at, timezone, status",
        )
        .eq("organization_id", validOrganizationId)
        .order("starts_at", { ascending: true });

      if (eventError) throw eventError;

      setEvents((eventData ?? []) as EventRecord[]);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to load events. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!organizationId) {
      setErrorMessage("Create or select an organization first.");
      return;
    }

    if (!startsAt || !endsAt || new Date(endsAt) <= new Date(startsAt)) {
      setErrorMessage("The event end date and time must be after its start.");
      return;
    }

    setSaving(true);

    try {
      const supabase = createClient();
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError) throw authError;
      if (!authData.user) {
        throw new Error("Your session has expired. Please sign in again.");
      }

      const { error } = await supabase.from("events").insert({
        organization_id: organizationId,
        name: name.trim(),
        event_type: eventType,
        description: description.trim() || null,
        venue: venue.trim() || null,
        starts_at: new Date(startsAt).toISOString(),
        ends_at: new Date(endsAt).toISOString(),
        timezone: "Africa/Johannesburg",
        created_by: authData.user.id,
      });

      if (error) throw error;

      setName("");
      setEventType("private");
      setDescription("");
      setVenue("");
      setStartsAt("");
      setEndsAt("");
      setSuccessMessage("Event created successfully.");

      await loadData();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to create the event. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(
    eventId: string,
    status: EventRecord["status"],
  ) {
    setErrorMessage("");
    setSuccessMessage("");
    setUpdatingId(eventId);

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("events")
        .update({ status })
        .eq("id", eventId)
        .eq("organization_id", organizationId);

      if (error) throw error;

      setSuccessMessage("Event status updated.");
      await loadData();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to update the event status.",
      );
    } finally {
      setUpdatingId("");
    }
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-stone-600 focus:border-[#d7b56d]/50";

  return (
    <section
      id="events"
      className="space-y-6 rounded-2xl border border-white/[0.08] bg-[#111113] p-5 sm:p-7"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#d7b56d]/15 bg-[#d7b56d]/[0.07] text-[#d7b56d]">
          <CalendarDays size={20} />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-stone-100">
            Event management
          </h2>
          <p className="mt-1 text-xs leading-5 text-stone-500">
            Create events, manage their status and keep event schedules in one
            workspace.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadData()}
          disabled={loading}
          aria-label="Refresh events"
          className="rounded-lg border border-white/10 p-2 text-stone-400 transition hover:border-[#d7b56d]/30 hover:text-[#e8c982] disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {errorMessage && (
        <div role="alert" className="rounded-xl border border-red-500/20 bg-red-500/[0.07] p-3 text-sm text-red-300">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div role="status" className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.07] p-3 text-sm text-emerald-300">
          {successMessage}
        </div>
      )}

      <div>
        <label htmlFor="event-organization" className="mb-2 block text-xs text-stone-400">
          Organization workspace
        </label>
        <select
          id="event-organization"
          value={organizationId}
          onChange={(event) => setOrganizationId(event.target.value)}
          disabled={loading || organizations.length === 0}
          className={`${inputClass} bg-[#171719]`}
        >
          {organizations.length === 0 ? (
            <option value="">Create an organization first</option>
          ) : (
            organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))
          )}
        </select>
      </div>

      <div className="border-t border-white/[0.08] pt-5">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-stone-200">
          <Plus size={16} className="text-[#d7b56d]" />
          Create an event
        </h3>

        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label htmlFor="event-name" className="mb-2 block text-xs text-stone-400">
              Event name
            </label>
            <input
              id="event-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              minLength={2}
              maxLength={180}
              required
              placeholder="e.g. Annual Celebration"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="event-type" className="mb-2 block text-xs text-stone-400">
              Event type
            </label>
            <select
              id="event-type"
              value={eventType}
              onChange={(event) => setEventType(event.target.value)}
              className={`${inputClass} bg-[#171719]`}
            >
              {eventTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="event-venue" className="mb-2 block text-xs text-stone-400">
              Venue (optional)
            </label>
            <input
              id="event-venue"
              value={venue}
              onChange={(event) => setVenue(event.target.value)}
              maxLength={300}
              placeholder="Venue or event location"
              className={inputClass}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="event-start" className="mb-2 block text-xs text-stone-400">
                Start date and time
              </label>
              <input
                id="event-start"
                type="datetime-local"
                value={startsAt}
                onChange={(event) => setStartsAt(event.target.value)}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="event-end" className="mb-2 block text-xs text-stone-400">
                End date and time
              </label>
              <input
                id="event-end"
                type="datetime-local"
                value={endsAt}
                onChange={(event) => setEndsAt(event.target.value)}
                required
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="event-description" className="mb-2 block text-xs text-stone-400">
              Description (optional)
            </label>
            <textarea
              id="event-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={5000}
              rows={3}
              placeholder="Add useful information about the event"
              className={inputClass}
            />
          </div>

          <p className="text-xs leading-5 text-stone-500">
            Event times are saved using the Africa/Johannesburg time zone.
          </p>

          <button
            type="submit"
            disabled={saving || loading || organizations.length === 0}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#d7b56d] px-4 py-3 text-sm font-semibold text-[#17130a] transition hover:bg-[#e8c982] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            <Plus size={17} />
            {saving ? "Creating event..." : "Create event"}
          </button>
        </form>
      </div>

      <div className="border-t border-white/[0.08] pt-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-sm font-medium text-stone-200">Your events</h3>
          {!loading && (
            <span className="text-xs text-stone-500">
              {events.length} {events.length === 1 ? "event" : "events"}
            </span>
          )}
        </div>

        {loading ? (
          <p className="py-5 text-sm text-stone-500">Loading events...</p>
        ) : organizations.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 px-4 py-6 text-center">
            <Building2 size={24} className="mx-auto text-stone-600" />
            <p className="mt-3 text-sm text-stone-300">No workspace available</p>
            <p className="mt-1 text-xs text-stone-500">
              Create an organization above before adding events.
            </p>
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 px-4 py-6 text-center">
            <CalendarDays size={24} className="mx-auto text-stone-600" />
            <p className="mt-3 text-sm text-stone-300">No events in this workspace</p>
            <p className="mt-1 text-xs text-stone-500">
              Create your first event using the form above.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((item) => (
              <article
                key={item.id}
                className="space-y-4 rounded-xl border border-white/[0.08] bg-black/20 p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="break-words text-sm font-semibold text-stone-100">
                      {item.name}
                    </p>
                    <p className="mt-1 text-xs text-stone-500">
                      {eventTypes.find((type) => type.value === item.event_type)?.label ?? item.event_type}
                    </p>
                  </div>

                  <span className="w-fit rounded-full border border-[#d7b56d]/20 bg-[#d7b56d]/[0.07] px-3 py-1 text-[10px] uppercase tracking-wider text-[#e8c982]">
                    {item.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-stone-400">
                  <p className="flex items-start gap-2">
                    <Clock3 size={14} className="mt-0.5 shrink-0 text-[#d7b56d]" />
                    <span>
                      {formatDate(item.starts_at)}
                      {" – "}
                      {formatDate(item.ends_at)}
                    </span>
                  </p>
                  {item.venue && (
                    <p className="flex items-start gap-2">
                      <MapPin size={14} className="mt-0.5 shrink-0 text-[#d7b56d]" />
                      <span>{item.venue}</span>
                    </p>
                  )}
                  {item.description && (
                    <p className="whitespace-pre-wrap break-words leading-5 text-stone-500">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2 border-t border-white/[0.07] pt-3 sm:flex-row sm:items-center">
                  <label htmlFor={`status-${item.id}`} className="text-xs text-stone-500">
                    Event status
                  </label>
                  <select
                    id={`status-${item.id}`}
                    value={item.status}
                    disabled={updatingId === item.id}
                    onChange={(event) =>
                      void handleStatusChange(
                        item.id,
                        event.target.value as EventRecord["status"],
                      )
                    }
                    className="w-full rounded-lg border border-white/10 bg-[#171719] px-3 py-2 text-xs text-stone-200 outline-none focus:border-[#d7b56d]/50 disabled:opacity-50 sm:ml-auto sm:w-auto"
                  >
                    {statuses.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
