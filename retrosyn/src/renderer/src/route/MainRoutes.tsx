import HistoryPage from '@renderer/pages/HistoryPage'
import MainLayout from '../layout/MainLayout'
import HomePage from '@renderer/pages/HomePage'
import Setting from '@renderer/pages/Setting'

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <HomePage />,
    },
    {
      path: '/history',
      element: <HistoryPage />,
    },
    {
      path: '/setting',
      element: <Setting />,
    },
  ],
}

export default MainRoutes
