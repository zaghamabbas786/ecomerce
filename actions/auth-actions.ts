'use server';

import { signIn } from '@/auth';
import { connectDB } from '@/lib/db';
import { handleError } from '@/lib/errors';
import { registerSchema, loginSchema, profileSchema } from '@/lib/validations';
import { requireAuth } from '@/lib/auth-helpers';
import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { toCamelCase, toSnakeCase } from '@/lib/db-helpers';

export async function register(data: unknown) {
  try {
    const validated = registerSchema.parse(data);

    const supabase = await connectDB();

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', validated.email.toLowerCase())
      .single();

    if (existingUser) {
      return { error: 'User with this email already exists' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validated.password, 10);

    // Create user
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        name: validated.name,
        email: validated.email.toLowerCase(),
        password: hashedPassword,
        role: 'user',
      })
      .select('id')
      .single();

    if (error) throw error;

    return { success: true, userId: user.id };
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

    const supabase = await connectDB();

    const snakeData = toSnakeCase(validated);

    const { data: user, error } = await supabase
      .from('users')
      .update(snakeData)
      .eq('id', session.user.id)
      .select()
      .single();

    if (error) throw error;
    if (!user) {
      return { error: 'User not found' };
    }

    revalidatePath('/account');

    return { success: true, user: toCamelCase(user) };
  } catch (error) {
    return handleError(error);
  }
}

export async function getProfile() {
  try {
    const session = await requireAuth();

    const supabase = await connectDB();

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error) throw error;
    if (!user) {
      return { error: 'User not found' };
    }

    return { user: toCamelCase(user) };
  } catch (error) {
    return handleError(error);
  }
}
