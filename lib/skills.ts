export interface Skill {
  id: string; // The folder name / URL slug
  name: string; // The official product name
  price: string; // The display price
  priceId: string; // The Stripe Price ID (price_...)
  icon: string;
  desc: string;
  benefits: string[];
}

export const skills: Skill[] = [
  {
    id: 'crypto',
    name: 'AgentBoost Crypto Pro',
    price: '$14.99',
    priceId: process.env.NEXT_PUBLIC_CRYPTO_PRICE_ID || 'price_...',
    icon: '📈',
    desc: 'Institutional-grade quantitative analysis for crypto options and volatility signals.',
    benefits: ['Real-time GREEKS tracking', 'Delta-Neutral hedging', 'Exchange API integration'],
  },
  {
    id: 'real-estate',
    name: 'AgentBoost Real Estate Pro',
    price: '$29.99',
    priceId: process.env.NEXT_PUBLIC_REALESTATE_PRICE_ID || 'price_...',
    icon: '🏠',
    desc: 'High-precision commercial investment underwriting, calculating Cap Rate and IRR.',
    benefits: ['Multi-year IRR projections', 'Market comp analysis', 'Automated memorandums'],
  },
  {
    id: 'whatsapp',
    name: 'AgentBoost WhatsApp Pro',
    price: '$19.99',
    priceId: 'prod_UJEtsQH8rPPFWw', // 👈 PASTE YOUR PRICE ID
    icon: '💬',
    desc: 'Scalable CRM orchestration and high-conversion automation for enterprise communication.',
    benefits: ['High-deliverability routing', 'Liquid-template personalization', 'Webhook integration'],
  },
  {
    id: 'b2b-leads',
    name: 'AgentBoost LeadScraper Pro',
    price: '$29.99',
    priceId: 'prod_UJFLf0ADTSKPRV', // 👈 PASTE YOUR PRICE ID
    icon: '🔍',
    desc: 'Extract verified decision-maker contact data from any company domain.',
    benefits: ['Direct-dial phone numbers', '98% Email verification', 'Salesforce/HubSpot export'],
  },
  {
    id: 'github-review', // 👈 The Folder Name
    name: 'AgentBoost Security Pro', // 👈 The Product Name
    price: '$9.99',
    priceId: 'prod_UJEtPSSD5dKGH6', // 👈 PASTE YOUR PRICE ID
    icon: '🛡️',
    desc: 'Comprehensive security review for pull requests, identifying vulnerabilities.',
    benefits: ['SOC2 compliance scanning', 'Static & Dynamic analysis', 'Auto-Fix CLI commands'],
  },
  {
    id: 'aws-cost',
    name: 'AgentBoost AWS Optimizer',
    price: '$19.99',
    priceId: 'prod_UJFKUJaBZudZ5J', // 👈 PASTE YOUR PRICE ID
    icon: '☁️',
    desc: 'Automated cloud infrastructure scanning to detect idle resources and anomalies.',
    benefits: ['Idle EC2/EBS detection', 'One-click cost reduction scripts', 'IAM-secured read access'],
  },
  {
    id: 'legal-risk',
    name: 'AgentBoost Legal Counsel',
    price: '$49.99',
    priceId: 'prod_UJFLVgNYrhj99d', // 👈 PASTE YOUR PRICE ID
    icon: '⚖️',
    desc: 'High-liability risk assessment for NDAs and enterprise vendor agreements.',
    benefits: ['IP trap detection', 'Enforceability risk scoring', 'Redlined counter-offers'],
  },
  {
    id: 'seo-audit',
    name: 'AgentBoost SEO Pro',
    price: '$19.99',
    priceId: 'prod_UJFL7D8JZUkvZp', // 👈 PASTE YOUR PRICE ID
    icon: '🚀',
    desc: 'Instant technical health checks, crawling sites for ranking bottlenecks.',
    benefits: ['Core Web Vitals audit', 'H1/Meta tag optimization', 'White-label PDF reporting'],
  },
  {
    id: 'linkedin-pro',
    name: 'AgentBoost LinkedIn Pro',
    price: '$12.99',
    priceId: 'prod_UJFLsCeI9Fxz6R', // 👈 PASTE YOUR PRICE ID
    icon: '👔',
    desc: 'Generate viral, high-converting social copy optimized for professional feeds.',
    benefits: ['Scroll-stopping hook generation', 'A/B tone testing', 'Automated profile scheduling'],
  },
  {
    id: 'stripe-invoice',
    name: 'AgentBoost Invoicer',
    price: '$9.99',
    priceId: 'prod_UJFLs743pREaun', // 👈 PASTE YOUR PRICE ID
    icon: '💳',
    desc: 'Instantly generate professional invoices and real payment links from a chat prompt.',
    benefits: ['Stripe Connect integration', 'Automated receipt generation', 'Multi-currency support'],
  },
  {
    id: 'yt-predictor',
    name: 'AgentBoost Creator Pro',
    price: '$12.99',
    priceId: 'prod_UJFMgZJxtwyX7G', // 👈 PASTE YOUR PRICE ID
    icon: '🎥',
    desc: 'Vision AI analysis to predict YouTube thumbnail performance and CTR.',
    benefits: ['Eye-tracking Heatmap simulation', 'A/B test concept scoring', 'Contrast & emotion analysis'],
  },
];