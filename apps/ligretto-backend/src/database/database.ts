import { injectable } from 'inversify'
import { Storage } from './storage'

export const storage: Storage = {
  games: {},
  users: {},
}

type Accessor<T> = (storage: Storage) => T
type Setter<T = void> = (storage: Storage) => T

export interface Database {
  get<T>(accessor: Accessor<T>): Promise<T>
  set<T>(setter: Setter<T>): Promise<T>
  addUpdateListener(key: string, getter: (storage: Storage) => object, callback: (changes: object | undefined) => void): void
  removeUpdateListener(key: string): void
}

const createChangesWatcher = <T extends {}>(obj: T) => {
  let oldValue = JSON.stringify(obj)

  return (obj: T) => {
    const value = JSON.stringify(obj)
    if (oldValue !== value) {
      oldValue = value

      return obj
    }

    return undefined
  }
}

@injectable()
export class Database implements Database {
  private storage: Storage = {
    games: {},
    users: {},
  }

  private listeners = {}

  private notifyListeners() {
    for (const listenerKey in this.listeners) {
      if (this.listeners.hasOwnProperty(listenerKey)) {
        const listener = this.listeners[listenerKey]

        listener(this.storage)
      }
    }
  }

  public get<T>(accessor: Accessor<T>) {
    return Promise.resolve(accessor(this.storage))
  }

  public set(setter: Setter) {
    return Promise.resolve(setter(this.storage)).then(result => {
      this.notifyListeners()
      return result
    })
  }

  public addUpdateListener(key: string, getter: (storage: Storage) => object, callback: (changes: object | undefined) => void) {
    const watched = getter(this.storage)
    const getChanges = createChangesWatcher(watched)

    this.listeners[key] = (nextStorage: Storage) => {
      const changes = getChanges(getter(nextStorage))

      if (changes) {
        callback(changes)
      }
    }
  }

  public removeUpdateListener(key: string) {
    delete this.listeners[key]
  }
}
