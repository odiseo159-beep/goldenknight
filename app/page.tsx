'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { Wallet, Shield, Clock, Award, Trophy, Medal, Users, TrendingUp, Languages } from 'lucide-react';

const translations = {
  zh: {
    siteName: '龙脉金骑',
    siteNameEn: 'Knight of the Imperial Vein',
    bnbPrice: 'BNB价格',
    goldPrice: '金价',
    activeKnights: '活跃骑士',
    heroTitle: '帝国金脉铸造所',
    heroDesc: '在BNB链上铸造神圣黄金。加入圣骑士团，领取你的财富。',
    mintGold: '铸造黄金',
    accumulating: '在BNB链上累积GLD',
    theVault: '宝库',
    rank: '排名',
    knight: '骑士',
    goldEarned: '赚取黄金',
    thePath: '征途',
    connectWallet: '连接钱包',
    connectWalletDesc: '连接你的BNB链钱包开始你的旅程',
    waitForge: '等待铸造',
    waitForgeDesc: '铸造所每30分钟铸造黄金',
    claimGold: '领取黄金',
    claimGoldDesc: '准备好后点击铸造黄金按钮',
    stakeWithdraw: '质押或提现',
    stakeWithdrawDesc: '选择质押更多或提现到BNB',
    whyGold: '为什么选择黄金？',
    instantPayouts: '即时BNB支付',
    instantPayoutsDesc: '立即将铸造的GLD转换为BNB，零延迟。您的收益始终处于流动状态，随时可以提现。',
    zeroFees: '零手续费内部兑换',
    zeroFeesDesc: '在平台内以零交易费用在GLD和BNB之间兑换。避免不必要的gas成本，最大化您的收益。',
    referralProgram: '神圣推荐计划（10%）',
    referralProgramDesc: '邀请其他骑士加入骑士团，永久赚取他们铸造黄金的10%。建立您的军队，观看您的被动收入呈指数增长。',
    builtOn: '构建于',
    copyright: '版权所有',
  },
  en: {
    siteName: 'Knight of the Imperial Vein',
    siteNameEn: '龙脉金骑',
    bnbPrice: 'BNB Price',
    goldPrice: 'Gold Price',
    activeKnights: 'Active Knights',
    heroTitle: 'The Golden Forge',
    heroDesc: 'Mint divine gold on the BNB Chain. Join the holy order of knights and claim your fortune.',
    mintGold: 'MINT GOLD',
    accumulating: 'Accumulating GLD on BNB Chain',
    theVault: 'The Vault',
    rank: 'Rank',
    knight: 'Knight',
    goldEarned: 'Gold Earned',
    thePath: 'The Path',
    connectWallet: 'Connect Wallet',
    connectWalletDesc: 'Link your BNB Chain wallet to begin your journey',
    waitForge: 'Wait for the Forge',
    waitForgeDesc: 'The forge mints gold every 30 minutes',
    claimGold: 'Claim your Gold',
    claimGoldDesc: 'Click the MINT GOLD button when ready',
    stakeWithdraw: 'Stake or Withdraw',
    stakeWithdrawDesc: 'Choose to stake for more or withdraw to BNB',
    whyGold: 'Why Gold?',
    instantPayouts: 'Instant BNB Payouts',
    instantPayoutsDesc: 'Convert your minted GLD to BNB instantly with zero delays. Your earnings are always liquid and ready to withdraw whenever you choose.',
    zeroFees: 'Zero-Fee Internal Swaps',
    zeroFeesDesc: 'Swap between GLD and BNB within the platform with absolutely no transaction fees. Maximize your earnings by avoiding unnecessary gas costs.',
    referralProgram: 'Holy Referral Program (10%)',
    referralProgramDesc: 'Invite fellow knights to join the order and earn 10% of their minted gold forever. Build your army and watch your passive income grow exponentially.',
    builtOn: 'Built on',
    copyright: 'Copyright',
  },
};

export default function GoldenKnightPage() {
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');
  const [countdown, setCountdown] = useState({ minutes: 29, seconds: 55 });
  const [bnbPrice, setBnbPrice] = useState<string>('...');
  const [goldPrice, setGoldPrice] = useState<string>('...');
  const [activeKnights, setActiveKnights] = useState<number>(0);
  const [topHolders, setTopHolders] = useState<Array<{ rank: number; knight: string; gold: string }>>([]);

  const t = translations[language];

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        } else {
          return { minutes: 29, seconds: 59 };
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch BNB Price from CoinGecko
  useEffect(() => {
    const fetchBnbPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd');
        const data = await response.json();
        if (data.binancecoin?.usd) {
          setBnbPrice(`$${data.binancecoin.usd.toFixed(2)}`);
        }
      } catch (error) {
        console.log('[v0] Error fetching BNB price:', error);
        setBnbPrice('$---');
      }
    };

    fetchBnbPrice();
    const interval = setInterval(fetchBnbPrice, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Fetch Token Data from API
  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const response = await fetch('/api/token-data');
        const data = await response.json();
        
        setGoldPrice(data.goldPrice);
        setActiveKnights(data.activeKnights);
        setTopHolders(data.topHolders);
        
        console.log('[v0] Token data updated:', data.lastUpdate);
      } catch (error) {
        console.log('[v0] Error fetching token data:', error);
        // Fallback to placeholder data
        setGoldPrice('$0.00');
        setActiveKnights(100);
        setTopHolders([
          { rank: 1, knight: '0x742d...3f5a', gold: '2,450 GLD' },
          { rank: 2, knight: '0x8b3c...7d2e', gold: '1,890 GLD' },
          { rank: 3, knight: '0x1a5f...9c4b', gold: '1,675 GLD' },
          { rank: 4, knight: '0x6e2d...5a1c', gold: '1,340 GLD' },
          { rank: 5, knight: '0x9f4a...2b8d', gold: '1,120 GLD' },
        ]);
      }
    };

    fetchTokenData();
    const interval = setInterval(fetchTokenData, 60000); // Update every 60 seconds
    return () => clearInterval(interval);
  }, []);



  const getMedalIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-[#FFD700]" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-[#C0C0C0]" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-[#CD7F32]" />;
    return <span className="text-muted-foreground">#{rank}</span>;
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Mystical Mine Background */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-70"
        style={{ backgroundImage: 'url(/mine-background.png)' }}
      />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-background/30 via-transparent to-background/30" />
      
      {/* Content Wrapper */}
      <div className="relative z-10">
      {/* Header with Live Stats Ticker */}
      <header className="border-b border-border backdrop-blur-md bg-card/40 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <img src="/golden-knight-logo.png" alt={t.siteName} className="w-12 h-12 rounded-lg drop-shadow-[0_0_15px_rgba(255,215,0,0.6)]" />
              </div>
              <span className="font-serif text-xl font-bold text-primary hidden sm:block">{t.siteName}</span>
            </div>

            {/* Live Stats Bar */}
            <div className="flex items-center gap-4 text-sm">
              <div className="hidden md:flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">{t.bnbPrice}:</span>
                <span className="text-foreground font-semibold">{bnbPrice}</span>
              </div>
              <div className="hidden md:block w-px h-4 bg-border" />
              <div className="hidden md:flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">{t.goldPrice}:</span>
                <span className="text-foreground font-semibold">{goldPrice}</span>
              </div>
              <div className="hidden md:block w-px h-4 bg-border" />
              <div className="hidden md:flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">{t.activeKnights}:</span>
                <span className="text-foreground font-semibold">{activeKnights}</span>
              </div>

              {/* Language Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
                className="ml-2 border-primary/30 hover:bg-primary/10"
              >
                <Languages className="w-4 h-4 mr-1" />
                {language === 'zh' ? 'EN' : '中文'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Side by Side */}
      <section className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Golden Knight Illustration */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-3xl aspect-square">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/20 to-transparent rounded-full blur-3xl animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-tl from-accent/20 via-primary/20 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
              
              {/* Golden Knight */}
              <div className="relative z-10 flex items-center justify-center h-full">
                <img 
                  src="/golden-knight-logo.png" 
                  alt="Golden Knight" 
                  className="w-96 h-96 lg:w-[32rem] lg:h-[32rem] rounded-3xl drop-shadow-[0_0_50px_rgba(255,215,0,0.8)] hover:scale-105 transition-transform duration-500" 
                />
              </div>
            </div>
          </div>

          {/* Right Side - The Golden Forge */}
          <div className="space-y-6">
            <div>
              <h1 className="font-serif text-4xl lg:text-5xl font-bold text-primary mb-4 text-balance">
                {t.heroTitle}
              </h1>
              <p className="text-lg text-muted-foreground text-pretty">
                {t.heroDesc}
              </p>
            </div>

            <Card className="backdrop-blur-md bg-card border-primary/30 p-8 shadow-[0_0_30px_rgba(255,215,0,0.1)]">
              {/* Countdown Timer */}
              <div className="relative flex items-center justify-center mb-6">
                <div className="relative w-40 h-40">
                  <svg className="w-40 h-40 transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="rgba(255, 215, 0, 0.2)"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="#FFD700"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 70}`}
                      strokeDashoffset={`${2 * Math.PI * 70 * (1 - (countdown.minutes * 60 + countdown.seconds) / 1800)}`}
                      className="drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Clock className="w-6 h-6 text-primary mx-auto mb-1" />
                      <div className="font-mono text-3xl font-bold text-primary">
                        {String(countdown.minutes).padStart(2, '0')}:{String(countdown.seconds).padStart(2, '0')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mint Button */}
              <Button
                className="w-full h-14 bg-gradient-to-r from-primary via-[#FFE135] to-primary text-primary-foreground hover:from-[#FFE135] hover:via-primary hover:to-[#FFE135] font-bold text-lg shadow-[0_0_30px_rgba(255,215,0,0.4)] hover:shadow-[0_0_50px_rgba(255,215,0,0.7)] transition-all animate-shimmer bg-[length:200%_100%]"
              >
                <Award className="w-6 h-6 mr-2" />
                {t.mintGold}
              </Button>

              <p className="text-center text-sm text-muted-foreground mt-4">
                {t.accumulating}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Dashboard - Two Columns */}
      <section className="container mx-auto px-4 py-12">
        <Card className="backdrop-blur-md bg-muted/30 border-primary/20 p-6 lg:p-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* The Vault - Leaderboard */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                <Trophy className="w-6 h-6" />
                {t.theVault}
              </h2>
              <div className="space-y-3">
                <div className="grid grid-cols-[auto_1fr_auto] gap-4 text-sm font-semibold text-muted-foreground pb-2 border-b border-border">
                  <span>{t.rank}</span>
                  <span>{t.knight}</span>
                  <span>{t.goldEarned}</span>
                </div>
                {topHolders.map((entry) => (
                  <div
                    key={entry.rank}
                    className="grid grid-cols-[auto_1fr_auto] gap-4 items-center p-3 rounded-lg bg-card/50 hover:bg-card/80 transition-colors border border-border/50"
                  >
                    <div className="flex items-center justify-center w-8">
                      {getMedalIcon(entry.rank)}
                    </div>
                    <span className="font-mono text-foreground">{entry.knight}</span>
                    <span className="font-semibold text-primary">{entry.gold}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* The Path - How It Works */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                <Shield className="w-6 h-6" />
                {t.thePath}
              </h2>
              <div className="space-y-4">
                {[
                  { image: '/step-1.png', title: t.connectWallet, desc: t.connectWalletDesc },
                  { image: '/step-2.png', title: t.waitForge, desc: t.waitForgeDesc },
                  { image: '/step-3.png', title: t.claimGold, desc: t.claimGoldDesc },
                  { image: '/step-4.png', title: t.stakeWithdraw, desc: t.stakeWithdrawDesc },
                ].map((step, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center shadow-[0_0_15px_rgba(255,215,0,0.3)] p-2">
                        <img src={step.image || "/placeholder.svg"} alt={step.title} className="w-full h-full object-contain" />
                      </div>
                      {index < 3 && (
                        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-gradient-to-b from-primary/50 to-transparent" />
                      )}
                    </div>
                    <div className="pt-2">
                      <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
                      <p className="text-sm text-muted-foreground text-pretty">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Feature Section - Always Expanded */}
      <section className="container mx-auto px-4 py-8 pb-12">
        <h2 className="font-serif text-3xl font-bold text-primary mb-6 text-center">{t.whyGold}</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Feature 1 */}
          <div className="border border-primary/20 rounded-lg overflow-hidden bg-card/50">
            <div className="p-4 bg-card/30">
              <h3 className="text-foreground font-semibold text-lg">
                ⚡ {t.instantPayouts}
              </h3>
            </div>
            <div className="p-4 text-muted-foreground space-y-4">
              <p>{t.instantPayoutsDesc}</p>
              <img src="/feature-1.png" alt={t.instantPayouts} className="w-full rounded-lg shadow-[0_0_20px_rgba(255,215,0,0.3)]" />
            </div>
          </div>

          {/* Feature 2 */}
          <div className="border border-primary/20 rounded-lg overflow-hidden bg-card/50">
            <div className="p-4 bg-card/30">
              <h3 className="text-foreground font-semibold text-lg">
                💎 {t.zeroFees}
              </h3>
            </div>
            <div className="p-4 text-muted-foreground space-y-4">
              <p>{t.zeroFeesDesc}</p>
              <img src="/feature-2.png" alt={t.zeroFees} className="w-full rounded-lg shadow-[0_0_20px_rgba(255,215,0,0.3)]" />
            </div>
          </div>

          {/* Feature 3 */}
          <div className="border border-primary/20 rounded-lg overflow-hidden bg-card/50">
            <div className="p-4 bg-card/30">
              <h3 className="text-foreground font-semibold text-lg">
                🛡️ {t.referralProgram}
              </h3>
            </div>
            <div className="p-4 text-muted-foreground space-y-4">
              <p>{t.referralProgramDesc}</p>
              <img src="/feature-3.png" alt={t.referralProgram} className="w-full rounded-lg shadow-[0_0_20px_rgba(255,215,0,0.3)]" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border backdrop-blur-md bg-card/40 mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>{t.builtOn}</span>
              <span className="font-semibold text-primary">BNB Chain</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-primary transition-colors" aria-label="Twitter">
                𝕏
              </a>
              <a href="#" className="hover:text-primary transition-colors" aria-label="Telegram">
                Telegram
              </a>
            </div>
            <div>© 2026 {t.siteName}</div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 3s linear infinite;
        }
      `}</style>
      </div>
    </div>
  );
}
