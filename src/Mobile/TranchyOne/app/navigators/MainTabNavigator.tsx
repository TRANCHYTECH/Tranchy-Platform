import React from "react"
import { CommunityScreen, NotificationScreen, ProfileScreen, WalkAroundScreen } from "app/screens"
import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { CommonActions, CompositeScreenProps } from "@react-navigation/native"
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"
import { translate } from "app/i18n"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { View } from "react-native"
import { colors, spacing } from "app/theme"
import { BottomNavigation } from "react-native-paper"

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
    <MaterialCommunityIcons name={name} size={size} color={color} />
    // <View
    // style={
    //   focused
    //     ? {
    //         backgroundColor: colors.palette.accent200,
    //         paddingLeft: spacing.md,
    //         paddingRight: spacing.md,
    //         paddingTop: spacing.xs / 2,
    //         paddingBottom: spacing.xs / 2,
    //         borderRadius: spacing.md,
    //       }
    //     : {}
    // }
    // >
    //   <MaterialCommunityIcons name={name} size={size} color={color} />
    // </View>
  )
}

const Tab = createBottomTabNavigator<MainTabNavigatorParamList>()
export const MainTabNavigator = () => {
  // const { bottom } = useSafeAreaInsets()

  return (
    <Tab.Navigator
      initialRouteName="WalkAround"
      screenOptions={{
        headerShown: true,
        // tabBarHideOnKeyboard: true,
        // tabBarStyle: [$tabBar, { height: bottom + 50 }],
        // tabBarActiveTintColor: colors.text,
        // tabBarInactiveTintColor: colors.text,
        // tabBarLabelStyle: $tabBarLabel,
        // tabBarItemStyle: $tabBarItem,
      }}
      tabBar={({ navigation, state, descriptors, insets }) => (
        <BottomNavigation.Bar
          keyboardHidesNavigationBar={true}
          navigationState={state}
          safeAreaInsets={insets}
          onTabPress={({ route, preventDefault }) => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            })

            if (event.defaultPrevented) {
              preventDefault()
            } else {
              navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key,
              })
            }
          }}
          renderIcon={({ route, focused, color }) => {
            const { options } = descriptors[route.key]
            if (options.tabBarIcon) {
              return options.tabBarIcon({ focused, color, size: 24 })
            }

            return null
          }}
          getLabelText={({ route }) => {
            const { options } = descriptors[route.key]
            const label = options.tabBarLabel?.toString() ?? options.title

            return label
          }}
          getBadge={({ route }) => {
            const { options } = descriptors[route.key]
            return options.tabBarBadge
          }}
        />
      )}
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

// const $tabBar: ViewStyle = {
//   backgroundColor: colors.background,
//   borderTopColor: colors.transparent,
// }

// const $tabBarItem: ViewStyle = {
//   paddingTop: spacing.md,
// }

// const $tabBarLabel: TextStyle = {
//   fontSize: 12,
//   fontFamily: typography.primary.medium,
//   lineHeight: 16,
// }
