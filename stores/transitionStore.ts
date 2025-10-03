import {create} from 'zustand'

type TransitionState = {
  pathname: string
  setPathname: (pathname: string) => void
}

export const useTransitionStore = create<TransitionState>(set => ({
  pathname: '',
  setPathname: (pathname) => set({ pathname })
}))