"use client";

import { useTransitionStore } from "@/stores/transitionStore";
import { ReactNode, useEffect, useState } from "react";

interface TransitionWrapperProps {
  children: ReactNode;
  pathname?: string;
  className?: string;
  duration?: number;
  show?: boolean;
  exit?: boolean;
}

export default function TransitionWrapper({
  children,
  pathname,
  className = "",
  duration = 200,
  show,
  exit
}: TransitionWrapperProps) {
  const transitionPathname = useTransitionStore((state) => state.pathname),
      [_ready, _setReady] = useState(false);

  useEffect(() => {
    _setReady(true)
  }, [])

  return (
    <div
      style={{
        transitionDuration: duration + "ms"
      }}
      className={[
        className,
        "transition-[opacity,transform,translate,filter]",
        _ready && (show || (show === undefined && transitionPathname === pathname)) && !exit
          ? "opacity-100 translate-y-0 blur-0"
          : transitionPathname === "$nil$" || exit
          ? "opacity-0 -translate-y-10 blur-[.2rem]"
          : "opacity-0 translate-y-10 blur-[.2rem]"
      ].join(" ")}
    >
      {children}
    </div>
  );
}
