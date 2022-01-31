import { Router } from './core/routes/Router'
import { DashboardPage } from './Pages/Dashboard'
import { ExcelPage } from './Pages/ExcelPage'
import './scss/index.scss'


new Router('#app', {
  dashboard: DashboardPage,
  excel: ExcelPage,
})
