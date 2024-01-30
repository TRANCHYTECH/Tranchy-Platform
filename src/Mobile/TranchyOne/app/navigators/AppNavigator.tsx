/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  NavigatorScreenParams,
} from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import React from "react"
import { View, useColorScheme } from "react-native"
import * as Screens from "app/screens"
import Config from "../config"
import { useStores } from "../models"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import { colors } from "app/theme"
import { MainTabNavigator, MainTabNavigatorParamList } from "./MainTabNavigator"
import { Text } from "react-native-paper"
import { translate } from "app/i18n"
import { useAuth0 } from "react-native-auth0"

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type AppStackParamList = {
  Welcome: undefined
  Login: undefined
  QuestionConversation: { id: string }
  // 🔥 Your screens go here
  Community: undefined
  WalkAround: undefined
  AskQuestion: undefined
  Notification: undefined
  MainTab: NavigatorScreenParams<MainTabNavigatorParamList>
  RecentQuestions: undefined
  QuestionDetail: { id: string }
  // IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST
}

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStack = observer(function AppStack() {
  const {
    authenticationStore: { isAuthenticated, distributeAuthToken },
    metadataStore,
    questionStore,
  } = useStores()
  const { user } = useAuth0()

  if (__DEV__) {
    console.tron.log("auth ", user)
  }
  if (isAuthenticated) {
    distributeAuthToken()
    metadataStore.getConfigurations(true)
    // todo:  better to get kind of  this info
    questionStore.getSavedQuestions()
  }

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, navigationBarColor: colors.background }}
      initialRouteName={isAuthenticated ? "MainTab" : "Login"}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="MainTab" component={MainTabNavigator} />
          <Stack.Screen
            name="AskQuestion"
            component={Screens.NewQuestionScreen}
            options={{ headerShown: true, title: "Tạo câu hỏi mới" }}
          />

          {/** 🔥 Your screens go here */}
          <Stack.Screen
            name="RecentQuestions"
            component={Screens.RecentQuestionsScreen}
            options={{
              headerShown: true,
              title: translate("recentQuestionScreen.title"),
              headerRight: () => (
                <View>
                  <Text>Filter</Text>
                </View>
              ),
            }}
          />
          <Stack.Screen
            name="QuestionDetail"
            component={Screens.QuestionDetailScreen}
            options={{
              headerShown: true,
              title: "Câu hỏi",
              headerBackVisible: true,
              headerBackTitleVisible: false,
            }}
          />
          {/* IGNITE_GENERATOR_ANCHOR_APP_STACK_SCREENS */}
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={Screens.LoginScreen} />
        </>
      )}
    </Stack.Navigator>
  )
})

export interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = observer(function AppNavigator(props: NavigationProps) {
  const colorScheme = useColorScheme()

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      {...props}
    >
      <AppStack />
    </NavigationContainer>
  )
})
