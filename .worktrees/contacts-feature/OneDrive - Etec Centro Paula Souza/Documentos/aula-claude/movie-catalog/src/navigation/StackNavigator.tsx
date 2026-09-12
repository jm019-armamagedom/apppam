import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { ResultsScreen } from '../screens/ResultsScreen';
import { DetailScreen } from '../screens/DetailScreen';
import { WatchlistScreen } from '../screens/WatchlistScreen';

const Stack = createNativeStackNavigator();

export const StackNavigator = () => (
  <Stack.Navigator initialRouteName="Home">
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Search" component={SearchScreen} />
    <Stack.Screen name="Results" component={ResultsScreen} />
    <Stack.Screen name="Detail" component={DetailScreen} />
    <Stack.Screen name="Watchlist" component={WatchlistScreen} />
  </Stack.Navigator>
);
