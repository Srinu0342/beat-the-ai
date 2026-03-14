import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;

  const { data: game } = await supabase
    .from("games")
    .select("*")
    .eq("join_code", code)
    .single();

  const { data: players } = await supabase
    .from("players")
    .select("*")
    .eq("game_id", game.id);

  res.json({ game, players });
}