import { call, put, select, takeLatest } from 'redux-saga/effects'
import { opponentToCardsMapper, playerToCardsMapper, tableCardsMapper } from 'utils'
import { without } from 'lodash'
import {
  Card,
  CardColors,
  CardPositions,
  Game,
  GameStatus,
  GameTypes as SharedGameTypes,
  OpponentPositions,
  PlayerStatus,
  setPlayerStatusEmitAction,
  UpdateGameAction,
  RoomsTypes as SharedRoomTypes,
  ConnectToRoomSuccessAction,
  CreateRoomSuccessAction,
  startGameEmitAction,
} from '@memebattle/ligretto-shared'
import { updateGameAction, setPlayerColorAction, setGameLoadedAction } from './actions'
import { selectGameId, selectPlayerColor, selectPlayerStatus } from './selectors'
import { cardsActions } from 'ducks/cards'
import { GameTypes } from './types'

const opponentsPositionsOrder = [OpponentPositions.Left, OpponentPositions.Top, OpponentPositions.Right]

/**
 * @draft - maybe id instead of color usage will be correctly
 */
function* gameCardsUpdate(game: Game) {
  const playerColor: CardColors = yield select(selectPlayerColor)

  const players = Object.values(game.players)
  const player = players.find(player => player.color === playerColor)
  if (player === undefined) {
    return
  }

  const tableCards = tableCardsMapper(game.playground.decks.map(cardDeck => cardDeck.cards[0]))

  const opponentsCardsByPositions = without(players, player).reduce(
    (opponentCardsByPositions, opponent, opponentIndex) => ({
      ...opponentCardsByPositions,
      ...opponentToCardsMapper(opponent, opponentsPositionsOrder[opponentIndex]),
    }),
    {},
  )

  const cards: Partial<Record<CardPositions, Card>> = {
    ...playerToCardsMapper(player),
    ...opponentsCardsByPositions,
    ...tableCards,
  }

  yield put(cardsActions.pushCardsAction(cards))
}

function* gameUpdateSaga(action: UpdateGameAction) {
  const game = action.payload
  yield put(updateGameAction(game))

  if (game.status === GameStatus.InGame) {
    yield call(gameCardsUpdate, action.payload)
  }
}

function* togglePlayerStatusSaga() {
  const currentStatus = yield select(selectPlayerStatus)
  const gameId = yield select(selectGameId)

  const status = currentStatus === PlayerStatus.DontReadyToPlay ? PlayerStatus.ReadyToPlay : PlayerStatus.DontReadyToPlay

  yield put(setPlayerStatusEmitAction({ status, gameId }))
}

function* connectToRoomSuccessSaga(action: ConnectToRoomSuccessAction | CreateRoomSuccessAction) {
  yield put(updateGameAction(action.payload.game))
  yield put(setPlayerColorAction(action.payload.playerColor))
  yield put(setGameLoadedAction(true))
}

function* startGameSaga() {
  const gameId = yield select(selectGameId)
  yield put(startGameEmitAction({ gameId }))
}

export function* gameRootSaga() {
  yield takeLatest(SharedGameTypes.UPDATE_GAME, gameUpdateSaga)
  yield takeLatest(GameTypes.TOGGLE_PLAYER_STATUS, togglePlayerStatusSaga)
  yield takeLatest(GameTypes.START_GAME, startGameSaga)
  yield takeLatest([SharedRoomTypes.CONNECT_TO_ROOM_SUCCESS, SharedRoomTypes.CREATE_ROOM_SUCCESS], connectToRoomSuccessSaga)
}
