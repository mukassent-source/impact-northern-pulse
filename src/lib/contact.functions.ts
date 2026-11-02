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
    const submissionId = crypto.randomUUID();
    const response = await fetch(`${base}/rest/v1/contact_messages`, {
      method: "POST", headers: { apikey: key, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ ...data, id: submissionId }),
    });
    if (!response.ok) throw new Error("Message could not be sent. Please try again later.");
    const templateName = data.subject.startsWith("Partnership application") ? "partnership-application" : "contact-message";
    try {
      const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");
      const result = await sendTemplateEmail(templateName, "sammyafful@gmail.com", {
        templateData: data,
        idempotencyKey: `${templateName}-${submissionId}`,
        replyTo: data.email,
      });
      return { success: true, emailed: result.sent };
    } catch (error) {
      // The saved message remains available even if notification delivery fails.
      console.error("Owner notification email failed", error);
    }
    return { success: true, emailed: false };
  });
