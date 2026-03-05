import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                otp: { label: "OTP", type: "text" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }

                // --------- ADMIN OVERRIDE ---------
                if (
                    credentials.email === "admin@mooyan.com" &&
                    credentials.password === "admin@123"
                ) {
                    return {
                        id: "admin-id",
                        email: "admin@mooyan.com",
                        name: "Admin",
                        isAdmin: true,
                    };
                }
                // -----------------------------------

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user || !user.password) {
                    throw new Error('User not found');
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isPasswordValid) {
                    throw new Error('Invalid password');
                }

                // --------- OTP VERIFICATION ---------
                if (!credentials.otp) {
                    throw new Error('OTP is required');
                }

                // 1. Check if OTP matches
                if (user.otp !== credentials.otp) {
                    // Clear OTP on failure for security (optional, but requested behavior is generally to clear on expiry)
                    throw new Error('Invalid OTP');
                }

                // 2. Check if OTP is expired
                const isExpired = !user.otpExpiresAt || new Date() > user.otpExpiresAt;
                if (isExpired) {
                    // Clear the expired OTP
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { otp: null, otpExpiresAt: null }
                    });
                    throw new Error('OTP has expired. Please request a new one.');
                }

                // 3. OTP is valid! Clear it so it can't be reused.
                await prisma.user.update({
                    where: { id: user.id },
                    data: { otp: null, otpExpiresAt: null }
                });
                // ------------------------------------

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    isAdmin: false,
                };
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.isAdmin = user.isAdmin;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.isAdmin = token.isAdmin;
            }
            return session;
        }
    }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
