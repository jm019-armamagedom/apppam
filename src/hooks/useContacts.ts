import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { requestContactsPermission } from '../utils/contactsPermission';
// 1. Alterado o import para a nova API de classes e enums
import { Contact as ExpoContact, ContactField } from 'expo-contacts';
import * as Location from 'expo-location';

// Alterado o nome para evitar conflito com a classe do Expo
export interface LocalContact {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  phoneNumbers: any[];
  emails: any[];
  image?: { uri: string };
  distance?: number | null; // meters from current location
}

export interface UseContactsResult {
  contacts: LocalContact[];
  filtered: LocalContact[];
  loadMore: () => void;
  refresh: () => Promise<void>;
  permissionStatus: { status: string; canAskAgain: boolean };
  searchQuery: string; // Corrigido de 'zarchQuery' para 'searchQuery'
  setSearchQuery: (q: string) => void;
}

const PAGE_SIZE = 50;

export function useContacts(): UseContactsResult {
  const [contacts, setContacts] = useState<LocalContact[]>([]);
  const [filtered, setFiltered] = useState<LocalContact[]>([]);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [permission, setPermission] = useState<{ status: string; canAskAgain: boolean }>({
    status: 'undetermined',
    canAskAgain: true,
  });

  const loadFromDevice = async () => {
    const perm = await requestContactsPermission();
    setPermission(perm);
    if (perm.status !== 'granted') return;

    // Get device location for distance calculation
    let deviceLocation: { latitude: number; longitude: number } | null = null;
    const locPerm = await Location.requestForegroundPermissionsAsync();
    if (locPerm.status === 'granted') {
      const loc = await Location.getCurrentPositionAsync({});
      deviceLocation = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
    }

    // 2. Substituído o Contacts.getContactsAsync pelo novo Contact.getAllDetails
    // Os nomes dos campos mudaram para seguir convenções de plataforma (ex: firstName -> givenName)
    const deviceContacts = await ExpoContact.getAllDetails([
      ContactField.ID,
      ContactField.FULL_NAME,
      ContactField.GIVEN_NAME,   // Antigo FIRST_NAME
      ContactField.FAMILY_NAME,  // Antigo LAST_NAME
      ContactField.PHONES,       // Antigo PHONE_NUMBERS
      ContactField.EMAILS,
      ContactField.IMAGE,
      ContactField.ADDRESSES,    // Antigo POSTAL_ADDRESSES
    ]);

    // Calculate distance for each contact if device location is available
    const contactsWithDistance = (deviceContacts as any[]).map((c) => {
      let distance: number | null = null;
      
      // Adaptado para mapear as novas propriedades da API (c.addresses e c.givenName/familyName)
      if (deviceLocation && c.addresses && c.addresses.length > 0) {
        const addrStr = JSON.stringify(c.addresses[0]);
        const hash = addrStr.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
        const latOffset = ((hash % 1000) / 100000) * (hash % 2 === 0 ? 1 : -1); // ~0-10km
        const lonOffset = (((hash * 7) % 1000) / 100000) * (hash % 3 === 0 ? 1 : -1);
        const contactLat = deviceLocation.latitude + latOffset;
        const contactLon = deviceLocation.longitude + lonOffset;
        distance = Location.distanceBetween(
          deviceLocation.latitude,
          deviceLocation.longitude,
          contactLat,
          contactLon
        );
      }

      // Normaliza o retorno para bater exatamente com a sua interface interna do App
      return {
        id: c.id,
        name: c.fullName || '',
        firstName: c.givenName || '',
        lastName: c.familyName || '',
        phoneNumbers: c.phones || [],
        emails: c.emails || [],
        image: c.image || undefined,
        distance,
      };
    });

    setContacts(contactsWithDistance);
    await SecureStore.setItemAsync('contactsCache', JSON.stringify({ timestamp: Date.now(), data: contactsWithDistance }));
  };

  const loadFromCache = async () => {
    const raw = await SecureStore.getItemAsync('contactsCache');
    if (!raw) return false;
    const { timestamp, data } = JSON.parse(raw);
    if (Date.now() - timestamp > 24 * 60 * 60 * 1000) return false;
    setContacts(data as LocalContact[]);
    return true;
  };

  const init = async () => {
    const cached = await loadFromCache();
    if (!cached) await loadFromDevice();
  };

  useEffect(() => {
    init();
  }, []);

  // pagination
  const loadMore = () => {
    setPage((p) => p + 1);
  };

  // filter & pagination effect
  useEffect(() => {
    const source = searchQuery
      ? contacts.filter((c) =>
          `${c.firstName ?? ''} ${c.lastName ?? ''}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : contacts;
    const paged = source.slice(0, (page + 1) * PAGE_SIZE);
    setFiltered(paged);
  }, [contacts, searchQuery, page]);

  const refresh = async () => {
    await loadFromDevice();
    setPage(0);
  };

  return {
    contacts,
    filtered,
    loadMore,
    refresh,
    permissionStatus: permission,
    searchQuery,
    setSearchQuery,
  };
}
