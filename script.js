/**
 * Rr INVESTMENT - Financial Services & Wealth Management
 * Senior Mobile Frontend Architecture & Touch-First Client Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 1. Universal iOS & Android Scroll Lock Utility
  // =========================================================================
  let savedScrollPosition = 0;

  const lockScroll = () => {
    savedScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${savedScrollPosition}px`;
    document.body.style.width = '100%';
  };

  const unlockScroll = () => {
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('position');
    document.body.style.removeProperty('top');
    document.body.style.removeProperty('width');
    window.scrollTo(0, savedScrollPosition);
  };

  // =========================================================================
  // 2. Sticky Navigation Header Elevation
  // =========================================================================
  const siteHeader = document.querySelector('.site-header');
  let ticking = false;

  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 20) {
          siteHeader?.classList.add('scrolled');
        } else {
          siteHeader?.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // =========================================================================
  // 3. Touch-First Mobile Off-Canvas Drawer Navigation
  // =========================================================================
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-links .nav-link');

  const openMobileDrawer = () => {
    mobileDrawer?.classList.add('open');
    drawerBackdrop?.classList.add('active');
    mobileToggle?.classList.add('active');
    mobileToggle?.setAttribute('aria-expanded', 'true');
    lockScroll();
  };

  const closeMobileDrawer = () => {
    mobileDrawer?.classList.remove('open');
    drawerBackdrop?.classList.remove('active');
    mobileToggle?.classList.remove('active');
    mobileToggle?.setAttribute('aria-expanded', 'false');
    unlockScroll();
  };

  mobileToggle?.addEventListener('click', () => {
    const isOpen = mobileDrawer?.classList.contains('open');
    if (isOpen) {
      closeMobileDrawer();
    } else {
      openMobileDrawer();
    }
  });

  drawerCloseBtn?.addEventListener('click', closeMobileDrawer);
  drawerBackdrop?.addEventListener('click', closeMobileDrawer);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileDrawer?.classList.contains('open')) {
        closeMobileDrawer();
      }
    });
  });

  // =========================================================================
  // 4. Active Nav Link on Scroll (Throttled ScrollSpy)
  // =========================================================================
  const navSections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-menu .nav-link');

  const highlightNavOnScroll = () => {
    const scrollY = window.pageYOffset;
    navSections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        desktopNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

  // =========================================================================
  // 5. GPU-Accelerated Scroll Reveals (Intersection Observer)
  // =========================================================================
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
      }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  // =========================================================================
  // 6. Animated Number Counters (Stats Strip)
  // =========================================================================
  const statNumbers = document.querySelectorAll('.stat-count');
  let statsCounted = false;

  const countUp = (element, targetValue, duration = 1600, isDecimal = false) => {
    const startValue = 0;
    const startTime = performance.now();

    const updateCounter = currentTime => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = startValue + (targetValue - startValue) * easeProgress;

      if (isDecimal) {
        element.textContent = currentVal.toFixed(1);
      } else {
        element.textContent = Math.floor(currentVal).toLocaleString('en-IN');
      }

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = isDecimal
          ? targetValue.toFixed(1)
          : targetValue.toLocaleString('en-IN');
      }
    };

    requestAnimationFrame(updateCounter);
  };

  const statsStrip = document.querySelector('.stats-strip');
  if (statsStrip && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver(
      entries => {
        const [entry] = entries;
        if (entry.isIntersecting && !statsCounted) {
          statsCounted = true;
          statNumbers.forEach(stat => {
            const rawTarget = stat.getAttribute('data-target');
            if (rawTarget) {
              const isDecimal = rawTarget.includes('.');
              const targetVal = parseFloat(rawTarget);
              countUp(stat, targetVal, 1800, isDecimal);
            }
          });
        }
      },
      { threshold: 0.25 }
    );

    statsObserver.observe(statsStrip);
  }

  // =========================================================================
  // 7. Interactive Touch-Optimized SIP Compounding Planner
  // =========================================================================
  const monthlySlider = document.getElementById('calc-monthly');
  const returnSlider = document.getElementById('calc-return');
  const tenureSlider = document.getElementById('calc-tenure');

  const monthlyValLabel = document.getElementById('val-monthly');
  const returnValLabel = document.getElementById('val-return');
  const tenureValLabel = document.getElementById('val-tenure');

  const resultInvested = document.getElementById('result-invested');
  const resultGain = document.getElementById('result-gain');
  const resultTotal = document.getElementById('result-total');

  const ratioInvestedEl = document.getElementById('ratio-invested');
  const ratioGainEl = document.getElementById('ratio-gain');
  const ratioInvestedPct = document.getElementById('ratio-invested-pct');
  const ratioGainPct = document.getElementById('ratio-gain-pct');
  const presetPills = document.querySelectorAll('.preset-pill');

  const presetConfigs = {
    wealth: { monthly: 15000, rate: 13.5, tenure: 15 },
    retirement: { monthly: 40000, rate: 12.5, tenure: 20 },
    education: { monthly: 25000, rate: 14.0, tenure: 10 },
    hni: { monthly: 100000, rate: 14.0, tenure: 18 }
  };

  const formatCurrencyINR = num => {
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)} Cr`;
    } else if (num >= 100000) {
      return `₹${(num / 100000).toFixed(2)} Lakh`;
    }
    return `₹${Math.round(num).toLocaleString('en-IN')}`;
  };

  const calculateSIP = () => {
    if (!monthlySlider || !returnSlider || !tenureSlider) return;

    const P = parseFloat(monthlySlider.value);
    const annualRate = parseFloat(returnSlider.value);
    const years = parseFloat(tenureSlider.value);

    // Update Label Values
    if (monthlyValLabel) monthlyValLabel.textContent = `₹${P.toLocaleString('en-IN')}`;
    if (returnValLabel) returnValLabel.textContent = `${annualRate}%`;
    if (tenureValLabel) tenureValLabel.textContent = `${years} ${years > 1 ? 'Years' : 'Year'}`;

    const n = years * 12;
    const i = annualRate / 12 / 100;

    // Compounded SIP Formula: M = P * (( (1 + i)^n - 1 ) / i) * (1 + i)
    const futureValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const totalInvested = P * n;
    const estimatedGains = Math.max(0, futureValue - totalInvested);

    if (resultInvested) resultInvested.textContent = formatCurrencyINR(totalInvested);
    if (resultGain) resultGain.textContent = formatCurrencyINR(estimatedGains);
    if (resultTotal) resultTotal.textContent = formatCurrencyINR(futureValue);

    // Update Visual Compounding Ratio Bar
    if (futureValue > 0) {
      const investedPct = Math.min(100, Math.max(1, Math.round((totalInvested / futureValue) * 100)));
      const gainPct = Math.max(0, 100 - investedPct);

      if (ratioInvestedEl) ratioInvestedEl.style.width = `${investedPct}%`;
      if (ratioGainEl) ratioGainEl.style.width = `${gainPct}%`;
      if (ratioInvestedPct) ratioInvestedPct.textContent = `${investedPct}% Principal`;
      if (ratioGainPct) ratioGainPct.textContent = `${gainPct}% Compounded Alpha`;
    }
  };

  // Wire Goal Quick-Presets
  presetPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const key = pill.getAttribute('data-preset');
      const cfg = presetConfigs[key];
      if (!cfg) return;

      presetPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      if (monthlySlider) monthlySlider.value = cfg.monthly;
      if (returnSlider) returnSlider.value = cfg.rate;
      if (tenureSlider) tenureSlider.value = cfg.tenure;

      calculateSIP();
    });
  });

  // Bind both input and change events for cross-browser mobile slider responsiveness
  [monthlySlider, returnSlider, tenureSlider].forEach(slider => {
    slider?.addEventListener('input', () => {
      calculateSIP();
    }, { passive: true });
    slider?.addEventListener('change', () => {
      calculateSIP();
    }, { passive: true });
  });

  // Initial run
  calculateSIP();

  // =========================================================================
  // 8. Service Details Modal
  // =========================================================================
  const serviceModal = document.getElementById('service-modal');
  const serviceModalTitle = document.getElementById('service-modal-title');
  const serviceModalBody = document.getElementById('service-modal-body');
  const serviceModalClose = document.getElementById('service-modal-close');
  const serviceLearnButtons = document.querySelectorAll('[data-service-trigger]');

  const serviceCatalog = {
    'mutual-funds': {
      title: 'Mutual Funds & Systematic Investment Planning (SIP)',
      content: `
        <p style="margin-bottom: 1rem; color: #4a596c;">Systematic Investment Plans (SIPs) are the bedrock of disciplined capital accumulation. Backed by 20+ years of fund analysis, Rr INVESTMENT handpicks top-decile equity, balanced, and debt funds engineered for maximum risk-adjusted alpha.</p>
        <h4 style="font-size: 1.05rem; margin-bottom: 0.5rem; color: #07152b;">Our Strategic Methodology:</h4>
        <ul style="list-style: disc; padding-left: 1.25rem; margin-bottom: 1.25rem; color: #4a596c; display: flex; flex-direction: column; gap: 0.4rem;">
          <li>Rigorous rolling-return analysis over 3, 5, and 10-year horizons.</li>
          <li>Dynamic asset allocation balancing large-cap stability with mid-cap momentum.</li>
          <li>Automated annual step-up SIP strategies matching salary and business revenue growth.</li>
        </ul>
        <div style="background: #edf4fc; padding: 0.85rem 1rem; border-radius: 6px; font-size: 0.85rem; color: #1b3d73;">
          <strong>Target Horizon:</strong> 3 to 15+ Years | <strong>Direct Desk:</strong> 8360344527
        </div>
      `
    },
    'wealth-management': {
      title: 'Bespoke Wealth Management',
      content: `
        <p style="margin-bottom: 1rem; color: #4a596c;">High Net-Worth families and business owners require institutional-grade stewardship. We build bespoke multi-asset architectures that balance capital preservation, real returns above inflation, and steady liquidity.</p>
        <h4 style="font-size: 1.05rem; margin-bottom: 0.5rem; color: #07152b;">Key Capabilities:</h4>
        <ul style="list-style: disc; padding-left: 1.25rem; margin-bottom: 1.25rem; color: #4a596c; display: flex; flex-direction: column; gap: 0.4rem;">
          <li>Dedicated Senior Wealth Advisor with quarterly performance audits.</li>
          <li>Macroeconomic risk profiling and strategic debt/equity balancing.</li>
          <li>Sovereign gold bond strategies and fixed income allocation.</li>
        </ul>
        <div style="background: #edf4fc; padding: 0.85rem 1rem; border-radius: 6px; font-size: 0.85rem; color: #1b3d73;">
          <strong>Mandate:</strong> Customized HNI Roadmaps | <strong>Helpline:</strong> 8360344527
        </div>
      `
    },
    'retirement-planning': {
      title: 'Retirement & Pension Architecture',
      content: `
        <p style="margin-bottom: 1rem; color: #4a596c;">A peaceful retirement starts decades before your final workday. We engineer inflation-indexed pension pipelines that guarantee regular monthly cash flows while shielding your core corpus against longevity risk.</p>
        <h4 style="font-size: 1.05rem; margin-bottom: 0.5rem; color: #07152b;">Retirement Framework:</h4>
        <ul style="list-style: disc; padding-left: 1.25rem; margin-bottom: 1.25rem; color: #4a596c; display: flex; flex-direction: column; gap: 0.4rem;">
          <li>Accumulation phase: Aggressive compounding through diversified growth funds.</li>
          <li>Transition phase: Step-down de-risking into sovereign debt instruments.</li>
          <li>Systematic Withdrawal Plan (SWP) with tax-optimized monthly payouts.</li>
        </ul>
      `
    },
    'portfolio-restructuring': {
      title: 'Portfolio Restructuring & Audits',
      content: `
        <p style="margin-bottom: 1rem; color: #4a596c;">Are your investments scattered across dozens of underperforming schemes and duplicated stock holdings? Our proprietary 360° audit revitalizes your entire portfolio.</p>
        <h4 style="font-size: 1.05rem; margin-bottom: 0.5rem; color: #07152b;">Audit Deliverables:</h4>
        <ul style="list-style: disc; padding-left: 1.25rem; margin-bottom: 1.25rem; color: #4a596c; display: flex; flex-direction: column; gap: 0.4rem;">
          <li>Pruning of deadweight schemes and persistent laggards.</li>
          <li>Elimination of excessive expense ratio leakages.</li>
          <li>Tax-loss harvesting transition to neutralize capital gains liability.</li>
        </ul>
      `
    },
    'tax-planning': {
      title: 'Tax-Advantaged Investment Strategies',
      content: `
        <p style="margin-bottom: 1rem; color: #4a596c;">Maximize your net in-hand returns through legitimate tax minimization via Section 80C ELSS equity, capital gains exemptions under Section 54, and optimal debt indexing.</p>
        <h4 style="font-size: 1.05rem; margin-bottom: 0.5rem; color: #07152b;">Key Highlights:</h4>
        <ul style="list-style: disc; padding-left: 1.25rem; margin-bottom: 1.25rem; color: #4a596c; display: flex; flex-direction: column; gap: 0.4rem;">
          <li>Shortest 3-year lock-in with equity compounding upside.</li>
          <li>Long-Term Capital Gain (LTCG) threshold planning.</li>
        </ul>
      `
    },
    'risk-management': {
      title: 'Risk & Shield Advisory',
      content: `
        <p style="margin-bottom: 1rem; color: #4a596c;">True wealth creation is vulnerable without uncompromised defense. We provide pure term life protection and high-deductible health umbrellas. Zero deceptive endowment policies or ULIPs.</p>
        <h4 style="font-size: 1.05rem; margin-bottom: 0.5rem; color: #07152b;">Protective Core:</h4>
        <ul style="list-style: disc; padding-left: 1.25rem; margin-bottom: 1.25rem; color: #4a596c; display: flex; flex-direction: column; gap: 0.4rem;">
          <li>Scientific Human Life Value (HLV) liability calculation.</li>
          <li>Zero-commission-bias pure term protection.</li>
          <li>Comprehensive family health contingency reserve planning.</li>
        </ul>
      `
    }
  };

  serviceLearnButtons.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const serviceKey = btn.getAttribute('data-service-trigger');
      const serviceData = serviceCatalog[serviceKey];
      if (serviceData && serviceModal) {
        if (serviceModalTitle) serviceModalTitle.textContent = serviceData.title;
        if (serviceModalBody) serviceModalBody.innerHTML = serviceData.content;
        serviceModal.classList.add('active');
        lockScroll();
      }
    });
  });

  serviceModalClose?.addEventListener('click', () => {
    serviceModal?.classList.remove('active');
    unlockScroll();
  });

  // =========================================================================
  // 9. Quick Consultation Booking Modal
  // =========================================================================
  const consultModal = document.getElementById('consult-modal');
  const consultModalClose = document.getElementById('consult-modal-close');
  const consultTriggers = document.querySelectorAll('[data-consult-trigger]');

  consultTriggers.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      consultModal?.classList.add('active');
      lockScroll();
    });
  });

  consultModalClose?.addEventListener('click', () => {
    consultModal?.classList.remove('active');
    unlockScroll();
  });

  // =========================================================================
  // 10. Market Insights & Blog Reader Modal
  // =========================================================================
  // 10. Market Insights & Blog Reader Modal (Compact Editorial Showcase)
  // =========================================================================
  const blogModal = document.getElementById('blog-modal');
  const blogModalClose = document.getElementById('blog-modal-close');
  const blogModalContent = document.getElementById('blog-modal-content');

  const blogCatalog = {
    'retirement-corpus': {
      tag: 'Retirement Strategy',
      title: 'How to Structure an Inflation-Indexed Retirement Corpus in India',
      meta: 'October 2026 • 6 min read • By Rajesh Roy, CFP®',
      content: `
        <p>A common retirement planning heuristic inherited from Western financial literature is William Bengen's <strong>4% Rule</strong>: withdraw 4% of your initial retirement portfolio in Year 1, and adjust subsequently for annual CPI inflation. While theoretically elegant in economies experiencing stable 2% inflation, blindly applying this rule in India is a recipe for premature portfolio depletion.</p>
        
        <h4>The Mathematical Reality of Indian Inflation</h4>
        <p>In India, aggregate retail inflation frequently oscillates between 5% and 7%, while <em>lifestyle and healthcare inflation</em> routinely surges past 9-11% per annum. A fixed deposit yielding 7% taxable interest generates a negative real return for an investor in the 30% tax bracket (7% × (1 - 0.312) = 4.82% post-tax vs. 7% inflation).</p>

        <div class="blog-callout">
          <p><strong>Core Principle:</strong> You do not retire from investing simply because you retire from active employment. Your post-retirement capital must actively compound to defeat compounding inflation.</p>
        </div>

        <h4>The 3-Bucket Strategic Architecture</h4>
        <p>At Rr INVESTMENT, we deploy a dynamic 3-Bucket Framework to safeguard multi-decade retirements:</p>
        <ul>
          <li><strong>Bucket 1 (Immediate Liquidity - Years 1 to 3):</strong> 36 months of living expenses housed in Ultra-Short Duration Debt, Liquid Funds, and Arbitrage Funds. Zero equity volatility risk.</li>
          <li><strong>Bucket 2 (Income Generation - Years 4 to 7):</strong> Short to Medium-Duration Corporate Bond Funds and Target Maturity Index Funds providing predictable coupon reinvestment and capital stability.</li>
          <li><strong>Bucket 3 (Growth Compounding Engine - Years 8+):</strong> Well-diversified Flexi-cap and Large & Mid-cap Equity Mutual Funds compounding at 12–14% CAGR, replenishing Buckets 1 and 2 during market peaks.</li>
        </ul>

        <h4>Systematic Withdrawal Plans (SWP) vs. Fixed Deposits</h4>
        <p>Opting for monthly SWPs from Equity-Oriented Hybrid or Flexi-Cap funds triggers Long-Term Capital Gains (LTCG) taxation exclusively on the capital gain component of each redemption, rather than the entire withdrawal amount. This yields up to 65% tax savings compared to traditional annuities or fixed deposit interest.</p>

        <div class="blog-modal-cta">
          <h5>Construct Your Personal Retirement Architecture</h5>
          <p>Work directly with CFP® Rajesh Roy to backtest your retirement portfolio against Indian inflation cycles.</p>
          <a href="tel:8360344527" class="btn btn-primary" style="margin-top: 0.5rem;">
            <span>Speak with Senior Advisor: 8360344527</span>
          </a>
        </div>
      `
    },
    'active-vs-passive': {
      tag: 'Mutual Funds & SIPs',
      title: 'Active Alpha vs. Passive Indexing: Where to Allocate in 2026',
      meta: 'September 2026 • 5 min read • By Research Desk',
      content: `
        <p>The global shift toward low-cost passive index funds has triggered intense debate across India's wealth management industry. With domestic monthly SIP inflows crossing ₹25,000 Crore, capital markets are maturing rapidly. However, applying a purely passive index strategy across all Indian market capitalizations leaves substantial returns on the table.</p>

        <h4>The Large-Cap Efficiency Shift</h4>
        <p>Over the past 5-year rolling period, approximately 65% of active Large-Cap mutual funds have struggled to beat the Nifty 50 Total Return Index (TRI) net of expense ratios. Institutional analyst coverage of top-50 companies is exhaustive, leaving minimal room for information arbitrage.</p>

        <div class="blog-callout">
          <p><strong>Empirical Rule:</strong> Where market coverage is hyper-efficient (Nifty 50), low-cost passive index funds and ETFs provide optimal risk-adjusted cost efficiency. Where market inefficiency reigns (Mid & Small Caps), experienced active fund managers consistently generate alpha.</p>
        </div>

        <h4>Where Active Managers Deliver 300–500 bps of True Alpha</h4>
        <p>Beyond the top 100 stocks, corporate governance divergence, balance sheet quality, and forensic accounting discrepancies widen exponentially. Quality-focused active fund managers who conduct rigorous field audits and promoter evaluation generate substantial outperformance:</p>
        <ul>
          <li><strong>Mid-Cap & Small-Cap Space:</strong> Active fund managers routinely beat index benchmarks by 3% to 5% net of fees across 7 to 10-year holding periods.</li>
          <li><strong>Flexi-Cap Category:</strong> Tactical cash holding and capitalization rotation allow active managers to mitigate severe cyclical drawdowns.</li>
        </ul>

        <h4>The Optimal Hybrid Core & Satellite Portfolio</h4>
        <p>Rather than adopting a dogmatic 'Active or Passive' ideology, Rr INVESTMENT engineers a barbell asset allocation:</p>
        <ul>
          <li><strong>Core Allocation (40–50%):</strong> Ultra low-cost Nifty 50 & Nifty Next 50 index funds (expense ratios under 0.15%).</li>
          <li><strong>Satellite Alpha Allocation (50–60%):</strong> High-conviction, low-churn active Flexi-Cap and Mid-Cap funds with proven downside capture ratios below 75%.</li>
        </ul>

        <div class="blog-modal-cta">
          <h5>Evaluate Your Current Fund Portfolio</h5>
          <p>Request an institutional portfolio audit to identify underperforming active funds and expense ratio leakages.</p>
          <a href="tel:8360344527" class="btn btn-primary" style="margin-top: 0.5rem;">
            <span>Request Diagnostic Call: 8360344527</span>
          </a>
        </div>
      `
    },
    'market-psychology': {
      tag: 'Wealth Philosophy',
      title: 'The Psychology of Market Corrections: Lessons from 4 Cycles',
      meta: 'August 2026 • 7 min read • By Rajesh Roy, CFP®',
      content: `
        <p>Over 20+ years of wealth management at Rr INVESTMENT, we have guided clients through four seismic capital market downturns: the 2008 Global Financial Meltdown (-55%), the 2011–2013 Indian Macro & Rupee Crisis, the 2016 Demonetization shock, and the March 2020 Covid plunge (-38%).</p>
        
        <p>In every instance, the mathematical constant remains identical: market crashes are temporary; the growth of the Indian real economy is permanent.</p>

        <h4>The Destructive Behavioral Instinct: Pausing SIPs</h4>
        <p>When stock markets experience double-digit corrections, financial media generates panic headlines. Investors instinctively seek to 'pause SIPs until markets stabilize'. Mathematically, this is the single most destructive decision an investor can make.</p>

        <div class="blog-callout">
          <p><strong>The Rupee Cost Averaging Formula:</strong> During market corrections, your fixed monthly SIP investment buys units at deep valuation discounts. When markets inevitably recover, those accumulated low-cost units deliver explosive portfolio acceleration.</p>
        </div>

        <h4>Real-World Case Evidence: 2020 vs 2026</h4>
        <p>Investors who paused or redeemed equity funds in March 2020 locked in permanent capital loss and missed the subsequent 140% Nifty rally. Conversely, clients who followed our advisory counsel to systematically increase SIP allocations achieved five-year portfolio XIRR exceeding 21.4%.</p>

        <h4>The 3 Rules of Market Correction Mastery</h4>
        <ul>
          <li><strong>Maintain Uncompromised Emergency Liquidity:</strong> With 6–12 months of household expenses in liquid reserves, you are never forced to liquidate equities during market lows.</li>
          <li><strong>Rebalance Counter-Cyclically:</strong> When equities fall, automatically reallocate capital from debt gains into undervalued equity schemes.</li>
          <li><strong>Rely on Seasoned Fiduciary Counsel:</strong> Wealth creation is 10% mathematical analysis and 90% emotional discipline. Having a trusted advisor prevents costly behavioral errors.</li>
        </ul>

        <div class="blog-modal-cta">
          <h5>Unbiased Wealth Stewardship</h5>
          <p>Need emotional clarity and portfolio fortitude during market turbulence? Talk directly to our founder.</p>
          <a href="tel:8360344527" class="btn btn-primary" style="margin-top: 0.5rem;">
            <span>Consult Rajesh Roy, CFP®: 8360344527</span>
          </a>
        </div>
      `
    },
    'tax-harvesting': {
      tag: 'Tax Optimization',
      title: 'Tax-Loss Harvesting & Capital Gains Strategy for Mutual Funds',
      meta: 'July 2026 • 4 min read • By Rajesh Roy, CFP®',
      content: `
        <p>In wealth management, it is not merely what your investments gross in nominal returns—it is what you retain net of taxation and inflation. Under Section 112A of the Indian Income Tax Act, Long-Term Capital Gains (LTCG) on equity mutual funds are taxed at 12.5% on aggregate gains exceeding ₹1.25 Lakh per financial year.</p>

        <h4>The Power of Annual ₹1.25 Lakh Exemption Reset</h4>
        <p>Most investors make the mistake of leaving high-growth equity mutual fund units untouched for 10 to 15 years without interim profit realization. At final redemption, a massive accumulated capital gain is subjected to heavy taxation.</p>

        <div class="blog-callout">
          <p><strong>Systematic Harvesting Rule:</strong> By systematically booking up to ₹1.25 Lakh of LTCG each financial year and instantly reinvesting the capital, you permanently reset your cost acquisition base without incurring a single rupee in income tax.</p>
        </div>

        <h4>Tax-Loss Harvesting During Market Dips</h4>
        <p>When tactical corrections depress specific portfolio holdings, selling underperforming schemes to realize Short-Term Capital Loss (STCL) allows you to offset gains against active equity profits for up to 8 assessment years. Reallocating proceeds into higher-conviction peer schemes maintains 100% equity market exposure while optimizing your net tax liability.</p>

        <h4>Key Fiduciary Rules for Harvesting:</h4>
        <ul>
          <li><strong>Avoid Exit Load Windows:</strong> Ensure redeemed units have surpassed their 365-day holding period to eliminate 1% exit penalties.</li>
          <li><strong>Mind the 24-Hour NAV Window:</strong> Reinvest redeemed capital promptly into pre-selected core funds to prevent cash-drag during sudden market rallies.</li>
          <li><strong>Coordinate with ITR Disclosures:</strong> Maintain an exact audit trail of Schedule CG filings matching your AIS and TIS records.</li>
        </ul>

        <div class="blog-modal-cta">
          <h5>Optimize Your Portfolio Tax Efficiency</h5>
          <p>Request our principal desk's complimentary capital gains audit before the current financial year concludes.</p>
          <a href="tel:8360344527" class="btn btn-primary" style="margin-top: 0.5rem;">
            <span>Schedule Tax Review: 8360344527</span>
          </a>
        </div>
      `
    }
  };

  // Open Blog Modal Helper
  const openBlogArticle = articleKey => {
    const article = blogCatalog[articleKey];
    if (article && blogModal && blogModalContent) {
      blogModalContent.innerHTML = `
        <div class="blog-modal-header">
          <span class="blog-modal-tag">${article.tag}</span>
          <h3 class="blog-modal-title" id="blog-modal-title">${article.title}</h3>
          <div class="blog-modal-meta">${article.meta}</div>
        </div>
        <div class="blog-modal-body">
          ${article.content}
        </div>
      `;
      blogModal.classList.add('active');
      lockScroll();
    }
  };

  // Global delegation for all data-blog-trigger buttons
  document.addEventListener('click', e => {
    const trigger = e.target.closest('[data-blog-trigger]');
    if (trigger) {
      e.preventDefault();
      const articleKey = trigger.getAttribute('data-blog-trigger');
      openBlogArticle(articleKey);
    }
  });

  blogModalClose?.addEventListener('click', () => {
    blogModal?.classList.remove('active');
    unlockScroll();
  });

  // =========================================================================
  // 11. Interactive Editorial Showcase & Carousel Controller
  // =========================================================================
  const blogArticlesData = [
    {
      id: 'retirement-corpus',
      categoryKey: 'retirement',
      category: 'Retirement Strategy',
      badge: '⭐ Principal Editor\'s Choice',
      title: 'How to Structure an Inflation-Indexed Retirement Corpus in India',
      readTime: '6 min read',
      date: 'Oct 2026',
      author: 'Rajesh Roy, CFP®',
      authorRole: 'Founder & Principal Advisor',
      desc: 'Why the static 4% withdrawal rule fails in high-growth emerging economies, and how Systematic Withdrawal Plans (SWP) combined with dynamic debt hedging safeguard your retirement longevity.',
      takeaway: 'Post-retirement capital must actively compound at 12-14% to defeat 9% lifestyle and healthcare inflation.',
      metrics: [
        { label: 'Asset Model', val: '3-Bucket Matrix' },
        { label: 'Tax Savings', val: '+65% vs FD' },
        { label: 'Horizon', val: '25-30+ Yrs' }
      ],
      image: 'https://images.unsplash.com/photo-1516726817505-f5ed825624d8?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'active-vs-passive',
      categoryKey: 'alpha',
      category: 'Mutual Funds & SIPs',
      badge: '📊 Empirical Research',
      title: 'Active Alpha vs. Passive Indexing: Where to Allocate in 2026',
      readTime: '5 min read',
      date: 'Sep 2026',
      author: 'Research Desk',
      authorRole: 'Capital Markets Analysis',
      desc: 'An empirical analysis of Large-cap vs. Mid/Small-cap fund manager alpha across 3, 5, and 10-year rolling windows in the Indian equity markets.',
      takeaway: 'Deploy passive indexing for hyper-efficient Large Caps; allocate active alpha satellites for Mid/Small Caps.',
      metrics: [
        { label: 'Alpha Target', val: '+300-500 bps' },
        { label: 'Core Barbell', val: '50/50 Split' },
        { label: 'Downside Beta', val: '< 0.75x' }
      ],
      image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'market-psychology',
      categoryKey: 'psychology',
      category: 'Wealth Philosophy',
      badge: '🧘 Cycle Wisdom',
      title: 'The Psychology of Market Corrections: Lessons from 4 Cycles',
      readTime: '7 min read',
      date: 'Aug 2026',
      author: 'Rajesh Roy, CFP®',
      authorRole: '20+ Yrs Market Veteran',
      desc: 'Examining the behavioral mistakes that destroy investor compounding during market downturns, and the mathematical reality of rupee cost averaging through panic phases.',
      takeaway: 'Market crashes are temporary; the compounding trajectory of India\'s real economy is permanent.',
      metrics: [
        { label: 'Bear Cycles', val: '4 Navigated' },
        { label: 'Drawdown Defense', val: 'Rupee Averaging' },
        { label: 'XIRR Upside', val: '+21.4% Multi-Yr' }
      ],
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'tax-harvesting',
      categoryKey: 'tax',
      category: 'Tax Optimization',
      badge: '⚡ Fiscal Alpha',
      title: 'Tax-Loss Harvesting & Capital Gains Strategy for Mutual Funds',
      readTime: '4 min read',
      date: 'Jul 2026',
      author: 'Rajesh Roy, CFP®',
      authorRole: 'Chartered Financial Planner',
      desc: 'How to utilize the Section 112A ₹1.25 Lakh annual LTCG threshold to systematically reset purchase costs and legally eliminate portfolio tax drag.',
      takeaway: 'Reset your cost base every March to eliminate accumulated future tax liability without altering market exposure.',
      metrics: [
        { label: 'Annual Exemption', val: '₹1.25 Lakh' },
        { label: 'Tax Drag Cut', val: 'Zero LTCG Up To Limit' },
        { label: 'Compliance', val: '100% Section 112A' }
      ],
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80'
    }
  ];

  let currentArticleIndex = 0;

  // Spotlight Elements
  const spotlightImg = document.getElementById('spotlight-img');
  const spotlightBadge = document.getElementById('spotlight-badge');
  const spotlightCat = document.getElementById('spotlight-cat');
  const spotlightReadtime = document.getElementById('spotlight-readtime');
  const spotlightAuthor = document.getElementById('spotlight-author');
  const spotlightRole = document.getElementById('spotlight-role');
  const spotlightDate = document.getElementById('spotlight-date');
  const spotlightTitle = document.getElementById('spotlight-title');
  const spotlightDesc = document.getElementById('spotlight-desc');
  const spotlightTakeaway = document.getElementById('spotlight-takeaway');
  const spotlightReadBtn = document.getElementById('spotlight-read-btn');
  const blogCounterDisplay = document.getElementById('blog-counter-display');
  const metric1 = document.getElementById('metric-1');
  const metric2 = document.getElementById('metric-2');
  const metric3 = document.getElementById('metric-3');

  const tabItems = document.querySelectorAll('.blog-tab-item');
  const filterPills = document.querySelectorAll('.blog-filter-pill');
  const blogPrevBtn = document.getElementById('blog-prev-btn');
  const blogNextBtn = document.getElementById('blog-next-btn');

  const updateSpotlight = index => {
    if (index < 0 || index >= blogArticlesData.length) return;
    currentArticleIndex = index;
    const article = blogArticlesData[index];

    // Update active tab styling
    tabItems.forEach((tab, idx) => {
      if (idx === index) {
        tab.classList.add('active');
        // Scroll into view on mobile horizontal track
        tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        tab.classList.remove('active');
      }
    });

    // Update Counter
    if (blogCounterDisplay) {
      blogCounterDisplay.textContent = `0${index + 1} / 0${blogArticlesData.length}`;
    }

    // Update Spotlight Card with subtle crossfade
    if (spotlightImg) {
      spotlightImg.style.opacity = '0.4';
      setTimeout(() => {
        spotlightImg.src = article.image;
        spotlightImg.style.opacity = '1';
      }, 150);
    }

    if (spotlightBadge) spotlightBadge.textContent = article.badge;
    if (spotlightCat) spotlightCat.textContent = article.category;
    if (spotlightReadtime) spotlightReadtime.textContent = article.readTime;
    if (spotlightAuthor) spotlightAuthor.textContent = article.author;
    if (spotlightRole) spotlightRole.textContent = article.authorRole;
    if (spotlightDate) spotlightDate.textContent = article.date;
    if (spotlightTitle) spotlightTitle.textContent = article.title;
    if (spotlightDesc) spotlightDesc.textContent = article.desc;
    if (spotlightTakeaway) spotlightTakeaway.textContent = article.takeaway;

    if (metric1 && article.metrics[0]) {
      metric1.textContent = article.metrics[0].val;
      metric1.previousElementSibling.textContent = article.metrics[0].label;
    }
    if (metric2 && article.metrics[1]) {
      metric2.textContent = article.metrics[1].val;
      metric2.previousElementSibling.textContent = article.metrics[1].label;
    }
    if (metric3 && article.metrics[2]) {
      metric3.textContent = article.metrics[2].val;
      metric3.previousElementSibling.textContent = article.metrics[2].label;
    }

    if (spotlightReadBtn) {
      spotlightReadBtn.setAttribute('data-blog-trigger', article.id);
    }
  };

  // Wire Tab Items
  tabItems.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      updateSpotlight(index);
    });
    tab.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        updateSpotlight(index);
      }
    });
  });

  // Wire Next / Prev Arrows
  blogNextBtn?.addEventListener('click', () => {
    const nextIdx = (currentArticleIndex + 1) % blogArticlesData.length;
    updateSpotlight(nextIdx);
  });

  blogPrevBtn?.addEventListener('click', () => {
    const prevIdx = (currentArticleIndex - 1 + blogArticlesData.length) % blogArticlesData.length;
    updateSpotlight(prevIdx);
  });

  // Wire Topic Filter Pills
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const cat = pill.getAttribute('data-category');
      if (cat === 'all') {
        updateSpotlight(0);
      } else {
        const foundIndex = blogArticlesData.findIndex(item => item.categoryKey === cat);
        if (foundIndex !== -1) {
          updateSpotlight(foundIndex);
        }
      }
    });
  });

  // Close modals when clicking backdrop
  [serviceModal, consultModal, blogModal].forEach(modal => {
    modal?.addEventListener('click', e => {
      if (e.target === modal) {
        modal.classList.remove('active');
        unlockScroll();
      }
    });
  });

  // Close modals on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (mobileDrawer?.classList.contains('open')) {
        closeMobileDrawer();
      }
      if (serviceModal?.classList.contains('active')) {
        serviceModal.classList.remove('active');
        unlockScroll();
      }
      if (consultModal?.classList.contains('active')) {
        consultModal.classList.remove('active');
        unlockScroll();
      }
      if (blogModal?.classList.contains('active')) {
        blogModal.classList.remove('active');
        unlockScroll();
      }
    }
  });

  // =========================================================================
  // 10. FAQ Accordion Interaction
  // =========================================================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question');
          otherBtn?.setAttribute('aria-expanded', 'false');
        }
      });

      if (isActive) {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // =========================================================================
  // 11. Form Submissions & Universal Dialing Feedback
  // =========================================================================
  const showToast = message => {
    let toast = document.querySelector('.toast-notice');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#178a57" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${message}</span>
    `;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  };

  const contactForm = document.getElementById('contact-form');
  const modalConsultForm = document.getElementById('modal-consult-form');

  const handleFormSubmit = (e, formType) => {
    e.preventDefault();
    const form = e.target;
    const name = form.querySelector('input[name="name"]')?.value || 'Investor';
    const phone = form.querySelector('input[name="phone"]')?.value || '8360344527';

    showToast(`Thank you, ${name}! Your consultation request has been received. Our senior advisor will call you shortly.`);

    form.reset();

    if (formType === 'modal') {
      consultModal?.classList.remove('active');
      unlockScroll();
    }

    setTimeout(() => {
      const confirmChat = confirm(`Would you like to connect directly on WhatsApp with our advisor right now?`);
      if (confirmChat) {
        const textMsg = encodeURIComponent(`Hello Rr INVESTMENT, I am ${name} (${phone}). I submitted an inquiry on your website and would like to speak regarding wealth management.`);
        window.open(`https://wa.me/918360344527?text=${textMsg}`, '_blank');
      }
    }, 1200);
  };

  contactForm?.addEventListener('submit', e => handleFormSubmit(e, 'main'));
  modalConsultForm?.addEventListener('submit', e => handleFormSubmit(e, 'modal'));
});
