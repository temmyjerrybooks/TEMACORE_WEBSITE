import { withDatabaseTransaction } from "./postgres";
import type { Database } from "./types";

type Tables = Database["public"]["Tables"];

export async function saveClientIntake(
  lead: Tables["leads"]["Insert"],
  intake: Omit<Tables["client_intakes"]["Insert"], "lead_id">
) {
  return withDatabaseTransaction(async database => {
    const saved = await database.insertOne("leads", lead);
    if (!saved.data) throw new Error("Unable to save lead.");
    await database.insertOne("client_intakes", { ...intake, lead_id: saved.data.id });
    return saved.data.id;
  });
}
