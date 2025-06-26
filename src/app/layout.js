import "./globals.css";
// import Footer from "@/components/footer";
import { DataProvider } from "@/lib/data-context";
import { AuthProvider } from "@/lib/auth-context";

export const metadata = {
  title: "Blackcoffer  - Company Knowledge Graph",
  description:
    "Interactive visualization of company structure, projects, and team relationships",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <DataProvider>{children}</DataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
