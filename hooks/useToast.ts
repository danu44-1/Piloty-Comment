"use client";

import { useCallback, useState } from "react";

export function useToast() {
  const [notice, setNotice] = useState("");
  const showNotice = useCallback((message: string) => setNotice(message), []);
  const closeNotice = useCallback(() => setNotice(""), []);
  return { notice, showNotice, closeNotice };
}
