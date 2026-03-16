import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code, name } = req.body;

  const { data: game } = await supabase
    .from("games")
    .select("*")
    .eq("join_code", code)
    .single();

  if (!game) {
    console.error("Game not found for code:", code);
    return res.status(404).json({ error: "Game not found" });
  }

  const { data } = await supabase
    .from("players")
    .insert({
      name,
      game_id: game.id
    })
    .select()
    .single();

  res.json(data);
}