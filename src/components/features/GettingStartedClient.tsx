"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Download,
  Gamepad2,
  Trophy,
  Wrench,
  BookOpen,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Monitor,
  Cpu,
  Users
} from "lucide-react";
import Link from "next/link";

interface ExternalLinkCardProps {
  href: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

function ExternalLinkCard({ href, title, description, icon }: ExternalLinkCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
    >
      <Card className="h-full transition-all duration-200 hover:border-minecraft-diamond/50 hover:shadow-lg hover:shadow-minecraft-diamond/10">
        <CardContent className="p-4 flex items-start gap-3">
          {icon && (
            <div className="mt-1 text-minecraft-diamond/70 group-hover:text-minecraft-diamond transition-colors">
              {icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-monocraft text-sm text-white group-hover:text-minecraft-diamond transition-colors">
                {title}
              </span>
              <ExternalLink className="h-3 w-3 text-white/40 group-hover:text-minecraft-diamond/70 transition-colors" />
            </div>
            <p className="text-xs text-white/60 mt-1">{description}</p>
          </div>
        </CardContent>
      </Card>
    </a>
  );
}

function SectionHeader({ icon, title, id }: { icon: React.ReactNode; title: string; id: string }) {
  return (
    <div id={id} className="flex items-center gap-3 mb-4 scroll-mt-20">
      <div className="p-2 rounded-lg bg-minecraft-diamond/10 text-minecraft-diamond">
        {icon}
      </div>
      <h2 className="font-monocraft text-xl text-white">{title}</h2>
    </div>
  );
}

function RequirementItem({ met, children }: { met?: boolean; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-sm text-white/80">
      {met !== undefined ? (
        met ? (
          <CheckCircle2 className="h-4 w-4 mt-0.5 text-minecraft-emerald flex-shrink-0" />
        ) : (
          <AlertCircle className="h-4 w-4 mt-0.5 text-yellow-500 flex-shrink-0" />
        )
      ) : (
        <ChevronRight className="h-4 w-4 mt-0.5 text-minecraft-diamond/70 flex-shrink-0" />
      )}
      <span>{children}</span>
    </li>
  );
}

export function GettingStartedClient() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-6">
        <h1 className="font-monocraft text-3xl sm:text-4xl text-white">
          Getting Started with <span className="text-minecraft-diamond">MCSR Ranked</span>
        </h1>
        <p className="text-white/70 max-w-2xl mx-auto">
          Your guide to joining the competitive Minecraft speedrunning community.
          Learn how to set up, play, and improve your skills.
        </p>
      </div>

      {/* Quick Navigation */}
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { href: "#what-is-mcsr", label: "What is MCSR?" },
              { href: "#requirements", label: "Requirements" },
              { href: "#installation", label: "Installation" },
              { href: "#how-to-play", label: "How to Play" },
              { href: "#ranking-system", label: "Ranking System" },
              { href: "#tools", label: "Tools" },
              { href: "#resources", label: "Resources" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-3 py-1.5 rounded-md text-xs font-monocraft text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* What is MCSR Ranked */}
      <section>
        <SectionHeader
          icon={<Gamepad2 className="h-5 w-5" />}
          title="What is MCSR Ranked?"
          id="what-is-mcsr"
        />
        <Card>
          <CardContent className="p-6 space-y-4">
            <p className="text-white/80 leading-relaxed">
              <strong className="text-white">MCSR Ranked</strong> is a competitive matchmaking
              system for Minecraft speedrunning. It pairs players of similar skill levels
              to race against each other in real-time, tracking your performance with an
              ELO rating system similar to chess.
            </p>
            <p className="text-white/80 leading-relaxed">
              The mod runs on <strong className="text-white">Minecraft 1.16.1</strong> and
              uses specially filtered seeds to ensure fair competition. Both players receive
              the same seed and identical RNG conditions, so victory comes down to pure skill
              and strategy.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 pt-2">
              <div className="text-center p-4 rounded-lg bg-white/5">
                <Users className="h-6 w-6 mx-auto mb-2 text-minecraft-diamond" />
                <div className="font-monocraft text-sm text-white">Skill-Based Matching</div>
                <div className="text-xs text-white/60 mt-1">Play against similarly skilled opponents</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-white/5">
                <Trophy className="h-6 w-6 mx-auto mb-2 text-minecraft-gold" />
                <div className="font-monocraft text-sm text-white">Ranked Progression</div>
                <div className="text-xs text-white/60 mt-1">Climb from Coal to Netherite rank</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-white/5">
                <Monitor className="h-6 w-6 mx-auto mb-2 text-minecraft-emerald" />
                <div className="font-monocraft text-sm text-white">Fair Competition</div>
                <div className="text-xs text-white/60 mt-1">Same seed and RNG for both players</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Requirements */}
      <section>
        <SectionHeader
          icon={<Cpu className="h-5 w-5" />}
          title="Requirements"
          id="requirements"
        />
        <Card>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-monocraft text-sm text-minecraft-diamond mb-3">Account Requirements</h3>
                <ul className="space-y-2">
                  <RequirementItem>
                    <strong className="text-white">Legitimate Minecraft Account</strong> -
                    Cracked launchers and accounts are not supported
                  </RequirementItem>
                  <RequirementItem>
                    Minecraft Java Edition ownership
                  </RequirementItem>
                </ul>
              </div>
              <div>
                <h3 className="font-monocraft text-sm text-minecraft-diamond mb-3">Technical Requirements</h3>
                <ul className="space-y-2">
                  <RequirementItem>
                    <strong className="text-white">Minecraft 1.16.1</strong> -
                    The only supported version
                  </RequirementItem>
                  <RequirementItem>
                    Fabric mod loader installed
                  </RequirementItem>
                  <RequirementItem>
                    64-bit Java (recommended: Java 17+)
                  </RequirementItem>
                  <RequirementItem>
                    2-3 GB RAM allocated to Minecraft
                  </RequirementItem>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-monocraft text-sm text-red-400 mb-1">Important Restrictions</h4>
                  <ul className="text-xs text-white/70 space-y-1">
                    <li>Modified clients like Lunar Client are <strong className="text-white">not allowed</strong></li>
                    <li>Only mods from the{" "}
                      <a
                        href="https://mods.tildejustin.dev"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-minecraft-diamond hover:underline"
                      >
                        official whitelist
                      </a>{" "}
                      are permitted
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Installation */}
      <section>
        <SectionHeader
          icon={<Download className="h-5 w-5" />}
          title="Installation"
          id="installation"
        />
        <Card>
          <CardContent className="p-6 space-y-6">
            <p className="text-white/80">
              MCSR Ranked offers modpacks for easy setup, available for Windows, macOS, and Linux.
              Choose one of the supported launchers below:
            </p>

            <div className="grid sm:grid-cols-3 gap-4">
              <ExternalLinkCard
                href="https://wiki.mcsrranked.com/install/install_prism"
                title="Prism / MultiMC"
                description="Recommended launcher with easy mod management"
                icon={<Download className="h-4 w-4" />}
              />
              <ExternalLinkCard
                href="https://wiki.mcsrranked.com/install/install_modrinth"
                title="Modrinth App"
                description="Modern launcher with built-in mod support"
                icon={<Download className="h-4 w-4" />}
              />
              <ExternalLinkCard
                href="https://wiki.mcsrranked.com/install/install_vanilla"
                title="Vanilla Launcher"
                description="Official Minecraft launcher (more setup required)"
                icon={<Download className="h-4 w-4" />}
              />
            </div>

            <div className="space-y-3">
              <h3 className="font-monocraft text-sm text-white">Available Modpacks</h3>
              <div className="grid gap-3">
                <div className="p-3 rounded-lg bg-minecraft-emerald/10 border border-minecraft-emerald/20">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="h-4 w-4 text-minecraft-emerald" />
                    <span className="font-monocraft text-sm text-white">Normal Pack (Recommended)</span>
                  </div>
                  <p className="text-xs text-white/60 ml-6">
                    Basic mods needed for MCSR Ranked - best for most players
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-1">
                    <ChevronRight className="h-4 w-4 text-white/40" />
                    <span className="font-monocraft text-sm text-white/80">Normal Pack + Standard Settings</span>
                  </div>
                  <p className="text-xs text-white/60 ml-6">
                    Includes pre-configured game settings for speedrunning
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-1">
                    <ChevronRight className="h-4 w-4 text-white/40" />
                    <span className="font-monocraft text-sm text-white/80">All RSG Mods Version</span>
                  </div>
                  <p className="text-xs text-white/60 ml-6">
                    Comprehensive mod collection for Random Seed Glitchless category
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <a
                href="https://mcsrranked.com/download"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-minecraft-diamond text-black font-monocraft text-sm hover:bg-minecraft-diamond/90 transition-colors"
              >
                <Download className="h-4 w-4" />
                Download MCSR Ranked
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* How to Play */}
      <section>
        <SectionHeader
          icon={<Gamepad2 className="h-5 w-5" />}
          title="How to Play"
          id="how-to-play"
        />
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="font-monocraft text-sm text-white">Getting Started</h3>
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-minecraft-diamond/20 text-minecraft-diamond flex items-center justify-center font-monocraft text-sm">1</span>
                  <div>
                    <div className="font-monocraft text-sm text-white">Launch Minecraft 1.16.1</div>
                    <p className="text-xs text-white/60 mt-1">
                      Start the game with the MCSR Ranked modpack installed
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-minecraft-diamond/20 text-minecraft-diamond flex items-center justify-center font-monocraft text-sm">2</span>
                  <div>
                    <div className="font-monocraft text-sm text-white">Click "Ranked" on the Main Menu</div>
                    <p className="text-xs text-white/60 mt-1">
                      If the button is greyed out, check your connection or mod version
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-minecraft-diamond/20 text-minecraft-diamond flex items-center justify-center font-monocraft text-sm">3</span>
                  <div>
                    <div className="font-monocraft text-sm text-white">Complete Placement Matches</div>
                    <p className="text-xs text-white/60 mt-1">
                      Play your first matches to establish your initial ELO rating. Progress matters - go as far as you can!
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-minecraft-diamond/20 text-minecraft-diamond flex items-center justify-center font-monocraft text-sm">4</span>
                  <div>
                    <div className="font-monocraft text-sm text-white">Queue for Matches</div>
                    <p className="text-xs text-white/60 mt-1">
                      Ranked mode typically finds opponents in 1-3 minutes
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-white/5">
                <h4 className="font-monocraft text-sm text-minecraft-diamond mb-2">Ranked Mode</h4>
                <p className="text-xs text-white/70">
                  Competitive matches that affect your ELO rating. Win to gain points,
                  lose to drop. Matchmaking prioritizes skill-balanced opponents.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-white/5">
                <h4 className="font-monocraft text-sm text-minecraft-diamond mb-2">Casual Mode</h4>
                <p className="text-xs text-white/70">
                  Practice without affecting your rank. Queue times may be longer
                  unless you enable "Unlimited Casual Queue" for wider matchmaking.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <h4 className="font-monocraft text-sm text-blue-400 mb-2">Matchmaking Settings</h4>
              <p className="text-xs text-white/70 mb-2">
                Access via Ranked {">"} Settings {">"} Matchmaking settings:
              </p>
              <ul className="text-xs text-white/70 space-y-1 ml-4">
                <li><strong className="text-white">Accurate:</strong> Narrower ELO range, longer wait times</li>
                <li><strong className="text-white">Balanced:</strong> Moderate settings (default)</li>
                <li><strong className="text-white">Fast:</strong> Wider ELO range, quicker matches</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Ranking System */}
      <section>
        <SectionHeader
          icon={<Trophy className="h-5 w-5" />}
          title="Understanding the Ranking System"
          id="ranking-system"
        />
        <Card>
          <CardContent className="p-6 space-y-6">
            <p className="text-white/80">
              MCSR Ranked uses an ELO rating system, similar to chess, to measure player skill.
              Win matches to gain points, lose matches to drop points. The amount gained or lost
              depends on your opponent&apos;s rating - beating higher-rated players rewards more points.
            </p>

            <div className="space-y-3">
              <h3 className="font-monocraft text-sm text-white">Rank Tiers</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { name: "Coal", range: "0-599", color: "bg-gray-600", desc: "Entry level" },
                  { name: "Iron", range: "600-899", color: "bg-gray-400", desc: "Unlocks Ruined Portals" },
                  { name: "Gold", range: "900-1199", color: "bg-yellow-500", desc: "Most common rank" },
                  { name: "Emerald", range: "1200-1499", color: "bg-emerald-500", desc: "Unlocks Buried Treasure" },
                  { name: "Diamond", range: "1500-1999", color: "bg-cyan-400", desc: "Top ~5% of players" },
                  { name: "Netherite", range: "2000+", color: "bg-purple-600", desc: "Top ~0.5% of players" },
                ].map((rank) => (
                  <div key={rank.name} className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-3 h-3 rounded-sm ${rank.color}`} />
                      <span className="font-monocraft text-sm text-white">{rank.name}</span>
                    </div>
                    <div className="text-xs text-minecraft-diamond">{rank.range} ELO</div>
                    <div className="text-xs text-white/50 mt-1">{rank.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <h4 className="font-monocraft text-sm text-yellow-400 mb-2">ELO Decay</h4>
                <p className="text-xs text-white/70">
                  Top 150 players face decay penalties. After 7+ days of inactivity,
                  you&apos;ll lose 5 ELO per day until you play again.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-white/5">
                <h4 className="font-monocraft text-sm text-white mb-2">Seasons</h4>
                <p className="text-xs text-white/70">
                  Ratings reset each season, requiring new placement matches.
                  This keeps competition fresh and gives everyone a clean start.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-minecraft-emerald/10 border border-minecraft-emerald/20">
              <h4 className="font-monocraft text-sm text-minecraft-emerald mb-2">Seed Distribution by Rank</h4>
              <p className="text-xs text-white/70 mb-3">
                Higher ranks unlock more diverse seed types:
              </p>
              <ul className="text-xs text-white/70 space-y-1">
                <li><strong className="text-white">Coal (0-599):</strong> Village 55%, Shipwreck 30%, Desert Temple 15%</li>
                <li><strong className="text-white">Iron-Gold (600-1199):</strong> +Ruined Portal seeds added</li>
                <li><strong className="text-white">Emerald+ (1200+):</strong> All seed types including Buried Treasure</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Tools */}
      <section>
        <SectionHeader
          icon={<Wrench className="h-5 w-5" />}
          title="Essential Tools"
          id="tools"
        />
        <Card>
          <CardContent className="p-6 space-y-6">
            <p className="text-white/80">
              These community-developed tools are widely used by speedrunners to enhance
              their gameplay experience. All are approved for use in official speedrun submissions.
            </p>

            <div className="space-y-4">
              {/* Jingle */}
              <div className="p-4 rounded-lg border border-white/10 hover:border-minecraft-diamond/30 transition-colors">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="font-monocraft text-base text-white">Jingle</h3>
                    <p className="text-xs text-white/50">Instance Management Tool</p>
                  </div>
                  <a
                    href="https://github.com/DuncanRuns/Jingle"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-minecraft-diamond hover:underline flex items-center gap-1"
                  >
                    GitHub <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <p className="text-sm text-white/70 mb-3">
                  An all-inclusive Minecraft speedrunning application for single-instance gameplay.
                  Handles instance management, world clearing, and various quality-of-life features.
                </p>
                <div className="grid sm:grid-cols-2 gap-2 text-xs text-white/60">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-minecraft-emerald" />
                    <span>Auto-detects launcher instances</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-minecraft-emerald" />
                    <span>World clearing with safety buffer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-minecraft-emerald" />
                    <span>Customizable hotkeys</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-minecraft-emerald" />
                    <span>OBS integration</span>
                  </div>
                </div>
              </div>

              {/* Ninjabrain Bot */}
              <div className="p-4 rounded-lg border border-white/10 hover:border-minecraft-diamond/30 transition-colors">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="font-monocraft text-base text-white">Ninjabrain Bot</h3>
                    <p className="text-xs text-white/50">Stronghold Calculator</p>
                  </div>
                  <a
                    href="https://github.com/Ninjabrain1/Ninjabrain-Bot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-minecraft-diamond hover:underline flex items-center gap-1"
                  >
                    GitHub <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <p className="text-sm text-white/70 mb-3">
                  Calculates stronghold locations through triangulation using ender eye throws.
                  Accounts for measurement accuracy and provides confidence percentages.
                </p>
                <div className="grid sm:grid-cols-2 gap-2 text-xs text-white/60">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-minecraft-emerald" />
                    <span>Advanced triangulation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-minecraft-emerald" />
                    <span>Subpixel adjustment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-minecraft-emerald" />
                    <span>Blind coordinate evaluation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-minecraft-emerald" />
                    <span>OBS overlay support</span>
                  </div>
                </div>
                <div className="mt-3 p-2 rounded bg-yellow-500/10 border border-yellow-500/20">
                  <p className="text-xs text-yellow-400">
                    <strong>Tip:</strong> Calibrate your "standard deviation" setting based on your
                    precision at reading ender eye angles (typically 0.005-0.200).
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* More Resources */}
      <section>
        <SectionHeader
          icon={<BookOpen className="h-5 w-5" />}
          title="More Guides & Resources"
          id="resources"
        />
        <Card>
          <CardContent className="p-6 space-y-6">
            <p className="text-white/80">
              Continue your learning journey with these official resources and community guides.
            </p>

            <div className="space-y-4">
              <h3 className="font-monocraft text-sm text-white">Official Resources</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <ExternalLinkCard
                  href="https://wiki.mcsrranked.com"
                  title="MCSR Ranked Wiki"
                  description="Complete official documentation for installation and gameplay"
                  icon={<BookOpen className="h-4 w-4" />}
                />
                <ExternalLinkCard
                  href="https://mcsrranked.com"
                  title="MCSR Ranked Website"
                  description="Official website with downloads and announcements"
                  icon={<ExternalLink className="h-4 w-4" />}
                />
                <ExternalLinkCard
                  href="https://discord.gg/nnjUSyDErj"
                  title="Discord Community"
                  description="Get help in #tech-help and connect with other players"
                  icon={<Users className="h-4 w-4" />}
                />
                <ExternalLinkCard
                  href="https://modrinth.com/mod/mcsr-ranked"
                  title="Modrinth Page"
                  description="Download the mod and check version updates"
                  icon={<Download className="h-4 w-4" />}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-monocraft text-sm text-white">Gameplay Guides</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <ExternalLinkCard
                  href="https://wiki.mcsrranked.com/gameplay/seed"
                  title="Filtered Seeds Guide"
                  description="Learn about seed filtering and structure spawns"
                  icon={<BookOpen className="h-4 w-4" />}
                />
                <ExternalLinkCard
                  href="https://wiki.mcsrranked.com/gameplay/rng"
                  title="RNG Standardization"
                  description="Understand how RNG is balanced for fair play"
                  icon={<BookOpen className="h-4 w-4" />}
                />
                <ExternalLinkCard
                  href="https://wiki.mcsrranked.com/gameplay/elo_and_ranks"
                  title="ELO & Ranking Details"
                  description="Deep dive into the ranking system mechanics"
                  icon={<Trophy className="h-4 w-4" />}
                />
                <ExternalLinkCard
                  href="https://wiki.mcsrranked.com/install/faq"
                  title="FAQ & Troubleshooting"
                  description="Common questions and solutions to issues"
                  icon={<AlertCircle className="h-4 w-4" />}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-monocraft text-sm text-white">Tools & Mods</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <ExternalLinkCard
                  href="https://mods.tildejustin.dev"
                  title="Approved Mods List"
                  description="Official whitelist of allowed speedrunning mods"
                  icon={<CheckCircle2 className="h-4 w-4" />}
                />
                <ExternalLinkCard
                  href="https://github.com/DuncanRuns/Jingle"
                  title="Jingle"
                  description="Instance management for single-instance speedrunning"
                  icon={<Wrench className="h-4 w-4" />}
                />
                <ExternalLinkCard
                  href="https://github.com/Ninjabrain1/Ninjabrain-Bot"
                  title="Ninjabrain Bot"
                  description="Stronghold triangulation calculator"
                  icon={<Wrench className="h-4 w-4" />}
                />
                <ExternalLinkCard
                  href="https://github.com/tildejustin/mcsr-sodium-1.16.5"
                  title="MCSR Sodium"
                  description="Performance mod optimized for speedrunning"
                  icon={<Cpu className="h-4 w-4" />}
                />
              </div>
            </div>

            <div className="p-4 rounded-lg bg-minecraft-diamond/10 border border-minecraft-diamond/20 text-center">
              <p className="text-sm text-white/80 mb-3">
                Ready to track your progress? Search for your username above or explore the leaderboard!
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white font-monocraft text-sm hover:bg-white/20 transition-colors"
                >
                  <Trophy className="h-4 w-4" />
                  View Leaderboard
                </Link>
                <Link
                  href="/live"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 font-monocraft text-sm hover:bg-red-500/30 transition-colors"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  Watch Live Matches
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Attribution */}
      <div className="text-center text-xs text-white/40 pb-6">
        <p>
          This guide summarizes information from the{" "}
          <a
            href="https://wiki.mcsrranked.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-minecraft-diamond/60 hover:text-minecraft-diamond"
          >
            official MCSR Ranked Wiki
          </a>
          . For the most up-to-date and detailed information, please refer to the original documentation.
        </p>
      </div>
    </div>
  );
}
