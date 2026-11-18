"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="page-shell section-shell"><div className="panel"><p className="eyebrow">Something went wrong</p><h2>We could not load this page.</h2><button className="button button-dark" type="button" onClick={reset}>Try again</button></div></main>;
}
