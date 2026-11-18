import Link from "next/link";

export default function NotFound() {
  return <main className="page-shell section-shell"><div className="panel"><p className="eyebrow">404</p><h1>Page not found.</h1><Link className="button button-dark" href="/">Return home</Link></div></main>;
}
