import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export const { auth, handlers, signIn, signOut } = NextAuth({
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
            // Allow Gmail users who signed up with credentials to also link Google
            allowDangerousEmailAccountLinking: true,
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
            // Allow GitHub users who signed up with credentials to also link GitHub
            allowDangerousEmailAccountLinking: true,
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

                // Use native MongoDB driver — gets ALL fields including isAdmin and role
                const client = await clientPromise;
                const db = client.db('cosmeticsdb');
                const user = await db.collection('User').findOne({
                    email: credentials.email.toLowerCase()
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

                const isAdmin = user.role === 'admin' || user.isAdmin === true;
                console.log(`[AUTH] Login: ${user.email} | isAdmin: ${isAdmin}`);

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    isAdmin,
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                // role-based admin — no email hardcoding
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
                // role-based: isAdmin comes purely from the DB role field
                session.user.isAdmin = token.isAdmin || false;
                session.user.image = token.image;
            }
            return session;
        },
        async signIn({ user, account, profile }) {
            // Always allow sign-in — email linking is handled by allowDangerousEmailAccountLinking
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
