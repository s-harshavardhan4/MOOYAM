import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id }
        });

        if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
                hasPassword: !!user.password
            }
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name } = body;

        if (!name) return NextResponse.json({ success: false, message: 'Name is required' }, { status: 400 });

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: { name }
        });

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully',
            user: { name: updatedUser.name }
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { currentPassword, newPassword } = body;

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ success: false, message: 'Both passwords are required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { id: session.user.id } });

        if (!user || !user.password) {
            return NextResponse.json({ success: false, message: 'User cannot update password via this method' }, { status: 400 });
        }

        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) {
            return NextResponse.json({ success: false, message: 'Incorrect current password' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: session.user.id },
            data: { password: hashedPassword }
        });

        return NextResponse.json({ success: true, message: 'Password updated successfully' });

    } catch (error) {
        return NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        // Prevent deleting the demo admin account
        if (session.user.email === 'admin@mooyan.com') {
            return NextResponse.json({ success: false, message: 'Cannot delete demo admin account' }, { status: 403 });
        }

        await prisma.user.delete({
            where: { id: session.user.id }
        });

        return NextResponse.json({ success: true, message: 'Account deleted forever' });

    } catch (error) {
        return NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 });
    }
}
