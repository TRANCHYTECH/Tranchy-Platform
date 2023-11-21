import { useCallback } from "react"
import { useFocusEffect } from "@react-navigation/native"
import { conversationHub } from "./conversationHub"

type ConversationHubProps = {
  receiveEventHandler: (data: any) => void
}

export function useConversationHub(props: ConversationHubProps) {
  useFocusEffect(
    useCallback(() => {
      async function config() {
        conversationHub.registerReceiveEventHandler(props.receiveEventHandler)
        await conversationHub.start()
      }

      config()
      return () => {
        conversationHub.stop().then(() => console.log("Conversation hub stopped"))
      }
    }, []),
  )
}
