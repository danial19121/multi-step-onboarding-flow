# FlowStart — Multi-Step Form / Onboarding Flow

A frontend implementation of the **Multi-Step Form / Onboarding Flow** intern project brief. The application is built with React and Vite and focuses on a clear, accessible, responsive onboarding experience.

## Implemented requirements

| Brief requirement | Implementation |
|---|---|
| At least four meaningful steps plus final review | 4 onboarding steps + Review |
| Current and completed progress | Progress bar, percentage, step counter, completed check states |
| Required field and format validation | Name, email, phone, role, experience, goals, conditional company, review confirmation |
| Backward navigation without data loss | Back button + React state |
| Conditional field / branch | Company field appears for `5+ years` experience; Other goal text field appears when `Other` is selected |
| Accessibility | Explicit labels, fieldset/legend controls, `aria-invalid`, `role="alert"`, focus on validation errors, keyboard-friendly native controls |
| Draft persistence | `localStorage` under `flowstart-onboarding-draft-v1` |
| Confirmation state | Dedicated success screen after mock submission |
| Responsive UI | Mobile breakpoint at 700px |

These features map directly to the supplied project brief, which requires the flow to be working, organized and reproducible. fileciteturn0file0L5-L10

## Step map

1. **About you** — full name, email, phone.
2. **Your role** — role and experience level. Selecting `5+ years` reveals company/organization.
3. **Your goals** — multi-select goals. Selecting `Other` reveals a text field.
4. **Preferences** — product-update preference.
5. **Review** — summary of all answers and final confirmation checkbox.

The brief specifically asks for at least four meaningful steps plus a final review, progress tracking, validation, backward navigation and conditional logic. fileciteturn0file0L12-L21

## Validation rules

### Step 1
- Full name is required.
- Email is required and must match a basic email format.
- Phone is required and must contain a plausible phone-number format.

### Step 2
- Role is required.
- Experience level is required.
- If experience is `5+ years`, company/organization is required.

### Step 3
- At least one goal must be selected.
- If `Other` is selected, the additional goal description is required.

### Step 5
- The user must confirm that the information is correct before submission.

Validation happens before moving forward. Errors are shown next to the relevant control and the first invalid control receives focus.

## State-management approach

The project intentionally keeps state simple and dependency-light:

- `data` holds all form values.
- `current` tracks the active step.
- `errors` holds validation messages.
- `submitted` controls the final confirmation state.
- A `useEffect` serializes `data` into browser `localStorage` whenever the draft changes.
- The initial state is restored from local storage when the application opens.
- Successful mock submission removes the draft.

No backend, database, API key or external service is required.

## Conditional logic

There are two branches:

1. **Experience branch:** selecting `5+ years` reveals the Company / organization field and makes it required.
2. **Goal branch:** selecting `Other` reveals an additional goal description field and makes it required.

## Accessibility behavior

- Every text/select control has a visible `<label>`.
- Related option groups use `<fieldset>` and `<legend>`.
- Invalid fields expose `aria-invalid="true"`.
- Validation errors use `role="alert"`.
- The first invalid field is focused after validation fails.
- Native buttons, inputs, selects, checkboxes and radio buttons remain keyboard accessible.
- The confirmation state uses a semantic heading and live-friendly status copy.

## Responsive behavior

The desktop layout uses a centered card with a two-column form where appropriate. At widths below 700px, grids collapse to one column and the step labels become compact so the flow remains usable on small screens.

## Project structure

```text
multi-step-onboarding-flow/
├── index.html
├── package.json
├── README.md
└── src/
    ├── main.jsx
    └── styles.css
```

The supplied brief asks for clear file names, documented dependencies, a reproducible README and removal of abandoned/duplicate clutter. fileciteturn0file0L35-L45

## Requirements

- Node.js 18+ recommended
- npm
- A modern browser with local storage enabled

## Installation and setup

From the project root:

```bash
npm install
```

## Run in development

```bash
npm run dev
```

Vite will print the local development URL in the terminal. Open that URL in a browser.

## Production build

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Verification checklist

After a fresh install, verify the following manually:

- [ ] Step 1 blocks Continue when required values are missing.
- [ ] Invalid email is rejected.
- [ ] Step 2 blocks Continue without role/experience.
- [ ] Selecting `5+ years` shows the conditional company field.
- [ ] Step 3 requires at least one goal.
- [ ] Selecting `Other` shows the conditional goal description field.
- [ ] Back navigation keeps entered values.
- [ ] Refreshing the browser restores the draft.
- [ ] Review displays the entered data.
- [ ] Submission requires the confirmation checkbox.
- [ ] Successful submission displays the confirmation state.
- [ ] Mobile layout remains usable.

## Screenshots / sample outputs

The final repository can include screenshots captured from the running app during review. Do not claim screenshot results unless they have actually been captured from the submitted build. The project brief explicitly asks the README to include screenshots or sample outputs where useful and warns against reporting results that were not produced. fileciteturn0file0L27-L34

## Known limitations

- This is a frontend-only mock onboarding flow; there is no server-side submission.
- Draft persistence is browser-local and is cleared after successful mock submission.
- Email and phone validation are intentionally lightweight client-side checks.
- No authentication or production data storage is included.

## Submission package

The project brief asks for a GitHub repository, a ZIP uploaded to Google Drive, a demonstration video uploaded to Google Drive, and the README inside both the repository and ZIP. fileciteturn0file0L48-L63

For final submission, add the repository and Drive links supplied by your team/boss in the requested submission format.
