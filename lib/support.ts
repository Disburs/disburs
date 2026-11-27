/** Where people reach Disburs. The one official address. */
export const SUPPORT_EMAIL = "hello@disburs.xyz";

/** Opens an email asking Disburs to allow one more organization on the account. */
export const ORG_REQUEST_MAILTO = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
  "Allow another organization on my account",
)}&body=${encodeURIComponent(
  "Hi Disburs,\n\nPlease allow another organization on my account.\n\nCompany name:\nWhy I need it:\n",
)}`;
