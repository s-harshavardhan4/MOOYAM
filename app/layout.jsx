import { Toaster } from "react-hot-toast";
import StoreProvider from "@/app/StoreProvider";
import AuthProvider from "@/app/AuthProvider";
import "./globals.css";

export const metadata = {
    title: "MOOYAM - Premium SkinCare & Beauty",
    description: "Discover luxury skincare, high-end serums, and elegant makeup that enhances your natural beauty.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="font-sans antialiased bg-[#FAFAFA] text-slate-800">
                <AuthProvider>
                    <StoreProvider>
                        <Toaster />
                        {children}
                    </StoreProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
