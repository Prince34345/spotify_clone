import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import SupabaseProvider from "@/provider/SupabaseProvider";
import UserProvider from "@/provider/UserProvider";
import ModalProvider from "@/provider/ModalProvider";

const font = Figtree({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Spotify Clone",
  description: "listen to music",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <SupabaseProvider>
             <UserProvider>
              <ModalProvider/>
                <Sidebar>{children}</Sidebar>
             </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
