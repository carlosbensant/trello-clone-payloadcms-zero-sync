import * as React from "react"

import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex w-full border flex items-center px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/5 dark:bg-transparent dark:ring-offset-slate-800 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300",
  {
    variants: {
      variant: {
        default: "text-white bg-[#2477D8] hover:bg-[#2d7fde]",
        destructive:
          "bg-red-500 text-slate-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90",
        outline:
          "border rounded bg-transparent hover:bg-black/5 hover:text-black/7 dark:border-white/5 dark:bg-white/0 dark:hover:bg-white/5 dark:hover:text-white/7",
        secondary:
          "bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80",
        ghost: "border-0 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50",
        link: "text-slate-900 underline-offset-4 hover:underline dark:text-slate-50",
      },
      inputSize: {
        default: "h-8 text-xs rounded px-2",
        sm: "h-10 text-xs px-7 py-2",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label: string;
}

const InputGroup = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, inputSize, type, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState<boolean>(false);

    return (
      <div className={cn(inputVariants({ variant, inputSize, className }), isFocused && 'outline-none ring-2 ring-slate-950 ring-offset-2 dark:ring-slate-300')}>
        <label
          htmlFor={props.name}
          className="border-0 text-xs text-slate-400 mr-[1px]"
        >
          {props.label}
        </label>
        <input
          className="border-0 text-xs bg-transparent outline-none ring-0"
          type={type}
          ref={ref}
          {...props}
          id={props.name}
          onFocus={() => setIsFocused(true)}
          onBlur={(args) => {
            if (props.onBlur) {
              props.onBlur(args)
            }
            setIsFocused(false)
          }}
        />
      </div>
    )
  }
)
InputGroup.displayName = "InputGroup"

export { InputGroup }
