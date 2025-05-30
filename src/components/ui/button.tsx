import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 text-white hover:bg-[#2d7fde] text-xs px-2 h-8 pr-2 pl-2 rounded bg-white/0 border border-white/5',
  {
    variants: {
      variant: {
        default: 'text-white bg-[#2477D8] hover:bg-[#2d7fde]',
        destructive:
          'bg-red-500 text-slate-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90',
        outline:
          // "bg-white/0 rounded border border-white/5 border-x-0 rounded-l-none rounded-r-none pr-2 pl-2"
          'border rounded bg-transparent hover:bg-black/5 hover:text-black/7 dark:border-white/5 dark:bg-white/0 dark:hover:bg-white/5 dark:hover:text-white/7',
        secondary:
          'bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80',
        ghost:
          'border-0 hover:bg-slate-100 hover:text-slate-900 text-slate-50 dark:text-slate-50 dark:hover:bg-slate-800 dark:hover:text-slate-50',
        link: 'border-0 text-slate-900 underline hover:underline dark:text-slate-50',
      },
      size: {
        default: 'h-8 text-xs rounded px-2',
        sm: 'h-10 text-xs px-7 py-2',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
