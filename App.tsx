
import React, { useState, Suspense, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, Search, Globe, FileText, Menu, X, Zap, Link as LinkIcon, 
  Activity, BarChart, MapPin, MessageSquare, Home, Mail, User as UserIcon, 
  LogOut, Crown, AlertTriangle, Lock, Loader2, Code, Hash, Tags, PenTool,
  GitCompare, Unplug, DollarSign, ChevronDown, ChevronRight, Layers, Table2,
  TrendingUp, Mic2, Star, Gift, Check, ArrowRight, Network, LineChart, Store
} from 'lucide-react';
import { ViewState, User, PlanType } from './types';
import { LockedFeature } from './components/LockedFeature';

// Lazy load views
const DashboardView = React.lazy(() => import('./views/DashboardView'));
const KeywordMagicView = React.lazy(() => import('./views/KeywordMagicView'));
const DomainOverviewView = React.lazy(() => import('./views/DomainOverviewView'));
const ContentAuditView = React.lazy(() => import('./views/ContentAuditView'));
const BacklinkAnalysisView = React.lazy(() => import('./views/BacklinkAnalysisView'));
const SiteAuditView = React.lazy(() => import('./views/SiteAuditView'));
const RankTrackerView = React.lazy(() => import('./views/RankTrackerView'));
const MarketInsightsView = React.lazy(() => import('./views/MarketInsightsView'));
const LocalSeoView = React.lazy(() => import('./views/LocalSeoView'));
const ChatView = React.lazy(() => import('./views/ChatView'));
const SchemaGeneratorView = React.lazy(() => import('./views/SchemaGeneratorView'));
const SitemapView = React.lazy(() => import('./views/SitemapView'));
const AuthView = React.lazy(() => import('./views/AuthView'));
const CheckoutView = React.lazy(() => import('./views/CheckoutView'));
const SocialMediaToolsView = React.lazy(() => import('./views/SocialMediaToolsView'));
const MetaGeneratorView = React.lazy(() => import('./views/MetaGeneratorView'));
const ContentGeneratorView = React.lazy(() => import('./views/ContentGeneratorView'));
const KeywordGapView = React.lazy(() => import('./views/KeywordGapView'));
const BrokenLinkView = React.lazy(() => import('./views/BrokenLinkView'));
const PpcExplorerView = React.lazy(() => import('./views/PpcExplorerView'));
const SerpCheckerView = React.lazy(() => import('./views/SerpCheckerView'));
const DomainComparisonView = React.lazy(() => import('./views/DomainComparisonView'));
const TextToSpeechView = React.lazy(() => import('./views/TextToSpeechView'));
const KeywordClusteringView = React.lazy(() => import('./views/KeywordClusteringView'));
const RobotsTxtView = React.lazy(() => import('./views/RobotsTxtView'));
const HreflangView = React.lazy(() => import('./views/HreflangView'));
const GoogleEssentialView = React.lazy(() => import('./views/GoogleEssentialView'));
const ImageGeneratorView = React.lazy(() => import('./views/ImageGeneratorView'));
const ImageAnalyzerView = React.lazy(() => import('./views/ImageAnalyzerView'));
const AudioTranscriptionView = React.lazy(() => import('./views/AudioTranscriptionView'));
const VideoAnalyzerView = React.lazy(() => import('./views/VideoAnalyzerView'));

// New Views
const KeywordVisualizationView = React.lazy(() => import('./views/KeywordVisualizationView'));
const ContentEditorView = React.lazy(() => import('./views/ContentEditorView'));
const TrendsView = React.lazy(() => import('./views/TrendsView'));
const GmbView = React.lazy(() => import('./views/GmbView'));

const HomeView = React.lazy(() => import('./views/HomeView'));
const PricingView = React.lazy(() => import('./views/PricingView'));
const AboutView = React.lazy(() => import('./views/AboutView'));
const ContactView = React.lazy(() => import('./views/ContactView'));
const LegalView = React.lazy(() => import('./views/LegalView'));

const LoadingScreen = () => (
  <div className="flex h-full w-full items-center justify-center bg-slate-50 min-h-[400px]">
    <div className="flex flex-col items-center">
      <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-2" />
      <p className="text-slate-400 text-sm font-medium">Genie Metrics...</p>
    </div>
  </div>
);

const PUBLIC_VIEWS = [
  ViewState.HOME,
  ViewState.PRICING,
  ViewState.ABOUT,
  ViewState.CONTACT,
  ViewState.LEGAL_PRIVACY,
  ViewState.LEGAL_TERMS,
  ViewState.LEGAL_DISCLAIMER,
  ViewState.LEGAL_COOKIE,
  ViewState.LEGAL_DMCA,
  ViewState.LEGAL_REFUND,
  ViewState.LOGIN,
  ViewState.SIGNUP
];

const SEARCH_ITEMS = [
    { label: 'Dashboard', view: ViewState.DASHBOARD, type: 'Page', icon: LayoutDashboard },
    { label: 'Keyword Magic Tool', view: ViewState.KEYWORD_MAGIC, type: 'Tool', icon: Search },
    { label: 'Keyword Visualization', view: ViewState.KEYWORD_VISUALIZATION, type: 'Tool', icon: Network },
    { label: 'Keyword Gap Analysis', view: ViewState.KEYWORD_GAP, type: 'Tool', icon: GitCompare },
    { label: 'Domain Overview', view: ViewState.DOMAIN_OVERVIEW, type: 'Tool', icon: Globe },
    { label: 'Trends Explorer', view: ViewState.TRENDS_EXPLORER, type: 'Tool', icon: LineChart },
    { label: 'Content Editor', view: ViewState.CONTENT_EDITOR, type: 'Tool', icon: PenTool },
    { label: 'Local Business Manager', view: ViewState.GMB_MANAGER, type: 'Tool', icon: Store },
    { label: 'Domain Comparison', view: ViewState.DOMAIN_COMPARISON, type: 'Tool', icon: GitCompare },
    { label: 'SERP Checker', view: ViewState.SERP_CHECKER, type: 'Tool', icon: Table2 },
    { label: 'Rank Tracker', view: ViewState.RANK_TRACKER, type: 'Tool', icon: BarChart },
    { label: 'Backlink Analytics', view: ViewState.BACKLINK_ANALYSIS, type: 'Tool', icon: LinkIcon },
    { label: 'Broken Link Checker', view: ViewState.BROKEN_LINKS, type: 'Tool', icon: Unplug },
    { label: 'PPC Explorer', view: ViewState.PPC_EXPLORER, type: 'Tool', icon: DollarSign },
    { label: 'Content Optimizer', view: ViewState.CONTENT_AUDIT, type: 'Tool', icon: FileText },
    { label: 'Site Audit', view: ViewState.SITE_AUDIT, type: 'Tool', icon: Activity },
    { label: 'Google Essentials', view: ViewState.GOOGLE_ESSENTIALS, type: 'Tool', icon: Zap },
    { label: 'Local SEO', view: ViewState.LOCAL_SEO, type: 'Tool', icon: MapPin },
    { label: 'AI Assistant', view: ViewState.AI_CHAT, type: 'Tool', icon: MessageSquare },
    { label: 'Schema Generator', view: ViewState.SCHEMA_GENERATOR, type: 'Tool', icon: Code },
    { label: 'Social Media Tools', view: ViewState.SOCIAL_MEDIA, type: 'Tool', icon: Hash },
    { label: 'Meta Generator', view: ViewState.META_GENERATOR, type: 'Tool', icon: Tags },
    { label: 'Article Writer', view: ViewState.CONTENT_GENERATOR, type: 'Tool', icon: PenTool },
    { label: 'Text to Speech', view: ViewState.TEXT_TO_SPEECH, type: 'Tool', icon: Mic2 },
    { label: 'Pricing', view: ViewState.PRICING, type: 'Page', icon: Crown },
    { label: 'Contact Support', view: ViewState.CONTACT, type: 'Page', icon: Mail }
];

const GlobalSearch = ({ onNavigate, variant = 'header' }: { onNavigate: (v: ViewState) => void, variant?: 'header' | 'sidebar' }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof SEARCH_ITEMS>([]);
  const [show, setShow] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShow(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      const q = e.target.value;
      setQuery(q);
      if (q) {
          const filtered = SEARCH_ITEMS.filter(i => i.label.toLowerCase().includes(q.toLowerCase()));
          setResults(filtered);
          setShow(true);
      } else {
          setShow(false);
      }
  };

  return (
      <div className={`relative ${variant === 'header' ? 'w-full max-w-sm hidden lg:block mx-6' : 'w-full px-4 mb-4'}`} ref={wrapperRef}>
          <div className="relative group">
              <Search className={`absolute left-3 top-2.5 h-4 w-4 ${variant === 'header' ? 'text-slate-400 group-focus-within:text-orange-500' : 'text-slate-500 group-focus-within:text-orange-500'}`} />
              <input 
                  type="text"
                  placeholder="Search tools..."
                  className={`w-full pl-9 pr-4 py-2 text-sm rounded-lg outline-none transition-all ${
                      variant === 'header' 
                      ? 'bg-slate-100/50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-orange-100 focus:border-orange-200' 
                      : 'bg-white border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100'
                  }`}
                  value={query}
                  onChange={handleSearch}
                  onFocus={() => query && setShow(true)}
              />
          </div>
          {show && results.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in duration-200">
                  <div className="max-h-64 overflow-y-auto custom-scrollbar">
                    {results.map((item, idx) => (
                        <button 
                            key={idx}
                            onClick={() => { onNavigate(item.view); setShow(false); setQuery(''); }}
                            className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-3 text-sm text-slate-700 transition-colors border-b border-slate-50 last:border-0"
                        >
                            <div className="p-1.5 bg-slate-100 rounded-md shrink-0">
                                <item.icon className="w-4 h-4 text-slate-500" />
                            </div>
                            <div>
                                <div className="font-semibold text-slate-900">{item.label}</div>
                                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">{item.type}</div>
                            </div>
                        </button>
                    ))}
                  </div>
              </div>
          )}
      </div>
  );
};

const NavGroup = ({ title, children, defaultOpen = true }: { title: string, children?: React.ReactNode, defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="mb-2">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center justify-between w-full px-4 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
      >
        {title}
        {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
      </button>
      {isOpen && <div className="mt-1 space-y-1 animate-in slide-in-from-top-1 fade-in duration-200">{children}</div>}
    </div>
  );
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [limitModalType, setLimitModalType] = useState<'search' | 'ai' | null>(null);
  const [showWelcomeTour, setShowWelcomeTour] = useState(false);

  useEffect(() => {
    document.title = 'Genie Metrics - Professional SEO Platform';
  }, [currentView]);

  const handleLogin = (loggedInUser: User) => {
    const userWithLimits: User = {
        ...loggedInUser,
        searchesLeft: loggedInUser.plan === 'Free' ? 5 : 99999,
        aiCreditsLeft: loggedInUser.plan === 'Free' ? 50 : 99999,
        referralCode: Math.random().toString(36).substring(7).toUpperCase(),
        referralsCount: 0
    };
    setUser(userWithLimits);
    setCurrentView(ViewState.DASHBOARD);
    if (loggedInUser.isNewUser) {
        setShowWelcomeTour(true);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView(ViewState.HOME);
  };

  const handleUpgrade = () => {
    setCurrentView(ViewState.CHECKOUT);
  };

  const handlePaymentSuccess = () => {
      if (user) {
          setUser({ ...user, plan: 'Pro', searchesLeft: 99999, aiCreditsLeft: 99999 });
          setCurrentView(ViewState.DASHBOARD);
      }
  };

  const consumeSearch = (): boolean => {
      if (!user) return false;
      if (user.plan === 'Pro' || user.plan === 'Business') return true;

      if (user.searchesLeft > 0) {
          setUser({ ...user, searchesLeft: user.searchesLeft - 1 });
          return true;
      } else {
          setLimitModalType('search');
          return false;
      }
  };

  const consumeAICredits = (amount: number): boolean => {
      if (!user) return false;
      if (user.plan === 'Pro' || user.plan === 'Business') return true;

      if (user.aiCreditsLeft >= amount) {
          setUser({ ...user, aiCreditsLeft: user.aiCreditsLeft - amount });
          return true;
      } else {
          setLimitModalType('ai');
          return false;
      }
  };

  const NavItem = ({ view, icon: Icon, label, isNew }: { view: ViewState; icon: any; label: string; isNew?: boolean }) => {
    const isActive = currentView === view;
    return (
      <button
        onClick={() => {
          setCurrentView(view);
          setMobileMenuOpen(false);
        }}
        className={`flex items-center justify-between w-full px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
          isActive
            ? 'bg-gradient-to-r from-orange-50 to-orange-100/50 text-orange-700 shadow-sm border border-orange-100'
            : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
        }`}
      >
        <div className="flex items-center">
          <Icon className={`w-4 h-4 mr-3 ${isActive ? 'text-orange-500' : 'text-slate-400'}`} />
          {label}
        </div>
        {isNew && <span className="text-[9px] bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-1.5 py-0.5 rounded shadow-sm font-bold uppercase tracking-wide">New</span>}
      </button>
    );
  };

  // --- Layout Logic ---
  
  const isPublicView = PUBLIC_VIEWS.includes(currentView);

  if (currentView === ViewState.CHECKOUT) {
      return (
         <Suspense fallback={<LoadingScreen />}>
            <CheckoutView onSuccess={handlePaymentSuccess} onCancel={() => setCurrentView(ViewState.DASHBOARD)} />
         </Suspense>
      );
  }

  if (isPublicView && currentView !== ViewState.LOGIN && currentView !== ViewState.SIGNUP) {
      return (
         <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
            <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                  <div className="flex items-center cursor-pointer shrink-0" onClick={() => setCurrentView(ViewState.HOME)}>
                      <Zap className="w-6 h-6 text-orange-600 mr-2" />
                      <span className="text-xl font-bold tracking-tight">Genie Metrics</span>
                  </div>
                  <GlobalSearch onNavigate={setCurrentView} variant="header" />
                  <nav className="hidden md:flex items-center gap-8 shrink-0">
                     <button onClick={() => setCurrentView(ViewState.KEYWORD_MAGIC)} className="text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors">Tools</button>
                     <button onClick={() => setCurrentView(ViewState.PRICING)} className="text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors">Pricing</button>
                     <button onClick={() => setCurrentView(ViewState.ABOUT)} className="text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors">About</button>
                  </nav>
                  <div className="flex items-center gap-3 ml-4 shrink-0">
                     {!user ? (
                         <>
                            <button onClick={() => setCurrentView(ViewState.LOGIN)} className="text-sm font-bold text-slate-700 hover:text-orange-600 px-4 py-2">Log In</button>
                            <button onClick={() => setCurrentView(ViewState.SIGNUP)} className="text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 px-5 py-2.5 rounded-xl shadow-lg shadow-orange-600/20">Start Free</button>
                         </>
                     ) : (
                         <button onClick={() => setCurrentView(ViewState.DASHBOARD)} className="text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-2"><LayoutDashboard className="w-4 h-4" /> Dashboard</button>
                     )}
                     <button className="md:hidden p-2 text-slate-500" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}><Menu className="w-6 h-6" /></button>
                  </div>
               </div>
            </header>
            
            {mobileMenuOpen && (
               <div className="fixed inset-0 z-50 md:hidden flex justify-start">
                  <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
                  <div className="relative bg-white w-[280px] h-full shadow-2xl overflow-y-auto animate-in slide-in-from-left duration-300 flex flex-col p-6">
                     <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-2"><Zap className="w-5 h-5 text-orange-600" /><span className="text-lg font-bold">Menu</span></div>
                        <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-6 h-6 text-slate-500" /></button>
                     </div>
                     <nav className="flex flex-col gap-2">
                        <button onClick={() => { setCurrentView(ViewState.HOME); setMobileMenuOpen(false); }} className="text-left px-4 py-3 rounded-lg hover:bg-slate-50 font-medium text-slate-700">Home</button>
                        <button onClick={() => { setCurrentView(ViewState.PRICING); setMobileMenuOpen(false); }} className="text-left px-4 py-3 rounded-lg hover:bg-slate-50 font-medium text-slate-700">Pricing</button>
                        <hr className="my-4 border-slate-100" />
                        <button onClick={() => { setCurrentView(ViewState.LOGIN); setMobileMenuOpen(false); }} className="text-left px-4 py-3 rounded-lg hover:bg-slate-50 font-bold text-slate-700">Log In</button>
                        <button onClick={() => { setCurrentView(ViewState.SIGNUP); setMobileMenuOpen(false); }} className="mt-2 w-full bg-orange-600 text-white px-4 py-3 rounded-xl font-bold">Sign Up Free</button>
                     </nav>
                  </div>
               </div>
            )}

            <main className="flex-1">
               <Suspense fallback={<LoadingScreen />}>
                  {currentView === ViewState.HOME && <HomeView onChangeView={setCurrentView} />}
                  {currentView === ViewState.PRICING && <PricingView onChangeView={setCurrentView} />}
                  {currentView === ViewState.ABOUT && <AboutView />}
                  {currentView === ViewState.CONTACT && <ContactView />}
                  {[ViewState.LEGAL_PRIVACY, ViewState.LEGAL_TERMS, ViewState.LEGAL_DISCLAIMER, ViewState.LEGAL_COOKIE, ViewState.LEGAL_DMCA, ViewState.LEGAL_REFUND].includes(currentView) && <LegalView view={currentView} />}
               </Suspense>
            </main>
             <footer className="bg-white border-t border-slate-200 py-12 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1">
                        <div className="flex items-center mb-4">
                            <Zap className="w-6 h-6 text-orange-600 mr-2" />
                            <span className="text-xl font-bold tracking-tight">Genie Metrics</span>
                        </div>
                        <p className="text-sm text-slate-500">
                            Empowering creators with world-class SEO tools.
                        </p>
                    </div>
                </div>
            </footer>
         </div>
      );
  }

  if (currentView === ViewState.LOGIN || currentView === ViewState.SIGNUP) {
      return (
         <Suspense fallback={<LoadingScreen />}>
             <AuthView viewState={currentView} onLogin={handleLogin} onChangeView={setCurrentView} />
         </Suspense>
      );
  }

  const renderRestrictedContent = () => {
      if (!user) {
          return <LockedFeature onSignup={() => setCurrentView(ViewState.SIGNUP)} onLogin={() => setCurrentView(ViewState.LOGIN)} />;
      }

      switch (currentView) {
        case ViewState.DASHBOARD: return <DashboardView onChangeView={setCurrentView} user={user} onUpgrade={handleUpgrade} />;
        
        case ViewState.DOMAIN_OVERVIEW: return <DomainOverviewView user={user} onConsumeSearch={consumeSearch} />;
        case ViewState.DOMAIN_COMPARISON: return <DomainComparisonView user={user} onConsumeSearch={consumeSearch} />;
        case ViewState.KEYWORD_GAP: return <KeywordGapView user={user} onConsumeSearch={consumeSearch} />;
        case ViewState.BACKLINK_ANALYSIS: return <BacklinkAnalysisView user={user} onConsumeSearch={consumeSearch} />;
        case ViewState.PPC_EXPLORER: return <PpcExplorerView user={user} onConsumeSearch={consumeSearch} />;
        case ViewState.TRENDS_EXPLORER: return <TrendsView user={user} onConsumeSearch={consumeSearch} />;
        case ViewState.MARKET_INSIGHTS: return <MarketInsightsView user={user} onConsumeSearch={consumeSearch} />;
        
        case ViewState.KEYWORD_MAGIC: return <KeywordMagicView user={user} onConsumeSearch={consumeSearch} />;
        case ViewState.KEYWORD_VISUALIZATION: return <KeywordVisualizationView user={user} onConsumeSearch={consumeSearch} />;
        case ViewState.KEYWORD_CLUSTERING: return <KeywordClusteringView user={user} onConsumeSearch={consumeSearch} />;
        case ViewState.SERP_CHECKER: return <SerpCheckerView user={user} onConsumeSearch={consumeSearch} />;
        case ViewState.RANK_TRACKER: return <RankTrackerView user={user} onConsumeSearch={consumeSearch} />;
        
        case ViewState.SITE_AUDIT: return <SiteAuditView user={user} onConsumeAICredits={consumeAICredits} />;
        case ViewState.GOOGLE_ESSENTIALS: return <GoogleEssentialView user={user} onConsumeSearch={consumeSearch} />;
        case ViewState.CONTENT_AUDIT: return <ContentAuditView user={user} onConsumeAICredits={consumeAICredits} />;
        case ViewState.BROKEN_LINKS: return <BrokenLinkView user={user} onConsumeSearch={consumeSearch} />;
        case ViewState.SCHEMA_GENERATOR: return <SchemaGeneratorView user={user} onConsumeAICredits={consumeAICredits} />;
        case ViewState.ROBOTS_TXT: return <RobotsTxtView user={user} onConsumeAICredits={consumeAICredits} />;
        case ViewState.HREFLANG_GENERATOR: return <HreflangView user={user} onConsumeAICredits={consumeAICredits} />;
        case ViewState.LOCAL_SEO: return <LocalSeoView user={user} onConsumeSearch={consumeSearch} />;
        case ViewState.GMB_MANAGER: return <GmbView user={user} onConsumeSearch={consumeSearch} />;

        case ViewState.CONTENT_GENERATOR: return <ContentGeneratorView user={user} onConsumeAICredits={consumeAICredits} />;
        case ViewState.CONTENT_EDITOR: return <ContentEditorView user={user} onConsumeAICredits={consumeAICredits} />;
        case ViewState.SOCIAL_MEDIA: return <SocialMediaToolsView user={user} onConsumeAICredits={consumeAICredits} />;
        case ViewState.META_GENERATOR: return <MetaGeneratorView user={user} onConsumeAICredits={consumeAICredits} />;
        case ViewState.TEXT_TO_SPEECH: return <TextToSpeechView user={user} onConsumeAICredits={consumeAICredits} />;
        case ViewState.IMAGE_GENERATOR: return <ImageGeneratorView user={user} onConsumeAICredits={consumeAICredits} />;
        case ViewState.IMAGE_ANALYZER: return <ImageAnalyzerView user={user} onConsumeAICredits={consumeAICredits} />;
        case ViewState.AUDIO_TRANSCRIPTION: return <AudioTranscriptionView user={user} onConsumeAICredits={consumeAICredits} />;
        case ViewState.VIDEO_ANALYZER: return <VideoAnalyzerView user={user} onConsumeAICredits={consumeAICredits} />;
        
        case ViewState.AI_CHAT: return <ChatView user={user} onConsumeAICredits={consumeAICredits} />;
        case ViewState.SITEMAP: return <SitemapView onChangeView={setCurrentView} />;
        default: return <DashboardView onChangeView={setCurrentView} user={user} onUpgrade={handleUpgrade} />;
      }
  };

  return (
    <div className="flex h-screen bg-slate-50/50 overflow-hidden font-sans selection:bg-orange-100 selection:text-orange-900 relative">
      
      {/* Onboarding Welcome Tour */}
      {showWelcomeTour && user && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
              <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-lg w-full text-center relative mx-4 border border-white/20">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/20">
                      <Star className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 mb-3">Welcome to Genie Metrics!</h2>
                  <p className="text-slate-600 mb-8 leading-relaxed">
                      You've just unlocked a professional SEO suite. Start by checking your domain health or finding hidden keyword gems.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-8 text-left">
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <Search className="w-5 h-5 text-orange-500 mb-2"/>
                          <h4 className="font-bold text-sm text-slate-900">Keyword Research</h4>
                          <p className="text-xs text-slate-500">Find long-tail opportunities.</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <Activity className="w-5 h-5 text-indigo-500 mb-2"/>
                          <h4 className="font-bold text-sm text-slate-900">Site Audit</h4>
                          <p className="text-xs text-slate-500">Fix technical errors.</p>
                      </div>
                  </div>
                  <button onClick={() => setShowWelcomeTour(false)} className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold shadow-xl transition-all flex items-center justify-center gap-2">
                      Let's Get Started <ArrowRight className="w-4 h-4"/>
                  </button>
              </div>
          </div>
      )}

      {/* Usage Limit Modal */}
      {limitModalType && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
             <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center relative mx-4">
                <button onClick={() => setLimitModalType(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6"><AlertTriangle className="w-8 h-8 text-red-500" /></div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">{limitModalType === 'search' ? 'Daily Limit Reached' : 'Out of Credits'}</h2>
                <p className="text-slate-500 mb-8">{limitModalType === 'search' ? 'You have used all 5 free daily searches. Upgrade to Pro for unlimited.' : 'You have run out of AI credits. Upgrade to Pro.'}</p>
                <button onClick={() => { setLimitModalType(null); handleUpgrade(); }} className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"><Crown className="w-5 h-5" /> Upgrade to Pro</button>
             </div>
          </div>
      )}

      {/* App Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200/60 shadow-lg shadow-slate-200/50 z-20 backdrop-blur-xl">
        <div className="flex items-center h-16 px-6 border-b border-slate-100/80 cursor-pointer" onClick={() => setCurrentView(ViewState.HOME)}>
          <Zap className="w-7 h-7 text-orange-500 mr-2 drop-shadow-sm" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-500 tracking-tight">Genie Metrics</span>
        </div>
        
        {user && (
            <div className="px-4 py-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold border border-orange-200">{user.name.charAt(0).toUpperCase()}</div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.plan} Plan</p>
                    </div>
                </div>
            </div>
        )}

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          <GlobalSearch onNavigate={setCurrentView} variant="sidebar" />
          <NavItem view={ViewState.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
          <NavItem view={ViewState.AI_CHAT} icon={MessageSquare} label="AI Consultant" />
          
          <div className="my-4 border-t border-slate-100"></div>

          <NavGroup title="Competitive Research">
             <NavItem view={ViewState.DOMAIN_OVERVIEW} icon={Globe} label="Domain Overview" />
             <NavItem view={ViewState.DOMAIN_COMPARISON} icon={GitCompare} label="Domain Comparison" isNew={true} />
             <NavItem view={ViewState.KEYWORD_GAP} icon={Layers} label="Keyword Gap" />
             <NavItem view={ViewState.BACKLINK_ANALYSIS} icon={LinkIcon} label="Backlink Analytics" />
             <NavItem view={ViewState.PPC_EXPLORER} icon={DollarSign} label="PPC Advertising" />
             <NavItem view={ViewState.TRENDS_EXPLORER} icon={LineChart} label="Trends Explorer" isNew={true} />
             <NavItem view={ViewState.MARKET_INSIGHTS} icon={TrendingUp} label="Market Insights" />
          </NavGroup>

          <NavGroup title="Keyword Research">
             <NavItem view={ViewState.KEYWORD_MAGIC} icon={Search} label="Keyword Magic" />
             <NavItem view={ViewState.KEYWORD_VISUALIZATION} icon={Network} label="Keyword Visualizer" isNew={true} />
             <NavItem view={ViewState.KEYWORD_CLUSTERING} icon={Layers} label="Keyword Clustering" />
             <NavItem view={ViewState.SERP_CHECKER} icon={Table2} label="SERP Checker" />
             <NavItem view={ViewState.RANK_TRACKER} icon={BarChart} label="Rank Tracker" />
          </NavGroup>

          <NavGroup title="On-Page & Tech SEO">
             <NavItem view={ViewState.SITE_AUDIT} icon={Activity} label="Site Audit" />
             <NavItem view={ViewState.GOOGLE_ESSENTIALS} icon={Zap} label="Google Essentials" />
             <NavItem view={ViewState.CONTENT_AUDIT} icon={FileText} label="Content Optimizer" />
             <NavItem view={ViewState.BROKEN_LINKS} icon={Unplug} label="Broken Link Checker" />
             <NavItem view={ViewState.SCHEMA_GENERATOR} icon={Code} label="Schema Generator" />
             <NavItem view={ViewState.ROBOTS_TXT} icon={Code} label="Robots.txt Gen" />
             <NavItem view={ViewState.HREFLANG_GENERATOR} icon={Globe} label="Hreflang Gen" />
             <NavItem view={ViewState.LOCAL_SEO} icon={MapPin} label="Local SEO" />
             <NavItem view={ViewState.GMB_MANAGER} icon={Store} label="Local Business Mgr" isNew={true} />
          </NavGroup>

          <NavGroup title="Content & Social">
             <NavItem view={ViewState.CONTENT_EDITOR} icon={PenTool} label="Surfer Editor" isNew={true} />
             <NavItem view={ViewState.CONTENT_GENERATOR} icon={FileText} label="AI Article Writer" />
             <NavItem view={ViewState.SOCIAL_MEDIA} icon={Hash} label="Social Tools" />
             <NavItem view={ViewState.META_GENERATOR} icon={Tags} label="Meta Tags" />
             <NavItem view={ViewState.TEXT_TO_SPEECH} icon={Mic2} label="Text to Speech" />
          </NavGroup>
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50/30 space-y-2">
           {user && user.plan === 'Free' && (
              <button onClick={handleUpgrade} className="w-full bg-slate-900 text-white py-2 rounded-lg text-xs font-bold shadow-lg flex items-center justify-center gap-2">Upgrade to Pro</button>
           )}
           {user ? <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-xs font-medium text-slate-500 py-2"><LogOut className="w-3 h-3" /> Log Out</button> : null}
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="md:hidden flex items-center justify-between h-16 px-4 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30">
          <div className="flex items-center" onClick={() => setCurrentView(ViewState.HOME)}>
            <Zap className="w-6 h-6 text-orange-500 mr-2" />
            <span className="text-lg font-bold text-slate-800 tracking-tight">Genie Metrics</span>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-500 p-2 hover:bg-slate-100 rounded-lg"><Menu className="w-6 h-6" /></button>
        </header>

        {mobileMenuOpen && (
           <div className="fixed inset-0 z-50 md:hidden flex justify-start">
               <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
               <div className="relative bg-white w-[280px] h-full shadow-2xl overflow-y-auto animate-in slide-in-from-left duration-300 flex flex-col p-6">
                   <div className="flex justify-between items-center mb-6"><span className="font-bold">Menu</span><X onClick={()=>setMobileMenuOpen(false)} className="w-6 h-6"/></div>
                   <nav className="space-y-2">
                       <button onClick={()=>{setCurrentView(ViewState.DASHBOARD);setMobileMenuOpen(false)}} className="block w-full text-left py-2 font-medium">Dashboard</button>
                       <button onClick={()=>{setCurrentView(ViewState.KEYWORD_MAGIC);setMobileMenuOpen(false)}} className="block w-full text-left py-2 font-medium">Tools</button>
                   </nav>
               </div>
           </div>
        )}

        <main className="flex-1 overflow-y-auto bg-slate-50 scroll-smooth relative">
           <div className="min-h-full flex flex-col">
               <div className="flex-1 p-4 md:p-8">
                    <Suspense fallback={<LoadingScreen />}>
                        {renderRestrictedContent()}
                    </Suspense>
               </div>
           </div>
        </main>
      </div>
    </div>
  );
};

export default App;
