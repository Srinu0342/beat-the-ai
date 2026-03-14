import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.body;

  await supabase
    .from("games")
    .update({
      state: "playing",
      started_at: new Date()
    })
    .eq("join_code", code);

  res.json({ ok: true });
}