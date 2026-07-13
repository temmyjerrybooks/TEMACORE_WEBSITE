export function getInvestorDeckAccessConfiguration() {
  const requested = process.env.INVESTOR_DECK_REQUIRE_ACCESS === "true";
  const accessCodeConfigured = Boolean(process.env.INVESTOR_DECK_ACCESS_CODE);

  return {
    requested,
    accessCodeConfigured,
    enabled: false,
    note:
      "Access protection is intentionally inactive until a server-side signed-session implementation and private asset delivery are configured."
  };
}
