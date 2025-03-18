import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NavigationBar from '../components/NavigationBar';
import DashboardScreen from '../screens/DashboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import MeetingsScreen from '../screens/MeetingsScreen';
import CalendarScreen from '../screens/CalendarScreen';
import NewsDetailScreen from '../screens/NewsDetailScreen';
import GeneralDetailScreen from '../screens/GeneralDetailScreen';
import CreateNewsScreen from '../screens/CreateNewsScreen';
import CreateGeneralScreen from '../screens/CreateGeneralScreen';
import EditNewsScreen from '../screens/EditNewsScreen';
import EditGeneralScreen from '../screens/EditGeneralScreen';
import { LoginScreen } from '../screens/PlaceholderScreens';

// Stack fürr Dashboard und alle zugehörigen Screens
const DashboardStack = createNativeStackNavigator();
function DashboardStackNavigator() {
  return (
    <DashboardStack.Navigator screenOptions={{ 
      headerShown: false,
      contentStyle: { backgroundColor: '#18181b' }
    }}>
      <DashboardStack.Screen name="DashboardMain" component={DashboardScreen} />
      <DashboardStack.Screen name="NewsDetail" component={NewsDetailScreen} />
      <DashboardStack.Screen name="GeneralDetail" component={GeneralDetailScreen} />
      <DashboardStack.Screen name="CreateNews" component={CreateNewsScreen} />
      <DashboardStack.Screen name="CreateGeneral" component={CreateGeneralScreen} />
      <DashboardStack.Screen name="EditNews" component={EditNewsScreen} />
      <DashboardStack.Screen name="EditGeneral" component={EditGeneralScreen} />
      <DashboardStack.Screen name="Login" component={LoginScreen} />
    </DashboardStack.Navigator>
  );
}

// Stack für Profil und alle zugehörigen Screens
const ProfileStack = createNativeStackNavigator();
function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ 
      headerShown: false,
      contentStyle: { backgroundColor: '#18181b' }
    }}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
      <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
      <ProfileStack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    </ProfileStack.Navigator>
  );
}

// Stack für Schedule und alle zugehörigen Screens
const ScheduleStack = createNativeStackNavigator();
function ScheduleStackNavigator() {
  return (
    <ScheduleStack.Navigator screenOptions={{ 
      headerShown: false,
      contentStyle: { backgroundColor: '#18181b' }
    }}>
      <ScheduleStack.Screen name="ScheduleMain" component={ScheduleScreen} />
      {/* Hier können weitere dienstplan-bezogene Screens hinzugefügt werden */}
    </ScheduleStack.Navigator>
  );
}

// Stack für Meetings und alle zugehörigen Screens
const MeetingsStack = createNativeStackNavigator();
function MeetingsStackNavigator() {
  return (
    <MeetingsStack.Navigator screenOptions={{ 
      headerShown: false,
      contentStyle: { backgroundColor: '#18181b' }
    }}>
      <MeetingsStack.Screen name="MeetingsMain" component={MeetingsScreen} />
      {/* Hier können weitere Meetings-bezogene Screens hinzugefügt werden */}
    </MeetingsStack.Navigator>
  );
}

// Stack für Calendar und alle zugehörigen Screens
const CalendarStack = createNativeStackNavigator();
function CalendarStackNavigator() {
  return (
    <CalendarStack.Navigator screenOptions={{ 
      headerShown: false,
      contentStyle: { backgroundColor: '#18181b' }
    }}>
      <CalendarStack.Screen name="CalendarMain" component={CalendarScreen} />
      {/* Weitere kalender-bezogene Screens können hier hinzugefügt werden */}
    </CalendarStack.Navigator>
  );
}

// Bottom Tab Navigator für die Hauptnavigation
const Tab = createBottomTabNavigator();
export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ 
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          display: 'none' // Tab bar wird ausgeblendet, da wir unsere eigene NavigationBar verwenden
        }
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardStackNavigator} />
      <Tab.Screen name="Schedule" component={ScheduleStackNavigator} />
      <Tab.Screen name="Meetings" component={MeetingsStackNavigator} />
      <Tab.Screen name="Calendar" component={CalendarStackNavigator} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
}