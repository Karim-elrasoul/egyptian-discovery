import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { WhatsappButton } from "@/components/whatsapp-button";

export const metadata: Metadata = {
  title: { default: "Egyptian Discovery", template: "%s · Egyptian Discovery" },
  description: "Small-group journeys shaped by local knowledge across Egypt.",
  icons: { icon: "/egyptian-discovery-logo.png", apple: "/egyptian-discovery-logo.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}<WhatsappButton /><SiteFooter /></body></html>;
}
