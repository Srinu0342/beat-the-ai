import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../lib/supabase";
import { generateJoinCode } from "../../../utils/joinCode";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const code = generateJoinCode();

  console.log({ code });

  const { data, error } = await supabase
    .from("games")
    .insert({
      join_code: code,
      state: "lobby"
    })
    .select()
    .single();

  if (error) return res.status(500).json(error);

  res.json(data);
}
