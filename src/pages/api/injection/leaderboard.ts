import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;

  if (!code || typeof code !== "string") {
    return res.status(400).json({ error: "Missing or invalid game code" });
  }

  const { data: game } = await supabase
    .from("games")
    .select("*")
    .eq("join_code", code)
    .single();

  if (!game) {
    return res.status(404).json({ error: "Game not found" });
  }

  const { data, error } = await supabase
    .from("prompts")
    .select(`
      *,
      players (
        name
      )
    `)
    .eq("game_id", game.id)
    .eq("hacked", true)
    .eq("section", "injection")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching leaderboard:", error);
    return res.status(500).json({ error: "Failed to fetch leaderboard" });
  }

  res.json(data);
}