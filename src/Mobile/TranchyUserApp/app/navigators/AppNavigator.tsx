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
import { Button, useColorScheme } from "react-native"
import * as Screens from "app/screens"
import Config from "../config"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import { colors } from "app/theme"
import { MyTabParamList, MyTabs } from "./BottomNavigator"
import { useStores } from "app/models"

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
  MyTabs: NavigatorScreenParams<MyTabParamList>
  // 🔥 Your screens go here
  NewQuestion: undefined
  Login: undefined
  QuestionList: undefined
  QuestionDetails: { id: string }
  QuestionConversation: { id: string }
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
  const { authenticationStore, metadataStore } = useStores()
  if (authenticationStore.isAuthenticated) {
    authenticationStore.distributeAuthToken()
  }

  metadataStore.downloadMetadata(true)

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, navigationBarColor: colors.background, title: "todo" }}
      initialRouteName={authenticationStore.isAuthenticated ? "MyTabs" : "Login"}
    >
      {authenticationStore.isAuthenticated ? (
        <>
          <Stack.Screen name="MyTabs" component={MyTabs} />
          <Stack.Screen
            name="NewQuestion"
            options={{ headerShown: true, title: "Tạo câu hỏi mới" }}
            component={Screens.NewQuestionScreen}
          />
          {/** 🔥 Your screens go here */}
          <Stack.Screen name="QuestionList" component={Screens.QuestionListScreen} />
          <Stack.Screen
            name="QuestionDetails"
            options={{ headerShown: true, title: "Câu hỏi", headerBackVisible: true }}
            component={Screens.QuestionDetailsScreen}
          />
          <Stack.Screen
            name="QuestionConversation"
            options={{
              headerShown: true,
              title: "Trao đổi",
            }}
            component={Screens.QuestionConversationScreen}
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
