import type { Page } from '@playwright/test'
import { byTestId } from '../utils/byTestId'

export class HomePage {
  constructor(readonly page: Page) {}

  async visitHomeUrl() {
    await this.page.goto('/')
  }

  async getMenuCreateGameButton() {
    return this.page.locator(byTestId('Menu-MenuItem-CreateOrEnterRoom'))
  }

  async getCreateGameButton() {
    return this.page.locator(byTestId('CreateGameButton'))
  }

  async getRoomNameInput() {
    return this.page.locator(byTestId('CreateGameInput'))
  }

  async getRoom(roomName: string) {
    return this.page.locator(byTestId(`RoomsList-RoomItem-${roomName}`))
  }
}
