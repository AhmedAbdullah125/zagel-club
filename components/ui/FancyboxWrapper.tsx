"use client";

import { useEffect } from "react";
import { Fancybox as NativeFancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

type Props = {
  children: React.ReactNode;
  delegate?: string; // CSS selector for clickable elements
};

export default function FancyboxWrapper({
  children,
  delegate = "[data-fancybox]"
}: Props) {
  useEffect(() => {
    NativeFancybox.bind(delegate, {
      // any options here
      Thumbs: false,
    });

    return () => {
      NativeFancybox.destroy();
    };
  }, [delegate]);

  return <>{children}</>;
}
