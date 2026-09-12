import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export interface DeviceLocation {
  latitude: number;
  longitude: number;
}

export function useDeviceLocation() {
  const [location, setLocation] = useState<DeviceLocation | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [permission, setPermission] = useState<{ status: string; canAskAgain: boolean }>({
    status: 'undetermined',
    canAskAgain: true,
  });

  useEffect(() => {
    (async () => {
      const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
      setPermission({ status, canAskAgain });
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
    })();
  }, []);

  return { location, errorMsg, permission };
}
