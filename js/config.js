/**
 * Pari Publicity - Official Configuration File
 * ================================================================
 * Verified Google Business Profile Information
 * Owner: Anoop Jain
 * Phone / WhatsApp: +91 97558 12374
 * Address: Near Rakesh Mavai Koti, Futi Puliya, Ganeshpura, Morena, MP 476001
 * ================================================================
 */

const PARI_CONFIG = {
  // Brand Details
  brandName: "Pari Publicity",
  hindiBrandName: "परी पब्लिसिटी",
  ownerName: "Anoop Jain",
  ownerTitle: "Founder & Director",
  tagline: "VISIBILITY, IMPACT, GROWTH",
  hindiTagline: "विजिबिलिटी • इम्पैक्ट • ग्रोथ",
  trustLine: "Creative Design • Quality Printing • Powerful Visibility",
  
  // Official Location
  city: "Morena",
  area: "Ganeshpura, Futi Puliya",
  state: "Madhya Pradesh",
  pincode: "476001",
  fullAddress: "Near Rakesh Mavai Koti, Futi Puliya, Ganeshpura, Morena, Madhya Pradesh - 476001",
  addressLandmark: "Near Rakesh Mavai Koti, Futi Puliya",
  
  // Official Verified Contact Details
  phoneDisplay: "+91 97558 12374",
  phoneTel: "+919755812374",
  secondaryPhoneDisplay: "097558 12374",
  secondaryPhoneTel: "+919755812374",
  
  // WhatsApp Configuration
  whatsappNumber: "919755812374", // International format without +
  whatsappDisplay: "+91 97558 12374",
  whatsappDefaultMsg: "Namaste Anoop ji / Pari Publicity! I need a quote for printing and advertising services in Morena.",
  
  // Email & Online
  email: "contact@paripublicity.in",
  secondaryEmail: "paripublicity15@gmail.com",
  websiteUrl: "https://paripublicity.in",
  
  // Operating Hours (From Verified Google Business Profile)
  businessHours: {
    weekdays: "Mon - Sat: 10:00 AM - 8:00 PM",
    sunday: "Sunday: On Call / Urgent Orders",
    fullDisplay: "Mon - Sat: 10:00 AM - 8:00 PM | Sun: On Call"
  },
  
  // Official Google Business Description
  officialDescription: "Pari Publicity, positioned near the heart of Morena, Madhya Pradesh, stands tall as a leading advertising agency in the region. They specialize in Flex Banner Printing, Hoarding, Vinyl, and Star Flex Banners. Their forte extends to the creation of brochures, flyers, posters, logos, and banners. The team at Pari Publicity understands the significance of a strong brand identity, and thus, offers impeccable logo design services. Their commitment to delivering eye-catching and impactful promotional materials has garnered them a reputation for excellence within Morena's business community.",

  // Google Maps Coordinates & Embed
  // Morena Ganeshpura / Futi Puliya
  mapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14298.654319488346!2d77.98901235123912!3d26.50152439120938!2m3!1f0!2f0!3f0!3m2!1i1024!2f768!4f13.1!3m3!1m2!1s0x3973ddff0c81dbab%3A0x1c3faee8bbd9124!2sGaneshpura%2C%20Morena%2C%20Madhya%20Pradesh%20476001!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
  mapsDirectionUrl: "https://www.google.com/maps/search/?api=1&query=Pari+Publicity+Near+Rakesh+Mavai+Koti+Futi+Puliya+Ganeshpura+Morena+Madhya+Pradesh+476001",
  
  // Verified Social Media Links
  socialLinks: {
    instagram: "https://www.instagram.com/paripublicity.in/",
    facebook: "https://www.facebook.com/publicitypari15",
    whatsappChannel: "https://wa.me/919755812374",
    youtube: "https://youtube.com/@paripublicity",
    googleBusiness: "https://www.google.com/search?q=pari+publicity+morena"
  },

  // Key Agency Highlights
  stats: [
    { label: "Years in Morena", value: 10, suffix: "+", hindi: "विश्वसनीय अनुभव" },
    { label: "Projects Completed", value: 1500, suffix: "+", hindi: "सफल प्रोजेक्ट्स" },
    { label: "Satisfied Clients", value: 650, suffix: "+", hindi: "संतुष्ट व्यापारी व ब्रांड्स" },
    { label: "In-House Setup", value: 100, suffix: "%", hindi: "स्वयं की प्रिंटिंग मशीनें" }
  ],

  // Interactive Estimator Standard Base Rates
  rates: {
    flexBannerPerSqFt: 12,
    starFlexPerSqFt: 22,
    vinylPrintPerSqFt: 35,
    glowSignBoardPerSqFt: 140,
    visitingCardsPer1000: 450,
    pamphletsPer1000: 350
  }
};

// Export to window for browser use
if (typeof window !== "undefined") {
  window.PARI_CONFIG = PARI_CONFIG;
}
