import { useRoutes } from 'react-router-dom'

import MainRoutes from './MainRoutes'

//eslint-disable-next-line
export default function ThemeRoutes() {
  return useRoutes([MainRoutes])
}
