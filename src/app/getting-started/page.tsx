import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import { GettingStartedClient } from '@/components/features/GettingStartedClient';

export const metadata: Metadata = {
  title: 'MCSR Ranked Guide - How to Play, RNG, Seeds, ELO & Installation',
  description:
    'Complete MCSR Ranked guide: Learn about filtered seeds, RNG standardization, ELO ranking system, installation, and gameplay. Understand how piglin barters, blaze drops, and seed types work. Essential tools: Jingle, Ninjabrain Bot.',
  keywords: [
    'MCSR Ranked',
    'MCSR Ranked mod',
    'MCSR Ranked guide',
    'MCSR Ranked tutorial',
    'Minecraft Speedrun Ranked',
    'Minecraft competitive speedrun',
    'MCSR filtered seeds',
    'MCSR RNG standardization',
    'MCSR seed types',
    'MCSR piglin barters',
    'MCSR blaze drops',
    'MCSR ELO system',
    'MCSR ranking system',
    'MCSR installation',
    'how to play MCSR Ranked',
    'MCSR Ranked download',
    'Minecraft 1.16.1 speedrun',
    'Fabric speedrun mod',
    'Jingle speedrun tool',
    'Ninjabrain Bot stronghold calculator',
    'MCSR village seeds',
    'MCSR shipwreck seeds',
    'MCSR buried treasure',
    'MCSR ruined portal',
    'speedrun ELO rating',
    'Coal Iron Gold Emerald Diamond Netherite rank',
  ],
  alternates: {
    canonical: `${SITE_URL}/getting-started`,
  },
  openGraph: {
    title: 'MCSR Ranked Complete Guide - Seeds, RNG, ELO & How to Play',
    description:
      'Everything you need to know about MCSR Ranked: filtered seeds explained, RNG standardization system, ELO ranking, installation guide, and essential speedrunning tools.',
    url: `${SITE_URL}/getting-started`,
    siteName: 'MCSR Ranked Companion',
    type: 'article',
    locale: 'en_US',
    images: [
      {
        url: `${SITE_URL}/icon.png`,
        width: 512,
        height: 512,
        alt: 'MCSR Ranked Companion - Minecraft Speedrun Statistics',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MCSR Ranked Guide - Seeds, RNG, ELO & Installation',
    description:
      'Complete MCSR Ranked guide: filtered seeds, RNG standardization, ranking system, and essential tools for Minecraft speedrunning.',
    images: [`${SITE_URL}/icon.png`],
  },
};

// JSON-LD structured data for the getting started guide
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'MCSR Ranked Complete Guide - Seeds, RNG, ELO & How to Play',
  description:
    'Comprehensive guide to MCSR Ranked covering filtered seeds, RNG standardization, ELO ranking system, installation, and essential speedrunning tools.',
  author: {
    '@type': 'Organization',
    name: 'MCSR Ranked Companion',
    url: SITE_URL,
  },
  publisher: {
    '@type': 'Organization',
    name: 'MCSR Ranked Companion',
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `${SITE_URL}/getting-started`,
  },
  about: [
    {
      '@type': 'Thing',
      name: 'MCSR Ranked',
      description: 'Competitive matchmaking system for Minecraft speedrunning',
    },
    {
      '@type': 'Thing',
      name: 'Filtered Seeds',
      description: 'Specially filtered seeds ensuring fair competition with guaranteed structures and loot',
    },
    {
      '@type': 'Thing',
      name: 'RNG Standardization',
      description: 'System that synchronizes random events like piglin barters and mob drops between players',
    },
  ],
  articleSection: [
    'What is MCSR Ranked',
    'Requirements',
    'Installation',
    'How to Play',
    'Filtered Seeds',
    'RNG Standardization',
    'Ranking System',
    'Essential Tools',
    'Resources',
  ],
  keywords: 'MCSR Ranked, Minecraft speedrun, filtered seeds, RNG standardization, ELO ranking, piglin barters, Jingle, Ninjabrain Bot',
};

// Additional FAQ schema for common questions
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is MCSR Ranked?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'MCSR Ranked is a competitive matchmaking system for Minecraft speedrunning that pairs players of similar skill levels using an ELO rating system. It runs on Minecraft 1.16.1 with filtered seeds and standardized RNG.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do filtered seeds work in MCSR Ranked?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'MCSR Ranked uses specially filtered seeds categorized by starting structure (Village, Shipwreck, Desert Temple, Ruined Portal, Buried Treasure). Both players receive the same seed. Higher ELO ranks unlock more seed types.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is RNG standardization in MCSR Ranked?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'RNG standardization ensures all players experience identical random events in the same order. This includes guaranteed piglin barter results (6 obsidian and 3 ender pearl trades in first 72 barters), synchronized mob drops, and standardized block drop rates.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are the MCSR Ranked rank tiers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'MCSR Ranked has 6 rank tiers: Coal (0-599 ELO), Iron (600-899), Gold (900-1199), Emerald (1200-1499), Diamond (1500-1999), and Netherite (2000+). Higher ranks unlock more seed types.',
      },
    },
  ],
};

export default function GettingStartedPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <GettingStartedClient />
    </>
  );
}
