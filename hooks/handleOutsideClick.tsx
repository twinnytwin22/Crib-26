"use client";
import { useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";

export function useHandleOutsideClick(
  isOpen: boolean,
  setIsOpen: Dispatch<SetStateAction<boolean>>,
  id: string,
) {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const targetElement = event.target as Element;
      if (!targetElement.closest("." + id)) {
        setIsOpen(false);
        return;
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClick);
    } else {
      document.removeEventListener("mousedown", handleClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [isOpen, setIsOpen, id]);
}
