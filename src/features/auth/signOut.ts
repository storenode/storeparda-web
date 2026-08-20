import { db } from "@/db";
import { clearMemberJwt } from "@/lib/memberSession";

/** Clears the cached member row and the stored JWT — purely a local/offline clear. */
export async function signOut() {
  await db.members.clear();
  clearMemberJwt();
}
