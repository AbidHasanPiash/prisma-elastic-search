import Wrapper from "@/providers/Wrapper";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased text-sm`}>
        <Wrapper>
          {children}
        </Wrapper>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
