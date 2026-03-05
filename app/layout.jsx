import { Outfit, Playfair_Display } from "next/font/google";
import { Toaster } from "react-hot-toast";
import StoreProvider from "@/app/StoreProvider";
import AuthProvider from "@/app/AuthProvider";
import "./globals.css";


const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"], variable: '--font-outfit' });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: '--font-playfair' });

export const metadata = {
    title: "MOOYAM - Premium SkinCare & Beauty",
    description: "Discover luxury skincare, high-end serums, and elegant makeup that enhances your natural beauty.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${outfit.variable} ${playfair.variable} font-sans antialiased bg-[#FAFAFA] text-slate-800`}>
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
