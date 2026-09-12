---
name: contacts-list-design
description: Design spec for a contacts list screen with infinite scroll, search filter, permission handling and local persistence.
metadata:
  type: reference
---

# Contacts List Design Specification

**Date:** 2026-09-10

## Overview
We need a new screen that displays **all contacts** from the device’s address book. The UI must support:
- Infinite scrolling (page‑wise loading) to handle large address books.
- A text search input that filters contacts locally in real‑time.
- A performant `FlatList` with proper recycling settings.
- Offline access by persisting the fetched contacts locally (AsyncStorage).
- Robust permission handling: when the user denies the contacts permission with `canAskAgain: false`, we must show a clear instruction directing them to the system settings page.

## Data Source
- Use **expo‑contacts** (or `react-native-contacts` as a fallback) to read the device’s contacts.
- Request `Permissions.CONTACTS` at runtime.
- Retrieve the full set of contacts (`getContactsAsync`) with the fields: `id, name, firstName, lastName, phoneNumbers, emails, image`.
- Store the raw array in AsyncStorage under the key `@contactsCache` for offline reads.
- On app launch, attempt to load cached contacts; if the cache is empty or stale (>24 h), refresh from the device.

## Permissions Flow
1. **Check permission** via `Permissions.getAsync(Permissions.CONTACTS)`.
2. If `status !== 'granted'`:
   - Call `Permissions.askAsync(Permissions.CONTACTS)`.
   - If the result is **denied** and `canAskAgain === false`:
     - Show an alert with a message:
       > "A permissão de acesso aos contatos foi negada permanentemente. Abra as Configurações do seu dispositivo → Aplicativos → [Seu App] → Permissões e habilite ‘Contatos’ para continuar."
     - Provide a button that opens the app settings using `Linking.openSettings()`.
3. If permission is granted, proceed to load contacts.

## UI Components
- **`ContactsScreen`** (in `src/screens/ContactsScreen.tsx`)
  - Contains a `TextInput` for search (debounced 300 ms).
  - Renders a `FlatList` with the following props for performance:
    ```tsx
    <FlatList
      data={visibleContacts}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      initialNumToRender={20}
      windowSize={10}
      maxToRenderPerBatch={20}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
    />
    ```
  - `renderItem` displays the contact’s avatar (if `image` exists), name, and primary phone/email.

- **`useContacts` hook** (`src/hooks/useContacts.ts`)
  - Manages loading, caching, pagination, and filtering logic.
  - Exposes:
    ```ts
    interface UseContactsResult {
      contacts: Contact[];          // full list (cached or fresh)
      filtered: Contact[];         // after search filter
      loadMore: () => void;        // fetch next page
      refresh: () => Promise<void>;// re‑fetch from device
      permissionStatus: PermissionResponse;
    }
    ```

## Pagination & Search
- Set a constant `PAGE_SIZE = 50`.
- Maintain `pageOffset` state; `loadMore` appends the next slice of the full contacts array.
- Search input updates a `searchQuery` state; the filtered list is derived by:
  ```ts
  const filtered = contacts.filter(c =>
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );
  ```
- Pagination works on the **filtered** array, so after a search the list restarts from page 0.

## Local Persistence (RF01)
- After the first successful fetch, store contacts in AsyncStorage:
  ```ts
  await AsyncStorage.setItem('@contactsCache', JSON.stringify(contacts));
  ```
- On app start, read the cache; if present and timestamp < 24 h, use it directly and skip the permission request (still need permission to re‑fetch, but we can show cached data immediately).

## Error Handling & Edge Cases
- **No contacts found** → display a friendly empty‑state message.
- **Permission denied permanently** → see Permissions Flow.
- **AsyncStorage errors** → log to console and fallback to in‑memory only.
- **Large avatar images** → request only thumbnail size via `image?.uri` with a max dimension of 64 px.

## Testing (RF01 Coverage)
- Unit tests for `useContacts` covering:
  - Permission requests and the `canAskAgain === false` path.
  - Caching logic and stale‑cache refresh.
  - Pagination boundaries.
  - Search filter correctness.
- UI snapshot tests for `ContactsScreen` with a mocked contacts list.
- Integration test on a real device/emulator to verify the settings‑link button opens the OS settings.

## Acceptance Criteria
1. The screen lists **all device contacts** with smooth infinite scroll.
2. Typing in the search bar instantly filters the list.
3. When permission is permanently denied, the user sees the instructional alert with a button that opens the system settings.
4. Contacts are persisted locally so the list is available offline and loads instantly on subsequent app launches.
5. All tests pass and the code follows the existing project’s linting and formatting rules.

---

**Next steps**
- Review this spec and approve or request changes.
- Once approved, we will invoke the `writing-plans` skill to generate the implementation plan.
