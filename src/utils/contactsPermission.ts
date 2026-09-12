// Simple permission utility for testing – returns a default granted response.
export async function requestContactsPermission() {
  // In production this would call Expo Permissions, but for tests we mock this.
  return { status: 'granted', canAskAgain: true };
}

