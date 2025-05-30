'use client'

import Link from "next/link"
import { usePathname } from 'next/navigation'

export const NavLink = ({
  url,
  title,
  icon,
}: {
  url: string;
  title: string;
  icon: any;
}) => {
  const pathname = usePathname()
  const isActive = pathname === url ? 'active' : ''

  return (
    <Link
      href={url}
      className={
        `group w-full inline-flex items-center justify-start whitespace-nowrap
        text-xs font-regular transition-colors focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2
        disabled:pointer-events-none disabled:opacity-50 text-slate-300 h-[30px]
        rounded pl-1.5 pr-4 relative mb-0.5
        hover:bg-[#30394A] hover:text-slate-50
        ${isActive ? 'bg-[#30394A] text-white font-medium' : ''}
        `
      }
    >
      <span className={
        `${isActive ? '' : 'opacity-60'}
          w-4 h-4 me-2 overflow-hidden flex items-center justify-center group-hover:opacity-100
        `}>{icon}</span>
      <span className="text-xs leading-3">{title}</span>
    </Link>
  )
}
