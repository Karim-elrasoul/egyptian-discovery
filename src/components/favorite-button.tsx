"use client";

import { useState } from "react";

export function FavoriteButton({ tripId }: { tripId: string }) {
  const [saved,setSaved]=useState(() => typeof window !== "undefined" && window.localStorage.getItem(`favorite:${tripId}`)==="1");
  function toggle() {
    const next=!saved;
    setSaved(next);
    window.localStorage.setItem(`favorite:${tripId}`,next?"1":"0");
  }
  return <button className={saved?"favorite is-saved":"favorite"} type="button" aria-label={saved?"Remove from favorites":"Add to favorites"} onClick={toggle}>{saved?"♥":"♡"}</button>;
}
