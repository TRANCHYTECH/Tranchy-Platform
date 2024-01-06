import { useStores } from "app/models"
import { colors } from "app/theme"
import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { ActivityIndicator, Modal, Portal } from "react-native-paper"

export interface LoadingProviderProps {
  children: React.ReactNode
}

export const LoadingProvider: FC<LoadingProviderProps> = observer(function LoadingProvider({
  children,
}) {
  const { uiStore } = useStores()
  return (
    <>
      <Portal>
        <Modal visible={uiStore.busyIndicator} dismissable={false}>
          <ActivityIndicator animating={uiStore.busyIndicator} color={colors.palette.accent500} />
        </Modal>
      </Portal>
      {children}
    </>
  )
})
