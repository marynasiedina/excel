import { defaultTitle } from '../../constants';
import { $ } from '../../core/dom';
import { ExcelComponent } from '../../core/ExcelComponent';
import { ActiveRoute } from '../../core/routes/ActiveRoute';
import { changeTitle } from '../../redux/action';

export class Header extends ExcelComponent {
  static className = 'excel__header'

  constructor($root, options) {
    super($root, {
      name: 'Header',
      listeners: ['input', 'click'],
      ...options
    })
  }

  toHTML() {
    const title = this.store.getState().title || defaultTitle
    return `<input type="text" class="input" value="${title}">
    <div>
      <div class="button">
        <i class="material-icons" data-button="exit">exit_to_app</i>
      </div>
      <div class="button">
        <i class="material-icons" data-button="remove">delete</i>
      </div>
    </div>`
  }

  onInput(event) {
    const $target = $(event.target)
    this.$dispatch(changeTitle($target.text()))
  }

  onClick(event) {
    const $target = $(event.target)
    if ($target.data.button === 'remove') {
      const decision = confirm('Вы действительно хотите удалить эту таблицу?')
      if (decision) {
        localStorage.removeItem('excel:' + ActiveRoute.param)
        ActiveRoute.navigate('')
      }
    } else if ($target.data.button === 'exit') {
      console.log('action')
      ActiveRoute.navigate('')
    }
  }
}
