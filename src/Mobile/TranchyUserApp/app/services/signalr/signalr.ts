import { HubConnectionBuilder, HubConnection, HubConnectionState } from "@microsoft/signalr"
import Config from "../../config"

export class Signalr {
  private _hubConnection: HubConnection
  private _currentQuestionId: string
  public constructor() {
    this._hubConnection = new HubConnectionBuilder()
      .withUrl(`${Config.API_URL}conversation`)
      .build()

    // this._hubConnection.on("receiveMessage", (data) => {
    //   console.log(data)
    // })
  }

  start() {
    if (this._hubConnection.state === HubConnectionState.Disconnected) {
      return this._hubConnection.start()
    }

    return null
  }

  registerEvent(questionId: string, callback: (data: any) => void) {
    console.log("Register event")
    if (this._currentQuestionId === questionId) {
      return
    }

    this._hubConnection.on("receiveMessage", callback)
    this._currentQuestionId = questionId
  }
}

export const signalr = new Signalr()
