import React from "react"
import { CommunityScreen, NotificationScreen, ProfileScreen, WalkAroundScreen } from "app/screens"
import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps } from "@react-navigation/native"
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"
import { translate } from "app/i18n"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { TextStyle, View, ViewStyle } from "react-native"
import { colors, spacing, typography } from "app/theme"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export type MainTabNavigatorParamList = {
  Community: undefined
  WalkAround: undefined
  AskQuestionTab: undefined
  Notification: undefined
  Profile: undefined
}

export type MainTabScreenProps<T extends keyof MainTabNavigatorParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainTabNavigatorParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

const Tab = createBottomTabNavigator<MainTabNavigatorParamList>()
export const MainTabNavigator = () => {
  const { bottom } = useSafeAreaInsets()

  return (
    <Tab.Navigator
      initialRouteName="WalkAround"
      screenOptions={{
        headerShown: true,
        tabBarHideOnKeyboard: true,
        tabBarStyle: [$tabBar, { height: bottom + 70 }],
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.text,
        tabBarLabelStyle: $tabBarLabel,
        tabBarItemStyle: $tabBarItem,
      }}
    >
      <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={{
          title: translate("tab.community"),
          tabBarLabel: translate("tab.community"),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="WalkAround"
        component={WalkAroundScreen}
        options={{
          title: translate("tab.walkAround"),
          tabBarLabel: translate("tab.walkAround"),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="comment-search-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="AskQuestionTab"
        component={View}
        options={{
          title: translate("tab.askQuestion"),
          tabBarLabel: translate("tab.askQuestion"),
          tabBarHideOnKeyboard: true,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="message-plus" color={color} size={size} />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault()
            navigation.navigate("AskQuestion")
          },
        })}
      />
      <Tab.Screen
        name="Notification"
        component={NotificationScreen}
        options={{
          title: translate("tab.notification"),
          tabBarLabel: translate("tab.notification"),
          tabBarBadge: 3,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="bell-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: translate("tab.profile"),
          tabBarLabel: translate("tab.profile"),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-circle-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

const $tabBar: ViewStyle = {
  backgroundColor: colors.background,
  borderTopColor: colors.transparent,
}

const $tabBarItem: ViewStyle = {
  paddingTop: spacing.md,
}

const $tabBarLabel: TextStyle = {
  fontSize: 12,
  fontFamily: typography.primary.medium,
  lineHeight: 16,
}
