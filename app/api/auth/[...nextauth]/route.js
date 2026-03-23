import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export const authOptions = {
    adapter: MongoDBAdapter(clientPromise, {
        collections: {
            Users: 'User',
            Accounts: 'Account',
            Sessions: 'Session',
            VerificationTokens: 'VerificationToken',
        }
    }),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID || "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing credentials");
                }

                // Check for admin user first (defined in environment)
                if (credentials.email === process.env.ADMIN_EMAIL) {
                    const isPasswordCorrect = credentials.password === process.env.ADMIN_PASSWORD;

                    if (isPasswordCorrect) {
                        return {
                            id: "admin-id",
                            name: "Administrator",
                            email: process.env.ADMIN_EMAIL,
                            isAdmin: true,
                        };
                    }
                }

                // Look for regular user in database
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user || !user.password) {
                    throw new Error("Invalid credentials");
                }

                const isPasswordCorrect = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isPasswordCorrect) {
                    throw new Error("Invalid credentials");
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    isAdmin: false,
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.isAdmin = user.isAdmin || false;
                token.image = user.image;
            }
            
            // Handle profile image updates from the frontend
            if (trigger === "update" && session?.image) {
                token.image = session.image;
            }
            
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.isAdmin = token.isAdmin;
                session.user.image = token.image;
            }
            return session;
        },
        async signIn({ user, account, profile }) {
            if (account?.provider === "google" || account?.provider === "github") {
                // NextAuth handles Prisma user creation automatically with the adapter
                // but we can add extra logic here if needed
                return true;
            }
            return true;
        }
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
