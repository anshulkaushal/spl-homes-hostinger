"use client";

import { useState } from "react";
import { intents } from "@/content/intents";
import { track } from "@/lib/analytics";
import { attributionForLead } from "@/lib/utm";

export function LeadMagnet() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(formData: FormData) {
    setStatus("loading");
    setError("");
    const payload = {
      source: "guide",
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      project_type: String(formData.get("project_type") ?? ""),
      consent: formData.get("consent") === "on",
      marketing_consent: formData.get("consent") === "on",
      company: String(formData.get("company") ?? ""),
      ...attributionForLead(),
    };

    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await response.json()) as { reference?: string; error?: string };
    if (!response.ok) {
      setStatus("error");
      setError(data.error ?? "Something went wrong. Please try again.");
      return;
    }
    setReference(data.reference ?? "");
    setStatus("done");
    track("guide_downloaded", { project_type: payload.project_type });
    track("lead_form_submitted", { source: "guide" });
  }

  return (
    <section className="bg-paper-2 py-20 sm:py-28">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-timber">
            Planning guide
          </p>
          <h2 className="font-display text-4xl sm:text-5xl">Planning a build or renovation?</h2>
          <p className="mt-4 text-ink-soft">
            Ask for the SPL Homes guide to planning your build. The PDF is a placeholder until the
            real document is supplied — we will still take your details and send it when it is ready.
          </p>
        </div>
        {status === "done" ? (
          <div className="bg-cream p-8">
            <h3 className="font-display text-2xl">Thanks — we have your request.</h3>
            <p className="mt-3 text-ink-soft">
              Your reference is <strong>{reference}</strong>. We will send the guide to your email
              when the file is published.
            </p>
          </div>
        ) : (
          <form
            className="bg-cream p-6 sm:p-8"
            onSubmit={(event) => {
              event.preventDefault();
              void onSubmit(new FormData(event.currentTarget));
            }}
          >
            <div className="grid gap-4">
              <label className="block text-sm font-medium">
                First name
                <input
                  required
                  name="name"
                  autoComplete="given-name"
                  className="mt-1 min-h-12 w-full border border-stone bg-paper px-3"
                />
              </label>
              <label className="block text-sm font-medium">
                Email
                <input
                  required
                  type="email"
                  name="email"
                  autoComplete="email"
                  className="mt-1 min-h-12 w-full border border-stone bg-paper px-3"
                />
              </label>
              <label className="block text-sm font-medium">
                Project type
                <select
                  required
                  name="project_type"
                  className="mt-1 min-h-12 w-full border border-stone bg-paper px-3"
                >
                  <option value="">Select</option>
                  {intents.map((intent) => (
                    <option key={intent.id} value={intent.plannerValue}>
                      {intent.title}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex items-start gap-3 text-sm text-ink-soft">
                <input required type="checkbox" name="consent" className="mt-1" />
                <span>
                  I agree SPL Homes may use these details to send the planning guide and contact me
                  about this enquiry. We will not add you to a promotional list.
                </span>
              </label>
              <div className="hidden" aria-hidden="true">
                <input name="company" tabIndex={-1} autoComplete="off" />
              </div>
              {error ? <p className="text-sm text-red-800">{error}</p> : null}
              <button
                type="submit"
                disabled={status === "loading"}
                className="min-h-12 bg-forest text-sm font-semibold uppercase tracking-wide text-cream disabled:opacity-60"
              >
                {status === "loading" ? "Sending…" : "Request the guide"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
