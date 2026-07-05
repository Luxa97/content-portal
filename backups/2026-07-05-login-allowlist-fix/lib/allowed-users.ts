const allowedEmails = [
  "lucasassantos97@gmail.com",
  "larissaborgesbaselii@gmail.com"
];

export function isAllowedEmail(email: string): boolean {
  return allowedEmails.includes(email.trim().toLowerCase());
}
