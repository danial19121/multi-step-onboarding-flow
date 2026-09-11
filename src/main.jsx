import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const STORAGE_KEY = 'flowstart-onboarding-draft-v1'

const initialData = {
  fullName: '',
  email: '',
  phone: '',
  role: '',
  experience: '',
  company: '',
  goals: [],
  goalOther: '',
  updates: 'yes',
  reviewAccepted: false,
}

const steps = [
  { title: 'About you', short: 'Personal' },
  { title: 'Your role', short: 'Role' },
  { title: 'Your goals', short: 'Goals' },
  { title: 'Preferences', short: 'Prefs' },
  { title: 'Review', short: 'Review' },
]

const goalOptions = [
  'Improve productivity',
  'Learn new skills',
  'Build a portfolio',
  'Collaborate with a team',
]

function loadDraft() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? { ...initialData, ...JSON.parse(saved) } : initialData
  } catch {
    return initialData
  }
}

function App() {
  const [data, setData] = useState(loadDraft)
  const [current, setCurrent] = useState(0)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const firstErrorRef = useRef(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  useEffect(() => {
    if (Object.keys(errors).length) firstErrorRef.current?.focus()
  }, [errors])

  const completedCount = current
  const progress = Math.round((current / (steps.length - 1)) * 100)

  const update = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const toggleGoal = (goal) => {
    const next = data.goals.includes(goal)
      ? data.goals.filter(item => item !== goal)
      : [...data.goals, goal]
    update('goals', next)
  }

  const validate = (index) => {
    const next = {}
    if (index === 0) {
      if (!data.fullName.trim()) next.fullName = 'Enter your full name.'
      if (!data.email.trim()) next.email = 'Enter your email address.'
      else if (!/^\S+@\S+\.\S+$/.test(data.email)) next.email = 'Enter a valid email address.'
      if (!data.phone.trim()) next.phone = 'Enter your phone number.'
      else if (!/^[+\d][\d\s().-]{7,}$/.test(data.phone)) next.phone = 'Enter a valid phone number.'
    }
    if (index === 1) {
      if (!data.role) next.role = 'Select your role.'
      if (!data.experience) next.experience = 'Select your experience level.'
      if (data.experience === '5+ years' && !data.company.trim()) next.company = 'Company is required for 5+ years experience.'
    }
    if (index === 2) {
      if (!data.goals.length) next.goals = 'Select at least one goal.'
      if (data.goals.includes('Other') && !data.goalOther.trim()) next.goalOther = 'Tell us about your other goal.'
    }
    if (index === 4 && !data.reviewAccepted) next.reviewAccepted = 'Please confirm that your information is correct.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const nextStep = () => {
    if (!validate(current)) return
    setCurrent(value => Math.min(value + 1, steps.length - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const previousStep = () => {
    setErrors({})
    setCurrent(value => Math.max(value - 1, 0))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const submit = () => {
    if (!validate(4)) return
    setSubmitted(true)
    localStorage.removeItem(STORAGE_KEY)
  }

  const restart = () => {
    setData(initialData)
    setErrors({})
    setCurrent(0)
    setSubmitted(false)
    localStorage.removeItem(STORAGE_KEY)
  }

  const summaryRows = useMemo(() => [
    ['Name', data.fullName],
    ['Email', data.email],
    ['Phone', data.phone],
    ['Role', data.role],
    ['Experience', data.experience],
    ...(data.experience === '5+ years' ? [['Company', data.company]] : []),
    ['Goals', data.goals.join(', ')],
    ['Product updates', data.updates === 'yes' ? 'Yes' : 'No'],
  ], [data])

  if (submitted) {
    return (
      <main className="page center">
        <section className="success-card" aria-labelledby="success-title">
          <div className="success-icon" aria-hidden="true">✓</div>
          <p className="eyebrow">Onboarding complete</p>
          <h1 id="success-title">You’re all set, {data.fullName.split(' ')[0] || 'there'}.</h1>
          <p className="muted">Your mock onboarding submission was received successfully.</p>
          <div className="confirmation">
            <strong>Confirmation</strong>
            <span>Welcome to FlowStart</span>
          </div>
          <button className="button primary" onClick={restart}>Start another onboarding</button>
        </section>
      </main>
    )
  }

  return (
    <main className="page">
      <section className="shell" aria-label="Onboarding form">
        <header className="hero">
          <div>
            <span className="brand">FLOWSTART</span>
            <h1>Let’s get you set up.</h1>
            <p>Tell us a little about yourself. You can move back and forth without losing your progress.</p>
          </div>
          <div className="save-status" aria-live="polite"><span className="dot" /> Draft saved</div>
        </header>

        <div className="progress-area" aria-label={`Step ${current + 1} of ${steps.length}`}>
          <div className="progress-meta"><span>Step {current + 1} of {steps.length}</span><span>{progress}% complete</span></div>
          <div className="progress-track"><div className="progress-bar" style={{ width: `${progress}%` }} /></div>
          <ol className="step-list">
            {steps.map((step, index) => (
              <li key={step.title} className={`${index === current ? 'active' : ''} ${index < completedCount ? 'done' : ''}`}>
                <span className="step-number" aria-hidden="true">{index < completedCount ? '✓' : index + 1}</span>
                <span>{step.short}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="content">
          {current === 0 && <StepOne data={data} update={update} errors={errors} firstErrorRef={firstErrorRef} />}
          {current === 1 && <StepTwo data={data} update={update} errors={errors} firstErrorRef={firstErrorRef} />}
          {current === 2 && <StepThree data={data} update={update} toggleGoal={toggleGoal} errors={errors} firstErrorRef={firstErrorRef} />}
          {current === 3 && <StepFour data={data} update={update} />}
          {current === 4 && <StepReview data={data} update={update} errors={errors} firstErrorRef={firstErrorRef} rows={summaryRows} />}
        </div>

        <footer className="footer-actions">
          <button className="button secondary" onClick={previousStep} disabled={current === 0}>Back</button>
          {current < steps.length - 1 ? (
            <button className="button primary" onClick={nextStep}>Continue <span aria-hidden="true">→</span></button>
          ) : (
            <button className="button primary" onClick={submit}>Submit onboarding <span aria-hidden="true">✓</span></button>
          )}
        </footer>
      </section>
      <p className="footer-note">Your progress is stored locally in this browser. No server connection is used.</p>
    </main>
  )
}

function Field({ label, name, value, onChange, error, type = 'text', placeholder, required = true, inputRef }) {
  const id = `field-${name}`
  return (
    <div className="field">
      <label htmlFor={id}>{label}{required && <span aria-hidden="true"> *</span>}</label>
      <input ref={inputRef} id={id} name={name} type={type} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} />
      {error && <p className="error" id={`${id}-error`} role="alert">{error}</p>}
    </div>
  )
}

function SelectField({ label, name, value, onChange, options, error, inputRef }) {
  const id = `field-${name}`
  return (
    <div className="field">
      <label htmlFor={id}>{label} <span aria-hidden="true">*</span></label>
      <select ref={inputRef} id={id} name={name} value={value} onChange={e => onChange(e.target.value)} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined}>
        <option value="">Choose an option</option>
        {options.map(option => <option key={option}>{option}</option>)}
      </select>
      {error && <p className="error" id={`${id}-error`} role="alert">{error}</p>}
    </div>
  )
}

function StepOne({ data, update, errors, firstErrorRef }) {
  return <div className="step">
    <div className="step-heading"><p className="eyebrow">01 · About you</p><h2>Start with the basics</h2><p>We’ll use these details to personalize your onboarding experience.</p></div>
    <div className="grid two">
      <Field label="Full name" name="fullName" value={data.fullName} onChange={v => update('fullName', v)} error={errors.fullName} placeholder="e.g. Ayesha Khan" inputRef={errors.fullName ? firstErrorRef : null} />
      <Field label="Email address" name="email" type="email" value={data.email} onChange={v => update('email', v)} error={errors.email} placeholder="you@example.com" inputRef={errors.email && !errors.fullName ? firstErrorRef : null} />
      <Field label="Phone number" name="phone" type="tel" value={data.phone} onChange={v => update('phone', v)} error={errors.phone} placeholder="+92 300 1234567" inputRef={errors.phone && !errors.fullName && !errors.email ? firstErrorRef : null} />
    </div>
  </div>
}

function StepTwo({ data, update, errors, firstErrorRef }) {
  return <div className="step">
    <div className="step-heading"><p className="eyebrow">02 · Your role</p><h2>Tell us where you are today</h2><p>This helps us tailor examples and recommendations to your experience.</p></div>
    <div className="grid two">
      <SelectField label="Current role" name="role" value={data.role} onChange={v => update('role', v)} options={['Student', 'Designer', 'Developer', 'Product / Project Manager', 'Business / Operations', 'Other']} error={errors.role} inputRef={errors.role ? firstErrorRef : null} />
      <SelectField label="Experience level" name="experience" value={data.experience} onChange={v => update('experience', v)} options={['Less than 1 year', '1–2 years', '3–4 years', '5+ years']} error={errors.experience} inputRef={errors.experience && !errors.role ? firstErrorRef : null} />
    </div>
    {data.experience === '5+ years' && <div className="conditional"><div><span className="conditional-label">Experienced professional</span><p>One extra detail is shown because you selected 5+ years.</p></div><Field label="Company / organization" name="company" value={data.company} onChange={v => update('company', v)} error={errors.company} placeholder="e.g. Acme Studio" required={false} /></div>}
  </div>
}

function StepThree({ data, update, toggleGoal, errors, firstErrorRef }) {
  return <div className="step">
    <div className="step-heading"><p className="eyebrow">03 · Your goals</p><h2>What would you like to achieve?</h2><p>Select all that apply. Your choices can be changed before submission.</p></div>
    <fieldset className="goal-fieldset" aria-describedby={errors.goals ? 'goals-error' : undefined}>
      <legend>Primary goals <span aria-hidden="true">*</span></legend>
      <div className="goal-grid">
        {[...goalOptions, 'Other'].map(goal => <label className={`goal-card ${data.goals.includes(goal) ? 'selected' : ''}`} key={goal}>
          <input type="checkbox" checked={data.goals.includes(goal)} onChange={() => toggleGoal(goal)} ref={errors.goals && goal === goalOptions[0] ? firstErrorRef : null} />
          <span className="check" aria-hidden="true">{data.goals.includes(goal) ? '✓' : ''}</span><span>{goal}</span>
        </label>)}
      </div>
    </fieldset>
    {errors.goals && <p className="error" id="goals-error" role="alert">{errors.goals}</p>}
    {data.goals.includes('Other') && <div className="field other-goal"><label htmlFor="field-goalOther">Tell us your other goal <span aria-hidden="true">*</span></label><textarea id="field-goalOther" value={data.goalOther} onChange={e => update('goalOther', e.target.value)} placeholder="A short description" aria-invalid={!!errors.goalOther} /><span className="helper">Keep it brief — one sentence is enough.</span>{errors.goalOther && <p className="error" role="alert">{errors.goalOther}</p>}</div>}
  </div>
}

function StepFour({ data, update }) {
  return <div className="step">
    <div className="step-heading"><p className="eyebrow">04 · Preferences</p><h2>Choose how we keep in touch</h2><p>You can change this preference later.</p></div>
    <fieldset className="radio-fieldset"><legend>Product updates</legend>
      <label className={`radio-card ${data.updates === 'yes' ? 'selected' : ''}`}><input type="radio" name="updates" value="yes" checked={data.updates === 'yes'} onChange={e => update('updates', e.target.value)} /><span><strong>Yes, send useful updates</strong><small>Occasional product tips and feature news.</small></span></label>
      <label className={`radio-card ${data.updates === 'no' ? 'selected' : ''}`}><input type="radio" name="updates" value="no" checked={data.updates === 'no'} onChange={e => update('updates', e.target.value)} /><span><strong>No thanks</strong><small>We’ll only send essential account messages.</small></span></label>
    </fieldset>
    <div className="privacy-note"><span aria-hidden="true">🔒</span><div><strong>Your data stays in this browser</strong><p>This demo uses local storage to preserve your draft. There is no backend or external API.</p></div></div>
  </div>
}

function StepReview({ data, update, errors, firstErrorRef, rows }) {
  return <div className="step">
    <div className="step-heading"><p className="eyebrow">05 · Review</p><h2>Check everything before you submit</h2><p>Use Back if you want to make changes. Your answers will stay saved.</p></div>
    <div className="review-list">
      {rows.map(([label, value]) => <div className="review-row" key={label}><span>{label}</span><strong>{value || '—'}</strong></div>)}
    </div>
    <label className={`confirm ${errors.reviewAccepted ? 'has-error' : ''}`}>
      <input ref={firstErrorRef} type="checkbox" checked={data.reviewAccepted} onChange={e => update('reviewAccepted', e.target.checked)} aria-invalid={!!errors.reviewAccepted} />
      <span>I confirm that the information above is correct.</span>
    </label>
    {errors.reviewAccepted && <p className="error" role="alert">{errors.reviewAccepted}</p>}
  </div>
}

createRoot(document.getElementById('root')).render(<App />)
