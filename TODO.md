# Issue: Optimistic Booking with Rollback

## Steps

- [x] 1. Read and analyze all relevant files
- [x] 2. Create implementation plan (approved)
- [x] 3. Update `BookingContext.tsx`:
  - [x] Wrap optimistic add in `startTransition`
  - [x] Capture immutable snapshot (`[...sessions]`) before optimistic add
  - [x] Update `rollbackBooking` to accept snapshot and restore prior state
  - [x] Update `BookingContextType` interface
- [x] 4. Update `BookingModal.tsx`:
  - [x] Remove local `submitting` state and spinner
  - [x] Close modal immediately after calling `bookSession` (don't await)
  - [x] Handle errors via try/catch with toast
- [x] 5. Create `src/components/Toast.tsx`:
  - [x] Reusable toast component with info/success/error types
  - [x] Auto-dismiss with configurable duration
  - [x] Animated entrance with dismiss button
- [x] 6. Update `src/vite-env.d.ts`:
  - [x] Add `VITE_BOOKING_FAILURE_RATE` env var type declaration

