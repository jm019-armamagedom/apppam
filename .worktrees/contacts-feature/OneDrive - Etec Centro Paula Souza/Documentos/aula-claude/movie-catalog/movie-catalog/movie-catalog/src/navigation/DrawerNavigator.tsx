import { createDrawerNavigator } from '@react-navigation/drawer';
import { HomeScreen } from '../screens/HomeScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { WatchlistScreen } from '../screens/WatchlistScreen';
import { StackNavigator } from './StackNavigator';

const Drawer = createDrawerNavigator();

export const DrawerNavigator = () => (
  <Drawer.Navigator initialRouteName="AppStack">
    <Drawer.Screen name="AppStack" component={StackNavigator} options={{ title: 'Movie Catalog' }} />
    <Drawer.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
    <Drawer.Screen name="Search" component={SearchScreen} options={{ title: 'Search' }} />
    <Drawer.Screen name="Watchlist" component={WatchlistScreen} options={{ title: 'Watchlist' }} />
  </Drawer.Navigator>
);
