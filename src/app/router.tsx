import { createBrowserRouter } from 'react-router'
import AppLayout from '@/components/layout/AppLayout'
import AuthLayout from '@/components/layout/AuthLayout'
import DetailsPage from '@/features/applications/pages/DetailsPage'
import EditPage from '@/features/applications/pages/EditPage'
import ListPage from '@/features/applications/pages/ListPage'
import NewPage from '@/features/applications/pages/NewPage'
import LoginPage from '@/features/auth/pages/LoginPage'
import RegisterPage from '@/features/auth/pages/RegisterPage'
import DashboardPage from '@/features/dashboard/pages/DashboardPage'
import NotFoundPage from '@/pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    Component: AppLayout,
    children: [
      { index: true, Component: DashboardPage },
      {
        path: 'applications',
        children: [
          { index: true, Component: ListPage },
          { path: 'new', Component: NewPage },
          { path: ':id', Component: DetailsPage },
          { path: ':id/edit', Component: EditPage }
        ]
      },
    ]
  },
  {
    Component: AuthLayout,
    children: [
      { path: 'login', Component: LoginPage },
      { path: 'register', Component: RegisterPage }
    ]
  },
  { path: '*', Component: NotFoundPage }
])