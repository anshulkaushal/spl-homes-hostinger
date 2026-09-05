"use client";

import { useState } from "react";
import { intents } from "@/content/intents";
import { track } from "@/lib/analytics";
import { attributionForLead } from "@/lib/utm";

export function QuickEnquiry() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(formData: FormData) {
    setStatus("loading");
    setError("");
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "contact",
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        project_type: String(formData.get("project_type") ?? ""),
        message: String(formData.get("message") ?? ""),
        consent: formData.get("consent") === "on",
        company: String(formData.get("company") ?? ""),
        ...attributionForLead(),
      }),
    });
    const data = (await response.json()) as { reference?: string; error?: string };
    if (!response.ok) {
      setStatus("error");
      setError(data.error ?? "Please check the form and try again.");
      return;
    }
    setReference(data.reference ?? "");
    setStatus("done");
    track("lead_form_submitted", { source: "contact" });
  }

  if (status === "done") {
    return (
      <div className="bg-cream p-8">
        <h2 className="font-display text-2xl">Thanks — we have your message.</h2>
        <p className="mt-3 text-ink-soft">
          Your reference is <strong>{reference}</strong>.
        </p>
      </div>
    );
  }

  return (
    <form
      className="bg-cream p-6 sm:p-8"
      onSubmit={(event) => {
        event.preventDefault();
        void onSubmit(new FormData(event.currentTarget));
      }}
    >
      <h2 className="font-display text-2xl">Quick enquiry</h2>
      <div className="mt-6 grid gap-4">
        <label className="text-sm font-medium">
          Name
          <input required name="name" className="mt-1 min-h-12 w-full border border-stone bg-paper px-3" />
        </label>
        <label className="text-sm font-medium">
          Email
          <input required type="email" name="email" className="mt-1 min-h-12 w-full border border-stone bg-paper px-3" />
        </label>
        <label className="text-sm font-medium">
          Phone
          <input required type="tel" name="phone" className="mt-1 min-h-12 w-full border border-stone bg-paper px-3" />
        </label>
        <label className="text-sm font-medium">
          Project type
          <select required name="project_type" className="mt-1 min-h-12 w-full border border-stone bg-paper px-3">
            <option value="">Select</option>
            {intents.map((intent) => (
              <option key={intent.id} value={intent.plannerValue}>
                {intent.title}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium">
          Message
          <textarea required name="message" rows={4} className="mt-1 w-full border border-stone bg-paper px-3 py-2" />
        </label>
        <label className="flex items-start gap-3 text-sm text-ink-soft">
          <input required type="checkbox" name="consent" className="mt-1" />
          <span>I agree SPL Homes may contact me about this enquiry.</span>
        </label>
        <div className="hidden" aria-hidden="true">
          <input name="company" tabIndex={-1} autoComplete="off" />
        </div>
        {error ? <p className="text-sm text-red-800">{error}</p> : null}
        <button
          type="submit"
          disabled={status === "loading"}
          className="min-h-12 bg-forest text-sm font-semibold uppercase tracking-wide text-cream"
        >
          {status === "loading" ? "Sending…" : "Send enquiry"}
        </button>
      </div>
    </form>
  );
}
