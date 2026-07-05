const allowedEmails = [
  "lucas_as97@hotmail.com",
  "lucasassantos97@gmail.com",
  "larissaborgesbaselli@gmail.com"
];

export function isAllowedEmail(email: string): boolean {
  return allowedEmails.includes(email.trim().toLowerCase());
}
