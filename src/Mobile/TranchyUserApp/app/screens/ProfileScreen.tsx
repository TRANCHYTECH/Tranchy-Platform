import React, { FC } from "react"
import { View, ViewStyle } from "react-native"
import { Screen } from "app/components"
import { Button, Text } from "react-native-paper"
import { MyTabScreenProps } from "../navigators/BottomNavigator"
import { spacing } from "app/theme"
import { useAuth0 } from "react-native-auth0"
// import { useNavigation } from "@react-navigation/native"
import { useStores } from "app/models"

export const ProfileScreen: FC<MyTabScreenProps<"Profile">> = function ProfileScreen(_props) {
  const { authenticationStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  const { user, clearSession } = useAuth0()

  const logout = async () => {
    await clearSession({})
    authenticationStore.logout()
  }
  return (
    <Screen contentContainerStyle={$container} preset="scroll" safeAreaEdges={["top"]}>
      <View>
        <Text>User: {user?.email}</Text>
        <Button mode="contained" onPress={logout}>
          Logout
        </Button>
      </View>
    </Screen>
  )
}

const $container: ViewStyle = {
  paddingTop: spacing.lg + spacing.xl,
  paddingHorizontal: spacing.lg,
}
