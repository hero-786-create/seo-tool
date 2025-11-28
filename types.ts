
export enum ViewState {
  HOME = 'HOME',
  DASHBOARD = 'DASHBOARD',
  KEYWORD_MAGIC = 'KEYWORD_MAGIC',
  DOMAIN_OVERVIEW = 'DOMAIN_OVERVIEW',
  CONTENT_AUDIT = 'CONTENT_AUDIT',
  BACKLINK_ANALYSIS = 'BACKLINK_ANALYSIS',
  SITE_AUDIT = 'SITE_AUDIT',
  RANK_TRACKER = 'RANK_TRACKER',
  MARKET_INSIGHTS = 'MARKET_INSIGHTS',
  LOCAL_SEO = 'LOCAL_SEO',
  AI_CHAT = 'AI_CHAT',
  SCHEMA_GENERATOR = 'SCHEMA_GENERATOR',
  SITEMAP = 'SITEMAP',
  
  // Content Tools
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  META_GENERATOR = 'META_GENERATOR',
  CONTENT_GENERATOR = 'CONTENT_GENERATOR',
  CONTENT_EDITOR = 'CONTENT_EDITOR', // SurferSEO Style
  TEXT_TO_SPEECH = 'TEXT_TO_SPEECH',
  
  // Visual & Trends
  KEYWORD_VISUALIZATION = 'KEYWORD_VISUALIZATION', // AnswerThePublic Style
  TRENDS_EXPLORER = 'TRENDS_EXPLORER', // Google Trends Style
  GMB_MANAGER = 'GMB_MANAGER', // Google Business Profile

  // New Competitor/Advanced Tools
  KEYWORD_GAP = 'KEYWORD_GAP',
  BROKEN_LINKS = 'BROKEN_LINKS',
  PPC_EXPLORER = 'PPC_EXPLORER',
  SERP_CHECKER = 'SERP_CHECKER',
  DOMAIN_COMPARISON = 'DOMAIN_COMPARISON',
  KEYWORD_CLUSTERING = 'KEYWORD_CLUSTERING',
  ROBOTS_TXT = 'ROBOTS_TXT',
  HREFLANG_GENERATOR = 'HREFLANG_GENERATOR',
  GOOGLE_ESSENTIALS = 'GOOGLE_ESSENTIALS',

  PRICING = 'PRICING',
  ABOUT = 'ABOUT',
  CONTACT = 'CONTACT',
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
  CHECKOUT = 'CHECKOUT',
  
  // Legal
  LEGAL_PRIVACY = 'LEGAL_PRIVACY',
  LEGAL_TERMS = 'LEGAL_TERMS',
  LEGAL_DISCLAIMER = 'LEGAL_DISCLAIMER',
  LEGAL_COOKIE = 'LEGAL_COOKIE',
  LEGAL_DMCA = 'LEGAL_DMCA',
  LEGAL_REFUND = 'LEGAL_REFUND'
}

export type PlanType = 'Free' | 'Pro' | 'Business';

export interface User {
  name: string;
  email: string;
  plan: PlanType;
  searchesLeft: number;
  aiCreditsLeft: number;
  avatar?: string;
  referralCode?: string;
  referralsCount?: number;
  isNewUser?: boolean;
}

export interface KeywordData {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
  intent: 'Informational' | 'Commercial' | 'Transactional' | 'Navigational';
  trend: number[];
  topic: string;
  isLongTail?: boolean;
}

export interface CompetitorData {
  domain: string;
  authorityScore: number;
  organicTraffic: number;
}

export interface SerpSnapshot {
    keyword: string;
    title: string;
    url: string;
    snippet: string;
    position: number;
}

export interface DomainMetrics {
  authorityScore: number;
  organicTraffic: number;
  backlinks: number;
  topKeywords: { keyword: string; position: number }[];
  competitors: CompetitorData[];
  trafficTrend: { month: string; value: number }[];
  weeklyTrend?: { date: string; value: number }[];
  serpSnapshots?: SerpSnapshot[];
}

export interface ContentAuditResult {
  score: number;
  readability: string;
  tone: string;
  freshnessScore: number;
  suggestions: string[];
  keywordsDetected: string[];
}

export interface BacklinkData {
  spamScore: number;
  totalBacklinks: number;
  referringDomains: number;
  domainAuthority: number;
  topAnchors: { anchor: string; percent: number }[];
  newLost: { date: string; new: number; lost: number }[];
  backlinkTypes: { type: string; count: number }[];
}

export interface SiteAuditData {
  healthScore: number;
  dr: number; 
  ur: number; 
  backlinks: number;
  refDomains: number;
  organicKeywords: number;
  organicTraffic: number;
  
  crawledPages: number;
  errors: number;
  warnings: number;
  notices: number;
  
  indexability: {
      canonical: string;
      robotsTxt: string;
      sitemap: string;
      metaRobots: string;
      hreflang: string;
  };
  
  socialTags: {
      ogTitle: string;
      ogImage: string;
      twitterCard: string;
      schemaTypes: string[];
  };

  httpHeaders: {
      statusCode: number;
      contentType: string;
      server: string;
      xFrameOptions: string;
  };

  images: {
      total: number;
      missingAlt: number;
      largeFiles: number;
  };

  outgoingLinks: {
      internal: number;
      external: number;
      broken: number;
  };

  coreWebVitals: { metric: string; value: string; status: 'Good' | 'Poor' | 'Needs Improvement' }[];
  
  topIssues: { 
    issue: string; 
    priority: 'High' | 'Medium' | 'Low'; 
    count: number;
    fixSuggestion?: string; 
  }[];
}

export interface RankData {
  visibility: number;
  avgPosition: number;
  keywords: {
    keyword: string;
    position: number;
    previousPosition: number;
    volume: number;
    serpFeatures: string[];
  }[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface GroundingSource {
  title?: string;
  uri?: string;
}

export interface MarketInsightResult {
  text: string;
  sources: GroundingSource[];
}

export interface LocalPlace {
  title: string;
  address?: string;
  rating?: number;
  userRatingCount?: number;
  websiteUri?: string;
  googleMapsUri?: string;
}

export interface LocalSeoResult {
  text: string;
  places: LocalPlace[];
}

export interface Notification {
    id: string;
    type: 'alert' | 'info' | 'success';
    message: string;
    time: string;
}

export interface SocialContentResult {
  type: 'hashtags' | 'youtube' | 'tiktok' | 'captions' | 'scripts';
  content: string[];
}

export interface MetaTagResult {
  title: string;
  description: string;
  previewUrl: string;
}

export interface KeywordGapResult {
  missing: { keyword: string; volume: number; kd: number; competitorPos: number }[];
  shared: { keyword: string; volume: number; myPos: number; competitorPos: number }[];
  weak: { keyword: string; volume: number; myPos: number; competitorPos: number }[];
}

export interface BrokenLinkResult {
  totalLinks: number;
  brokenCount: number;
  links: {
    url: string;
    statusCode: number;
    sourcePage: string;
    anchorText: string;
  }[];
}

export interface PPCDataResult {
  estimatedBudget: number;
  paidKeywords: number;
  topAdKeywords: { keyword: string; cpc: number; volume: number; competition: number }[];
  sampleAds: {
    headline: string;
    description: string;
    url: string;
  }[];
}

export interface SerpAnalysisResult {
  keyword: string;
  difficulty: number;
  volume: number;
  results: {
    rank: number;
    title: string;
    url: string;
    domainAuthority: number;
    backlinks: number;
    wordCount: number;
  }[];
}

export interface DomainComparisonResult {
  domains: {
    domain: string;
    authorityScore: number;
    organicTraffic: number;
    paidTraffic: number;
    keywords: number;
    backlinks: number;
  }[];
  winner: string;
  insight: string;
}

export interface SerpVolatility {
  score: number;
  status: 'Quiet' | 'Normal' | 'High' | 'Very High';
  date: string;
}

export interface GoogleEssentialResult {
  mobileFriendly: boolean;
  performanceScore: number;
  lcp: string;
  fid: string;
  cls: string;
  screenshot: string; // url
}

// --- New Feature Interfaces ---

export interface KeywordVisualResult {
  questions: string[];
  prepositions: string[];
  comparisons: string[];
  related: string[];
}

export interface SemanticKeyword {
  keyword: string;
  importance: 'High' | 'Medium' | 'Low';
  recommendedCount: number;
  currentCount: number;
}

export interface TrendData {
  query: string;
  interestOverTime: { date: string; value: number }[];
  relatedTopics: string[];
  regionalInterest: { region: string; value: number }[];
}

export interface GmbLocation {
  name: string;
  address: string;
  rating: number;
  reviews: number;
  views: number;
  calls: number;
}
