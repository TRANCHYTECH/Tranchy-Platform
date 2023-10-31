import { Text, View } from "react-native"
import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { translate } from "app/i18n"
import React from "react"
import { CommunityQuestionListScreen, ProfileScreen, QuestionListScreen } from "app/screens"
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"
import { CompositeScreenProps } from "@react-navigation/native"

export type MyTabParamList = {
  Profile: undefined
  Blank: undefined
  CommunityQuestionList: undefined
}

/**
 * Helper for automatically generating navigation prop types for each route.
 *
 * More info: https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type MyTabScreenProps<T extends keyof MyTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<MyTabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

const Tab = createBottomTabNavigator()

function Blank() {
  return (
    <View>
      <Text>Blank</Text>
    </View>
  )
}

export function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      screenOptions={{
        tabBarActiveTintColor: "#e91e63",
      }}
    >
      <Tab.Screen
        name="Feed"
        component={CommunityQuestionListScreen}
        options={{
          title: translate("tab.community"),
          tabBarLabel: translate("tab.community"),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Questions"
        component={QuestionListScreen}
        options={{
          title: translate("tab.questions"),
          tabBarLabel: translate("tab.questions"),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={Blank}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault()
            navigation.navigate("NewQuestion")
          },
        })}
        options={{
          title: translate("tab.newQuestion"),
          tabBarLabel: translate("tab.newQuestion"),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="file-edit-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}
