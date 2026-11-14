import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from '../config/environment.js';
import { logger } from '../config/logger.js';
import { Role } from '../models/Role.js';
import { Permission } from '../models/Permission.js';
import { Admin } from '../models/Admin.js';
import { User } from '../models/User.js';
import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { Inventory } from '../models/Inventory.js';
import { StoreSettings } from '../models/StoreSettings.js';

// Predefined Categories matching existing frontend
const categoriesData = [
  {
    slug: 'millets',
    name: 'Millets & Minor Grains',
    teluguName: 'చిరుధాన్యాలు (మిల్లెట్స్)',
    icon: 'Wheat',
    description: 'Indigenous unpolished millets: Ragi, Jowar, Korralu, Samalu, Arikalu, and Yavvalu.',
    teluguDescription: 'స్వచ్ఛమైన సాంప్రదాయ చిరుధాన్యాలు: రాగులు, జొన్నలు, కొర్రలు, సామలు, అరికలు.',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    badge: 'Ancient Grains',
    benefitEn: 'Low GI • Best for Diabetes, BP & Daily Energy',
    benefitTe: 'షుగర్, బీపీ నియంత్రణ & బరువు నియంత్రణకు ఉత్తమం',
    sortOrder: 1,
  },
  {
    slug: 'ready-to-cook',
    name: 'Ready to Cook',
    teluguName: 'రెడీ టు కుక్ ఉత్పత్తులు',
    icon: 'Utensils',
    description: 'Sprouted flours, millet semiya, instant khichdi & pongal mixes, and papads.',
    teluguDescription: 'మొలకెత్తిన రాగి పిండి, మిల్లెట్ సేమియా, కిచిడి & పొంగల్ మిక్స్, అప్పడాలు.',
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80',
    badge: 'Quick & Healthy',
    benefitEn: 'High Bio-Enzymes • 5-Min Nutritious Breakfast',
    benefitTe: 'జీర్ణక్రియకు సులువైన పోషకాలతో కూడిన అల్పాహారం',
    sortOrder: 2,
  },
  {
    slug: 'ready-to-eat',
    name: 'Ready to Eat / Snacks',
    teluguName: 'రెడీ టు ఈట్ & స్నాక్స్',
    icon: 'Cookie',
    description: 'Crispy millet murukulu, savory mixtures, nachos, and traditional chakralu.',
    teluguDescription: 'కరకరలాడే జొన్న, రాగి మురుకులు, మిక్చర్, నాచోస్, చక్రాలు.',
    image: 'https://images.unsplash.com/photo-1599481238640-4c1288750d7a?auto=format&fit=crop&w=600&q=80',
    badge: 'No Palm Oil',
    benefitEn: 'Zero Palm Oil & Maida • Wholesome Tea-time Crunch',
    benefitTe: 'పామాయిల్, మైదా లేని సంప్రదాయ పిండివంటలు',
    sortOrder: 3,
  },
  {
    slug: 'flours',
    name: 'Flours & Ravva',
    teluguName: 'పిండి రకాలు & రవ్వ',
    icon: 'Package',
    description: 'Stone ground Ragi, Jowar, Multi Millet, Buckwheat flours and fresh coarse ravva.',
    teluguDescription: 'రాతి గానుగపై ఆడించిన రాగి, జొన్న, గోధుమ పిండి మరియు రవ్వ రకాలు.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    badge: 'Stone Ground',
    benefitEn: 'Stone-Ground Cold Milling • Retains Natural Fiber & Calcium',
    benefitTe: 'సహజ ఫైబర్, కాల్షియం నిండిన రాతి పిండి',
    sortOrder: 4,
  },
  {
    slug: 'natural-dairy',
    name: 'Desi Cow Dairy & Honey',
    teluguName: 'దేశీవాళి ఆవు పాలు, నెయ్యి & తేనె',
    icon: 'Milk',
    description: 'Pure Desi Cow A2 Milk, Curd, Bilona Ghee, Raw Forest Honey, and Free-Range Eggs.',
    teluguDescription: 'దేశీ నాటు ఆవు A2 పాలు, పెరుగు, స్వచ్ఛమైన నెయ్యి, అడవి తేనె, నాటు కోడిగుడ్లు.',
    image: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&w=600&q=80',
    badge: '100% Pure Desi',
    benefitEn: 'Traditional Bilona Churned • Boosts Immunity & Longevity',
    benefitTe: 'సంప్రదాయ చిలుకుడు పద్ధతిలో తయారుచేసిన A2 నెయ్యి',
    sortOrder: 5,
  },
  {
    slug: 'oils',
    name: 'Cold Pressed Oils (Wood Pressed)',
    teluguName: 'గానుగ నూనెలు (కట్టె గానుగ)',
    icon: 'Droplet',
    description: 'Traditional wood-churned Groundnut, Sesame, Safflower, Mustard, and Coconut oils.',
    teluguDescription: 'కట్టె గానుగపై స్వచ్ఛంగా తీసిన పల్లి, నువ్వుల, కుసుమ, ఆవాలు మరియు కొబ్బరి నూనె.',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
    badge: 'Wood Pressed',
    benefitEn: 'Zero Heat Extraction • Preserves Natural Antioxidants & Vitamin E',
    benefitTe: 'రసాయనాలు లేని కట్టె గానుగ నూనె – గుండె ఆరోగ్యానికి శ్రేష్టం',
    sortOrder: 6,
  },
  {
    slug: 'pulses',
    name: 'Organic Pulses & Dals',
    teluguName: 'సేంద్రీయ పప్పు దినుసులు',
    icon: 'CircleDot',
    description: 'Unpolished traditional Toor dal, Moong dal, Urad dal, Chana dal, and Horse gram.',
    teluguDescription: 'పాలిష్ చేయని నాటు కందిపప్పు, పెసరపప్పు, మినపప్పు, శెనగపప్పు, ఉలవలు.',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    badge: 'Unpolished Dals',
    benefitEn: 'Plant-Based High Protein • Retains Natural Husk Nutrition',
    benefitTe: 'రసాయనాలు లేని నాటు పప్పులు – పోషకాల గని',
    sortOrder: 7,
  },
  {
    slug: 'rice',
    name: 'Traditional & Desi Rice',
    teluguName: 'సాంప్రదాయ దేశీ బియ్యం',
    icon: 'Wheat',
    description: 'Ancient medicinal rice: Navara, Brown Rice, Black Rice, and Indigenous Sona Masoori.',
    teluguDescription: 'ఆయుర్వేద ఔషధ గుణాలు కలిగిన నవార, బ్రౌన్ రైస్, నల్ల బియ్యం, సోనా మసూరి.',
    image: 'https://images.unsplash.com/photo-1586201375763-48866e74f884?auto=format&fit=crop&w=600&q=80',
    badge: 'Medicinal Rice',
    benefitEn: 'High Micro-Nutrients • Gentle on Digestion & Low Glycemic',
    benefitTe: 'రక్తహీనతను తగ్గించి శక్తినిచ్చే సంప్రదాయ బియ్యం రకాలు',
    sortOrder: 8,
  },
  {
    slug: 'spices',
    name: 'Spices, Salts & Natural Sweeteners',
    teluguName: 'మసాలాలు, ఉప్పు & బెల్లం రకాలు',
    icon: 'Flame',
    description: 'Indigenous turmeric with high curcumin, pink rock salt, chemical-free jaggery, palm sugar.',
    teluguDescription: 'హై-కర్కుమిన్ పసుపు, సైంధవ లవణం, నాటు బెల్లం పొడి, తాటి బెల్లం.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
    badge: 'High Curcumin',
    benefitEn: 'Anti-Inflammatory • 100% Unadulterated Ancient South Indian Flavors',
    benefitTe: 'రోగనిరోధక శక్తిని పెంచే సహజ పసుపు & మసాలాలు',
    sortOrder: 9,
  },
  {
    slug: 'sweets-snacks',
    name: 'Organic Traditional Sweets',
    teluguName: 'సంప్రదాయ మిల్లెట్ మిఠాయిలు',
    icon: 'Sparkles',
    description: 'Sunnundalu, Bellam Laddu, Kaju Katli made exclusively with A2 Ghee and pure Jaggery.',
    teluguDescription: 'A2 ఆవు నెయ్యి మరియు నాటు బెల్లంతో చేసిన సున్నుండలు, నువ్వుల లడ్డు.',
    image: 'https://images.unsplash.com/photo-1599481238640-4c1288750d7a?auto=format&fit=crop&w=600&q=80',
    badge: 'Pure A2 Ghee',
    benefitEn: 'Refined Sugar Free • Sweetened Exclusively with Pure Jaggery',
    benefitTe: 'తెల్ల చక్కెర లేని స్వచ్ఛమైన ఆవు నెయ్యి మిఠాయిలు',
    sortOrder: 10,
  },
  {
    slug: 'herbal-eco',
    name: 'Herbal Care & Eco Home',
    teluguName: 'మూలికా ఉత్పత్తులు & పర్యావరణ రక్షణ',
    icon: 'Leaf',
    description: 'Natural herbal bath powders (Sunni Pindi), hair oils, and cow dung dhoop cups.',
    teluguDescription: 'సహజ సున్నిపిండి, హెర్బల్ హెయిర్ ఆయిల్, ఆవు పేడతో చేసిన ధూప్ కప్పులు.',
    image: 'https://images.unsplash.com/photo-1608248597359-59754f923286?auto=format&fit=crop&w=600&q=80',
    badge: 'Chemical-Free',
    benefitEn: 'Ayurvedic Wellness • Non-Toxic & Biodegradable',
    benefitTe: 'చర్మ సౌందర్యానికి, మనశ్శాంతికి సంప్రదాయ మూలికా సంరక్షణ',
    sortOrder: 11,
  },
];

// Seed Core Products
const productsData = [
  {
    legacyId: 'prod-01',
    slNo: 1,
    sku: 'GVK-RAGI-1KG',
    name: 'Finger Millet (Ragi)',
    teluguName: 'రాగులు',
    category: 'millets',
    price: 70,
    originalPrice: 80,
    quantity: '1 kg',
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    description: 'Traditionally cultivated high-calcium Finger Millet (Ragi / Ragulu) grown without chemicals by DDS Sangham women farmers.',
    teluguDescription: 'కాల్షియం మరియు పీచు పదార్థం పుష్కలంగా ఉండే సహజ రాగులు. డీడీఎస్ మహిళా సంఘాల ద్వారా రసాయనాలు లేకుండా పండించినవి.',
    available: true,
    isFeatured: true,
    tags: ['millet', 'ragi', 'calcium', 'traditional', 'ragulu', 'రాగులు'],
    source: 'dds_catalog_1',
    stockQuantity: 150,
  },
  {
    legacyId: 'prod-02',
    slNo: 2,
    sku: 'GVK-JOWAR-1KG',
    name: 'Sorghum Millet (White & Yellow)',
    teluguName: 'జొన్నలు (తెల్ల & పసుపు)',
    category: 'millets',
    price: 80,
    originalPrice: 90,
    quantity: '1 kg',
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80',
    description: 'Nutrient-rich indigenous Sorghum (Jowar / Jonnalu) grains. High protein and gluten-free dietary staple.',
    teluguDescription: 'స్వచ్ఛమైన దేశీ తెల్ల మరియు పసుపు జొన్నలు. రోగనిరోధక శక్తిని పెంచే సంప్రదాయ చిరుధాన్యం.',
    available: true,
    tags: ['millet', 'sorghum', 'jowar', 'jonnalu', 'gluten-free', 'జొన్నలు'],
    source: 'dds_catalog_1',
    stockQuantity: 120,
  },
  {
    legacyId: 'prod-03',
    slNo: 3,
    sku: 'GVK-FOXTAIL-1KG',
    name: 'Foxtail Millet',
    teluguName: 'కొర్రలు',
    category: 'millets',
    price: 120,
    originalPrice: 140,
    quantity: '1 kg',
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80',
    description: 'Unpolished Foxtail Millet (Korralu). Excellent low-glycemic grain rich in minerals and dietary fiber.',
    teluguDescription: 'షుగర్ నియంత్రణకు మరియు జీర్ణక్రియకు ఎంతో మేలైన పాలిష్ చేయని కొర్రలు.',
    available: true,
    isFeatured: true,
    tags: ['millet', 'foxtail', 'korralu', 'diabetic-friendly', 'కొర్రలు'],
    source: 'dds_catalog_1',
    stockQuantity: 100,
  },
  {
    legacyId: 'prod-04',
    slNo: 4,
    sku: 'GVK-KODO-1KG',
    name: 'Kodo Millet',
    teluguName: 'అరికలు',
    category: 'millets',
    price: 130,
    originalPrice: 150,
    quantity: '1 kg',
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    description: 'Nutrient-dense unpolished Kodo Millet (Arikalu). Promotes cardiovascular wellness and weight management.',
    teluguDescription: 'గుండె ఆరోగ్యానికి, బరువు తగ్గుటకు తోడ్పడే సహజ అరికలు.',
    available: true,
    tags: ['millet', 'kodo', 'arikalu', 'heart-health', 'అరికలు'],
    source: 'dds_catalog_1',
    stockQuantity: 90,
  },
  {
    legacyId: 'prod-05',
    slNo: 5,
    sku: 'GVK-LITTLE-1KG',
    name: 'Little Millet',
    teluguName: 'సామలు',
    category: 'millets',
    price: 120,
    originalPrice: 135,
    quantity: '1 kg',
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?auto=format&fit=crop&w=600&q=80',
    description: 'Wholesome Little Millet (Samalu) grains. Light on the stomach and loaded with essential trace minerals.',
    teluguDescription: 'సులభంగా జీర్ణమయ్యే పోషకాల గని – స్వచ్ఛమైన సామలు.',
    available: true,
    tags: ['millet', 'little-millet', 'samalu', 'సామలు'],
    source: 'dds_catalog_1',
    stockQuantity: 110,
  },
  {
    legacyId: 'prod-06',
    slNo: 6,
    sku: 'GVK-BARNYARD-1KG',
    name: 'Barnyard Millet',
    teluguName: 'ఊదలు',
    category: 'millets',
    price: 130,
    originalPrice: 145,
    quantity: '1 kg',
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80',
    description: 'Fiber-rich unpolished Barnyard Millet (Udalu). Ideal for detoxification and diabetic nutrition.',
    teluguDescription: 'శరీర శుద్ధికి, షుగర్ లెవెల్స్ తగ్గించడానికి ఉపకరించే సహజ ఊదలు.',
    available: true,
    tags: ['millet', 'barnyard', 'udalu', 'fiber', 'ఊదలు'],
    source: 'dds_catalog_1',
    stockQuantity: 85,
  },
  {
    legacyId: 'prod-07',
    slNo: 7,
    sku: 'GVK-BROWNTOP-1KG',
    name: 'Browntop Millet',
    teluguName: 'అండు కొర్రలు',
    category: 'millets',
    price: 180,
    originalPrice: 200,
    quantity: '1 kg',
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80',
    description: 'Rare and powerful Browntop Millet (Andu Korralu). Highest dietary fiber content among all positive grains.',
    teluguDescription: 'అత్యధిక పీచు పదార్థం కలిగిన అరుదైన సిరిధాన్యం – అండు కొర్రలు.',
    available: true,
    isFeatured: true,
    tags: ['millet', 'browntop', 'andu-korralu', 'superfood', 'అండుకొర్రలు'],
    source: 'dds_catalog_1',
    stockQuantity: 60,
  },
  {
    legacyId: 'prod-15',
    slNo: 15,
    sku: 'GVK-BILONA-GHEE-500ML',
    name: 'Desi Cow A2 Cultured Bilona Ghee',
    teluguName: 'దేశీ నాటు ఆవు కవ్వపు నెయ్యి (బిలోనా గీ)',
    category: 'natural-dairy',
    price: 950,
    originalPrice: 1100,
    quantity: '500 ml',
    unit: '500 ml Glass Jar',
    image: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&w=600&q=80',
    description: 'Prepared using traditional Vedic 2-way wooden churner (Bilona) method from curd of pure free-grazing indigenous Gir & Sahiwal cows.',
    teluguDescription: 'సంప్రదాయ వేద పద్ధతిలో కవ్వంతో పెరుగును చిలికి తీసిన స్వచ్ఛమైన దేశీ నాటు ఆవు వెన్న నెయ్యి. బుద్ధి వికాసానికి, జీర్ణవ్యవస్థకు అమృతం.',
    available: true,
    isFeatured: true,
    isNaturalProduct: true,
    tags: ['dairy', 'ghee', 'bilona', 'desi-cow', 'a2', 'ayurvedic', 'నెయ్యి'],
    source: 'gvkss_palle_santha',
    stockQuantity: 75,
  },
  {
    legacyId: 'prod-16',
    slNo: 16,
    sku: 'GVK-HONEY-500G',
    name: 'Pure Raw Forest Honey (Wild Bee)',
    teluguName: 'స్వచ్ఛమైన అడవి తేనె',
    category: 'natural-dairy',
    price: 380,
    originalPrice: 450,
    quantity: '500 gm',
    unit: '500 gm Glass Bottle',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
    description: 'Unprocessed, unpasteurized natural honey collected from wild bees in Nallamala dense forests by tribal gatherers.',
    teluguDescription: 'నల్లమల అడవులలో సహజ సిద్ధంగా లభించే స్వచ్ఛమైన కల్తీ లేని తేనె. రోగనిరోధక శక్తికి సంజీవని.',
    available: true,
    isFeatured: true,
    isNaturalProduct: true,
    tags: ['honey', 'forest-honey', 'raw-honey', 'immunity', 'తేనె'],
    source: 'gvkss_palle_santha',
    stockQuantity: 120,
  },
  {
    legacyId: 'prod-20',
    slNo: 20,
    sku: 'GVK-OIL-GROUNDNUT-1L',
    name: 'Cold Pressed Groundnut Oil (Wood Pressed)',
    teluguName: 'కట్టె గానుగ పల్లి నూనె',
    category: 'oils',
    price: 240,
    originalPrice: 270,
    quantity: '1 Litre',
    unit: '1 Litre Bottle',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
    description: 'Slow extracted cold pressed peanut oil extracted on traditional wooden churner (Marachekku). Zero heat and zero chemicals.',
    teluguDescription: 'సంప్రదాయ కట్టె గానుగపై స్వచ్ఛంగా ఆడిన పల్లీ నూనె. సహజ రుచి మరియు ఘుమఘుమలు నిండిన ఆరోగ్యం.',
    available: true,
    isFeatured: true,
    tags: ['oil', 'cold-pressed', 'groundnut-oil', 'marachekku', 'నూనె'],
    source: 'dds_catalog_1',
    stockQuantity: 140,
  },
  {
    legacyId: 'prod-30',
    slNo: 30,
    sku: 'GVK-TOORDAL-1KG',
    name: 'Unpolished Native Toor Dal',
    teluguName: 'నాటు కందిపప్పు (పాలిష్ చేయనిది)',
    category: 'pulses',
    price: 195,
    originalPrice: 220,
    quantity: '1 kg',
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    description: 'Organically grown village toor dal cultivated by Sangham women without synthetic fertilizers or chemical polish.',
    teluguDescription: 'రసాయనాలు మరియు పాలిష్ లేని స్వచ్ఛమైన గ్రామీణ నాటు కందిపప్పు.',
    available: true,
    tags: ['pulses', 'dal', 'toor-dal', 'unpolished', 'కందిపప్పు'],
    source: 'dds_catalog_1',
    stockQuantity: 200,
  },
  {
    legacyId: 'prod-40',
    slNo: 40,
    sku: 'GVK-RICE-NAVARA-1KG',
    name: 'Medicinal Red Rice (Navara)',
    teluguName: 'నవార ఎర్ర బియ్యం (ఆయుర్వేద ఔషధ బియ్యం)',
    category: 'rice',
    price: 160,
    originalPrice: 190,
    quantity: '1 kg',
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1586201375763-48866e74f884?auto=format&fit=crop&w=600&q=80',
    description: 'Ayurvedic specialty medicinal rice renowned for internal healing, bone strengthening, and post-natal nutrition.',
    teluguDescription: 'కీళ్ల నొప్పులు మరియు రోగనిరోధక శక్తికి అమృతం లాంటి ఆయుర్వేద నవార బియ్యం.',
    available: true,
    isFeatured: true,
    tags: ['rice', 'navara', 'red-rice', 'medicinal', 'ఎర్రబియ్యం'],
    source: 'dds_catalog_1',
    stockQuantity: 90,
  },
  {
    legacyId: 'prod-50',
    slNo: 50,
    sku: 'GVK-SPROUTED-RAGI-FLOUR-500G',
    name: 'Sprouted Ragi Flour (Malted Finger Millet)',
    teluguName: 'మొలకెత్తిన రాగి పిండి',
    category: 'ready-to-cook',
    price: 90,
    originalPrice: 110,
    quantity: '500 gr',
    unit: '500 gr',
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80',
    description: 'Naturally sprouted and stone-ground malted finger millet flour. 300% higher bio-available iron and calcium.',
    teluguDescription: 'మొలకలు కట్టి ఎండబెట్టి ఆడించిన పోషకాల గని. పిల్లలు మరియు వృద్ధులకు అమృతతుల్యమైన ఆహారం.',
    available: true,
    isReadyToCook: true,
    isFeatured: true,
    tags: ['ready-to-cook', 'sprouted', 'ragi-malt', 'పిండి'],
    source: 'dds_catalog_1',
    stockQuantity: 180,
  },
  {
    legacyId: 'pack-7500',
    slNo: 99,
    sku: 'GVK-MONTHLY-PACK-42ITEMS',
    name: 'Complete Family Monthly Provision Pack (42 Items)',
    teluguName: 'సంపూర్ణ కుటుంబ నెలవారీ ప్రొవిజన్ ప్యాక్ (42 రకాలు)',
    category: 'millets',
    price: 7500,
    originalPrice: 8500,
    quantity: '46+ Kg & Litres',
    unit: '42 Items Box',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    description: 'An exhaustive, carefully curated monthly grocery bundle designed to cover all culinary and nutritional needs of a standard family for an entire month.',
    teluguDescription: 'ఒక కుటుంబానికి నెల మొత్తానికి సరిపడా అన్ని రకాల నిత్యావసరాలు, చిరుధాన్యాలు, నూనె, పప్పులు, మసాలాలు కలిగిన సంపూర్ణ ప్యాక్.',
    available: true,
    isFeatured: true,
    tags: ['monthly-pack', 'bundle', 'family-pack'],
    source: 'gvkss_palle_santha',
    stockQuantity: 40,
  },
];

export async function seedDatabase() {
  try {
    logger.info('Connecting to MongoDB for seeding...');
    await mongoose.connect(config.mongodbUri);
    logger.info('Connected to MongoDB.');

    // 1. Seed Roles & Permissions
    logger.info('Seeding Roles and Permissions...');
    const permissions = [
      { name: 'Read Orders', code: 'orders:read', module: 'orders', description: 'View orders' },
      { name: 'Write Orders', code: 'orders:write', module: 'orders', description: 'Manage order statuses' },
      { name: 'Verify Payments', code: 'payments:verify', module: 'payments', description: 'Confirm or reject UPI payments' },
      { name: 'Manage Products', code: 'products:write', module: 'products', description: 'Create and update products' },
      { name: 'Manage Inventory', code: 'inventory:write', module: 'inventory', description: 'Adjust stock quantities' },
      { name: 'Manage Settings', code: 'settings:write', module: 'settings', description: 'Update business settings' },
      { name: 'Manage Customers', code: 'customers:write', module: 'customers', description: 'Manage customer accounts' },
    ];

    const permDocs = [];
    for (const p of permissions) {
      const doc = await Permission.findOneAndUpdate({ code: p.code }, p, { upsert: true, new: true });
      permDocs.push(doc._id);
    }

    const roles = [
      { name: 'SUPER_ADMIN', displayName: 'Super Administrator', description: 'Full system control and configuration', permissions: permDocs },
      { name: 'ADMIN', displayName: 'Store Administrator', description: 'Manages catalog, orders, and business operations', permissions: permDocs },
      { name: 'PAYMENT_VERIFIER', displayName: 'Payment Verifier', description: 'Audits bank deposits and confirms/rejects UPI UTRs', permissions: permDocs.slice(2, 3) },
      { name: 'ORDER_MANAGER', displayName: 'Order Fulfillment Manager', description: 'Processes and ships customer consignments', permissions: permDocs.slice(0, 2) },
      { name: 'INVENTORY_MANAGER', displayName: 'Inventory Manager', description: 'Manages warehouse stocks and reorders', permissions: permDocs.slice(3, 5) },
    ];

    let superAdminRole: any;
    for (const r of roles) {
      const doc = await Role.findOneAndUpdate({ name: r.name as any }, r, { upsert: true, new: true });
      if (r.name === 'SUPER_ADMIN') superAdminRole = doc;
    }

    // 2. Seed Master Admin User
    logger.info('Seeding Master Admin User...');
    const adminPasswordHash = await bcrypt.hash(config.initialAdmin.password, 12);
    await Admin.findOneAndUpdate(
      { email: config.initialAdmin.email.toLowerCase() },
      {
        fullName: config.initialAdmin.name,
        email: config.initialAdmin.email.toLowerCase(),
        passwordHash: adminPasswordHash,
        role: superAdminRole._id,
        isMfaEnabled: false,
        status: 'active',
      },
      { upsert: true, new: true }
    );
    logger.info(`Master Admin ready: ${config.initialAdmin.email} / ${config.initialAdmin.password}`);

    // 3. Seed Sample Customer User
    logger.info('Seeding Sample Customer User...');
    const customerPasswordHash = await bcrypt.hash('CustomerSecure@2026!', 12);
    await User.findOneAndUpdate(
      { email: 'customer@gvkss.org' },
      {
        fullName: 'Prabhakar Reddy',
        email: 'customer@gvkss.org',
        passwordHash: customerPasswordHash,
        phone: '9391628344',
        isEmailVerified: true,
        status: 'active',
      },
      { upsert: true, new: true }
    );
    logger.info('Sample Customer ready: customer@gvkss.org / CustomerSecure@2026!');

    // 4. Seed Categories
    logger.info(`Seeding ${categoriesData.length} Categories...`);
    for (const cat of categoriesData) {
      await Category.findOneAndUpdate({ slug: cat.slug }, cat, { upsert: true, new: true });
    }

    // 5. Seed Products & Inventory
    logger.info(`Seeding ${productsData.length} Products and Inventory...`);
    for (const prod of productsData) {
      const slug = prod.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const productDoc = await Product.findOneAndUpdate(
        { sku: prod.sku },
        {
          ...prod,
          slug,
          status: 'active',
          isSoftDeleted: false,
        },
        { upsert: true, new: true }
      );

      await Inventory.findOneAndUpdate(
        { productId: productDoc._id },
        {
          productId: productDoc._id,
          sku: productDoc.sku,
          stockQuantity: prod.stockQuantity || 100,
          reservedQuantity: 0,
          minThreshold: 15,
        },
        { upsert: true, new: true }
      );
    }

    // 6. Seed Store Settings
    logger.info('Seeding Store Settings...');
    await StoreSettings.findOneAndUpdate(
      { singletonKey: 'DEFAULT_SETTINGS' },
      {
        singletonKey: 'DEFAULT_SETTINGS',
        businessNameEn: 'GVKSS - Go Vishwa Kalyana Voluntary Service Organization',
        businessNameTe: 'GVKSS గో విశ్వ కళ్యాణ స్వచ్ఛంద సేవా సంస్థ',
        businessUpiId: config.business.upiId,
        businessDisplayName: config.business.displayName,
        supportEmail: config.business.email,
        primaryPhone: config.business.phone,
        freeDeliveryThreshold: 1000,
        standardDeliveryFee: 50,
        isCodEnabled: true,
        codMinOrderAmount: 200,
        codMaxOrderAmount: 15000,
        isStoreAcceptingOrders: true,
        upiPaymentInstructions:
          'Scan this official UPI QR code with Google Pay, PhonePe, or Paytm, complete the payment, and submit the 12-digit UTR bank reference number below.',
      },
      { upsert: true, new: true }
    );

    logger.info('Database seeded successfully!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Execute if run directly
seedDatabase();
