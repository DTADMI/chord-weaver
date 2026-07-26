import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

let _adminClient: ReturnType<typeof createClient> | null = null;

export function getServiceClient() {
  if (!_adminClient) {
    _adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return _adminClient;
}

export async function listAllUsers() {
  const supabase = getServiceClient();
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) throw error;
  return data.users;
}

export async function deleteUser(userId: string) {
  const supabase = getServiceClient();
  const { error } = await supabase.auth.admin.deleteUser(userId);
  if (error) throw error;
}
