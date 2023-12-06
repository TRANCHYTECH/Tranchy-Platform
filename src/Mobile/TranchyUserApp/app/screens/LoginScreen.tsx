// import { useStores } from "app/models"
import { Screen } from "app/components"
import { AppStackScreenProps } from "app/navigators"
import { observer } from "mobx-react-lite"
import React, { FC, useState } from "react"
import { View, ViewStyle } from "react-native"
// import { useNavigation } from "@react-navigation/native"
import { spacing } from "app/theme"
import { useAuth0 } from "react-native-auth0"
import { Button, Text } from "react-native-paper"
import { useStores } from "app/models"
import Config from "app/config"

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(_props) {
  const { authenticationStore } = useStores()
  const [isProcessing, setIsProcessing] = useState(false)

  // todo: handle callback, loading
  const { navigation } = _props
  const { authorize, getCredentials } = useAuth0()
  const login = async () => {
    setIsProcessing(true)
    await authorize({ scope: "offline_access", audience: Config.auth0Audience })
    const credentials = await getCredentials()
    authenticationStore.setAuthToken(credentials.accessToken)
    authenticationStore.distributeAuthToken()
    navigation.navigate("MyTabs", { screen: "CommunityQuestionList" })
  }

  // todo: process callback, loading
  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <View>
        <Text variant="displaySmall">Tranchy One Platform</Text>
        <Button mode={"contained"} onPress={login} loading={isProcessing}>
          Đăng nhập
        </Button>
      </View>
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
}
