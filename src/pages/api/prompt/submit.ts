import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../lib/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const {
    playerId,
    gameCode,
    score,
    section,
    scenario,
    promptNumber,
    prompt,
    aiResponse,
    hallucination,
  } = req.body;

  // get gameId from game code
  const { data: gameData, error: gameError } = await supabase
    .from("games")
    .select("id")
    .eq("join_code", gameCode)
    .single();

  if (gameError) {
    console.error("Error fetching game:", gameError);
    return res.status(500).json({ error: "Failed to fetch game data" });
  }

  if (!gameData) {
    return res.status(404).json({ error: "Game not found" });
  }

  const { data: promptData, error: promptError } = await supabase
    .from("prompts")
    .upsert({
      player_id: playerId,
      game_id: gameData.id,
      section,
      scenario,
      prompt_number: promptNumber,
      prompt_text: prompt,
      ai_response: aiResponse,
      hallucination,
    })
    .eq("player_id", playerId)
    .eq("game_id", gameData.id)
    .eq("prompt_number", promptNumber)
    .eq("section", section)
    .eq("scenario", scenario);

  if (promptError) {
    console.error("Error upserting prompt:", promptError);
    return res.status(500).json({ error: "Failed to save prompt data" });
  }

  const { data: scoreData, error: scoreError } = await supabase
     .from("scores")
     .select("*")
     .eq("player_id", playerId)
     .eq("game_id", gameData.id)
     .eq("section", section)
     .eq("scenario", scenario)
     .single();

  if (scoreError && scoreError.code !== "PGRST116") {
    console.error("Error fetching score:", scoreError);
    return res.status(500).json({ error: "Failed to fetch score data" });
  }

  if (scoreData) {
    // Update existing score
    const { error: updateError } = await supabase
      .from("scores")
      .update({ score })
      .eq("player_id", playerId)
      .eq("game_id", gameData.id)
      .eq("section", section)
      .eq("scenario", scenario);

    if (updateError) {
      console.error("Error updating score:", updateError);
      return res.status(500).json({ error: "Failed to update score data" });
    }
  } else {
    // Insert new score
    const { error: insertError } = await supabase.from("scores").insert({
      player_id: playerId,
      game_id: gameData.id,
      section,
      scenario,
      score,
    });

    if (insertError) {
      console.error("Error inserting score:", insertError);
      return res.status(500).json({ error: "Failed to insert score data" });
    }
  }

  const { data: totalScoreData, error: totalScoreError } = await supabase
    .from("scores")
    .select("score")
    .eq("player_id", playerId)
    .eq("game_id", gameData.id);

  if (totalScoreError) {
    console.error("Error fetching total score:", totalScoreError);
    return res.status(500).json({ error: "Failed to fetch total score" });
  }

  const totalScore = totalScoreData?.reduce((acc, curr) => acc + curr.score, 0) || 0;

  await supabase.from("scores").update({ score: totalScore }).eq("player_id", playerId).eq("game_id", gameData.id).eq("section", "total");

  res.json({ ok: true });
}
