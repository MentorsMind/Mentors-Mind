# Form Validation Implementation

## Step 1: Create `src/lib/schemas.ts`

- [x] Define type `SchemaField` with validators
- [x] Create schema objects for all 5 forms
- [x] Implement `validate<T>(schema, data)` function

## Step 2: Create `src/hooks/useForm.ts`

- [x] Generic `useForm<T>` hook
- [x] Handle change, blur, submit
- [x] Field-level errors with touched tracking

## Step 3: Update `Login.tsx`

- [x] Replace inline validation with `loginSchema` + `useForm`
- [x] Field-level errors on blur
- [x] Block submit on invalid

## Step 4: Update `Signup.tsx`

- [x] Replace inline validation with `signupSchema` + `useForm`
- [x] Field-level errors on blur

## Step 5: Update `MedicalRegistration.tsx`

- [x] Replace step-level validation with `medicalRegistrationSchema`
- [x] Nigerian phone regex, license format, experience 0–60
- [x] Field-level errors on all inputs across 3 steps

## Step 6: Update `BookingModal.tsx`

- [x] Replace bare `required` with `bookingSchema`
- [x] Field-level error on topic on blur

## Step 7: Update `ConsultationBookingModal.tsx`

- [x] Replace bare `required` with `consultationSchema`
- [x] Field-level errors on blur for all fields

## Acceptance Criteria

- [x] All forms show field-level errors on blur
- [x] Submit blocked on invalid state
- [x] Nigerian phone regex validates correctly
- [x] No Zod or external validation library
- [x] Error messages accessible via `aria-describedby`
