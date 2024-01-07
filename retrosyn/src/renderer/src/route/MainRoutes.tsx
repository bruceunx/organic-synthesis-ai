import HistoryPage from '@renderer/pages/HistoryPage'
import MainLayout from '../layout/MainLayout'
import HomePage from '@renderer/pages/HomePage'
import Help from '@renderer/pages/Help'
import SingleHistoryEntry from '@renderer/pages/SingleHistory'

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
      path: '/history/:id',
      element: <SingleHistoryEntry />,
    },
    {
      path: '/helper',
      element: <Help />,
    },
  ],
}

export default MainRoutes
