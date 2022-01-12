import { $ } from '../../core/dom';
import { ExcelComponent } from '../../core/ExcelComponent';
import { createTable } from './table.template';
import { shouldResize, isCell, matrix, nextSelector } from './table.functions';
import { resizeHandler } from './table.resize';
import { TableSelection } from './TableSelection';
import * as action from '../../redux/action'

export class Table extends ExcelComponent {
  static className = 'excel__table'

  constructor($root, options) {
    super($root, {
      name: 'Table',
      listeners: ['mousedown', 'keydown', 'input'],
      ...options
    })
  }
  
  toHTML() {
    return createTable(20, this.store.getState())
  }

  prepare() {
    this.selection = new TableSelection()
  }

  init() {
    super.init()
    this.selectCell(this.$root.find('[data-id="0:0"]'))
    this.$on('formula:input', (data)=> {
      this.selection.current.text(data)
    })
    this.$on('formula:done', ()=> {
      this.selection.current.focus()
    })
    // this.$subscribe(state => {
    //   console.log('tablestate', state)
    // })
  }

  selectCell($cell) {
    this.selection.select($cell)
    this.$emit('table:select', $cell)
  }

  async resizeTable(event) {
    try {
      const data = await resizeHandler( this.$root, event)
      this.$dispatch(action.tableResize(data))
    } catch (e) {
      console.warn('resize error', e.message)
    }
  }

  onMousedown(event) {
    if (shouldResize(event)) {
      this.resizeTable(event)
    } else if (isCell(event)) {
      const $target = $(event.target)
      if (event.shiftKey) {
        const target = $target.id(true)
        const current = this.selection.current.id(true)

        const $cells = matrix(target, current)
            .map( id => this.$root.find(`[data-id="${id}"]`))

        this.selection.selectGroup($cells)
      } else {
        this.selectCell($target)
      }
    }
  }

  onKeydown(event) {
    const keys = [
      'Enter',
      'Tab',
      'ArrowLeft',
      'ArrowRight',
      'ArrowDown',
      'ArrowUp'
    ]

    const { key } = event
    if (keys.includes(key) && !event.shiftKey) {
      event.preventDefault()
      const id = this.selection.current.id(true)
      const $next = this.$root.find(nextSelector(key, id));
      this.selectCell($next)
    }
  }

  onInput(event) {
    this.$emit('table:input', $(event.target))
  }
}
