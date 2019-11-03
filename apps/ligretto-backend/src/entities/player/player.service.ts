/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { inject, injectable } from 'inversify'
import { last, shuffle } from 'lodash'

import { PlayerRepository } from './player.repo'
import { Card } from '../../types'

@injectable()
export class PlayerService {
  constructor(@inject(PlayerRepository) private playerRepository: PlayerRepository) {}

  async getPlayer(gameId: string, color: string) {
    return await this.playerRepository.getPlayer(gameId, color)
  }

  async getCard(gameId: string, color: string, position: number) {
    return await this.playerRepository.getCard(gameId, color, position)
  }

  async addCard(gameId: string, color: string, card: Card) {
    const cards = await this.playerRepository.getCards(gameId, color)
    if (cards.length < 3) {
      await this.playerRepository.addCard(gameId, color, card)
    }
  }

  async removeCard(gameId: string, color: string, position: number) {
    await this.playerRepository.removeCard(gameId, color, position)

    return undefined
  }

  async removeCardFromLigrettoDeck(gameId: string, color: string) {
    return this.playerRepository.removeCardFromLigrettoDeck(gameId, color)
  }

  async removeCardFromStackOpenDeck(gameId: string, color: string) {
    await this.playerRepository.removeCardFromStackOpenDeck(gameId, color)
    return await this.getCardFromStackOpenDeck(gameId, color)
  }

  async getCardFromStackOpenDeck(gameId: string, color: string) {
    const deck = await this.playerRepository.getStackOpenDeck(gameId, color)
    return last(deck.cards)
  }

  async shuffleStackDeck(gameId: string, color: string) {
    const stackOpenDeck = await this.playerRepository.getStackOpenDeck(gameId, color)
    const stackDeck = await this.playerRepository.getStackDeck(gameId, color)

    if (stackDeck.cards.length !== 0) {
      return
    }

    await this.playerRepository.updateStackDeck(gameId, color, stackDeck => ({
      ...stackDeck,
      cards: shuffle(stackOpenDeck.cards),
    }))

    await this.playerRepository.updateStackOpenDeck(gameId, color, stackOpenDeck => ({
      ...stackOpenDeck,
      cards: [],
    }))
  }

  async takeFromStackDeck(gameId: string, color: string) {
    let cards = []

    await this.playerRepository.updateStackDeck(gameId, color, stackDeck => {
      cards = stackDeck.cards.slice(-3)

      return {
        ...stackDeck,
        cards: stackDeck.cards.slice(0, -3),
      }
    })

    await this.playerRepository.updateStackOpenDeck(gameId, color, stackOpenDeck => ({
      ...stackOpenDeck,
      cards: stackOpenDeck.cards.concat(cards),
    }))
  }

  async takeFromLigrettoDeck(gameId: string, color: string) {
    const deck = await this.playerRepository.getLigrettoDeck(gameId, color)
    const card = last(deck.cards)
    await this.addCard(gameId, color, card)
    return await this.removeCardFromLigrettoDeck(gameId, color)
  }
}