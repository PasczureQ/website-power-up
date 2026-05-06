import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "admin_pw";

export const getAdminPw = () => sessionStorage.getItem(SESSION_KEY) || "";
export const setAdminPw = (pw: string) => sessionStorage.setItem(SESSION_KEY, pw);
export const clearAdminPw = () => sessionStorage.removeItem(SESSION_KEY);
export const isAdmin = () => !!getAdminPw();

export async function callAdmin(body: Record<string, unknown>) {
  const pw = getAdminPw();
  const { data, error } = await supabase.functions.invoke("admin", {
    body,
    headers: { "x-admin-password": pw },
  });
  if (error) throw error;
  if (data && typeof data === "object" && "error" in data) throw new Error((data as { error: string }).error);
  return data;
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke("admin", {
      body: { action: "verify" },
      headers: { "x-admin-password": password },
    });
    if (error) return false;
    return !!(data && (data as { ok?: boolean }).ok);
  } catch {
    return false;
  }
}
