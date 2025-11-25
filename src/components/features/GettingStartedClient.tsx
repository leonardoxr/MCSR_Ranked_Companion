"use client";

import {
  Card,
  CardContent,
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
  Users,
  Sparkles,
  Shuffle,
  Layers
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

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

function RequirementItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-sm text-white/80">
      <ChevronRight className="h-4 w-4 mt-0.5 text-minecraft-diamond/70 flex-shrink-0" />
      <span>{children}</span>
    </li>
  );
}

export function GettingStartedClient() {
  const t = useTranslations('gettingStarted');

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-6">
        <h1 className="font-monocraft text-3xl sm:text-4xl text-white">
          {t('title').split('MCSR Ranked')[0]}
          <span className="text-minecraft-diamond">MCSR Ranked</span>
          {t('title').split('MCSR Ranked')[1] || ''}
        </h1>
        <p className="text-white/70 max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      {/* Quick Navigation */}
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { href: "#what-is-mcsr", label: t('quickNav.whatIs') },
              { href: "#requirements", label: t('quickNav.requirements') },
              { href: "#installation", label: t('quickNav.installation') },
              { href: "#how-to-play", label: t('quickNav.howToPlay') },
              { href: "#filtered-seeds", label: t('quickNav.filteredSeeds'), featured: true },
              { href: "#rng-standard", label: t('quickNav.rngStandard'), featured: true },
              { href: "#ranking-system", label: t('quickNav.rankingSystem') },
              { href: "#tools", label: t('quickNav.tools') },
              { href: "#resources", label: t('quickNav.resources') },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-md text-xs font-monocraft transition-colors ${
                  'featured' in item && item.featured
                    ? "text-minecraft-gold bg-minecraft-gold/10 hover:bg-minecraft-gold/20 hover:text-minecraft-gold"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
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
          title={t('whatIs.title')}
          id="what-is-mcsr"
        />
        <Card>
          <CardContent className="p-6 space-y-4">
            <p className="text-white/80 leading-relaxed">
              {t('whatIs.description')}
            </p>
            <p className="text-white/80 leading-relaxed">
              {t('whatIs.description2')}
            </p>
            <div className="grid sm:grid-cols-3 gap-4 pt-2">
              <div className="text-center p-4 rounded-lg bg-white/5">
                <Users className="h-6 w-6 mx-auto mb-2 text-minecraft-diamond" />
                <div className="font-monocraft text-sm text-white">{t('whatIs.features.skillBased')}</div>
                <div className="text-xs text-white/60 mt-1">{t('whatIs.features.skillBasedDesc')}</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-white/5">
                <Trophy className="h-6 w-6 mx-auto mb-2 text-minecraft-gold" />
                <div className="font-monocraft text-sm text-white">{t('whatIs.features.ranked')}</div>
                <div className="text-xs text-white/60 mt-1">{t('whatIs.features.rankedDesc')}</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-white/5">
                <Monitor className="h-6 w-6 mx-auto mb-2 text-minecraft-emerald" />
                <div className="font-monocraft text-sm text-white">{t('whatIs.features.fair')}</div>
                <div className="text-xs text-white/60 mt-1">{t('whatIs.features.fairDesc')}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Requirements */}
      <section>
        <SectionHeader
          icon={<Cpu className="h-5 w-5" />}
          title={t('requirements.title')}
          id="requirements"
        />
        <Card>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-monocraft text-sm text-minecraft-diamond mb-3">{t('requirements.account')}</h3>
                <ul className="space-y-2">
                  <RequirementItem>{t('requirements.accountItem1')}</RequirementItem>
                  <RequirementItem>{t('requirements.accountItem2')}</RequirementItem>
                </ul>
              </div>
              <div>
                <h3 className="font-monocraft text-sm text-minecraft-diamond mb-3">{t('requirements.technical')}</h3>
                <ul className="space-y-2">
                  <RequirementItem>{t('requirements.technicalItem1')}</RequirementItem>
                  <RequirementItem>{t('requirements.technicalItem2')}</RequirementItem>
                  <RequirementItem>{t('requirements.technicalItem3')}</RequirementItem>
                  <RequirementItem>{t('requirements.technicalItem4')}</RequirementItem>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-monocraft text-sm text-red-400 mb-1">{t('requirements.restrictions')}</h4>
                  <ul className="text-xs text-white/70 space-y-1">
                    <li>{t('requirements.restrictionItem1')}</li>
                    <li>{t('requirements.restrictionItem2')} -{" "}
                      <a
                        href="https://mods.tildejustin.dev"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-minecraft-diamond hover:underline"
                      >
                        mods.tildejustin.dev
                      </a>
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
          title={t('installation.title')}
          id="installation"
        />
        <Card>
          <CardContent className="p-6 space-y-6">
            <p className="text-white/80">
              {t('installation.description')}
            </p>

            <div className="grid sm:grid-cols-3 gap-4">
              <ExternalLinkCard
                href="https://wiki.mcsrranked.com/install/install_prism"
                title={t('installation.prism')}
                description={t('installation.prismDesc')}
                icon={<Download className="h-4 w-4" />}
              />
              <ExternalLinkCard
                href="https://wiki.mcsrranked.com/install/install_modrinth"
                title={t('installation.modrinth')}
                description={t('installation.modrinthDesc')}
                icon={<Download className="h-4 w-4" />}
              />
              <ExternalLinkCard
                href="https://wiki.mcsrranked.com/install/install_vanilla"
                title={t('installation.vanilla')}
                description={t('installation.vanillaDesc')}
                icon={<Download className="h-4 w-4" />}
              />
            </div>

            <div className="space-y-3">
              <h3 className="font-monocraft text-sm text-white">{t('installation.modpacks')}</h3>
              <div className="grid gap-3">
                <div className="p-3 rounded-lg bg-minecraft-emerald/10 border border-minecraft-emerald/20">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="h-4 w-4 text-minecraft-emerald" />
                    <span className="font-monocraft text-sm text-white">{t('installation.normalPack')}</span>
                  </div>
                  <p className="text-xs text-white/60 ml-6">
                    {t('installation.normalPackDesc')}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-1">
                    <ChevronRight className="h-4 w-4 text-white/40" />
                    <span className="font-monocraft text-sm text-white/80">{t('installation.standardPack')}</span>
                  </div>
                  <p className="text-xs text-white/60 ml-6">
                    {t('installation.standardPackDesc')}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-1">
                    <ChevronRight className="h-4 w-4 text-white/40" />
                    <span className="font-monocraft text-sm text-white/80">{t('installation.allRsgPack')}</span>
                  </div>
                  <p className="text-xs text-white/60 ml-6">
                    {t('installation.allRsgPackDesc')}
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
                {t('installation.downloadButton')}
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
          title={t('howToPlay.title')}
          id="how-to-play"
        />
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="font-monocraft text-sm text-white">{t('howToPlay.gettingStarted')}</h3>
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-minecraft-diamond/20 text-minecraft-diamond flex items-center justify-center font-monocraft text-sm">1</span>
                  <div>
                    <div className="font-monocraft text-sm text-white">{t('howToPlay.step1')}</div>
                    <p className="text-xs text-white/60 mt-1">{t('howToPlay.step1Desc')}</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-minecraft-diamond/20 text-minecraft-diamond flex items-center justify-center font-monocraft text-sm">2</span>
                  <div>
                    <div className="font-monocraft text-sm text-white">{t('howToPlay.step2')}</div>
                    <p className="text-xs text-white/60 mt-1">{t('howToPlay.step2Desc')}</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-minecraft-diamond/20 text-minecraft-diamond flex items-center justify-center font-monocraft text-sm">3</span>
                  <div>
                    <div className="font-monocraft text-sm text-white">{t('howToPlay.step3')}</div>
                    <p className="text-xs text-white/60 mt-1">{t('howToPlay.step3Desc')}</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-minecraft-diamond/20 text-minecraft-diamond flex items-center justify-center font-monocraft text-sm">4</span>
                  <div>
                    <div className="font-monocraft text-sm text-white">{t('howToPlay.step4')}</div>
                    <p className="text-xs text-white/60 mt-1">{t('howToPlay.step4Desc')}</p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-white/5">
                <h4 className="font-monocraft text-sm text-minecraft-diamond mb-2">{t('howToPlay.rankedMode')}</h4>
                <p className="text-xs text-white/70">{t('howToPlay.rankedModeDesc')}</p>
              </div>
              <div className="p-4 rounded-lg bg-white/5">
                <h4 className="font-monocraft text-sm text-minecraft-diamond mb-2">{t('howToPlay.casualMode')}</h4>
                <p className="text-xs text-white/70">{t('howToPlay.casualModeDesc')}</p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <h4 className="font-monocraft text-sm text-blue-400 mb-2">{t('howToPlay.matchmakingSettings')}</h4>
              <p className="text-xs text-white/70 mb-2">{t('howToPlay.matchmakingSettingsDesc')}</p>
              <ul className="text-xs text-white/70 space-y-1 ml-4">
                <li><strong className="text-white">{t('howToPlay.accurate')}:</strong> {t('howToPlay.accurateDesc')}</li>
                <li><strong className="text-white">{t('howToPlay.balanced')}:</strong> {t('howToPlay.balancedDesc')}</li>
                <li><strong className="text-white">{t('howToPlay.fast')}:</strong> {t('howToPlay.fastDesc')}</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Filtered Seeds - Featured Section */}
      <section>
        <div id="filtered-seeds" className="scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-minecraft-gold/20 text-minecraft-gold">
              <Layers className="h-5 w-5" />
            </div>
            <h2 className="font-monocraft text-xl text-white">{t('filteredSeeds.title')}</h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-minecraft-gold/20 text-minecraft-gold text-xs font-monocraft">
              <Sparkles className="h-3 w-3" />
              {t('filteredSeeds.featured')}
            </span>
          </div>
        </div>
        <Card className="border-minecraft-gold/30 bg-gradient-to-br from-minecraft-gold/5 to-transparent">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-3">
              <p className="text-white/80 leading-relaxed">{t('filteredSeeds.description')}</p>
              <p className="text-white/80 leading-relaxed">{t('filteredSeeds.description2')}</p>
            </div>

            <div className="space-y-4">
              <h3 className="font-monocraft text-sm text-minecraft-gold">{t('filteredSeeds.categories')}</h3>
              <div className="grid gap-3">
                {[
                  { key: 'village', color: 'bg-green-500' },
                  { key: 'shipwreck', color: 'bg-blue-500' },
                  { key: 'desertTemple', color: 'bg-yellow-600' },
                  { key: 'ruinedPortal', color: 'bg-purple-500' },
                  { key: 'buriedTreasure', color: 'bg-orange-500' },
                ].map((seed) => (
                  <div key={seed.key} className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-3 h-3 rounded-sm ${seed.color}`} />
                      <span className="font-monocraft text-sm text-white">
                        {t(`filteredSeeds.${seed.key}` as const)}
                      </span>
                    </div>
                    <p className="text-xs text-white/60 ml-5">
                      {t(`filteredSeeds.${seed.key}Desc` as const)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-monocraft text-sm text-minecraft-gold">{t('filteredSeeds.distribution')}</h3>
              <p className="text-sm text-white/70">{t('filteredSeeds.distributionDesc')}</p>
              <div className="grid gap-3">
                <div className="p-3 rounded-lg bg-gray-600/20 border border-gray-600/30">
                  <div className="font-monocraft text-sm text-gray-300 mb-1">{t('filteredSeeds.distributionCoal')}</div>
                  <p className="text-xs text-white/60">{t('filteredSeeds.distributionCoalDesc')}</p>
                </div>
                <div className="p-3 rounded-lg bg-gray-400/20 border border-gray-400/30">
                  <div className="font-monocraft text-sm text-gray-200 mb-1">{t('filteredSeeds.distributionIron')}</div>
                  <p className="text-xs text-white/60">{t('filteredSeeds.distributionIronDesc')}</p>
                </div>
                <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                  <div className="font-monocraft text-sm text-emerald-300 mb-1">{t('filteredSeeds.distributionEmerald')}</div>
                  <p className="text-xs text-white/60">{t('filteredSeeds.distributionEmeraldDesc')}</p>
                </div>
              </div>
              <p className="text-xs text-white/50 italic">{t('filteredSeeds.distributionPrivate')}</p>
            </div>

            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <h4 className="font-monocraft text-sm text-red-400 mb-2">{t('filteredSeeds.nether')}</h4>
              <p className="text-xs text-white/70 mb-2">{t('filteredSeeds.netherDesc')}</p>
              <ul className="text-xs text-white/60 space-y-1">
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-3 w-3 mt-0.5 text-red-400 flex-shrink-0" />
                  {t('filteredSeeds.netherBastion')}
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-3 w-3 mt-0.5 text-red-400 flex-shrink-0" />
                  {t('filteredSeeds.netherFortress')}
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* RNG Standardization - Featured Section */}
      <section>
        <div id="rng-standard" className="scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-minecraft-gold/20 text-minecraft-gold">
              <Shuffle className="h-5 w-5" />
            </div>
            <h2 className="font-monocraft text-xl text-white">{t('rngStandard.title')}</h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-minecraft-gold/20 text-minecraft-gold text-xs font-monocraft">
              <Sparkles className="h-3 w-3" />
              {t('rngStandard.featured')}
            </span>
          </div>
        </div>
        <Card className="border-minecraft-gold/30 bg-gradient-to-br from-minecraft-gold/5 to-transparent">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-3">
              <p className="text-white/80 leading-relaxed">{t('rngStandard.description')}</p>
              <p className="text-white/80 leading-relaxed">{t('rngStandard.description2')}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Piglin Barters */}
              <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <h4 className="font-monocraft text-sm text-yellow-400 mb-2">{t('rngStandard.piglinBarters')}</h4>
                <p className="text-xs text-white/70 mb-2">{t('rngStandard.piglinBartersDesc')}</p>
                <ul className="text-xs text-white/60 space-y-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3 w-3 mt-0.5 text-yellow-400 flex-shrink-0" />
                    {t('rngStandard.piglinObsidian')}
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3 w-3 mt-0.5 text-yellow-400 flex-shrink-0" />
                    {t('rngStandard.piglinPearls')}
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3 w-3 mt-0.5 text-yellow-400 flex-shrink-0" />
                    {t('rngStandard.piglinSync')}
                  </li>
                </ul>
              </div>

              {/* Entity Drops */}
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <h4 className="font-monocraft text-sm text-white mb-2">{t('rngStandard.entityDrops')}</h4>
                <p className="text-xs text-white/70 mb-2">{t('rngStandard.entityDropsDesc')}</p>
                <ul className="text-xs text-white/60 space-y-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3 w-3 mt-0.5 text-minecraft-emerald flex-shrink-0" />
                    {t('rngStandard.entityBlaze')}
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3 w-3 mt-0.5 text-minecraft-emerald flex-shrink-0" />
                    {t('rngStandard.entityEnderman')}
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3 w-3 mt-0.5 text-minecraft-emerald flex-shrink-0" />
                    {t('rngStandard.entityGolem')}
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3 w-3 mt-0.5 text-minecraft-emerald flex-shrink-0" />
                    {t('rngStandard.entityFood')}
                  </li>
                </ul>
              </div>

              {/* Block Drops */}
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <h4 className="font-monocraft text-sm text-white mb-2">{t('rngStandard.blockDrops')}</h4>
                <p className="text-xs text-white/70 mb-2">{t('rngStandard.blockDropsDesc')}</p>
                <ul className="text-xs text-white/60 space-y-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3 w-3 mt-0.5 text-minecraft-emerald flex-shrink-0" />
                    {t('rngStandard.blockFlint')}
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3 w-3 mt-0.5 text-minecraft-emerald flex-shrink-0" />
                    {t('rngStandard.blockSticks')}
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3 w-3 mt-0.5 text-minecraft-emerald flex-shrink-0" />
                    {t('rngStandard.blockApples')}
                  </li>
                </ul>
              </div>

              {/* Other Mechanics */}
              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <h4 className="font-monocraft text-sm text-purple-400 mb-2">{t('rngStandard.otherMechanics')}</h4>
                <p className="text-xs text-white/70 mb-2">{t('rngStandard.otherMechanicsDesc')}</p>
                <ul className="text-xs text-white/60 space-y-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3 w-3 mt-0.5 text-purple-400 flex-shrink-0" />
                    {t('rngStandard.otherEye')}
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3 w-3 mt-0.5 text-purple-400 flex-shrink-0" />
                    {t('rngStandard.otherDragon')}
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3 w-3 mt-0.5 text-purple-400 flex-shrink-0" />
                    {t('rngStandard.otherBlaze')}
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex justify-center">
              <a
                href={t('rngStandard.learnMoreLink')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-minecraft-gold/20 text-minecraft-gold font-monocraft text-sm hover:bg-minecraft-gold/30 transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                {t('rngStandard.learnMore')}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Ranking System */}
      <section>
        <SectionHeader
          icon={<Trophy className="h-5 w-5" />}
          title={t('rankingSystem.title')}
          id="ranking-system"
        />
        <Card>
          <CardContent className="p-6 space-y-6">
            <p className="text-white/80">{t('rankingSystem.description')}</p>

            <div className="space-y-3">
              <h3 className="font-monocraft text-sm text-white">{t('rankingSystem.rankTiers')}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { name: t('rankingSystem.coal'), range: t('rankingSystem.coalRange'), color: "bg-gray-600", desc: t('rankingSystem.coalDesc') },
                  { name: t('rankingSystem.iron'), range: t('rankingSystem.ironRange'), color: "bg-gray-400", desc: t('rankingSystem.ironDesc') },
                  { name: t('rankingSystem.gold'), range: t('rankingSystem.goldRange'), color: "bg-yellow-500", desc: t('rankingSystem.goldDesc') },
                  { name: t('rankingSystem.emerald'), range: t('rankingSystem.emeraldRange'), color: "bg-emerald-500", desc: t('rankingSystem.emeraldDesc') },
                  { name: t('rankingSystem.diamond'), range: t('rankingSystem.diamondRange'), color: "bg-cyan-400", desc: t('rankingSystem.diamondDesc') },
                  { name: t('rankingSystem.netherite'), range: t('rankingSystem.netheriteRange'), color: "bg-purple-600", desc: t('rankingSystem.netheriteDesc') },
                ].map((rank) => (
                  <div key={rank.name} className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-3 h-3 rounded-sm ${rank.color}`} />
                      <span className="font-monocraft text-sm text-white">{rank.name}</span>
                    </div>
                    <div className="text-xs text-minecraft-diamond">{rank.range}</div>
                    <div className="text-xs text-white/50 mt-1">{rank.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <h4 className="font-monocraft text-sm text-yellow-400 mb-2">{t('rankingSystem.eloDecay')}</h4>
                <p className="text-xs text-white/70">{t('rankingSystem.eloDecayDesc')}</p>
              </div>
              <div className="p-4 rounded-lg bg-white/5">
                <h4 className="font-monocraft text-sm text-white mb-2">{t('rankingSystem.seasons')}</h4>
                <p className="text-xs text-white/70">{t('rankingSystem.seasonsDesc')}</p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-minecraft-emerald/10 border border-minecraft-emerald/20">
              <h4 className="font-monocraft text-sm text-minecraft-emerald mb-2">{t('rankingSystem.seedDistribution')}</h4>
              <p className="text-xs text-white/70 mb-3">{t('rankingSystem.seedDistributionDesc')}</p>
              <ul className="text-xs text-white/70 space-y-1">
                <li>{t('rankingSystem.seedCoal')}</li>
                <li>{t('rankingSystem.seedIron')}</li>
                <li>{t('rankingSystem.seedEmerald')}</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Tools */}
      <section>
        <SectionHeader
          icon={<Wrench className="h-5 w-5" />}
          title={t('tools.title')}
          id="tools"
        />
        <Card>
          <CardContent className="p-6 space-y-6">
            <p className="text-white/80">{t('tools.description')}</p>

            <div className="space-y-4">
              {/* Jingle */}
              <div className="p-4 rounded-lg border border-white/10 hover:border-minecraft-diamond/30 transition-colors">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="font-monocraft text-base text-white">{t('tools.jingle')}</h3>
                    <p className="text-xs text-white/50">{t('tools.jingleSubtitle')}</p>
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
                <p className="text-sm text-white/70 mb-3">{t('tools.jingleDesc')}</p>
                <div className="grid sm:grid-cols-2 gap-2 text-xs text-white/60">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-minecraft-emerald" />
                    <span>{t('tools.jingleFeature1')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-minecraft-emerald" />
                    <span>{t('tools.jingleFeature2')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-minecraft-emerald" />
                    <span>{t('tools.jingleFeature3')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-minecraft-emerald" />
                    <span>{t('tools.jingleFeature4')}</span>
                  </div>
                </div>
                <div className="mt-3 p-2 rounded bg-minecraft-diamond/10 border border-minecraft-diamond/20">
                  <p className="text-xs text-white/70">
                    <span className="text-minecraft-diamond font-medium">{t('tools.jinglePlugin')}: </span>
                    {t('tools.jinglePluginDesc')}{' '}
                    <a
                      href="https://github.com/leonardoxr/jingle-e-counter-plugin"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-minecraft-diamond hover:underline inline-flex items-center gap-1"
                    >
                      GitHub <ExternalLink className="h-3 w-3" />
                    </a>
                  </p>
                </div>
              </div>

              {/* Ninjabrain Bot */}
              <div className="p-4 rounded-lg border border-white/10 hover:border-minecraft-diamond/30 transition-colors">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="font-monocraft text-base text-white">{t('tools.ninjabrain')}</h3>
                    <p className="text-xs text-white/50">{t('tools.ninjabrainSubtitle')}</p>
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
                <p className="text-sm text-white/70 mb-3">{t('tools.ninjabrainDesc')}</p>
                <div className="grid sm:grid-cols-2 gap-2 text-xs text-white/60">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-minecraft-emerald" />
                    <span>{t('tools.ninjabrainFeature1')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-minecraft-emerald" />
                    <span>{t('tools.ninjabrainFeature2')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-minecraft-emerald" />
                    <span>{t('tools.ninjabrainFeature3')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-minecraft-emerald" />
                    <span>{t('tools.ninjabrainFeature4')}</span>
                  </div>
                </div>
                <div className="mt-3 p-2 rounded bg-yellow-500/10 border border-yellow-500/20">
                  <p className="text-xs text-yellow-400">{t('tools.ninjabrainTip')}</p>
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
          title={t('resources.title')}
          id="resources"
        />
        <Card>
          <CardContent className="p-6 space-y-6">
            <p className="text-white/80">{t('resources.description')}</p>

            <div className="space-y-4">
              <h3 className="font-monocraft text-sm text-white">{t('resources.official')}</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <ExternalLinkCard
                  href="https://wiki.mcsrranked.com"
                  title={t('resources.wiki')}
                  description={t('resources.wikiDesc')}
                  icon={<BookOpen className="h-4 w-4" />}
                />
                <ExternalLinkCard
                  href="https://mcsrranked.com"
                  title={t('resources.website')}
                  description={t('resources.websiteDesc')}
                  icon={<ExternalLink className="h-4 w-4" />}
                />
                <ExternalLinkCard
                  href="https://discord.gg/nnjUSyDErj"
                  title={t('resources.discord')}
                  description={t('resources.discordDesc')}
                  icon={<Users className="h-4 w-4" />}
                />
                <ExternalLinkCard
                  href="https://modrinth.com/mod/mcsr-ranked"
                  title={t('resources.modrinth')}
                  description={t('resources.modrinthDesc')}
                  icon={<Download className="h-4 w-4" />}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-monocraft text-sm text-white">{t('resources.gameplay')}</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <ExternalLinkCard
                  href="https://wiki.mcsrranked.com/gameplay/seed"
                  title={t('resources.seedGuide')}
                  description={t('resources.seedGuideDesc')}
                  icon={<BookOpen className="h-4 w-4" />}
                />
                <ExternalLinkCard
                  href="https://wiki.mcsrranked.com/gameplay/rng"
                  title={t('resources.rngGuide')}
                  description={t('resources.rngGuideDesc')}
                  icon={<BookOpen className="h-4 w-4" />}
                />
                <ExternalLinkCard
                  href="https://wiki.mcsrranked.com/gameplay/elo_and_ranks"
                  title={t('resources.eloGuide')}
                  description={t('resources.eloGuideDesc')}
                  icon={<Trophy className="h-4 w-4" />}
                />
                <ExternalLinkCard
                  href="https://wiki.mcsrranked.com/install/faq"
                  title={t('resources.faq')}
                  description={t('resources.faqDesc')}
                  icon={<AlertCircle className="h-4 w-4" />}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-monocraft text-sm text-white">{t('resources.toolsAndMods')}</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <ExternalLinkCard
                  href="https://mods.tildejustin.dev"
                  title={t('resources.approvedMods')}
                  description={t('resources.approvedModsDesc')}
                  icon={<CheckCircle2 className="h-4 w-4" />}
                />
                <ExternalLinkCard
                  href="https://github.com/DuncanRuns/Jingle"
                  title={t('tools.jingle')}
                  description={t('tools.jingleSubtitle')}
                  icon={<Wrench className="h-4 w-4" />}
                />
                <ExternalLinkCard
                  href="https://github.com/Ninjabrain1/Ninjabrain-Bot"
                  title={t('tools.ninjabrain')}
                  description={t('tools.ninjabrainSubtitle')}
                  icon={<Wrench className="h-4 w-4" />}
                />
                <ExternalLinkCard
                  href="https://github.com/tildejustin/mcsr-sodium-1.16.5"
                  title={t('resources.sodium')}
                  description={t('resources.sodiumDesc')}
                  icon={<Cpu className="h-4 w-4" />}
                />
              </div>
            </div>

            <div className="p-4 rounded-lg bg-minecraft-diamond/10 border border-minecraft-diamond/20 text-center">
              <p className="text-sm text-white/80 mb-3">{t('resources.readyToTrack')}</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white font-monocraft text-sm hover:bg-white/20 transition-colors"
                >
                  <Trophy className="h-4 w-4" />
                  {t('resources.viewLeaderboard')}
                </Link>
                <Link
                  href="/live"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 font-monocraft text-sm hover:bg-red-500/30 transition-colors"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  {t('resources.watchLive')}
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Attribution */}
      <div className="text-center text-xs text-white/40 pb-6">
        <p>
          {t('attribution').split('MCSR Ranked Wiki')[0]}
          <a
            href="https://wiki.mcsrranked.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-minecraft-diamond/60 hover:text-minecraft-diamond"
          >
            MCSR Ranked Wiki
          </a>
          {t('attribution').split('MCSR Ranked Wiki')[1] || '.'}
        </p>
      </div>
    </div>
  );
}
