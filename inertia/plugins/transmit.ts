// plugins/transmit.ts
import { Transmit } from '@adonisjs/transmit-client'
import { v7 as uuid } from 'uuid'
import { App } from 'vue'

let transmitInstance: Transmit

export default {
  install(app: App) {
    if (!transmitInstance) {
      transmitInstance = new Transmit({
        baseUrl: window.location.origin,
        uidGenerator: uuid,
      })
    }

    app.provide('transmit', transmitInstance)
  },
}

export function useTransmitInstance(): Transmit {
  return transmitInstance
}
