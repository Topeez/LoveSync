"use server";

import { createClient } from "@/utils/supabase/server";
import { PasswordSchema } from "@/lib/schemas";
import { redirect} from "next/navigation";

export async function signUpWithEmail(email: string, password: string, fullname: string){
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullname,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback?next=/dashboard`,
    }
  })

  if (error) return { error: error.message };
  
  return { success: true };
}

export async function signInWithEmail(email: string, password: string) {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    redirect("/dashboard");
}

export async function updatePassword(prevState: null, formData: FormData) {
  const supabase = await createClient();

  // 1. Validace inputů
  const rawData = {
    password: formData.get("password")?.toString(),
    confirmPassword: formData.get("confirmPassword")?.toString(),
  };

  const validatedFields = PasswordSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Chyba validace",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 2. Update hesla v Supabase
  const { error } = await supabase.auth.updateUser({
    password: validatedFields.data.password,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Heslo bylo úspěšně změněno.",
  };
}
