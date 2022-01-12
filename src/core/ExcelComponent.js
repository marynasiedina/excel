import { DomListener } from './DomListener';

export class ExcelComponent extends DomListener {
  constructor($root, options = {}) {
    super($root, options.listeners)
    this.name = options.name || ''
    this.store = options.store
    this.emitter = options.emitter
    this.unsubscribes = []
    this.prepare()
    this.storeSub = null
  }
  
  prepare() {}

  toHTML() {
    return ''
  }

  $emit(event, ...args) {
    this.emitter.emit(event, ...args)
  }

  $on(event, fn) {
    const unsub = this.emitter.subscribe(event, fn)
    this.unsubscribes.push(unsub)
  }

  $dispatch(action) {
    this.store.dispatch(action)
  }

  $subscribe(fn) {
    this.storeSub = this.store.subscribe(fn)
  }

  init() {
    this.initDOMListeners()
  }

  destroy() {
    this.removeDOMListeners()
    this.unsubscribes.forEach(unsub => unsub())
    this.storeSub.unsubscribe()
  }
}
