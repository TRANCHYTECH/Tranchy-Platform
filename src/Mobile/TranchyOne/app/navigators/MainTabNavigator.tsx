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

function tabBarIcon(
  name:
    | "home-outline"
    | "comment-search-outline"
    | "message-plus"
    | "bell-outline"
    | "account-circle-outline",
  focused: boolean,
  color: string,
  size: number,
): React.ReactNode {
  return (
    <View
      style={
        focused
          ? {
              backgroundColor: colors.palette.accent200,
              paddingLeft: spacing.md,
              paddingRight: spacing.md,
              paddingTop: spacing.xs / 2,
              paddingBottom: spacing.xs / 2,
              borderRadius: spacing.md,
            }
          : {}
      }
    >
      <MaterialCommunityIcons name={name} size={size} color={color} />
    </View>
  )
}

const Tab = createBottomTabNavigator<MainTabNavigatorParamList>()
export const MainTabNavigator = () => {
  const { bottom } = useSafeAreaInsets()

  return (
    <Tab.Navigator
      initialRouteName="WalkAround"
      screenOptions={{
        headerShown: true,
        tabBarHideOnKeyboard: true,
        tabBarStyle: [$tabBar, { height: bottom + 80 }],
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
          tabBarIconStyle: {
            backgroundColor: colors.background,
            borderRadius: spacing.lg,
          },
          tabBarIcon: ({ focused, color, size }) =>
            tabBarIcon("home-outline", focused, color, size),
        }}
      />
      <Tab.Screen
        name="WalkAround"
        component={WalkAroundScreen}
        options={{
          title: translate("tab.walkAround"),
          tabBarLabel: translate("tab.walkAround"),
          tabBarIcon: ({ focused, color, size }) =>
            tabBarIcon("comment-search-outline", focused, color, size),
        }}
      />
      <Tab.Screen
        name="AskQuestionTab"
        component={View}
        options={{
          title: translate("tab.askQuestion"),
          tabBarLabel: translate("tab.askQuestion"),
          tabBarHideOnKeyboard: true,
          tabBarIcon: ({ focused, color, size }) =>
            tabBarIcon("message-plus", focused, color, size),
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
          tabBarIcon: ({ focused, color, size }) =>
            tabBarIcon("bell-outline", focused, color, size),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: translate("tab.profile"),
          tabBarLabel: translate("tab.profile"),
          tabBarIcon: ({ focused, color, size }) =>
            tabBarIcon("account-circle-outline", focused, color, size),
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
