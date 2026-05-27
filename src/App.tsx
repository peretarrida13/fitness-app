import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppShell } from './components/layout/AppShell'
import { MealsPage } from './components/meals/MealsPage'
import { GymPage } from './components/gym/GymPage'
import { ShoppingPage } from './components/shopping/ShoppingPage'
import { TipsPage } from './components/tips/TipsPage'
import { ProgressPage } from './components/progress/ProgressPage'
import { CalendarPage } from './components/calendar/CalendarPage'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<Navigate to="/meals" replace />} />
            <Route path="/meals" element={<MealsPage />} />
            <Route path="/gym" element={<GymPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/shopping" element={<ShoppingPage />} />
            <Route path="/tips" element={<TipsPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
