import { Provider as PaperProvider } from 'react-native-paper';
import { QueryProvider } from './src/app/QueryProvider';
import { NavigationContainer } from '@react-navigation/native';
import { DrawerNavigator } from './src/navigation/DrawerNavigator';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export default function App() {
  return (
    <PaperProvider>
      <QueryProvider>
        <NavigationContainer>
          <DrawerNavigator />
        </NavigationContainer>
      </QueryProvider>
      {__DEV__ && <ReactQueryDevtools initialIsOpen={false} />}
    </PaperProvider>
  );
}
