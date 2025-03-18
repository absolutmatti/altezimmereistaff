import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Home, Calendar, Users, Clock, User } from 'react-native-feather';

import DashboardScreen from '../screens/DashboardScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import MeetingsScreen from '../screens/MeetingsScreen';
import CalendarScreen from '../screens/CalendarScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const navItems = [
  {
    name: "Dashboard",
    component: DashboardScreen,
    icon: Home,
    label: "Feed",
  },
  {
    name: "Schedule",
    component: ScheduleScreen,
    icon: Clock,
    label: "Dienstplan",
  },
  {
    name: "Meetings",
    component: MeetingsScreen,
    icon: Users,
    label: "Besprechungen",
  },
  {
    name: "Calendar",
    component: CalendarScreen,
    icon: Calendar,
    label: "Kalender",
  },
  {
    name: "Profile",
    component: ProfileScreen,
    icon: User,
    label: "Profil",
  },
];

function MyTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel || options.title || route.name;
        const isFocused = state.index === index;
        
        const tabItem = navItems.find(item => item.name === route.name);
        const IconComponent = tabItem ? tabItem.icon : null;

        // Pre-create the animated style
        const animatedStyle = useAnimatedStyle(() => {
          return {
            transform: [{ scale: withSpring(1) }],
          };
        });

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={styles.tabItem}
          >
            {isFocused && (
              <Animated.View 
                style={[
                  styles.activeBackground,
                  animatedStyle
                ]} 
              />
            )}
            
            <View style={styles.tabContent}>
              {IconComponent && (
                <IconComponent 
                  width={20} 
                  height={20} 
                  color={isFocused ? '#6366f1' : '#71717a'} 
                />
              )}
              <Text style={[
                styles.tabLabel, 
                isFocused ? styles.tabLabelActive : {}
              ]}>
                {tabItem ? tabItem.label : label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function NavigationBar() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={props => <MyTabBar {...props} />}
    >
      {navItems.map((item) => (
        <Tab.Screen
          key={item.name}
          name={item.name}
          component={item.component}
        />
      ))}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    height: 64,
    borderTopWidth: 1,
    borderTopColor: '#27272a',
    backgroundColor: '#09090b',
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  activeBackground: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: 4,
    bottom: 4,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 8,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    color: '#71717a',
  },
  tabLabelActive: {
    color: '#6366f1',
  },
});