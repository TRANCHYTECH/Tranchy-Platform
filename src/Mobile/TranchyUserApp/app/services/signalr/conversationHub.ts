import {
  HubConnectionBuilder,
  HubConnection,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr"
import Config from "../../config"
import { api } from "../api"

export class ConversationHub {
  private _hubConnection: HubConnection

  constructor() {
    this._hubConnection = this.createHubConnection("conversation")
  }

  start() {
    if (this._hubConnection.state === HubConnectionState.Disconnected) {
      return this._hubConnection.start()
    }

    return Promise.resolve()
  }

  stop() {
    if (this._hubConnection.state !== HubConnectionState.Disconnected) {
      return this._hubConnection.stop()
    }

    return Promise.resolve()
  }

  join(conversationId: string) {
    return this._hubConnection.invoke("JoinConversation", conversationId)
  }

  registerReceiveEventHandler(handler: (data: any) => void) {
    const eventName = "receiveEvent"
    // Ensure to remove pervious handlers same name.
    this._hubConnection.off(eventName)
    this._hubConnection.on(eventName, (args) => handler(args))
  }

  private createHubConnection = (key: string) =>
    new HubConnectionBuilder()
      .withUrl(`${Config.API_URL}${key}`, {
        accessTokenFactory: () => {
          return api.apisauce.headers.Authorization.replace("Bearer ", "")
        },
      })
      .withAutomaticReconnect()
      .configureLogging({
        log: (logLevel: LogLevel, message: string) => {
          console.log("SIGNALR:", message)
        },
      })
      .build()

  // async createEvent(questionId: string, payload: any) {
  //   console.log("create event payload", payload)
  //   try {
  //     await this._hubConnection.invoke("CreateEvent", questionId, JSON.stringify(payload))
  //   } catch (error) {
  //     console.log("invoke error", error)
  //   }
  // }
}

export const conversationHub = new ConversationHub()
