# Optimistic Update Pattern Implementation

## Steps

- [x] 1. Create plan and get approval
- [ ] 2. Create `.env` file with `VITE_BOOKING_FAILURE_RATE=0.1`
- [ ] 3. Update `BookingContext.tsx`:
  - [ ] Add `'optimistic'` to Session.status union
  - [ ] Import `useTransition` and `useRef` from React
  - [ ] Import `showToast` from `lib/toast`
  - [ ] Implement optimistic add with snapshot-based rollback
  - [ ] Use `startTransition` for non-urgent status resolution
  - [ ] Add 10% failure rate using `VITE_BOOKING_FAILURE_RATE`
  - [ ] Expose `rollbackBooking` function
- [ ] 4. Update `BookingModal.tsx`:
  - [ ] Remove local `loading`/`success` state management
  - [ ] Close modal immediately after optimistic submit
  - [ ] Let context handle toast/rollback on failure
- [ ] 5. Done!

