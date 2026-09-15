import { useMemo, useState, type ChangeEvent, type SyntheticEvent } from "react";
import type { WaitlistCopy } from "../../i18n/pages/waitlist";

type Props = {
  copy: WaitlistCopy;
  endpoint?: string;
  contactEmail: string;
};

type FormValues = {
  name: string;
  email: string;
  organization: string;
  role: string;
  interest: string;
  environment: string;
  useCase: string;
  stage: string;
  timeline: string;
  notes: string;
  consent: boolean;
};

const initialValues: FormValues = {
  name: "",
  email: "",
  organization: "",
  role: "",
  interest: "",
  environment: "",
  useCase: "",
  stage: "",
  timeline: "",
  notes: "",
  consent: false,
};

const track = (event: string) =>
  (window as Window & { umami?: { track: (name: string) => void } }).umami?.track(event);

export default function WaitlistForm({ copy, endpoint, contactEmail }: Props) {
  const [values, setValues] = useState(initialValues);
  const [step, setStep] = useState<0 | 1>(0);
  const [started, setStarted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "failure">("idle");

  const configured = useMemo(() => Boolean(endpoint && /^https:\/\//.test(endpoint)), [endpoint]);

  const update = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = event.target;
    const value = target instanceof HTMLInputElement && target.type === "checkbox" ? target.checked : target.value;
    setValues((current) => ({ ...current, [target.name]: value }));
    setErrors((current) => ({ ...current, [target.name]: "" }));
    if (!started) {
      setStarted(true);
      track("waitlist-form-start");
    }
  };

  const validate = (keys: Array<keyof FormValues>) => {
    const next: Record<string, string> = {};
    for (const key of keys) {
      if (!values[key]) next[key] = copy.required;
    }
    if (keys.includes("email") && values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      next.email = copy.invalidEmail;
    }
    setErrors(next);
    if (Object.keys(next).length) track("waitlist-validation-error");
    return Object.keys(next).length === 0;
  };

  const advance = () => {
    if (validate(["name", "email", "organization", "role"])) setStep(1);
  };

  const submit = async (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    event.preventDefault();
    if (!configured || !endpoint) return;
    if (!validate(["interest", "environment", "useCase", "stage", "timeline", "consent"])) return;
    setStatus("submitting");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, source: "whitzard-website-waitlist" }),
      });
      if (!response.ok) throw new Error(`Waitlist endpoint returned ${response.status}`);
      setStatus("success");
      track("waitlist-submit-success");
    } catch {
      setStatus("failure");
      track("waitlist-submit-failure");
    }
  };

  const field = (name: keyof FormValues, label: string, input: React.ReactNode) => (
    <label className="waitlist-field">
      <span>{label}</span>
      {input}
      {errors[name] && <small role="alert">{errors[name]}</small>}
    </label>
  );

  return (
    <form className="waitlist-form" onSubmit={submit} noValidate>
      {!configured && <aside className="waitlist-unavailable" aria-labelledby="waitlist-unavailable-title">
        <span aria-hidden="true">◎</span>
        <div><h2 id="waitlist-unavailable-title">{copy.unavailableTitle}</h2><p>{copy.unavailableBody}</p></div>
        <a className="button button--secondary button--small" href={`mailto:${contactEmail}?subject=${encodeURIComponent(copy.title)}`}>{copy.emailFallback} ↗</a>
      </aside>}
      <ol className="waitlist-steps" aria-label={copy.title}>
        {copy.steps.map((label, index) => <li key={label} className={index === step ? "is-current" : index < step ? "is-complete" : ""}><span>0{index + 1}</span>{label}</li>)}
      </ol>

      {step === 0 ? (
        <fieldset>
          <legend>{copy.steps[0]}</legend>
          <div className="waitlist-form__grid">
            {field("name", copy.fields.name, <input name="name" value={values.name} onChange={update} autoComplete="name" aria-invalid={Boolean(errors.name)} />)}
            {field("email", copy.fields.email, <input name="email" type="email" value={values.email} onChange={update} autoComplete="email" aria-invalid={Boolean(errors.email)} />)}
            {field("organization", copy.fields.organization, <input name="organization" value={values.organization} onChange={update} autoComplete="organization" aria-invalid={Boolean(errors.organization)} />)}
            {field("role", copy.fields.role, <input name="role" value={values.role} onChange={update} autoComplete="organization-title" aria-invalid={Boolean(errors.role)} />)}
          </div>
          <div className="waitlist-form__actions"><button className="button button--primary" type="button" onClick={advance}>{copy.next} →</button></div>
        </fieldset>
      ) : (
        <fieldset>
          <legend>{copy.steps[1]}</legend>
          <div className="waitlist-form__grid">
            {field("interest", copy.fields.interest, <select name="interest" value={values.interest} onChange={update} aria-invalid={Boolean(errors.interest)}><option value="" />{copy.options.interests.map((option) => <option key={option}>{option}</option>)}</select>)}
            {field("environment", copy.fields.environment, <input name="environment" value={values.environment} onChange={update} placeholder="LangChain / OpenAI Agents / Internal" aria-invalid={Boolean(errors.environment)} />)}
            {field("stage", copy.fields.stage, <select name="stage" value={values.stage} onChange={update} aria-invalid={Boolean(errors.stage)}><option value="" />{copy.options.stages.map((option) => <option key={option}>{option}</option>)}</select>)}
            {field("timeline", copy.fields.timeline, <select name="timeline" value={values.timeline} onChange={update} aria-invalid={Boolean(errors.timeline)}><option value="" />{copy.options.timelines.map((option) => <option key={option}>{option}</option>)}</select>)}
            <div className="waitlist-field--wide">{field("useCase", copy.fields.useCase, <textarea name="useCase" rows={4} value={values.useCase} onChange={update} aria-invalid={Boolean(errors.useCase)} />)}</div>
            <div className="waitlist-field--wide">{field("notes", copy.fields.notes, <textarea name="notes" rows={3} value={values.notes} onChange={update} />)}</div>
          </div>
          <label className="waitlist-consent"><input name="consent" type="checkbox" checked={values.consent} onChange={update} aria-invalid={Boolean(errors.consent)} /><span>{copy.fields.consent}</span></label>
          {errors.consent && <small className="waitlist-consent__error" role="alert">{errors.consent}</small>}
          <p className="waitlist-privacy">{copy.privacyNote}</p>
          {status === "success" && <p className="waitlist-status is-success" role="status">{copy.success}</p>}
          {status === "failure" && <p className="waitlist-status is-failure" role="alert">{copy.failure}</p>}
          <div className="waitlist-form__actions"><button className="button button--secondary" type="button" onClick={() => setStep(0)}>{copy.back}</button>{configured ? <button className="button button--primary" type="submit" disabled={status === "submitting" || status === "success"}>{status === "submitting" ? copy.submitting : copy.submit}</button> : <a className="button button--primary" href={`mailto:${contactEmail}?subject=${encodeURIComponent(copy.title)}`}>{copy.emailFallback} ↗</a>}</div>
        </fieldset>
      )}
    </form>
  );
}
