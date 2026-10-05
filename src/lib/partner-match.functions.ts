import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { recommendCollaborations } from "./partner-match.server";

export const partnerMatchSchema = z.object({
  organization: z.string().trim().max(150),
  goals: z.string().trim().min(20).max(2000),
});

export const getPartnerMatches = createServerFn({ method: "POST" })
  .inputValidator((input) => partnerMatchSchema.parse(input))
  .handler(async ({ data }) => {
    try {
      return { text: await recommendCollaborations(data.goals, data.organization) };
    } catch (e) {
      const status = (e as { statusCode?: number })?.statusCode;
      if (status === 429) return { error: "Too many requests right now. Please try again in a minute." };
      if (status === 402) return { error: "Recommendations are temporarily unavailable." };
      console.error(e);
      return { error: "Recommendations could not be generated. Please try again later." };
    }
  });
