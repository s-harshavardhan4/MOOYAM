import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

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
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }

                console.log('DEBUG [authorize]: email received:', `"${credentials.email}"`);
                console.log('DEBUG [authorize]: password received:', `"${credentials.password}"`);

                const receivedEmail = (credentials.email || "").trim().toLowerCase();
                const receivedPassword = (credentials.password || "").trim();

                // --------- ADMIN OVERRIDE ---------
                if (
                    receivedEmail === "admin@mooyan.com" &&
                    receivedPassword === "admin@123"
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
