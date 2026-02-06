import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CartProvider } from "@/context/cart-context";
import { CartSheet } from "@/components/shop/cart-sheet";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MakerSpace | Learn. Build. Collaborate.",
  description: "Arkansas's first community technology hub. Education, Retail, and Repairs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <CartProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <CartSheet />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
