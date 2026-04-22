import { Resend } from "resend";
import RequestPasswordEmail from "@/emails/request-password-email";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailValues {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

type SendResetPasswordProps = {
  to: string;
  subject: string;
  url: string;
};

export const sendEmail = async ({ to, subject, text }: SendEmailValues) => {
  await resend.emails.send({
    from: "verification@synqmenu.com",
    to,
    subject,
    text,
  });
};

export const sendResetPasswordEmail = async ({
  to,
  subject,
  url,
}: SendResetPasswordProps) => {
  await resend.emails.send({
    from: "verification@email.synqmenu.com",
    to,
    subject,
    react: <RequestPasswordEmail to={to} url={url} />,
  });
};
