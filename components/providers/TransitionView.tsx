"use client"

import { useTransitionStore } from "@/stores/transitionStore"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

export default function TransitionView({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(),
    setTransitionPathname = useTransitionStore(state => state.setPathname)

  useEffect(() => {
    setTransitionPathname(pathname)
  }, [pathname])
  
  return children
}