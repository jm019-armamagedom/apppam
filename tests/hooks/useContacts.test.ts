import { renderHook } from '@testing-library/react-hooks';
import { useContacts } from '../../src/hooks/useContacts';
import * as PermissionUtil from '../../src/utils/contactsPermission';

jest.mock('../../src/utils/contactsPermission');

test('loads contacts after permission granted (empty placeholder)', async () => {
  (PermissionUtil.requestContactsPermission as jest.Mock).mockResolvedValue({
    status: 'granted',
    canAskAgain: true,
  });

  const { result, waitForNextUpdate } = renderHook(() => useContacts());
  await waitForNextUpdate(); // wait for async init

  expect(result.current.contacts).toHaveLength(0);
});
