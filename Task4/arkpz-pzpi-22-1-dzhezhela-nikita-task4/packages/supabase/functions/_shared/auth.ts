import { User as SupabaseUser } from "jsr:@supabase/supabase-js@2";
import { supabase } from "./client.ts";
import { Database } from "./database.ts";

type DbUser = Database["public"]["Tables"]["users"]["Row"];
export type User = SupabaseUser & DbUser;

export function withAuth(
  handler: (req: Request, user: User) => Promise<Response>,
  { allowedRoleIds }: { allowedRoleIds?: string[] } = {}
) {
  return async (req: Request): Promise<Response> => {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        {
          status: 401,
        }
      );
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));

    if (error || !user) {
      return new Response(JSON.stringify({ error: "Invalid authentication" }), {
        status: 401,
      });
    }

    const { data: dbUser, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (userError || !dbUser) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 403,
      });
    }

    if (allowedRoleIds && allowedRoleIds.length > 0) {
      if (!allowedRoleIds.includes(dbUser.role_id)) {
        return new Response(
          JSON.stringify({ error: "Insufficient permissions" }),
          {
            status: 403,
          }
        );
      }
    }

    const authUser = { ...user, ...dbUser };
    return handler(req, authUser);
  };
}
