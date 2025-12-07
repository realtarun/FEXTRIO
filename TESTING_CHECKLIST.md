# Testing Checklist - Fextrio Vehicle Trips App

## Integration Testing

### 1. Authentication & Authorization

#### User Registration
- [ ] Register with valid email and password (8+ chars)
- [ ] Register with invalid email (should show error)
- [ ] Register with short password (should show error)
- [ ] Register with existing email (should show "already registered" error)
- [ ] Verify auto-login after successful registration
- [ ] Check profile is created in database

#### User Login
- [ ] Login with correct credentials
- [ ] Login with incorrect email (should show error)
- [ ] Login with incorrect password (should show error)
- [ ] Verify redirect to original page after login
- [ ] Check session persists after page refresh
- [ ] Verify user avatar displays correctly

#### Password Reset
- [ ] Request password reset with valid email
- [ ] Request password reset with non-existent email
- [ ] Verify reset email is sent (check backend logs)
- [ ] Test reset link functionality
- [ ] Verify old password doesn't work after reset

#### Session Management
- [ ] Verify session persists across page refreshes
- [ ] Test logout clears session completely
- [ ] Check automatic redirect to login when not authenticated
- [ ] Verify automatic redirect away from auth page when logged in

---

### 2. Vehicle Management

#### Create Vehicle
- [ ] Create vehicle with name and owner name
- [ ] Create vehicle with empty name (should show error)
- [ ] Create vehicle with empty owner name (should show error)
- [ ] Verify vehicle appears in list immediately
- [ ] Check vehicle is associated with current user

#### View Vehicles
- [ ] View empty state when no vehicles exist
- [ ] View list of vehicles after creating some
- [ ] Verify only user's own vehicles are shown
- [ ] Test vehicle cards display correctly (name, owner, stats)
- [ ] Check loading skeleton appears during fetch

#### Search Vehicles
- [ ] Search by vehicle name (partial match)
- [ ] Search by owner name (partial match)
- [ ] Search with no results (show empty state)
- [ ] Verify search is case-insensitive
- [ ] Test clearing search resets list

#### Edit Vehicle
- [ ] Edit vehicle name
- [ ] Edit owner name
- [ ] Edit with empty name (should show error)
- [ ] Verify changes reflect immediately
- [ ] Cancel edit preserves original data

#### Delete Vehicle
- [ ] Delete vehicle shows confirmation dialog
- [ ] Cancel delete preserves vehicle
- [ ] Confirm delete removes vehicle
- [ ] Verify associated trips are also deleted (cascade)
- [ ] Check deleted vehicle removed from list

---

### 3. Trip Management

#### Create Trip
- [ ] Add trip with date, cash, and earning
- [ ] Add trip with invalid date (should show error)
- [ ] Add trip with negative cash (should show error)
- [ ] Add trip with negative earning (should show error)
- [ ] Add trip with empty fields (should show errors)
- [ ] Verify trip appears in list immediately
- [ ] Check dashboard stats update correctly

#### View Current Month Trips
- [ ] View trips for current month on vehicle detail page
- [ ] Verify only current month trips are shown
- [ ] Check trips are sorted by date (newest first)
- [ ] Test empty state when no trips exist
- [ ] Verify "Showing: [Month Year]" displays correctly

#### Edit Trip
- [ ] Edit trip date
- [ ] Edit cash amount
- [ ] Edit earning amount
- [ ] Edit with invalid values (should show errors)
- [ ] Verify changes update dashboard stats
- [ ] Cancel edit preserves original data

#### Delete Trip
- [ ] Delete trip shows confirmation dialog
- [ ] Cancel delete preserves trip
- [ ] Confirm delete removes trip
- [ ] Verify dashboard stats update after delete

---

### 4. Dashboard & Statistics

#### Dashboard Metrics
- [ ] Verify Total Cash sums all trip cash values
- [ ] Verify Total Earnings sums all trip earning values
- [ ] Verify Total Trips counts all trips
- [ ] Verify Driver Salary = 30% of Total Earnings
- [ ] Check metrics update when trips are added/edited/deleted
- [ ] Test with zero trips (should show 0 for all metrics)

#### Real-time Updates
- [ ] Add trip and verify dashboard updates immediately
- [ ] Edit trip and verify stats recalculate
- [ ] Delete trip and verify stats decrease

---

### 5. Archive & Statement

#### Archive Page
- [ ] View archived trips (older than current month)
- [ ] Test with no archived trips (empty state)
- [ ] Verify pagination controls appear for 50+ trips
- [ ] Test pagination next/previous buttons
- [ ] Test pagination page numbers
- [ ] Check page indicator (showing X to Y of Z trips)

#### Date Range Filtering
- [ ] Filter trips from specific start date
- [ ] Filter trips to specific end date
- [ ] Filter trips with both start and end dates
- [ ] Clear filters returns to all archived trips
- [ ] Verify stats update based on filtered range

#### CSV Export
- [ ] Export trips to CSV
- [ ] Verify CSV contains correct headers
- [ ] Check CSV has all trip data (date, cash, earning)
- [ ] Verify totals row is included
- [ ] Test CSV filename includes vehicle name and date

#### Print Statement
- [ ] Click print button
- [ ] Verify print preview looks clean (no UI chrome)
- [ ] Check table formatting is print-friendly
- [ ] Verify headers and totals are included
- [ ] Test on different browsers

---

### 6. Role-Based Access Control (RBAC)

#### Owner Role
- [ ] Can create vehicles
- [ ] Can edit own vehicles
- [ ] Can delete own vehicles
- [ ] Can add/edit/delete trips
- [ ] Can view statements and archive

#### Manager Role (if multi-user enabled)
- [ ] Can add/edit/delete trips
- [ ] Cannot modify vehicle details
- [ ] Cannot delete vehicles
- [ ] Can view statements and archive

#### Viewer Role (if multi-user enabled)
- [ ] Can view vehicles
- [ ] Can view trips
- [ ] Cannot add/edit/delete trips
- [ ] Cannot modify vehicles
- [ ] Can view statements and archive (read-only)

#### Access Control
- [ ] Users cannot access other users' vehicles
- [ ] Direct URL access to other users' vehicles is blocked
- [ ] API calls for unauthorized data are rejected
- [ ] Proper error messages for unauthorized access

---

### 7. Edge Cases & Error Handling

#### Boundary Conditions
- [ ] Test with 0 trips (empty state)
- [ ] Test with 1 trip
- [ ] Test with 100+ trips (pagination)
- [ ] Test with very large numbers (cash/earning)
- [ ] Test with decimal values (0.50, 10.99)

#### Month Transitions
- [ ] Add trip on last day of month
- [ ] Verify trip appears in current month
- [ ] Wait for month to change (or manually test)
- [ ] Verify old trip moves to archive
- [ ] Check archive automation edge function logs

#### Network Errors
- [ ] Test with slow network (throttle in DevTools)
- [ ] Test with offline mode (should show errors)
- [ ] Verify loading states appear correctly
- [ ] Check error messages are user-friendly

#### Form Validation
- [ ] Test all required fields (show errors when empty)
- [ ] Test email validation (invalid email format)
- [ ] Test number validation (non-numeric input)
- [ ] Test date validation (invalid date format)
- [ ] Test minimum/maximum constraints

---

### 8. UI/UX Testing

#### Responsive Design
- [ ] Test on desktop (1920x1080)
- [ ] Test on tablet (768x1024)
- [ ] Test on mobile (375x667)
- [ ] Verify tables scroll horizontally on mobile
- [ ] Check navigation menu is accessible
- [ ] Test touch interactions on mobile

#### Loading States
- [ ] Verify skeletons appear during data loading
- [ ] Check loading spinners on buttons
- [ ] Test page-level loading states
- [ ] Ensure no flash of empty content

#### Empty States
- [ ] No vehicles empty state
- [ ] No trips empty state
- [ ] No search results empty state
- [ ] No archived trips empty state
- [ ] Verify helpful messages and CTAs

#### Animations
- [ ] Test fade-in animations on page load
- [ ] Check hover effects on interactive elements
- [ ] Verify button loading states animate
- [ ] Test page transitions are smooth

#### Accessibility
- [ ] Verify all forms have labels
- [ ] Check aria-labels on icon buttons
- [ ] Test keyboard navigation (tab through forms)
- [ ] Verify color contrast meets WCAG AA
- [ ] Test with screen reader (if available)

---

### 9. Performance Testing

#### Query Performance
- [ ] Create 100 trips for a vehicle
- [ ] Measure time to load vehicle detail page
- [ ] Test archive page with 200+ trips
- [ ] Verify pagination loads instantly
- [ ] Check date range filters respond quickly

#### Frontend Performance
- [ ] Measure page load time (< 3 seconds)
- [ ] Check time to interactive (< 5 seconds)
- [ ] Verify no layout shifts during loading
- [ ] Test animations don't cause jank

#### Database Performance
- [ ] Check edge function logs for slow queries
- [ ] Verify indexes are being used
- [ ] Test with concurrent users (if possible)

---

### 10. Security Testing

#### Authentication Security
- [ ] Verify passwords are hashed (never stored in plain text)
- [ ] Check session tokens are secure
- [ ] Test logout invalidates tokens
- [ ] Verify auto-refresh of expired tokens

#### RLS Policy Testing
- [ ] Attempt to access another user's vehicle (should fail)
- [ ] Try to modify another user's trip (should fail)
- [ ] Verify RLS policies block unauthorized database access
- [ ] Check error messages don't leak sensitive info

#### Input Security
- [ ] Test SQL injection in forms (should be prevented)
- [ ] Test XSS in text inputs (should be sanitized)
- [ ] Verify file upload limits (if applicable)
- [ ] Check CORS policies in edge functions

---

## Manual Testing Scenarios

### Scenario 1: New User Onboarding
1. Register a new account
2. Verify welcome/dashboard appears
3. Add first vehicle
4. Add first trip
5. View dashboard stats
6. Export statement

### Scenario 2: Month-End Workflow
1. Login to existing account
2. Add trips for last day of month
3. Verify trips appear in current month view
4. Check archive page (should be empty)
5. Simulate month transition (or test after month change)
6. Verify old trips moved to archive

### Scenario 3: Mobile User Experience
1. Open app on mobile device
2. Register/login
3. Create vehicle
4. Add trip using mobile date picker
5. View dashboard (verify responsive layout)
6. Export CSV (verify mobile download works)

### Scenario 4: Data Export
1. Create vehicle with 50+ trips
2. Go to archive page
3. Filter by date range
4. Export filtered trips to CSV
5. Verify CSV contains correct data
6. Test print functionality

---

## Automated Testing Recommendations

While this app currently uses manual testing, consider adding:
- Unit tests for utility functions (formatCurrency, date calculations)
- Integration tests for API calls
- E2E tests with Cypress or Playwright
- Visual regression tests for UI components

---

## Test Results Template

```
Date: [DATE]
Tester: [NAME]
Environment: [Production/Staging]
Browser: [Chrome/Firefox/Safari/etc]
Device: [Desktop/Mobile/Tablet]

✅ Passed: [COUNT]
❌ Failed: [COUNT]
⚠️ Warnings: [COUNT]

Critical Issues:
- [List any blocking issues]

Minor Issues:
- [List non-blocking issues]

Notes:
- [Any additional observations]
```

---

## Sign-off Criteria

Phase 3 is complete when:
- [ ] All critical user flows tested and working
- [ ] No critical security vulnerabilities
- [ ] Performance benchmarks met
- [ ] Mobile responsive verified
- [ ] Error handling verified
- [ ] Documentation complete

**Testing Status:** ⏳ Ready for Testing

Next: Begin manual testing using this checklist!
