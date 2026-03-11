import { Outlet, NavLink } from 'react-router-dom'
import { PlusCircle, ClipboardList } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="bg-[#FF6600] text-white border-b border-[#e55d00] px-6 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2">
          {/* replace src with your actual logo file when available */}
          <img src="/logo.png" alt="Imus Online Turo-turo" className="h-8 w-auto hidden sm:block" />
          <span className="font-semibold text-base">Imus Online Turo‑turo</span>
        </div>
        <nav className="flex gap-1 ml-6">
          {/*
          <NavLink
            to="/orders/new"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-white/20 text-white'
                  : 'text-white hover:bg-white/10'
              )
            }
          >
            <PlusCircle size={15} />
            New Order
          </NavLink>
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-white/20 text-white'
                  : 'text-white hover:bg-white/10'
              )
            }
          >
            <ClipboardList size={15} />
            Orders
          </NavLink>
          */}
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 py-6 max-w-3xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  )
}
