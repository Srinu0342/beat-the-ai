export function calculateScore(
  playerGuess: boolean,
  actualCorrect: boolean,
  aiConfidence: number
) {

  let correctnessScore = 0;

  if (playerGuess === actualCorrect) {
    correctnessScore = 50;
  }

  const actual = actualCorrect ? 1 : 0;

  const calibration = 1 - Math.abs(aiConfidence - actual);

  const calibrationScore = Math.round(calibration * 50);

  return {
    total: correctnessScore + calibrationScore,
    correctnessScore,
    calibrationScore
  };
}