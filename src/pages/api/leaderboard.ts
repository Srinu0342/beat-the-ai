import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;

  const { data: game } = await supabase
    .from("games")
    .select("*")
    .eq("join_code", code)
    .single();

  const { data } = await supabase
    .from("leaderboard")
    .select("*")
    .eq("game_id", game.id)
    .order("total_score", { ascending: false });

  res.json(data);
}