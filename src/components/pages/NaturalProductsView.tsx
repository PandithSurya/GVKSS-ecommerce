import React from 'react';
import { Milk, Leaf, CheckCircle2 } from 'lucide-react';
import { products } from '../../data/products';
import { ProductGrid } from '../shop/ProductGrid';
import { Product } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface NaturalProductsViewProps {
  onOpenDetails: (product: Product) => void;
}

export const NaturalProductsView: React.FC<NaturalProductsViewProps> = ({
  onOpenDetails
}) => {
  const { language, t } = useLanguage();

  const naturalProductsList = products.filter(
    p =>
      p.isNaturalProduct ||
      p.category === 'natural-dairy' ||
      p.category === 'herbal-eco'
  );

  const officialBrochureCategories = [
    { en: 'Desi Cow A2 Milk', te: 'దేశీవాళి నాటు ఆవుపాలు (A2 Milk)' },
    { en: 'Desi Cow Curd', te: 'దేశీవాళి ఆవు పెరుగు' },
    { en: 'Desi Cow Ghee (Bilona Churned)', te: 'దేశీవాళి ఆవు నెయ్యి' },
    { en: 'Pure Raw Forest Honey', te: 'స్వచ్ఛమైన అడవి తేనె' },
    { en: 'Wood Pressed Oils (4 Varieties)', te: 'ఎద్దు గానుగ నూనెలు' },
    { en: 'Traditional Rice (20 Varieties)', te: 'దేశీవాళి నాటు బియ్యం (20 రకాలు)' },
    { en: 'Millets (Minor Grains)', te: 'మిల్లెట్స్ (చిరుధాన్యాలు)' },
    { en: 'Sprouted Millet Flours', te: 'మొలకెత్తిన చిరు ధాన్యాల పిండి రకాలు' },
    { en: 'Chemical-Free Pulses & Dals', te: 'పప్పు ధాన్యాలు' },
    { en: 'Natural Fresh Vegetables & Fruits', te: 'న్యాచురల్ కూరగాయలు & తాజా పండ్లు' },
    { en: 'Village Style Food Delicacies', te: 'గ్రామీణ పిండి వంటకాలు' },
    { en: 'Handmade Natural Products', te: 'ఇంట్లో తయారు చేసిన సహజ ఉత్పత్తులు' },
    { en: 'Herbal & Ayurvedic Products', te: 'మూలికల ఉత్పత్తులు' },
    { en: 'Palash Leaves Biodegradable Plates', te: 'మోదుగ విస్తరాకులు' },
    { en: 'Free-Range Desi Country Eggs', te: 'దేశీనాటు కోడిగుడ్లు' },
    { en: 'Cow-Based Gomaya Products', te: 'గోమయ ఉత్పత్తులు (హోమ పిడకలు)' },
    { en: 'Soapnuts Natural Cloth Wash Liquid', te: 'కుంకుడుకాయల బట్టల లిక్విడ్' },
    { en: 'Soapnuts Chemical-Free Shampoo', te: 'కుంకుడు కాయల షాంపూస్' }
  ];

  return (
    <div className="py-10 bg-transparent min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Banner */}
        <div className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-12 relative overflow-hidden shadow-xl border-b-4 border-emerald-600">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800 text-emerald-200 border border-emerald-700 text-xs font-bold">
              <Milk className="w-4 h-4 text-emerald-300" />
              <span>
                {language === 'te'
                  ? 'GVKSS – సహజ & సేంద్రీయ ఉత్పత్తులు'
                  : 'GVKSS – Natural & Organic Farm Collectives'}
              </span>
            </div>

            <h1 className="font-sans font-black text-2xl sm:text-4xl lg:text-5xl leading-tight">
              {t.sections.naturalCowTitle}
            </h1>

            <p className="text-emerald-100/80 text-xs sm:text-base leading-relaxed">
              {language === 'te'
                ? 'రైతుల నుండి నేరుగా సేకరించిన దేశీ ఆవు A2 పాలు, సాంప్రదాయ బిలోనా నెయ్యి, అడవి తేనె, మరియు సహజ మూలికా ఉత్పత్తులు.'
                : 'Directly sourced from indigenous Desi cow rearing and wild forest foraging by GVKSS Go Viswa Kalyana Samrakshana Samithi.'}
            </p>
          </div>
        </div>

        {/* Brochure Highlights Matrix */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Leaf className="w-5 h-5 text-emerald-600" />
            <h2 className="font-sans font-black text-lg sm:text-xl text-stone-900">
              {language === 'te'
                ? 'అందుబాటులో గల సహజ ఉత్పత్తుల జాబితా (Brochure Catalog)'
                : 'Natural Products Available (As Featured in Official Brochure)'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {officialBrochureCategories.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-xs text-stone-900 font-semibold"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{language === 'te' ? item.te : item.en}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Available Products Grid */}
        <div className="space-y-4">
          <h3 className="font-sans font-black text-xl text-stone-900">
            {language === 'te' ? 'ఆర్డర్ చేయదగిన ఉత్పత్తులు' : 'Shop Natural Products Online'}
          </h3>
          <ProductGrid
            products={naturalProductsList}
            onOpenDetails={onOpenDetails}
          />
        </div>
      </div>
    </div>
  );
};
