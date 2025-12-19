'use server';

import { signIn } from '@/auth';
import { connectDB } from '@/lib/db';
import { handleError } from '@/lib/errors';
import { registerSchema, loginSchema, profileSchema } from '@/lib/validations';
import { requireAuth } from '@/lib/auth-helpers';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';
import { revalidatePath } from 'next/cache';

export async function register(data: unknown) {
  try {
    const validated = registerSchema.parse(data);

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: validated.email });
    if (existingUser) {
      return { error: 'User with this email already exists' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validated.password, 10);

    // Create user
    const user = await User.create({
      name: validated.name,
      email: validated.email,
      password: hashedPassword,
      role: 'user',
    });

    return { success: true, userId: user._id.toString() };
  } catch (error) {
    return handleError(error);
  }
}

export async function login(data: unknown) {
  try {
    const validated = loginSchema.parse(data);

    await signIn('credentials', {
      email: validated.email,
      password: validated.password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Invalid credentials' };
    }
    return handleError(error);
  }
}

export async function updateProfile(data: unknown) {
  try {
    const session = await requireAuth();
    const validated = profileSchema.parse(data);

    await connectDB();

    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $set: validated },
      { new: true }
    );

    if (!user) {
      return { error: 'User not found' };
    }

    revalidatePath('/account');

    return { success: true, user: JSON.parse(JSON.stringify(user)) };
  } catch (error) {
    return handleError(error);
  }
}

export async function getProfile() {
  try {
    const session = await requireAuth();

    await connectDB();

    const user = await User.findById(session.user.id).lean();

    if (!user) {
      return { error: 'User not found' };
    }

    return { user: JSON.parse(JSON.stringify(user)) };
  } catch (error) {
    return handleError(error);
  }
}

