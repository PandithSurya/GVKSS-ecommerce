import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  Globe
} from 'lucide-react';
import { businessInfo } from '../../data/businessInfo';
import { useLanguage } from '../../context/LanguageContext';

export const ContactView: React.FC = () => {
  const { language, t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-10 bg-transparent min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Banner */}
        <div className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-12 relative overflow-hidden shadow-xl border-b-4 border-emerald-600">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800 text-emerald-200 border border-emerald-700 text-xs font-bold">
              <Phone className="w-4 h-4 text-emerald-300" />
              <span>
                {language === 'te'
                  ? 'కస్టమర్ కేర్ & హోమ్ డెలివరీ'
                  : 'Customer Support & Dispatch'}
              </span>
            </div>

            <h1 className="font-sans font-black text-2xl sm:text-4xl lg:text-5xl leading-tight">
              {t.nav.contact}
            </h1>

            <p className="text-emerald-100/80 text-xs sm:text-base leading-relaxed">
              {language === 'te'
                ? 'సేంద్రీయ ఉత్పత్తుల ఆర్డర్ల కొరకు మరియు హోమ్ డెలివరీ కోసం మమ్మల్ని నేరుగా సంప్రదించండి.'
                : 'Get in touch for home delivery bookings, bulk provision packages, or visit our local Hyderabad stores.'}
            </p>
          </div>
        </div>

        {/* Store Locations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {businessInfo.locations.map((loc, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-100 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="font-sans font-bold text-base sm:text-lg text-stone-900">
                  {language === 'te' ? loc.titleTe : loc.titleEn}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {language === 'te' ? loc.addressTe : loc.addressEn}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-50 text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                <span>✓ Verified Store Location</span>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming Branches Banner */}
        <div className="p-6 bg-emerald-50/70 rounded-3xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
              {language === 'te' ? 'త్వరలో ప్రారంభం' : 'Coming Soon'}
            </span>
            <h4 className="font-sans font-bold text-base sm:text-lg text-stone-900">
              {language === 'te'
                ? 'త్వరలో జూబ్లీహిల్స్, కూకట్‌పల్లి, అమీర్‌పేట్ లలో మా బ్రాంచీలు ప్రారంభించబడును.'
                : 'New Branch Outlets Opening Soon in Jubilee Hills, Kukatpally & Ameerpet, Hyderabad!'}
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {businessInfo.upcomingBranches.map((b, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-full bg-white text-xs font-bold text-emerald-900 border border-emerald-200 shadow-sm"
              >
                {language === 'te' ? b.nameTe : b.nameEn}
              </span>
            ))}
          </div>
        </div>

        {/* Contact Form & Phone Directory */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Direct Dial Directory */}
          <div className="lg:col-span-5 bg-emerald-950 text-white p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl">
            <div>
              <h3 className="font-sans font-bold text-xl text-white">
                {language === 'te' ? 'సంప్రదించే ఫోన్ నంబర్లు' : 'Phone Directory'}
              </h3>
              <p className="text-xs text-emerald-200/80 mt-1">
                Direct helpline numbers for quick orders and questions
              </p>
            </div>

            <div className="space-y-3">
              {businessInfo.phones.map((phone, idx) => (
                <a
                  key={idx}
                  href={`tel:${phone.number}`}
                  className="p-3.5 rounded-2xl bg-emerald-900/90 border border-emerald-800 hover:border-emerald-500 transition flex items-center justify-between group"
                >
                  <div>
                    <span className="text-[11px] text-emerald-300 font-medium block">
                      {phone.label}
                    </span>
                    <span className="font-bold text-sm text-white group-hover:text-emerald-200">
                      {phone.number}
                    </span>
                  </div>
                  <Phone className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>

            <div className="pt-4 border-t border-emerald-900 space-y-2 text-xs text-emerald-200/80">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>{businessInfo.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>{businessInfo.website}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>8:00 AM – 8:30 PM (All 7 Days)</span>
              </div>
            </div>
          </div>

          {/* Contact Inquiry Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-sm">
            <h3 className="font-sans font-black text-xl text-stone-900 mb-1">
              {language === 'te' ? 'మాకు సందేశం పంపండి' : 'Send an Inquiry / Message'}
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              Fill the form below and our team will get back to you promptly.
            </p>

            {submitted ? (
              <div className="p-8 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3 animate-fadeIn">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="font-sans font-bold text-lg text-emerald-950">
                  Thank You for Reaching Out!
                </h4>
                <p className="text-xs text-emerald-800 max-w-sm mx-auto">
                  We have received your message. Prabhakar Reddy and our dispatch team will contact you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2.5 rounded-full bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="e.g. Anand"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="e.g. 9391628344"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Subject / Product Interested In
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={e =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    placeholder="e.g. Monthly Provision Pack or Wood-pressed oils"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Message / Address
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={e =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Tell us what you would like to order or ask..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="py-3.5 px-7 rounded-full bg-emerald-600 text-white font-bold text-xs sm:text-sm hover:bg-emerald-700 transition flex items-center justify-center gap-2 shadow-green-glow"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
