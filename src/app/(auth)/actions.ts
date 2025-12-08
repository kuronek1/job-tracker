"use server";

import { redirect } from "next/navigation";
import { authenticateUser, clearSession, registerUser } from "@/lib/auth";
import { getDictionary } from "@/i18n/config";

type AuthState = {
  error?: string;
};

function getStrings() {
  return getDictionary().dict.auth.errors;
}

export async function signUpAction(_: AuthState, formData: FormData): Promise<AuthState> {
  const errors = getStrings();
  const email = (formData.get("email") as string | null)?.trim().toLowerCase();
  const username = (formData.get("username") as string | null)?.trim();
  const password = (formData.get("password") as string | null) ?? "";

  if (!email || !username || password.length < 6) {
    if (!email || password.length < 6) {
      return { error: password.length < 6 ? errors.shortPassword : errors.needEmailPass };
    }
    return { error: errors.needUsername };
  }

  try {
    await registerUser(email, password, username);
    redirect("/");
  } catch (err) {
    const message = err instanceof Error ? err.message : errors.unknown;
    if (message.includes("username")) {
      return { error: errors.usernameTaken };
    }
    return { error: message.includes("Unique constraint") ? errors.alreadyExists : message };
  }
}

export async function signInAction(_: AuthState, formData: FormData): Promise<AuthState> {
  const errors = getStrings();
  const email = (formData.get("email") as string | null)?.trim().toLowerCase();
  const password = (formData.get("password") as string | null) ?? "";

  if (!email || !password) {
    return { error: errors.needEmailPass };
  }

  const user = await authenticateUser(email, password);
  if (!user) {
    return { error: errors.invalid };
  }

  redirect("/");
}

export async function signOutAction() {
  await clearSession();
  redirect("/login");
}
