import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Deploy Sexta Automation", description: "Transforme um roteiro em cenas e monte seu vídeo." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
