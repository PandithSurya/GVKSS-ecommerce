export interface AdminCategoryOption {
  id: string;
  name: string;
  teluguName: string;
  icon?: string;
}

export const ADMIN_CATEGORIES: AdminCategoryOption[] = [
  { id: 'millets', name: 'Millets & Minor Grains', teluguName: 'చిరుధాన్యాలు (మిల్లెట్స్)' },
  { id: 'ready-to-cook', name: 'Ready to Cook', teluguName: 'రెడీ టు కుక్ ఉత్పత్తులు' },
  { id: 'ready-to-eat', name: 'Ready to Eat / Snacks', teluguName: 'రెడీ టు ఈట్ & స్నాక్స్' },
  { id: 'flours', name: 'Flours & Ravva', teluguName: 'పిండి రకాలు & రవ్వ' },
  { id: 'cold-pressed-oils', name: 'Wood-Pressed Oils', teluguName: 'గానుగ నూనెలు' },
  { id: 'a2-ghee-butter', name: 'Desi Cow A2 Ghee & Butter', teluguName: 'దేశీ ఆవు నెయ్యి & వెన్న' },
  { id: 'natural-sweeteners', name: 'Natural Sweeteners & Jaggery', teluguName: 'బెల్లం & సహజ తీపి పదార్థాలు' },
  { id: 'spices-salts', name: 'Traditional Spices & Rock Salt', teluguName: 'సాంప్రదాయ మసాలాలు & రాతి ఉప్పు' },
  { id: 'forest-honey', name: 'Wild Forest Honey', teluguName: 'స్వచ్ఛమైన కొండ తేనె' },
  { id: 'herbal-eco', name: 'Herbal & Ayurvedic Care', teluguName: 'ఆయుర్వేద & మూలికా సంరక్షణ' },
  { id: 'sweets-snacks', name: 'Organic Traditional Sweets', teluguName: 'స్వచ్ఛమైన సంప్రదాయ మిఠాయిలు' },
  { id: 'natural-dairy', name: 'Desi Cow Dairy & Honey', teluguName: 'దేశీవాళి ఆవు పాలు, నెయ్యి & తేనె' },
];
