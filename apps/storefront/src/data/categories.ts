import { Category } from '../types';

export const categories: Category[] = [
  {
    id: 'millets',
    name: 'Millets & Minor Grains',
    teluguName: 'చిరుధాన్యాలు (మిల్లెట్స్)',
    icon: 'Wheat',
    description: 'Indigenous unpolished millets: Ragi, Jowar, Korralu, Samalu, Arikalu, and Yavvalu.',
    teluguDescription: 'స్వచ్ఛమైన సాంప్రదాయ చిరుధాన్యాలు: రాగులు, జొన్నలు, కొర్రలు, సామలు, అరికలు.',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    badge: 'Ancient Grains',
    benefitEn: 'Low GI • Best for Diabetes, BP & Daily Energy',
    benefitTe: 'షుగర్, బీపీ నియంత్రణ & బరువు నియంత్రణకు ఉత్తమం'
  },
  {
    id: 'ready-to-cook',
    name: 'Ready to Cook',
    teluguName: 'రెడీ టు కుక్ ఉత్పత్తులు',
    icon: 'Utensils',
    description: 'Sprouted flours, millet semiya, instant khichdi & pongal mixes, and papads.',
    teluguDescription: 'మొలకెత్తిన రాగి పిండి, మిల్లెట్ సేమియా, కిచిడి & పొంగల్ మిక్స్, అప్పడాలు.',
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80',
    badge: 'Quick & Healthy',
    benefitEn: 'High Bio-Enzymes • 5-Min Nutritious Breakfast',
    benefitTe: 'జీర్ణక్రియకు సులువైన పోషకాలతో కూడిన అల్పాహారం'
  },
  {
    id: 'ready-to-eat',
    name: 'Ready to Eat / Snacks',
    teluguName: 'రెడీ టు ఈట్ & స్నాక్స్',
    icon: 'Cookie',
    description: 'Crispy millet murukulu, savory mixtures, nachos, and traditional chakralu.',
    teluguDescription: 'కరకరలాడే జొన్న, రాగి మురుకులు, మిక్చర్, నాచోస్, చక్రాలు.',
    image: 'https://images.unsplash.com/photo-1599481238640-4c1288750d7a?auto=format&fit=crop&w=600&q=80',
    badge: 'No Palm Oil',
    benefitEn: 'Zero Palm Oil & Maida • Wholesome Tea-time Crunch',
    benefitTe: 'పామాయిల్, మైదా లేని సంప్రదాయ పిండివంటలు'
  },
  {
    id: 'flours',
    name: 'Flours & Ravva',
    teluguName: 'పిండి రకాలు & రవ్వ',
    icon: 'Package',
    description: 'Stone ground Ragi, Jowar, Multi Millet, Buckwheat flours and fresh coarse ravva.',
    teluguDescription: 'రాతి గానుగపై ఆడించిన రాగి, జొన్న, గోధుమ పిండి మరియు రవ్వ రకాలు.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    badge: 'Stone Ground',
    benefitEn: 'Stone-Ground Cold Milling • Retains Natural Fiber & Calcium',
    benefitTe: 'సహజ ఫైబర్, కాల్షియం నిండిన రాతి పిండి'
  },
  {
    id: 'natural-dairy',
    name: 'Desi Cow Dairy & Honey',
    teluguName: 'దేశీవాళి ఆవు పాలు, నెయ్యి & తేనె',
    icon: 'Milk',
    description: 'Pure Desi Cow A2 Milk, Curd, Bilona Ghee, Raw Forest Honey, and Free-Range Eggs.',
    teluguDescription: 'దేశీ నాటు ఆవు A2 పాలు, పెరుగు, స్వచ్ఛమైన నెయ్యి, అడవి తేనె, నాటు కోడిగుడ్లు.',
    image: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&w=600&q=80',
    badge: '100% Pure Desi',
    benefitEn: 'Vedic A2 Nutrition • Gut Health, Brain Power & Immunity',
    benefitTe: 'జీర్ణక్రియ, మెదడు చురుకుదనం & రోగనిరోధక శక్తికి'
  },
  {
    id: 'oils',
    name: 'Wood Pressed Oils',
    teluguName: 'ఎద్దు గానుగ / చెక్క గానుగ నూనెలు',
    icon: 'Droplet',
    description: 'Unrefined cold extracted Groundnut and Safflower oils with pure aroma.',
    teluguDescription: 'ఎద్దు గానుగ / చెక్క గానుగ ద్వారా సహజంగా తీసిన పల్లి మరియు కుసుమ నూనెలు.',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
    badge: 'Cold Extracted',
    benefitEn: 'Bull-Driven Zero Heat Extraction • Heart Friendly HDL',
    benefitTe: 'కొలెస్ట్రాల్ లేని సహజ గానుగ నూనె – గుండెకు రక్ష'
  },
  {
    id: 'pulses',
    name: 'Pulses & Dals',
    teluguName: 'పప్పు ధాన్యాలు',
    icon: 'CircleDot',
    description: 'Unpolished chemical-free Redgram, Moong, Urad, Horse Gram, and Bengal Gram.',
    teluguDescription: 'రసాయన రహిత స్వచ్ఛమైన కందిపప్పు, పెసరపప్పు, మినపప్పు, ఉలవలు.',
    image: 'https://images.unsplash.com/photo-1585994192701-f1a505c817ea?auto=format&fit=crop&w=600&q=80',
    badge: 'Unpolished',
    benefitEn: 'Unpolished Pure Protein • High Digestibility & Iron',
    benefitTe: 'సహజ ప్రొటీన్లు & ఐరన్ నిండిన పాలిష్ లేని పప్పులు'
  },
  {
    id: 'spices',
    name: 'Spices, Podis & Seeds',
    teluguName: 'సుగంధ ద్రవ్యాలు, కారం పొడులు',
    icon: 'Flame',
    description: 'Natural turmeric, red chilli, flax seeds, sesame seeds, coriander, and podis.',
    teluguDescription: 'స్వచ్ఛమైన పసుపు, ధనియాలు, అవిశలు, నువ్వులు, సంప్రదాయ కారం పొడులు.',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
    badge: 'High Curcumin',
    benefitEn: 'High Curcumin & Natural Antioxidants • Authentic Telugu Aromas',
    benefitTe: 'రోగనిరోధక సహజ పసుపు & సంప్రదాయ కారం పొడులు'
  },
  {
    id: 'sweets-snacks',
    name: 'Sweets & Cup Cakes',
    teluguName: 'మిల్లెట్ స్వీట్స్ & కేకులు',
    icon: 'Sparkles',
    description: 'Jaggery & honey cup cakes, Nuvvula Laddus, Groundnut Laddus, Garijalu, and Jaggery.',
    teluguDescription: 'బెల్లం & తేనెతో చేసిన కప్ కేకులు, నువ్వుల లడ్డు, పల్లి ఉండలు, గరిజలు, బెల్లం.',
    image: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?auto=format&fit=crop&w=600&q=80',
    badge: 'No White Sugar',
    benefitEn: '100% Desi Jaggery & Honey • Healthy Kids Treats without White Sugar',
    benefitTe: 'పంచదార లేని స్వచ్ఛమైన బెల్లం, తేనె స్వీట్లు'
  },
  {
    id: 'herbal-eco',
    name: 'Herbal, Cow & Eco Products',
    teluguName: 'మూలికలు, గోమయ & సహజ ఉత్పత్తులు',
    icon: 'Leaf',
    description: 'Soapnuts liquid, herbal shampoo, Moringa powder, Palash leaf plates, Dhoop & Gomaya items.',
    teluguDescription: 'కుంకుడుకాయల లిక్విడ్, షాంపూ, మునగాకు పొడి, మోదుగ విస్తరాకులు, గోమయ పిడకలు.',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
    badge: 'Eco Friendly',
    benefitEn: 'Chemical-Free Living • Panchagavya & Non-Toxic Home Wellness',
    benefitTe: 'రసాయన రహిత సహజ సంప్రదాయ జీవన ఉత్పత్తులు'
  }
];
