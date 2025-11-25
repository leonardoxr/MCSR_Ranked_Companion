import type { Metadata } from 'next';
import { GettingStartedClient } from '@/components/features/GettingStartedClient';

const BASE_URL = 'https://mcsr-ranked-companion.vercel.app';

export const metadata: Metadata = {
  title: 'Getting Started - MCSR Ranked Guide for Beginners',
  description:
    'Learn how to get started with MCSR Ranked. Complete guide covering installation, requirements, gameplay, ranking system, and essential tools for Minecraft speedrunning.',
  keywords: [
    'MCSR Ranked',
    'Minecraft Speedrun',
    'Getting Started',
    'Installation Guide',
    'Speedrun Tutorial',
    'Minecraft Ranked',
    'ELO Rating',
    'Beginner Guide',
    'Jingle',
    'Ninjabrain Bot',
  ],
  alternates: {
    canonical: `${BASE_URL}/getting-started`,
  },
  openGraph: {
    title: 'Getting Started with MCSR Ranked - Beginner Guide',
    description:
      'Complete guide to getting started with MCSR Ranked. Learn installation, gameplay, ranking system, and essential speedrunning tools.',
    url: `${BASE_URL}/getting-started`,
    siteName: 'MCSR Ranked Companion',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: `${BASE_URL}/icon.png`,
        width: 512,
        height: 512,
        alt: 'MCSR Ranked Companion Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Getting Started with MCSR Ranked - Beginner Guide',
    description:
      'Complete guide to getting started with MCSR Ranked. Learn installation, gameplay, and essential tools.',
    images: [`${BASE_URL}/icon.png`],
  },
};

// JSON-LD structured data for the getting started guide
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Getting Started with MCSR Ranked',
  description:
    'Learn how to set up and play MCSR Ranked, the competitive Minecraft speedrunning platform.',
  step: [
    {
      '@type': 'HowToStep',
      name: 'Check Requirements',
      text: 'Ensure you have a legitimate Minecraft Java Edition account and meet the technical requirements (Minecraft 1.16.1, Fabric, 64-bit Java).',
    },
    {
      '@type': 'HowToStep',
      name: 'Install the Mod',
      text: 'Download and install the MCSR Ranked modpack using Prism/MultiMC, Modrinth App, or the vanilla launcher.',
    },
    {
      '@type': 'HowToStep',
      name: 'Complete Placement Matches',
      text: 'Play your first matches to establish your initial ELO rating.',
    },
    {
      '@type': 'HowToStep',
      name: 'Start Competing',
      text: 'Queue for ranked matches and climb the ladder from Coal to Netherite rank.',
    },
  ],
  tool: [
    {
      '@type': 'HowToTool',
      name: 'Jingle',
    },
    {
      '@type': 'HowToTool',
      name: 'Ninjabrain Bot',
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
      <GettingStartedClient />
    </>
  );
}
