import type { ReactNode } from 'react'
import { ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CardProps {
  children: ReactNode
  className?: string
}

interface CardHeaderProps {
  title: string
  actions?: ReactNode
}

interface CardBodyProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return <div className={cn('card', className)}>{children}</div>
}

export function CardHeader({ title, actions }: CardHeaderProps) {
  return (
    <div className="card-header">
      <h2>{title}</h2>
      <div className="flex items-center gap-2">
        {actions}
        <ChevronUp size={16} className="text-slate-400" />
      </div>
    </div>
  )
}

export function CardBody({ children, className }: CardBodyProps) {
  return <div className={cn('px-5 py-4', className)}>{children}</div>
}
