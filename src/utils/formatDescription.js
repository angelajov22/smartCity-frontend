const AI_SPLIT_PATTERNS = ["AI vision:", "Визија на AI:"];

export const formatDescriptionParts = (description) => {
  if (!description) {
    return {
      userReport: "",
      aiVision: "",
      userLabel: "Пријава на корисник",
      aiLabel: "AI опис",
    };
  }

  let userPart = description;
  let aiPart = "";

  for (const pattern of AI_SPLIT_PATTERNS) {
    const idx = description.indexOf(pattern);
    if (idx !== -1) {
      userPart = description.slice(0, idx).trim();
      aiPart = description.slice(idx + pattern.length).trim();
      break;
    }
  }

  userPart = userPart
    .replace(/^Issue detected:\s*\w+\.\s*/i, "")
    .replace(/^User report:\s*/i, "")
    .trim();

  return {
    userReport: userPart,
    aiVision: aiPart,
    userLabel: "Пријава на корисник",
    aiLabel: "AI опис",
  };
};
