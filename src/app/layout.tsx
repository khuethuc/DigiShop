import type { Metadata } from "next";
import "./globals.css";
import MainLayout from "@/components/layout/MainLayout";

export const metadata: Metadata = {
  title: {
    template: "%s | DigiShop",
    default: "DigiShop",
  },
  description:
    "Get verified and secure premium accounts for your favorite apps at DigiShop. We provide fast delivery, reliable support, and affordable access to top subscription services.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
