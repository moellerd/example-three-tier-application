'use server';

import { revalidatePath } from 'next/cache';

const API_URL = process.env.API_URL || 'http://localhost:3001';

export type Challenge = {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
};

export async function getChallenges(): Promise<Challenge[]> {
  const res = await fetch(`${API_URL}/challenges`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch challenges');
  return res.json();
}

export async function createChallenge(formData: FormData) {
  const title = formData.get('title') as string;
  await fetch(`${API_URL}/challenges`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  revalidatePath('/');
}

export async function toggleChallenge(id: number, completed: boolean) {
  await fetch(`${API_URL}/challenges/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed }),
  });
  revalidatePath('/');
}
