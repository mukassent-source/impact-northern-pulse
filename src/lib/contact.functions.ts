import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
export const contactSchema = z.object({
  name: z.string().trim().min(1).max(100), email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40), organization: z.string().trim().max(150),
  subject: z.string().trim().min(1).max(160), message: z.string().trim().min(1).max(3000),
});
export const sendContact = createServerFn({ method: "POST" })
  .inputValidator((input) => contactSchema.parse(input))
  .handler(async ({ data }) => {
    const base = process.env['SUPABASE_URL'];
    const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
    if (!base || !key) throw new Error("Contact service unavailable");
    const response = await fetch(`${base}/rest/v1/contact_messages`, {
      method: "POST", headers: { apikey: key, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Message could not be sent. Please try again later.");
    return { success: true };
  });
