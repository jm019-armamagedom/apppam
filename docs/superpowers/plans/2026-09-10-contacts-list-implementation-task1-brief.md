# Task 1 – Add contacts permission handling utilities

**Goal:** Implement robust permission handling for accessing device contacts.

**Files to create:**
- `src/utils/contactsPermission.ts`

**Interfaces:**
- Export function `requestContactsPermission(): Promise<{ status: string; canAskAgain: boolean }>`
- No inputs needed; returns the permission status.

**Steps (per plan):**
1. Write failing test (`tests/utils/contactsPermission.test.ts`).
2. Run test to confirm failure.
3. Implement minimal utility.
4. Run test to confirm pass.
5. Commit changes.

**Report file:** `docs/superpowers/plans/2026-09-10-contacts-list-implementation-task1-report.md`
