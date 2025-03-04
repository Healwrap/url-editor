import { defineExtensionMessaging } from "@webext-core/messaging"

interface ProtocolMap {
  getURL(data: string): string
  setURL(data: string): boolean
  openURL(data: string): boolean
  getIrameLinks(data: string): { url: string; key: number }[]
  reloadPage(data: string): boolean
}

export const { sendMessage, onMessage } =
  defineExtensionMessaging<ProtocolMap>()
