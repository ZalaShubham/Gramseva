const fs = require('fs');
const path = require('path');

const additions = {
  en: {
    metadata: {
      title: 'Gramseva - SC/ST Community Empowerment Platform',
      description: 'Empowering Scheduled Caste and Scheduled Tribe citizens with transparent representative tracking, affirmative jobs, education scholarships, and verified matrimony.'
    },
    common: {
      digitalPublicGood: 'Digital Public Good',
      level0Public: 'Level 0 Public',
      level2Verified: 'Level 2 Verified',
      scStQuotas: 'SC/ST Quotas',
      directBenefits: 'Direct Benefits',
      activeSession: 'Active Session',
      devLoginLabel: 'Dev Login:',
      openCommunityDatasets: 'Open Community Datasets',
      electedRepresentatives: 'Elected Representatives',
      affirmativeJobs: 'Affirmative Jobs',
      welfareScholarships: 'Welfare Scholarships',
      totalCount: '{count} Total',
      worksCount: '{count} Works',
      scStQuota: 'SC/ST Quota',
      communityReserved: '{community} Reserved',
      scAndSt: 'SC & ST',
      national: 'National',
      guestVisitor: 'Guest Visitor',
      visitorRole: 'VISITOR',
      verifiedMembersOnly: 'Verified members only',
      level2Required: 'Level 2 clearance required',
      communitySafeguards: 'Community Safeguards',
      systemHealthUptime: 'System Health & Uptime',
      governancePolicies: 'Governance & Policies',
      communityVouching: 'Community Vouching Guidelines'
    },
    nav: {
      health: 'Health Check Status'
    },
    devLogin: {
      tempSwitcher: 'Temporary Dev Switcher',
      cookieNotice: 'Signs in via session cookie without OTP/password.',
      guestVisitorNoLogin: 'Guest Visitor (No Login)',
      publicBrowsingOnly: 'Level 0 • Public browsing only',
      devOnly: 'Visible only when NODE_ENV=development'
    },
    health: {
      subtitle: 'Realtime platform telemetry, environment status, and authorization diagnostics.',
      allOperational: 'All Phase 0 subsystems functioning normally',
      dbDesc: 'Prisma Schema initialized with 29 models & relations',
      appRouter: 'Next.js App Router (Turbopack)',
      i18nConfig: 'i18n Configuration',
      i18nDesc: 'Strict key validation (0 hardcoded strings)',
      authSession: 'Active Auth Session'
    }
  },
  gu: {
    metadata: {
      title: 'ગ્રામસેવા - SC/ST સમુદાય સશક્તિકરણ મંચ',
      description: 'જનપ્રતિનિધિઓના કાર્યોની પારદર્શિતા, અનામત રોજગાર, શિષ્યવૃત્તિ અને મેટ્રિમોનિયલ સેવાઓ સાથે SC અને ST નાગરિકોનું સશક્તિકરણ.'
    },
    common: {
      digitalPublicGood: 'ડિજિટલ પબ્લિક ગુડ',
      level0Public: 'સ્તર ૦ જાહેર',
      level2Verified: 'સ્તર ૨ પ્રમાણિત',
      scStQuotas: 'SC/ST અનામત',
      directBenefits: 'સીધા લાભો',
      activeSession: 'સક્રિય સત્ર',
      devLoginLabel: 'ડેવ લૉગિન:',
      openCommunityDatasets: 'ખુલ્લા સમુદાય ડેટાસેટ્સ',
      electedRepresentatives: 'ચૂંટાયેલા પ્રતિનિધિઓ',
      affirmativeJobs: 'સકારાત્મક નોકરીઓ',
      welfareScholarships: 'કલ્યાણકારી શિષ્યવૃત્તિઓ',
      totalCount: 'કુલ {count}',
      worksCount: '{count} કાર્યો',
      scStQuota: 'SC/ST અનામત',
      communityReserved: '{community} અનામત',
      scAndSt: 'SC અને ST',
      national: 'રાષ્ટ્રીય',
      guestVisitor: 'મુલાકાતી',
      visitorRole: 'મુલાકાતી',
      verifiedMembersOnly: 'માત્ર પ્રમાણિત સભ્યો માટે',
      level2Required: 'સ્તર ૨ પ્રમાણીકરણ જરૂરી',
      communitySafeguards: 'સમુદાય સુરક્ષા કવચ',
      systemHealthUptime: 'સિસ્ટમ હેલ્થ અને અપટાઇમ',
      governancePolicies: 'શાસન અને નીતિઓ',
      communityVouching: 'સમુદાય સમર્થન માર્ગદર્શિકા'
    },
    nav: {
      health: 'સિસ્ટમ હેલ્થ સ્થિતિ'
    },
    devLogin: {
      tempSwitcher: 'કામચલાઉ ડેવ સ્વિચર',
      cookieNotice: 'OTP/પાસવર્ડ વગર સેશન કૂકી દ્વારા સાઇન-ઇન કરે છે.',
      guestVisitorNoLogin: 'મુલાકાતી (લૉગિન વગર)',
      publicBrowsingOnly: 'સ્તર ૦ • માત્ર જાહેર બ્રાઉઝિંગ',
      devOnly: 'માત્ર NODE_ENV=development હોય ત્યારે જ દેખાય છે'
    },
    health: {
      subtitle: 'રીઅલ-ટાઇમ પ્લેટફોર્મ ટેલિમેટ્રી, સિસ્ટમ સ્થિતિ અને ઓથોરાઇઝેશન નિદાન.',
      allOperational: 'તમામ ફેઝ ૦ સબસિસ્ટમ્સ સામાન્ય રીતે કાર્યરત છે',
      dbDesc: 'પ્રિઝ્મા સ્કીમા ૨૯ મોડલ્સ અને સંબંધો સાથે સક્રિય થયેલ છે',
      appRouter: 'Next.js એપ રાઉટર (Turbopack)',
      i18nConfig: 'ભાષા રૂપરેખાંકન (i18n)',
      i18nDesc: 'ચુસ્ત કી માન્યતા (૦ હાર્ડકોડેડ ટેક્સ્ટ)',
      authSession: 'સક્રિય ઓથ સત્ર'
    }
  },
  hi: {
    metadata: {
      title: 'ग्रामसेवा - SC/ST समुदाय सशक्तिकरण मंच',
      description: 'जनप्रतिनिधियों के कार्यों की पारदर्शिता, आरक्षित रोज़गार, छात्रवृत्ति और वैवाहिक सेवाओं के माध्यम से SC एवं ST नागरिकों का सशक्तिकरण.'
    },
    common: {
      digitalPublicGood: 'डिजिटल पब्लिक गुड',
      level0Public: 'स्तर ० सार्वजनिक',
      level2Verified: 'स्तर २ सत्यापित',
      scStQuotas: 'SC/ST आरक्षण कोटा',
      directBenefits: 'प्रत्यक्ष लाभ',
      activeSession: 'सक्रिय सत्र',
      devLoginLabel: 'डेव लॉगिन:',
      openCommunityDatasets: 'खुले सामुदायिक डेटासेट',
      electedRepresentatives: 'निर्वाचित जनप्रतिनिधि',
      affirmativeJobs: 'सकारात्मक रोज़गार',
      welfareScholarships: 'कल्याणकारी छात्रवृत्तियां',
      totalCount: 'कुल {count}',
      worksCount: '{count} कार्य',
      scStQuota: 'SC/ST कोटा',
      communityReserved: '{community} आरक्षित',
      scAndSt: 'SC एवं ST',
      national: 'राष्ट्रीय',
      guestVisitor: 'अतिथि आगंतुक',
      visitorRole: 'आगंतुक',
      verifiedMembersOnly: 'केवल सत्यापित सदस्यों के लिए',
      level2Required: 'स्तर २ प्रमाणीकरण आवश्यक',
      communitySafeguards: 'सामुदायिक सुरक्षा',
      systemHealthUptime: 'सिस्टम स्थिति एवं अपटाइम',
      governancePolicies: 'प्रशासन एवं नीतियां',
      communityVouching: 'सामुदायिक समर्थन दिशानिर्देश'
    },
    nav: {
      health: 'सिस्टम स्थिति जांच'
    },
    devLogin: {
      tempSwitcher: 'अस्थायी डेव स्विचर',
      cookieNotice: 'OTP/पासवर्ड के बिना सत्र कुकी के माध्यम से साइन इन करता है.',
      guestVisitorNoLogin: 'अतिथि आगंतुक (बिना लॉगिन)',
      publicBrowsingOnly: 'स्तर ० • केवल सार्वजनिक ब्राउज़िंग',
      devOnly: 'केवल NODE_ENV=development होने पर ही दिखाई देता है'
    },
    health: {
      subtitle: 'रीयल-टाइम प्लेटफॉर्म टेलीमेट्री, सिस्टम स्थिति एवं प्रमाणीकरण डायग्नोस्टिक्स.',
      allOperational: 'सभी चरण ० उपप्रणालियां सामान्य रूप से कार्यरत हैं',
      dbDesc: 'प्रिज्मा स्कीमा २९ मॉडल्स एवं संबंधों के साथ सक्रिय है',
      appRouter: 'Next.js ऐप राउटर (Turbopack)',
      i18nConfig: 'भाषा विन्यास (i18n)',
      i18nDesc: 'सख्त कुंजी सत्यापन (० हार्डकोडेड स्ट्रिंग्स)',
      authSession: 'सक्रिय ऑथ सत्र'
    }
  }
};

function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object && !Array.isArray(source[key])) {
      if (!target[key]) Object.assign(target, { [key]: {} });
      deepMerge(target[key], source[key]);
    } else {
      Object.assign(target, { [key]: source[key] });
    }
  }
  return target;
}

for (const lang of ['en', 'gu', 'hi']) {
  const filePath = path.join(__dirname, '..', 'messages', lang + '.json');
  const existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const updated = deepMerge(existing, additions[lang]);
  fs.writeFileSync(filePath, JSON.stringify(updated, null, 2) + '\n', 'utf8');
  console.log('Updated ' + filePath);
}
