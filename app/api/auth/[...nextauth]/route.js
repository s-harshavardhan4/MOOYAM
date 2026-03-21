import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import { checkRateLimit } from "@/lib/rate-limit"

export const authOptions = {
    // adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                otp: { label: "OTP", type: "text" }
            },
            async authorize(credentials, req) {
                const ip = req.headers?.['x-forwarded-for']?.split(',')[0] || '127.0.0.1';
                const { success } = await checkRateLimit(`login_${ip}`, 10, 600000); // 10 login attempts per 10 minutes

                if (!success) {
                    throw new Error("Too many login attempts. Please try again later.");
                }

                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }

                const receivedEmail = (credentials.email || "").trim().toLowerCase();
                const receivedPassword = (credentials.password || "").trim();

                if (
                    receivedEmail === process.env.ADMIN_EMAIL &&
                    process.env.ADMIN_PASSWORD_HASH
                ) {
                    const isPasswordValid = await bcrypt.compare(
                        receivedPassword,
                        process.env.ADMIN_PASSWORD_HASH
                    );
                    if (isPasswordValid) {
                        return {
                            id: "admin-id",
                            email: process.env.ADMIN_EMAIL,
                            name: "Admin",
                            isAdmin: true,
                        };
                    }
                }

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
