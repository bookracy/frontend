import { createFileRoute } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { DISCORD_URL } from "@/constants";

interface DonationTier {
  name: string;
  amount: string;
  perks: string[];
  color: string;
  donateUrl: string;
}

const MONTHLY_GOAL = 100;
const CURRENT_AMOUNT = 42; // Example, update as needed
const SERVER_COST = 80;
const PROXY_COST = 20;

const TIERS: DonationTier[] = [
  {
    name: "Supporter",
    amount: "$3/mo",
    color: "border-blue-500 dark:bg-blue-950 bg-blue-100",
    donateUrl: "#supporter",
    perks: ["🎖️ Discord Supporter role", "🚫 Less rate limiting for downloads", "📚 Priority book requests (if missing on Bookracy or Anna's Archive)", "🤔 Unsure? Ask us anything on Discord!"],
  },
  {
    name: "Patron",
    amount: "$10/mo",
    color: "border-purple-500 dark:bg-purple-950 bg-purple-100",
    donateUrl: "#patron",
    perks: ["✅ All Supporter perks", "📝 Name on Supporters page (opt-in)", "🗳️ Vote on new features", "🏛️ Help pick featured books", "🤔 Not sure which tier? DM us on Discord!"],
  },
  {
    name: "Benefactor",
    amount: "$25+/mo",
    color: "border-yellow-500 dark:bg-yellow-950 bg-yellow-100",
    donateUrl: "#benefactor",
    perks: [
      "✅ All Patron perks",
      "🌟 'Bookracy Hero' Discord role",
      "💬 Direct feedback channel with the team",
      "⚡️ Bookmarks automatically stored on High-speed caching servers",
      "🤔 Questions? We're happy to help!",
    ],
  },
];

const ENTERPRISE_TIER = {
  name: "Enterprise/Partner",
  amount: "Contact Us",
  color: "border-orange-500 dark:bg-orange-950 bg-orange-100",
  donateUrl: "mailto:dev@bookracy.org?subject=Enterprise%20Donation%20or%20Collection%20Exchange",
  perks: [
    "🚀 Unlimited high-speed access to all resources",
    "⚡️ Direct SFTP access (10Gbps NVMe cache)",
    "📥 Lightning-fast downloads, served from NVMe cache",
    "🔁 Collection Exchange: Add new collections or datasets and get public recognition",
    "🏷️ Custom partnership badge and homepage placement",
    "🧠 Priority feature requests & direct team contact",
    "📶 No rate-limiting or buffering per IP (ideal for institutions or archive builders)",
  ],
};

export const Route = createFileRoute("/donation")({
  component: DonationPage,
});

function DonationPage() {
  const progress = Math.min((CURRENT_AMOUNT / MONTHLY_GOAL) * 100, 100);

  return (
    <div className="flex min-h-[80vh] w-full justify-center">
      <div className="mx-auto w-full max-w-7xl px-4 py-8">
        <Card className="w-full border border-border bg-card shadow-2xl dark:bg-card">
          <CardHeader>
            <CardTitle className="text-3xl md:text-4xl">Support Bookracy 💜</CardTitle>
            <CardDescription className="text-base md:text-lg">
              Bookracy is 100% free and open-source. We rely on your support to keep the servers running and the library growing. Every dollar helps us provide free knowledge to the world.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex flex-col gap-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-lg font-semibold">Monthly Goal</span>
                <span className="font-mono text-lg">
                  ${CURRENT_AMOUNT} / ${MONTHLY_GOAL} USD
                </span>
              </div>
              <Progress value={progress} className="h-5" />
              <div className="mt-2 flex flex-col gap-2 text-xs text-muted-foreground md:flex-row md:justify-between">
                <span>{progress.toFixed(0)}% of goal reached</span>
                <span>
                  Server: ${SERVER_COST} | Proxy: ${PROXY_COST} <span className="opacity-70">(proxy depends on usage)</span>
                </span>
              </div>
            </div>

            {/* Donation tiers */}
            <div className="mt-8 px-2 grid grid-cols-1 place-items-center justify-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {TIERS.map((tier) => (
                <Card key={tier.name} className={`border-2 ${tier.color} flex h-full w-full max-w-sm flex-col shadow-md transition-all duration-200 hover:scale-[1.025]`}>
                  <CardHeader>
                    <CardTitle className="text-lg md:text-xl">{tier.name}</CardTitle>
                    <div className="mt-1 text-2xl font-bold">{tier.amount}</div>
                  </CardHeader>
                  <CardContent>
                    <ul className="ml-4 flex list-disc flex-col gap-2 text-sm">
                      {tier.perks.map((perk) => (
                        <li key={perk}>{perk}</li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <Button asChild variant="blue" className="w-full">
                      <a href={tier.donateUrl} target="_blank" rel="noopener noreferrer">
                        Donate
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Enterprise/Partner Card */}
            <div className="mt-10 flex justify-center px-2">
              <Card className={`border-2 ${ENTERPRISE_TIER.color} flex w-full flex-col items-center justify-between p-6 shadow-lg md:flex-row md:p-10`}>
                <div className="min-w-0 flex-1">
                  <CardHeader className="mb-4 p-0 md:mb-0">
                    <CardTitle className="text-2xl text-orange-600 dark:text-orange-300 md:text-3xl">{ENTERPRISE_TIER.name}</CardTitle>
                    <div className="mt-1 text-lg font-bold">{ENTERPRISE_TIER.amount}</div>
                  </CardHeader>
                  <CardContent className="mt-2 p-0">
                    <ul className="ml-4 flex list-disc flex-col gap-2 text-base">
                      {ENTERPRISE_TIER.perks.map((perk) => (
                        <li key={perk}>{perk}</li>
                      ))}
                    </ul>
                  </CardContent>
                </div>
                <div className="mt-6 flex flex-col items-center justify-center md:ml-10 md:mt-0">
                  <Button asChild variant="confirm" size="lg" className="w-full px-8 py-4 text-lg md:w-auto">
                    <a href={ENTERPRISE_TIER.donateUrl} target="_blank" rel="noopener noreferrer">
                      Contact for Enterprise
                    </a>
                  </Button>
                </div>
              </Card>
            </div>

            <div className="mt-10 text-center text-xs text-muted-foreground">
              Want to support in other ways?{" "}
              <a href={DISCORD_URL} className="text-blue-400 underline" target="_blank" rel="noopener noreferrer">
                Join our Discord
              </a>{" "}
              or{" "}
              <a href="mailto:dev@bookracy.org" className="text-blue-400 underline">
                contact us
              </a>
              .<br />
              <span className="mt-2 block opacity-70">Dark mode is fully supported. Thank you for helping keep knowledge free!</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
