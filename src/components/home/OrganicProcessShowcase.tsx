import React, { useState } from 'react';
import { Leaf, Sparkles, CheckCircle2, ArrowRight, X, Play } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface ProcessStep {
  id: string;
  stepNumber: string;
  titleEn: string;
  titleTe: string;
  subtitleEn: string;
  subtitleTe: string;
  descEn: string;
  descTe: string;
  image: string;
  badgeEn: string;
  badgeTe: string;
  benefitsEn: string[];
  benefitsTe: string[];
}

export const OrganicProcessShowcase: React.FC<{ onExploreShop?: () => void }> = ({
  onExploreShop
}) => {
  const { language } = useLanguage();
  const [selectedStep, setSelectedStep] = useState<ProcessStep | null>(null);

  const steps: ProcessStep[] = [
    {
      id: 'wood-press',
      stepNumber: '01',
      titleEn: 'Bull-Driven Wood Cold-Pressing',
      titleTe: 'ఎద్దు గానుగ / చెక్క గానుగ నూనెలు',
      subtitleEn: 'Zero-Heat Cold Extraction',
      subtitleTe: 'వేడి లేకుండా తీసిన స్వచ్ఛమైన నూనె',
      descEn:
        'Groundnuts, safflower, and sesame seeds are crushed slowly in a traditional wooden mortar (Gaana / Marachekku) turned by indigenous bulls. Because no friction heat or chemical solvents are used, natural antioxidants, vitamins, and authentic aromas remain 100% intact.',
      descTe:
        'రసాయనాలు, పామాయిల్ మరియు అధిక వేడి లేకుండా సాంప్రదాయ ఎద్దు గానుగ ద్వారా సహజ పద్ధతిలో నూనెను తీస్తారు. దీనివల్ల నూనెలోని సహజ పోషకాలు, సువాసన చెక్కుచెదరకుండా ఉంటాయి.',
      image: '/images/wood_press_oil_process.jpg',
      badgeEn: 'Traditional Cold Pressed',
      badgeTe: 'సంప్రదాయ గానుగ',
      benefitsEn: [
        'No chemical refining or trans fats',
        'Rich in Vitamin E and Omega fatty acids',
        'Authentic rich nutty aroma & taste'
      ],
      benefitsTe: [
        'రసాయన రహితం, ట్రాన్స్ ఫ్యాట్స్ లేవు',
        'విటమిన్ E మరియు ఒమేగా ఫ్యాటీ యాసిడ్స్ పుష్కలం',
        'స్వచ్ఛమైన సంప్రదాయ రుచి మరియు వాసన'
      ]
    },
    {
      id: 'sprouting',
      stepNumber: '02',
      titleEn: 'Natural Sprouting & Sun Drying',
      titleTe: 'మొలకెత్తిన ధాన్యాలు & ఎండబెట్టుట',
      subtitleEn: 'Living Enzyme Multiplier',
      subtitleTe: 'పోషకాలను రెట్టింపు చేసే పద్ధతి',
      descEn:
        'Organic Finger Millet (Ragi), Jowar, and Green Moong are carefully soaked in fresh water, naturally sprouted in woven bamboo trays (moora), and gently sun-dried in clean village courtyards before stone grinding.',
      descTe:
        'సేంద్రీయ రాగులు, జొన్నలు మరియు పెసర్లను శుభ్రమైన నీటిలో నానబెట్టి, వెదురు బుట్టలలో సహజంగా మొలకలు తెప్పించి, ఉదయపు సూర్యరశ్మిలో ఆరబెడతారు. ఇది శరీరంలో జీర్ణశక్తిని మరియు పోషకాలను పెంచుతుంది.',
      image: '/images/sprouting_grains_process.jpg',
      badgeEn: 'Enzyme Enriched',
      badgeTe: 'మొలకల పోషకాలు',
      benefitsEn: [
        'Multiplies natural iron & bio-calcium',
        'Breaks down complex starches for easy digestion',
        'Ideal for infants, kids, and elders'
      ],
      benefitsTe: [
        'సహజ ఐరన్ మరియు కాల్షియం పెరుగుతుంది',
        'సులభంగా జీర్ణమయ్యేలా పోషకాలు మారతాయి',
        'చిన్నపిల్లలకు మరియు పెద్దలకు శ్రేష్ఠమైనది'
      ]
    },
    {
      id: 'bilona-ghee',
      stepNumber: '03',
      titleEn: 'Vedic Bilona Ghee Churning',
      titleTe: 'సంప్రదాయ బిలోనా నెయ్యి తయారీ',
      subtitleEn: 'Desi Cow A2 Whole Curd Churning',
      subtitleTe: 'దేశీ నాటు ఆవు పెరుగుతో చేసిన నెయ్యి',
      descEn:
        'Pure Desi Cow A2 milk is cultured naturally into whole curd in clay pots, then churned bi-directionally with a wooden bilona churner to separate fresh makhan (butter). The butter is gently slow-simmered over a low cow-dung fire into aromatic golden liquid ghee.',
      descTe:
        'దేశీ నాటు ఆవు పాలతో తోడుపెట్టిన పెరుగును, సాంప్రదాయ చెక్క కవ్వం (బిలోనా)తో చిలికి వెన్నను తీస్తారు. ఆ వెన్నను మట్టి పొయ్యిపై స్వల్ప మంటపై కరిగించి స్వచ్ఛమైన దానేదార్ నెయ్యిని తయారుచేస్తారు.',
      image: '/images/bilona_ghee_process.jpg',
      badgeEn: 'Bilona Churned A2 Ghee',
      badgeTe: 'బిలోనా పద్ధతి నెయ్యి',
      benefitsEn: [
        '100% Pure A2 protein from grazing cows',
        'High smoke point and rich butyric acid',
        'Promotes gut health and cognitive vigor'
      ],
      benefitsTe: [
        '100% స్వచ్ఛమైన దేశీ ఆవు A2 నెయ్యి',
        'జీర్ణవ్యవస్థను మరియు రోగనిరోధక శక్తిని పెంచుతుంది',
        'స్వచ్ఛమైన బంగారు రంగు, పూస పూసగా ఉండే సువాసన'
      ]
    },
    {
      id: 'stone-grinding',
      stepNumber: '04',
      titleEn: 'Ancient Hand Stone Grinding',
      titleTe: 'రాతి తిరగలి పిండి విసరడం',
      subtitleEn: 'Slow Friction-Free Milling',
      subtitleTe: 'వేడి పుట్టకుండా విసిరిన పిండి',
      descEn:
        'Heirloom grains and millets are ground slowly using heavy granite stone grinders (Chakki / Tiragali). Unlike high-speed commercial steel rollers that overheat and burn the bran and germ, slow stone milling keeps vital dietary fiber and vitamins completely alive.',
      descTe:
        'సంప్రదాయ రాతి తిరగలిపై నెమ్మదిగా పిండిని విసరడం వలన పిండి వేడెక్కదు. దీనివల్ల ధాన్యంలోని పొట్టు (bran), మొలక (germ), మరియు పీచు పదార్థం నశించకుండా ఆహారానికి పూర్తి పోషక విలువలను ఇస్తాయి.',
      image: '/images/stone_grinding_process.jpg',
      badgeEn: 'Stone Ground Grain',
      badgeTe: 'రాతి తిరగలి పిండి',
      benefitsEn: [
        'Retains 100% natural wheat germ and bran',
        'Low Glycemic Index for balanced blood sugar',
        'Pure flour without any maida or chemical whiteners'
      ],
      benefitsTe: [
        'ధాన్యంలోని పూర్తి పీచు పదార్థం నిలిచి ఉంటుంది',
        'షుగర్ నియంత్రణకు అనువైన లో-గ్లైసెమిక్ పిండి',
        'మైదా మరియు బ్లీచింగ్ రసాయనాలు కలపబడవు'
      ]
    }
  ];

  return (
    <section className="py-20 bg-transparent relative overflow-hidden">
      {/* Background soft modern shapes */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-emerald-50/60 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              {language === 'te'
                ? 'సేంద్రీయ & సంప్రదాయ తయారీ విధానం'
                : '100% Authentic Traditional Preparation'}
            </span>
          </div>

          <h2 className="font-sans font-black text-3xl sm:text-4xl lg:text-5xl text-stone-900 tracking-tight leading-tight">
            {language === 'te' ? (
              <>
                మన ఆహారాన్ని <span className="text-emerald-600">సహజంగా ఎలా తయారు చేస్తాం?</span>
              </>
            ) : (
              <>
                How We Prepare Our <br className="hidden sm:inline" />
                <span className="text-emerald-600">Pure Organic Products</span>
              </>
            )}
          </h2>

          <p className="text-stone-600 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            {language === 'te'
              ? 'డీడీఎస్ మహిళా సంఘాల ద్వారా ఎద్దు గానుగ, రాతి తిరగలి, వెదురు బుట్టల మొలకలు మరియు సంప్రదాయ బిలోనా పద్ధతులలో ఎలాంటి రసాయనాలు లేకుండా తయారుచేయబడుతున్నాయి.'
              : 'Witness the time-honored Indian village heritage methods used by GVKSS - Go Vishwa Kalyana Voluntary Service Organization to preserve 100% living nutrition, natural aromas, and zero chemical additives.'}
          </p>
        </div>

        {/* 4 Interactive Process Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.id}
              onClick={() => setSelectedStep(step)}
              className="group bg-white rounded-3xl border border-stone-200/80 hover:border-emerald-400 shadow-sm hover:shadow-foodie transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer relative transform hover:-translate-y-2"
            >
              {/* Step Number Top Badge */}
              <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/85 backdrop-blur-md text-white text-[11px] font-black border border-white/20">
                <span className="text-emerald-400 font-mono">{step.stepNumber}</span>
                <span>•</span>
                <span>{language === 'te' ? step.badgeTe : step.badgeEn}</span>
              </div>

              {/* Photographic Card Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-emerald-50">
                <img
                  src={step.image}
                  alt={step.titleEn}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
              </div>

              {/* Card Text Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[11px] font-extrabold text-emerald-700 uppercase tracking-wider block">
                    {language === 'te' ? step.subtitleTe : step.subtitleEn}
                  </span>

                  <h3 className="font-sans font-black text-base sm:text-lg text-stone-900 group-hover:text-emerald-700 transition leading-snug mt-1">
                    {language === 'te' ? step.titleTe : step.titleEn}
                  </h3>

                  <p className="text-xs text-stone-500 line-clamp-3 mt-2 leading-relaxed">
                    {language === 'te' ? step.descTe : step.descEn}
                  </p>
                </div>

                {/* Bottom Action Row */}
                <div className="pt-3 border-t border-emerald-50 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
                  <span>{language === 'te' ? 'వివరాలు చూడండి' : 'Read Full Method'}</span>
                  <div className="w-7 h-7 rounded-full bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white transition flex items-center justify-center">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Explore Shop CTA Bar */}
        {onExploreShop && (
          <div className="mt-12 text-center">
            <button
              onClick={onExploreShop}
              className="px-8 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-green-glow hover:shadow-xl transition-all inline-flex items-center gap-2"
            >
              <span>{language === 'te' ? 'సేంద్రీయ ఉత్పత్తులను కొనండి' : 'Taste Pure Traditional Goodness – Shop Products'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Process Step Detail Modal */}
      {selectedStep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-emerald-950/80 backdrop-blur-md animate-fadeIn">
          <div className="fixed inset-0" onClick={() => setSelectedStep(null)}></div>

          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-100 z-10 text-left my-6">
            {/* Modal Close Button */}
            <button
              onClick={() => setSelectedStep(null)}
              className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/90 backdrop-blur-sm text-stone-600 hover:text-stone-950 transition shadow-md"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image Header */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-emerald-950">
              <img
                src={selectedStep.image}
                alt={selectedStep.titleEn}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/30 to-transparent"></div>
              
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-600 text-white inline-block mb-1.5">
                  Step {selectedStep.stepNumber} • {selectedStep.badgeEn}
                </span>
                <h3 className="font-sans font-black text-xl sm:text-2xl text-white">
                  {language === 'te' ? selectedStep.titleTe : selectedStep.titleEn}
                </h3>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 space-y-5 max-h-[50vh] overflow-y-auto">
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
                {language === 'te' ? selectedStep.descTe : selectedStep.descEn}
              </p>

              {/* Health Benefits Box */}
              <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-2.5">
                <h4 className="font-bold text-xs text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'te' ? 'ప్రత్యేక ప్రయోజనాలు' : 'Pure Health Benefits:'}</span>
                </h4>

                <div className="space-y-1.5">
                  {(language === 'te' ? selectedStep.benefitsTe : selectedStep.benefitsEn).map(
                    (b, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-stone-700">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{b}</span>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    setSelectedStep(null);
                    if (onExploreShop) onExploreShop();
                  }}
                  className="px-6 py-2.5 rounded-full bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition shadow-sm"
                >
                  {language === 'te' ? 'ఉత్పత్తులను బ్రౌజ్ చేయండి' : 'Browse Products Made This Way'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
