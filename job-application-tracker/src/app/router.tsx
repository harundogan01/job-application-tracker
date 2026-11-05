import { createBrowserRouter } from 'react-router'
import AppLayout from '@/components/layout/AppLayout'
import AuthLayout from '@/components/layout/AuthLayout'
import DetailsPage from '@/features/applications/pages/Detail'
import EditPage from '@/features/applications/pages/Edit'
import ListPage from '@/features/applications/pages/List'
import NewPage from '@/features/applications/pages/New'
import LoginPage from '@/features/auth/pages/Login'
import RegisterPage from '@/features/auth/pages/Register'
import DashboardPage from '@/features/dashboard/pages/Dashboard'
import NotFoundPage from '@/pages/NotFound'

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