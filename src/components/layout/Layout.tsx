import { Outlet, NavLink } from 'react-router-dom'
import { PlusCircle, ClipboardList } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800 text-base">Order Entry</span>
          <span className="text-xs font-mono bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
            POS
          </span>
        </div>
        <nav className="flex gap-1 ml-6">
          <NavLink
            to="/orders/new"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
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
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              )
            }
          >
            <ClipboardList size={15} />
            Orders
          </NavLink>
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 py-6 max-w-3xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  )
}
