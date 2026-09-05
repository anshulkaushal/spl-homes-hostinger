"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { budgetBands, projectStages, timeframes } from "@/content/site";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import {
  buildProjectDetails,
  canAdvance,
  clearPlannerDraft,
  detailProfileFor,
  emptyPlannerForm,
  getOrCreateIdempotencyKey,
  normalizeProjectType,
  plannerProjectTypes,
  plannerSteps,
  plannerTypeLabel,
  readPlannerDraft,
  renovationScope,
  writePlannerDraft,
  type PlannerForm,
} from "@/lib/planner";
import { attributionForLead } from "@/lib/utm";

function Choice({
  selected,
  children,
  onClick,
}: {
  selected: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "min-h-12 border px-4 py-3 text-left text-sm transition-colors",
        selected ? "border-forest bg-forest text-cream" : "border-stone bg-cream hover:border-forest",
      )}
    >
      {children}
    </button>
  );
}

export function ProjectPlanner() {
  const params = useSearchParams();
  const [step, setStep] = useState(0);
  const [started, setStarted] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const [form, setForm] = useState<PlannerForm>(() => ({
    ...emptyPlannerForm,
    ...readPlannerDraft(),
    project_type: normalizeProjectType(params.get("type")) || readPlannerDraft()?.project_type || "",
  }));

  const details = useMemo(() => buildProjectDetails(form), [form]);
  const profile = detailProfileFor(form.project_type);
  const submitted = Boolean(reference);

  useEffect(() => {
    writePlannerDraft(form);
  }, [form]);

  function markStarted() {
    if (!started) {
      setStarted(true);
      track("project_planner_started", { project_type: form.project_type || undefined });
    }
  }

  function next() {
    markStarted();
    setStep((value) => Math.min(value + 1, plannerSteps.length - 1));
    track("project_planner_step_completed", {
      step: String(step + 1),
      step_name: plannerSteps[step],
      project_type: form.project_type || undefined,
    });
  }

  async function submit() {
    setStatus("loading");
    setError("");
    const attribution = attributionForLead();
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": getOrCreateIdempotencyKey(),
      },
      body: JSON.stringify({
        source: "planner",
        name: form.name,
        email: form.email,
        phone: form.phone,
        project_type: form.project_type,
        location: [form.suburb, form.city].filter(Boolean).join(", "),
        location_suburb: form.suburb,
        location_region: form.city,
        street_address: form.address || undefined,
        project_stage: form.project_stage,
        budget_range: form.budget_range,
        timeframe: form.timeframe,
        project_details: details,
        preferred_contact_method: form.preferred_contact,
        message: form.message,
        consent: true,
        marketing_consent: form.marketing_consent,
        ...attribution,
      }),
    });
    const data = (await response.json()) as { reference?: string; error?: string };
    if (!response.ok) {
      setStatus("error");
      setError(data.error ?? "Please check the form and try again.");
      return;
    }
    setReference(data.reference ?? "");
    setStatus("idle");
    clearPlannerDraft();
    track("project_planner_completed", { project_type: form.project_type });
    track("lead_form_submitted", { source: "planner" });
  }

  if (submitted) {
    return (
      <div className="bg-cream p-6 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-timber">Enquiry received</p>
        <h2 className="font-display mt-2 text-3xl sm:text-4xl">You’re away</h2>
        <p className="mt-6 text-lg text-ink-soft">
          Thanks. We have your enquiry. Your reference is <strong className="text-ink">{reference}</strong>.
        </p>
        <p className="mt-4 text-ink-soft">
          Someone from SPL Homes will be in touch using your preferred method. If the project is not
          a fit, you should still hear back.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-cream p-6 sm:p-10">
      <ol className="mb-8 flex gap-1" aria-label="Progress">
        {plannerSteps.map((label, index) => (
          <li
            key={label}
            className={cn("h-1 flex-1", index <= step ? "bg-forest" : "bg-stone")}
            aria-current={index === step ? "step" : undefined}
          />
        ))}
      </ol>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-timber">
        Step {step + 1} of {plannerSteps.length}
      </p>
      <h1 data-testid="planner-step" className="font-display mt-2 text-3xl sm:text-4xl">
        {plannerSteps[step]}
      </h1>

      {step === 0 && (
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {plannerProjectTypes.map((type) => (
            <Choice
              key={type.id}
              selected={form.project_type === type.id}
              onClick={() => {
                setForm((current) => ({ ...current, project_type: type.id }));
                track("project_type_selected", { project_type: type.id });
              }}
            >
              {type.label}
            </Choice>
          ))}
        </div>
      )}

      {step === 1 && (
        <div className="mt-8 grid gap-4">
          <Field label="Suburb" value={form.suburb} onChange={(suburb) => setForm((c) => ({ ...c, suburb }))} required />
          <Field label="City / region" value={form.city} onChange={(city) => setForm((c) => ({ ...c, city }))} required />
          <Field
            label="Street address (optional)"
            value={form.address}
            onChange={(address) => setForm((c) => ({ ...c, address }))}
          />
        </div>
      )}

      {step === 2 && (
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {projectStages.map((stage) => (
            <Choice
              key={stage.id}
              selected={form.project_stage === stage.id}
              onClick={() => setForm((c) => ({ ...c, project_stage: stage.id }))}
            >
              {stage.label}
            </Choice>
          ))}
        </div>
      )}

      {step === 3 && (
        <div className="mt-8 grid gap-4">
          {profile === "new_build" ? (
            <>
              <fieldset>
                <legend className="mb-3 text-sm font-medium">Do you own the land?</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {["Yes", "Under contract", "Looking"].map((item) => (
                    <Choice key={item} selected={form.owns_land === item} onClick={() => setForm((c) => ({ ...c, owns_land: item }))}>
                      {item}
                    </Choice>
                  ))}
                </div>
              </fieldset>
              <Field label="Approximate floor area" value={form.floor_area} onChange={(floor_area) => setForm((c) => ({ ...c, floor_area }))} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Bedrooms" value={form.bedrooms} onChange={(bedrooms) => setForm((c) => ({ ...c, bedrooms }))} />
                <Field label="Bathrooms" value={form.bathrooms} onChange={(bathrooms) => setForm((c) => ({ ...c, bathrooms }))} />
              </div>
              <fieldset>
                <legend className="mb-3 text-sm font-medium">Storeys</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {["Single storey", "Double storey", "Split / other"].map((storeys) => (
                    <Choice key={storeys} selected={form.storeys === storeys} onClick={() => setForm((c) => ({ ...c, storeys }))}>
                      {storeys}
                    </Choice>
                  ))}
                </div>
              </fieldset>
              <Field label="Garage requirement" value={form.garage} onChange={(garage) => setForm((c) => ({ ...c, garage }))} />
              <fieldset>
                <legend className="mb-3 text-sm font-medium">Do you already have plans?</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {["Yes", "Concept only", "Not yet"].map((item) => (
                    <Choice key={item} selected={form.has_plans === item} onClick={() => setForm((c) => ({ ...c, has_plans: item }))}>
                      {item}
                    </Choice>
                  ))}
                </div>
              </fieldset>
            </>
          ) : null}

          {profile === "renovation" || profile === "extension" ? (
            <fieldset>
              <legend className="mb-3 text-sm font-medium">What does the work include?</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {renovationScope.map((item) => {
                  const selected = form.reno_scope.includes(item);
                  return (
                    <Choice
                      key={item}
                      selected={selected}
                      onClick={() =>
                        setForm((c) => ({
                          ...c,
                          reno_scope: selected ? c.reno_scope.filter((value) => value !== item) : [...c.reno_scope, item],
                        }))
                      }
                    >
                      {item}
                    </Choice>
                  );
                })}
              </div>
            </fieldset>
          ) : null}

          {profile === "development" ? (
            <>
              <Field label="Approximate number of dwellings" value={form.units} onChange={(units) => setForm((c) => ({ ...c, units }))} />
              <fieldset>
                <legend className="mb-3 text-sm font-medium">Do you own the land?</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {["Yes", "Under contract", "Looking"].map((item) => (
                    <Choice key={item} selected={form.owns_land === item} onClick={() => setForm((c) => ({ ...c, owns_land: item }))}>
                      {item}
                    </Choice>
                  ))}
                </div>
              </fieldset>
            </>
          ) : null}

          {profile === "commercial" ? (
            <fieldset>
              <legend className="mb-3 text-sm font-medium">Will the space stay occupied during the work?</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {["Yes", "No", "Not sure"].map((item) => (
                  <Choice key={item} selected={form.occupied === item} onClick={() => setForm((c) => ({ ...c, occupied: item }))}>
                    {item}
                  </Choice>
                ))}
              </div>
            </fieldset>
          ) : null}

          <label className="block text-sm font-medium">
            Anything else we should know?
            <textarea
              value={form.notes}
              onChange={(event) => setForm((c) => ({ ...c, notes: event.target.value }))}
              rows={4}
              className="input mt-1"
            />
          </label>
        </div>
      )}

      {step === 4 && (
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {budgetBands.map((band) => (
            <Choice
              key={band.id}
              selected={form.budget_range === band.id}
              onClick={() => setForm((c) => ({ ...c, budget_range: band.id }))}
            >
              {band.label}
            </Choice>
          ))}
          <p className="sm:col-span-2 text-sm text-ink-soft">
            These bands help us prepare. They are not a quote and not SPL Homes pricing.
          </p>
        </div>
      )}

      {step === 5 && (
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {timeframes.map((item) => (
            <Choice
              key={item.id}
              selected={form.timeframe === item.id}
              onClick={() => setForm((c) => ({ ...c, timeframe: item.id }))}
            >
              {item.label}
            </Choice>
          ))}
        </div>
      )}

      {step === 6 && (
        <div className="mt-8 grid gap-4">
          <Field label="Name" value={form.name} onChange={(name) => setForm((c) => ({ ...c, name }))} required />
          <Field label="Email" type="email" value={form.email} onChange={(email) => setForm((c) => ({ ...c, email }))} required />
          <Field label="Phone" type="tel" value={form.phone} onChange={(phone) => setForm((c) => ({ ...c, phone }))} required />
          <fieldset>
            <legend className="text-sm font-medium">Preferred contact</legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {["phone", "email", "either"].map((method) => (
                <Choice
                  key={method}
                  selected={form.preferred_contact === method}
                  onClick={() => setForm((c) => ({ ...c, preferred_contact: method }))}
                >
                  {method[0].toUpperCase() + method.slice(1)}
                </Choice>
              ))}
            </div>
          </fieldset>
          <label className="block text-sm font-medium">
            Message (optional)
            <textarea
              value={form.message}
              onChange={(event) => setForm((c) => ({ ...c, message: event.target.value }))}
              rows={4}
              className="input mt-1"
            />
          </label>
          <label className="flex items-start gap-3 text-sm text-ink-soft">
            <input
              type="checkbox"
              checked={form.marketing_consent}
              onChange={(event) => setForm((c) => ({ ...c, marketing_consent: event.target.checked }))}
              className="mt-1"
            />
            <span>
              Optional: send me the planning guide and occasional project notes. We will not add you
              to a list without this.
            </span>
          </label>
          <p className="text-sm text-ink-soft">
            By continuing you agree we may contact you about this enquiry.
          </p>
        </div>
      )}

      {step === 7 && (
        <div className="mt-8 space-y-4 text-sm leading-6">
          <ReviewRow label="Project" value={plannerTypeLabel(form.project_type)} />
          <ReviewRow label="Location" value={[form.suburb, form.city].filter(Boolean).join(", ")} />
          <ReviewRow label="Stage" value={projectStages.find((stage) => stage.id === form.project_stage)?.label} />
          <ReviewRow label="Budget" value={budgetBands.find((band) => band.id === form.budget_range)?.label} />
          <ReviewRow label="Timeframe" value={timeframes.find((item) => item.id === form.timeframe)?.label} />
          <ReviewRow label="Contact" value={`${form.name} · ${form.email} · ${form.phone}`} />
          {details ? <ReviewRow label="Details" value={details} /> : null}
          {error ? (
            <div role="alert" className="border border-red-800/30 bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          ) : null}
        </div>
      )}

      <div className="mt-10 flex flex-wrap gap-3">
        {step > 0 ? (
          <button type="button" onClick={() => setStep((value) => value - 1)} className="btn-outline">
            Back
          </button>
        ) : null}
        {step < 7 ? (
          <button
            type="button"
            data-testid="planner-continue"
            disabled={!canAdvance(step, form)}
            onClick={next}
            className="btn-primary disabled:opacity-40"
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            disabled={!canAdvance(6, form) || status === "loading"}
            onClick={() => void submit()}
            className="btn-primary disabled:opacity-40"
          >
            {status === "loading" ? "Sending…" : "Submit enquiry"}
          </button>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
}) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <label className="block text-sm font-medium" htmlFor={id}>
      {label}
      <input
        id={id}
        required={required}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="input mt-1"
      />
    </label>
  );
}

function ReviewRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="border-t border-stone pt-3">
      <p className="text-xs uppercase tracking-[0.16em] text-timber">{label}</p>
      <p className="mt-1 whitespace-pre-wrap text-ink">{value}</p>
    </div>
  );
}
