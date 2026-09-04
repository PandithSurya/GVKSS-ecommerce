import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  HeartHandshake,
  Leaf,
  Milk,
  Building,
  Heart,
  TrendingUp,
  Award,
  BookOpen,
  QrCode,
  MapPin,
  Phone,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { businessInfo } from '../../data/businessInfo';

export const AboutView: React.FC = () => {
  const { language } = useLanguage();
  const [activeSummaryTab, setActiveSummaryTab] = useState<
    'manifesto' | 'gaushalas' | 'farmers' | 'hyderabad' | 'donations'
  >('manifesto');

  return (
    <div className="py-10 bg-transparent min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Banner */}
        <div className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-12 relative overflow-hidden shadow-xl border-b-4 border-emerald-600">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800 text-emerald-200 border border-emerald-700 text-xs font-bold">
              <Leaf className="w-4 h-4 text-emerald-300" />
              <span>{businessInfo.regNo}</span>
            </div>

            <h1 className="font-sans font-black text-2xl sm:text-4xl lg:text-5xl leading-tight">
              {language === 'te'
                ? 'మా లక్ష్యం & సేంద్రీయ ఉద్యమం'
                : 'About GVKSS - Go Vishwa Kalyana Voluntary Service Organization'}
            </h1>

            <p className="text-emerald-100/80 text-xs sm:text-base leading-relaxed">
              {language === 'te'
                ? 'గో విశ్వ కళ్యాణ సంరక్షణ సమితి మరియు డీడీఎస్ మహిళా సంఘాల ద్వారా దేశీ గోవుల సంరక్షణ, రైతు సాధికారత మరియు సహజ సేంద్రీయ వ్యవసాయ పునరుజ్జీవనం.'
                : 'Reviving Vedic organic agriculture, protecting indigenous Desi cows, empowering rural women farmers, and delivering authentic natural food directly from farm to family.'}
            </p>
          </div>
        </div>

        {/* 4 Core Pillars Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 border border-emerald-100 shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-sans font-black text-base sm:text-lg text-stone-900">
                {language === 'te' ? '5000+ మహిళా రైతులు' : '5,000+ Women Farmers'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {language === 'te'
                  ? 'డీడీఎస్ మహిళా సంఘాల ద్వారా రసాయన రహిత సంప్రదాయ చిరుధాన్యాల సాగు.'
                  : 'Empowered through Deccan Development Society collectives across Telangana.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-50 text-[11px] font-bold text-emerald-700">
              ✓ Heirloom Seed Keepers
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 border border-emerald-100 shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-sans font-black text-base sm:text-lg text-stone-900">
                {language === 'te' ? '100% రసాయన రహితం' : '100% Zero-Chemical'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {language === 'te'
                  ? 'కృత్రిమ ఎరువులు, పురుగుమందులు, మైదా మరియు ప్రిజర్వేటివ్‌లు లేవు.'
                  : 'Zero chemical fertilizers, synthetic pesticides, or artificial preservatives.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-50 text-[11px] font-bold text-emerald-700">
              ✓ Natural Jeevamrutham
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 border border-emerald-100 shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                <Milk className="w-6 h-6" />
              </div>
              <h3 className="font-sans font-black text-base sm:text-lg text-stone-900">
                {language === 'te' ? 'దేశీ గో సంరక్షణ' : 'Indigenous Desi Cows'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {language === 'te'
                  ? '15 వృద్ధ గోఆశ్రమాలు, A2 పాలు, బిలోనా నెయ్యి మరియు 50 రకాల గోమయ ఉత్పత్తులు.'
                  : '15 Old-Age Gaushalas, Vedic Bilona A2 Ghee, and Panchagavya care.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-50 text-[11px] font-bold text-emerald-700">
              ✓ Non-Violent Sanctuaries
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 border border-emerald-100 shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-sans font-black text-base sm:text-lg text-stone-900">
                {language === 'te' ? 'రైతుకు +₹500 బోనస్' : 'MSP + ₹500/Qtl Bonus'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {language === 'te'
                  ? 'ప్రభుత్వ మద్దతు ధర కంటే క్వింటాలుకు ₹500 అదనంగా ఇచ్చి పంటల కొనుగోలు.'
                  : 'Guaranteed fair market pricing giving ₹500 extra bonus per quintal to farmers.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-50 text-[11px] font-bold text-emerald-700">
              ✓ Direct Farmer Support
            </div>
          </div>
        </div>

        {/* =========================================================================
            OFFICIAL ENGLISH SUMMARY FROM REFERENCE PAMPHLETS
            ========================================================================= */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-emerald-200 p-6 sm:p-10 shadow-foodie space-y-8">
          
          <div className="border-b border-stone-200 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span>Official Organization Manifesto & Reference Summary</span>
              </div>
              <h2 className="font-sans font-black text-2xl sm:text-3xl text-stone-900">
                The GVKSS Movement & Agricultural Revival
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                A complete English translation and structural summary of the official Ugadi message and mission document.
              </p>
            </div>

            {/* Subtab Switcher */}
            <div className="flex flex-wrap gap-2 bg-emerald-50 p-1.5 rounded-2xl border border-emerald-200">
              <button
                onClick={() => setActiveSummaryTab('manifesto')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  activeSummaryTab === 'manifesto'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-stone-700 hover:text-emerald-800'
                }`}
              >
                1. The Crisis & Vision
              </button>
              <button
                onClick={() => setActiveSummaryTab('gaushalas')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  activeSummaryTab === 'gaushalas'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-stone-700 hover:text-emerald-800'
                }`}
              >
                2. 15 Gaushalas
              </button>
              <button
                onClick={() => setActiveSummaryTab('farmers')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  activeSummaryTab === 'farmers'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-stone-700 hover:text-emerald-800'
                }`}
              >
                3. Farmer Support
              </button>
              <button
                onClick={() => setActiveSummaryTab('hyderabad')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  activeSummaryTab === 'hyderabad'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-stone-700 hover:text-emerald-800'
                }`}
              >
                4. 150 Hyderabad Outlets
              </button>
              <button
                onClick={() => setActiveSummaryTab('donations')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  activeSummaryTab === 'donations'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-stone-700 hover:text-emerald-800'
                }`}
              >
                5. Bank & Leadership
              </button>
            </div>
          </div>

          {/* TAB 1: The Crisis & Vision */}
          {activeSummaryTab === 'manifesto' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
                  <h3 className="font-sans font-black text-xl text-emerald-950 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    Historical Heritage vs. The Modern Chemical Crisis
                  </h3>

                  <p>
                    <strong>Pre-Colonial Health & Cattle Wealth:</strong> Historically, India had a population of 25 to 30 Crores supported by an immense cattle wealth of <strong>130 to 150 Crore indigenous cows and bullocks</strong>. People thrived on wholesome unpolished millets, natural grains, and pure A2 cow dairy, living robust, disease-free lives spanning up to 100 years while working 15 hours daily with vigorous stamina.
                  </p>

                  <p>
                    <strong>The 1960 Chemical Fertilizer Catastrophe:</strong> The introduction of synthetic chemical fertilizers in 1960 stripped soil nutrients up to 15 feet deep. Today, central governments spend over ₹3 Lakh Crores annually on chemical fertilizer subsidies, and farmers spend ₹20,000+ per acre on synthetic inputs that poison our ground water and food supply.
                  </p>

                  <p>
                    <strong>Public Health Burden:</strong> Because of chemically grown, polished, and stripped foods, <strong>30% to 40% of average household income is now drained into hospitals</strong> for diabetes, thyroid, cardiovascular illnesses, and young-age infertility. Life expectancy has dropped significantly to 50–60 years.
                  </p>

                  <p className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950 font-medium">
                    <strong>The GVKSS Solution:</strong> Inspiring farmers across Telangana to return to ancient zero-budget natural farming based on <strong>Dr. Subhash Palekar’s (SPK) 5-layer model</strong> and <strong>Sri Gora Vijayaramaraju’s</strong> organic cultivation principles.
                  </p>
                </div>

                <div className="lg:col-span-5 bg-emerald-950 text-white p-6 sm:p-7 rounded-3xl space-y-4">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4" />
                    Key Reference Facts
                  </div>
                  <h4 className="font-sans font-black text-lg text-white">
                    Ugadi Sri Vishwavasu Nama Samvatsara Manifesto
                  </h4>
                  <ul className="space-y-2.5 text-xs text-stone-300">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span><strong>Honoring Farmers:</strong> Recognizing traditional plough farmers (*హలము పట్టిన రైతులు*) and relieving debt burdens.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span><strong>Subsidized Desi Cows:</strong> Providing ₹40,000–₹75,000 market-value cows to farmers for just ₹15,000–₹20,000 with donor and bank linkage.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span><strong>Fair Price Guarantee:</strong> Buying all organic harvest with an extra <strong>₹500/quintal bonus above government MSP</strong>.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 15 Gaushalas */}
          {activeSummaryTab === 'gaushalas' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
                  <h3 className="font-sans font-black text-xl text-emerald-950 flex items-center gap-2">
                    <Building className="w-5 h-5 text-emerald-600" />
                    15 Old-Age Gaushalas (వృద్ధ గోఆశ్రమాలు) Across Telangana
                  </h3>

                  <p>
                    <strong>Honorable Sanctuaries for Aged & Sick Cattle:</strong> Establishing 15 Old-Age Gaushalas on 15-acre parcels across the 10 old districts of Telangana to protect aged, non-lactating, sick, and abandoned cows with dedicated veterinary care, shelter, and green pasture.
                  </p>

                  <p>
                    <strong>Infrastructure & Equipment:</strong> Setting up <strong>5 veterinary ambulances</strong>, <strong>10 specialized tractors</strong> for plowing pastureland, growing green fodder, and mechanical grass baling (approx construction cost of ₹15–₹20 Lakhs per Gaushala shed).
                  </p>

                  <p>
                    <strong>50+ Gomayam & Panchagavya Products:</strong> Producing over 50 varieties of eco-friendly products, bio-pesticides, organic insect repellents, and natural medicines from cow dung (*Gomayam*) and cow urine (*Gomutram*), completely replacing harmful chemical sprays.
                  </p>

                  <p>
                    <strong>Operating Budget:</strong> Monthly maintenance of approximately ₹7 Lakhs per Gaushala (employing 4 drivers, 8 full-time caretakers @ ₹20,000/month, plus green fodder, medicines, and nutrition).
                  </p>
                </div>

                <div className="lg:col-span-5 bg-stone-50 p-6 rounded-3xl border border-stone-200 space-y-3">
                  <h4 className="font-sans font-black text-base text-stone-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    Active Gaushala Sanctuaries
                  </h4>
                  <div className="space-y-2 text-xs text-stone-700">
                    <div className="p-3 bg-white rounded-xl border border-stone-200">
                      <strong className="block text-emerald-900 font-bold">Eeduluru Village Gaushala:</strong>
                      <span>Survey No. 989/1, 2,400 sq. yards (1/2 acre) donated by Late Sri Malpatel Boyapally Sanjeeva Reddy & Smt. Balakrishnamma’s family (value ~₹30 Lakhs) accommodating 100 cows. Second gaushala on 12 acres leased land for 200 cows.</span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-stone-200">
                      <strong className="block text-emerald-900 font-bold">Sri Krishna Gaushala, Kattangur:</strong>
                      <span>Located in Kattangur, Nalgonda District. Coordinators: Saidulu (9848993302) & V. Vinod Kumar (9666868622). 200-cow distribution ceremony held March 24, 2025.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Farmer Support */}
          {activeSummaryTab === 'farmers' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
                  <h3 className="font-sans font-black text-xl text-emerald-950 flex items-center gap-2">
                    <HeartHandshake className="w-5 h-5 text-emerald-600" />
                    Empowering 10 Farmers in Every Village (10,000 Villages)
                  </h3>

                  <p>
                    <strong>Statewide Grassroots Network:</strong> Supporting 10 farmers in each village across 10,000 villages of Telangana to transition fully to zero-chemical natural farming.
                  </p>

                  <p>
                    <strong>2 Desi Cows & Cattle Shed per Farmer:</strong> Providing each participating farmer with 2 indigenous Desi cows and assisting with cattle shed construction (investment of ~₹1 Lakh per farmer).
                  </p>

                  <p>
                    <strong>Earn ₹40,000 to ₹80,000 per Acre:</strong> Utilizing multi-layer millet and vegetable intercropping enables a farmer with even 1 single acre of land to generate steady, dignified monthly income.
                  </p>

                  <p>
                    <strong>Free Training on 8 Bio-Formulations:</strong> Imparting hands-on training to farmers to make Jeevamrutham, Beejamrutham, Neemastra, Brahmastra, Agniastra, and natural disease-preventing plant tonics from cow dung and urine at zero cash cost.
                  </p>

                  <p className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950">
                    <strong>Annual State Awards:</strong> Announcing 1st, 2nd, and 3rd State Awards for the best organic farmers and Gaushala managers starting from Ugadi 2026.
                  </p>
                </div>

                <div className="lg:col-span-5 bg-emerald-900 text-white p-6 rounded-3xl space-y-3">
                  <h4 className="font-sans font-black text-base text-white">
                    Ancient Soil Silt Revival (ఒండ్రు మట్టి)
                  </h4>
                  <p className="text-xs text-stone-200 leading-relaxed">
                    Reviving the time-tested agricultural practice of scooping nutrient-dense silt (*Ondru Matti*) from dried summer village lakes and ponds, and transporting it via tractors directly into dry farmland.
                  </p>
                  <p className="text-xs text-stone-200 leading-relaxed">
                    This completely restores micro-nutrients, water retention, and microbial fertility to the soil without spending a single rupee on artificial fertilizers.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: 150 Hyderabad Outlets */}
          {activeSummaryTab === 'hyderabad' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
                  <h3 className="font-sans font-black text-xl text-emerald-950 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                    150 Outlets Across GHMC Hyderabad & Youth Entrepreneurship
                  </h3>

                  <p>
                    <strong>Direct Farm-to-City Pipeline:</strong> Establishing warehouses, cold-press oil units, and sales outlets across LB Nagar and 150 GHMC divisions in Hyderabad.
                  </p>

                  <p>
                    <strong>80+ Heirloom Varieties Available:</strong>
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-stone-700">
                    <li>80+ varieties of naturally cultivated heritage paddy and rice (including low-glycemic strains that help prevent and manage Diabetes, BP, and Thyroid).</li>
                    <li>9 traditional millets (*Navadhanyalu*), sprouted ragi/jowar flours, and ready idli/dosa batters.</li>
                    <li>Bull-driven wood cold-pressed oils (*Eddu Ganuga Noonelu*), fresh cold-pressed groundnut, safflower, and sesame oils.</li>
                    <li>Clay cookware and earthen pots (*Matti Paatralu*) for toxin-free traditional cooking.</li>
                  </ul>

                  <p>
                    <strong>Youth Entrepreneurship Support:</strong> Inviting local youth across Hyderabad to manage neighborhood organic stores with <strong>₹1 Lakh refundable advance stock</strong> and comprehensive marketing guidance.
                  </p>
                </div>

                <div className="lg:col-span-5 bg-stone-50 p-6 rounded-3xl border border-stone-200 space-y-3">
                  <h4 className="font-sans font-black text-base text-stone-900">
                    Hyderabad Store & Branch Details
                  </h4>
                  <div className="space-y-2 text-xs text-stone-700">
                    <div className="p-3 bg-white rounded-xl border border-stone-200">
                      <strong>Main Saroornagar Store:</strong>
                      <p className="text-stone-600 mt-1">Shop No. 7, H.No. 13-23-130, Janapriya Soudha, Sri Chaitanya School Opp. Lane, Saroornagar, Hyderabad - 500060</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-stone-200">
                      <strong>Kothapet Registered Office:</strong>
                      <p className="text-stone-600 mt-1">CSR Apartments, Plot No. 21, Flat No. G7, 1st Floor, Huda Complex, Kothapet, Hyderabad - 500060</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-stone-200">
                      <strong>Upcoming Outlets:</strong>
                      <p className="text-stone-600 mt-1">Jubilee Hills, Kukatpally, and Ameerpet.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Bank & Leadership */}
          {activeSummaryTab === 'donations' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-6 space-y-4">
                  <h3 className="font-sans font-black text-xl text-emerald-950 flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-emerald-600" />
                    Official Bank Account for Donations & Cow Sponsorships
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                    100% of donor contributions and proceeds from the Ugadi Diary are dedicated transparently to Gaushala maintenance, medical care, ambulance services, and supporting natural farming farmers.
                  </p>

                  <div className="bg-emerald-950 text-white p-6 rounded-3xl space-y-3 font-mono text-xs shadow-md">
                    <div className="text-emerald-400 font-bold uppercase tracking-wider text-[11px] font-sans">
                      Verified Bank Transfer Details:
                    </div>
                    <div className="space-y-1.5 pt-1">
                      <div><span className="text-stone-400">Account Name:</span> <strong className="text-white">GAU VISHWA KALYAN SAMRAKSHNA SAMITHI</strong></div>
                      <div><span className="text-stone-400">Account Number:</span> <strong className="text-emerald-300 text-sm">019212010001444</strong></div>
                      <div><span className="text-stone-400">Bank & Branch:</span> <strong className="text-white">Union Bank of India, Kothapet Branch</strong></div>
                      <div><span className="text-stone-400">IFSC Code:</span> <strong className="text-emerald-300">UBIN0801925</strong></div>
                      <div><span className="text-stone-400">MICR Code:</span> <strong className="text-white">500 026027</strong></div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6 space-y-4">
                  <h3 className="font-sans font-black text-xl text-emerald-950 flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-600" />
                    Key Leadership & Spiritual Patrons
                  </h3>

                  <div className="space-y-2 text-xs text-stone-700">
                    <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-1">
                      <strong className="text-emerald-950 block font-bold">Key Executive Trustees:</strong>
                      <p>• <strong>V. Prabhakar Reddy:</strong> 9346749301, 9441796324</p>
                      <p>• <strong>V. Seetharam Reddy:</strong> 8374297542</p>
                      <p>• <strong>Smt. Radhika:</strong> 9948643681</p>
                      <p>• <strong>Vanasthalipuram Office:</strong> H.No. 5-5-276/1, Plot No. 293, Prashanth Nagar, Road No. 9, Opp. Ganesh Temple, Vanasthalipuram, Hyderabad.</p>
                    </div>

                    <div className="p-3.5 bg-white rounded-2xl border border-stone-200 space-y-1">
                      <strong className="text-stone-900 block font-bold">Revered Spiritual Patrons:</strong>
                      <p>• <strong>Sri Mahamandaleshwar Swami Taranand Shivji Maharaj</strong> (State President, Saint Wing Telangana)</p>
                      <p>• <strong>Sri Vijay Pratap Maharaj</strong> (International Yoga Expert)</p>
                      <p>• <strong>Sri Deekshitulu Yogulu</strong></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Panchagavya Natural Medicine Special Feature */}
        <div className="bg-emerald-50/70 rounded-3xl p-8 border border-emerald-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white inline-block">
              {language === 'te' ? 'వైద్య సేవలు' : 'Wellness & Healthcare'}
            </span>
            <h3 className="font-sans font-black text-xl text-stone-900">
              {language === 'te'
                ? businessInfo.panchagavyaInfo.doctorTe
                : businessInfo.panchagavyaInfo.doctorEn}
            </h3>
            <p className="text-xs sm:text-sm text-stone-700 max-w-xl">
              {language === 'te'
                ? businessInfo.panchagavyaInfo.specialtyTe
                : businessInfo.panchagavyaInfo.specialtyEn}
            </p>
          </div>

          <a
            href={`tel:${businessInfo.panchagavyaInfo.phone}`}
            className="px-6 py-3 rounded-full bg-emerald-600 text-white font-bold text-xs sm:text-sm hover:bg-emerald-700 transition shrink-0 shadow-green-glow"
          >
            Call {businessInfo.panchagavyaInfo.phone}
          </a>
        </div>
      </div>
    </div>
  );
};
