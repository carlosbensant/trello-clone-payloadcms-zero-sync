'use client'

import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'

import { cn } from '@/lib/utils'
import { CheckCircle } from '@untitled-ui/icons-react'
// import { LineHeight } from "@untitled-ui/icons-react"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer h-5 w-5 shrink-0 rounded-sm border border-white/25 ring-offset-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[#368DF0] data-[state=checked]:text-[#368DF0] dark:border-white/25 dark:ring-offset-white/25 dark:hover:border-[#368DF0] dark:hover:ring-offset-[#368DF0] dark:focus-visible:ring-[#368DF0] dark:data-[state=checked]:bg-[#368DF0] dark:data-[state=checked]:text-slate-900',
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-white')}>
      {/* <CheckIcon data-state={props.checked} className={cn("h-5 w-5")} /> */}
      <CheckCircle
        data-state={props.checked}
        className={cn('h-5 w-5 data-[state=indeterminate]:hidden')}
      />
      {/* <LineHeight data-state={props.checked} className={cn("h-5 w-5 hidden data-[state=indeterminate]:block")} /> */}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
