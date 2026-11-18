export interface SeedUser {
  id: string;
  phone: string;
  email: string;
  name: string;
  role: "USER" | "POLITICIAN" | "EMPLOYER" | "MODERATOR" | "ADMIN";
  level: 0 | 1 | 2;
  community?: "SC" | "ST" | null;
  subCaste?: string | null;
  state: string;
  district: string;
  isPhoneVerified: boolean;
  verifiedAt?: string | null;
  titleBadge: string;
}

export interface SeedRelationType {
  code: string;
  nameEn: string;
  nameGu: string;
  nameHi: string;
  inverseRelationCode?: string;
  isSymmetric: boolean;
}

export interface SeedPolitician {
  id: string;
  userId: string;
  name: string;
  constituency: string;
  constituencyType: string;
  party: string;
  designation: string;
  state: string;
  district: string;
  reservedSeat: boolean;
  termStart: string;
  termEnd: string;
  bio: string;
  officeAddress: string;
  contactEmail: string;
  contactPhone: string;
  bannerUrl: string;
  isVerified: boolean;
  worksCount: number;
}

export interface SeedEmployer {
  id: string;
  userId: string;
  companyName: string;
  industry: string;
  companySize?: string;
  website?: string;
  logoUrl?: string;
  verifiedCompany: boolean;
  isApproved: boolean;
  state: string;
  city: string;
  address?: string;
}

export interface SeedJob {
  id: string;
  title: string;
  employerName: string;
  employerId?: string;
  organizationName?: string;
  category: string;
  sector?: "GOVERNMENT" | "PRIVATE" | "PSU";
  jobType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | "GOVERNMENT";
  workplaceType: "ON_SITE" | "HYBRID" | "REMOTE";
  qualification?: string;
  quota?: "SC" | "ST" | "GENERAL" | "ALL";
  ageRelaxation?: string;
  minAge?: number;
  maxAge?: number;
  state: string;
  district: string;
  city: string;
  minSalary?: number;
  maxSalary?: number;
  isReservedForScSt: boolean;
  targetCommunity?: "SC" | "ST" | null;
  vacancies: number;
  deadline: string;
  description: string;
  requirements?: string;
  howToApplySteps?: string[];
  officialUrl?: string;
  sourceUrl?: string;
  syllabusUrl?: string;
  admitCardUrl?: string;
  resultUrl?: string;
  isExternal?: boolean;
  status?: "ACTIVE" | "EXPIRED" | "ARCHIVED" | "PENDING_APPROVAL";
  isActive?: boolean;
}

export interface SeedScholarship {
  id: string;
  title: string;
  provider: string;
  educationLevel?: string;
  category: "PRE_MATRIC" | "POST_MATRIC" | "HIGHER_STUDY" | "ABROAD" | "COACHING" | "HOSTEL";
  course?: string;
  classLevel?: string;
  community?: "SC" | "ST" | null;
  awardAmount: number;
  deadline: string;
  state?: string | null;
  isNational: boolean;
  minPercentage?: number;
  maxFamilyIncome?: number;
  description: string;
  applicationUrl: string;
  sourceUrl: string;
  howToApplySteps: string[];
  documentsRequired: string[];
  commonRejectionReasons: string[];
  lastVerifiedAt: string;
  eligibilityCriteria?: string;
  status: "OPEN" | "CLOSED" | "UPCOMING";
}

export const SEED_TEST_USERS: SeedUser[] = [
  {
    id: "user-visitor-001",
    phone: "+919800000000",
    email: "visitor@gramseva.dev",
    name: "Guest Visitor",
    role: "USER",
    level: 0,
    community: null,
    subCaste: null,
    state: "Gujarat",
    district: "Ahmedabad",
    isPhoneVerified: false,
    verifiedAt: null,
    titleBadge: "Level 0 Visitor (Public Access Only)",
  },
  {
    id: "user-otp-002",
    phone: "+919800000001",
    email: "ramesh.solanki@gramseva.dev",
    name: "Ramesh Solanki",
    role: "USER",
    level: 1,
    community: "SC",
    subCaste: "Vankar",
    state: "Gujarat",
    district: "Ahmedabad",
    isPhoneVerified: true,
    verifiedAt: null,
    titleBadge: "Level 1 Citizen (Phone OTP Verified)",
  },
  {
    id: "user-verified-003",
    phone: "+919800000002",
    email: "pravin.parmar@gramseva.dev",
    name: "Pravin Parmar",
    role: "USER",
    level: 2,
    community: "SC",
    subCaste: "Rohit",
    state: "Gujarat",
    district: "Gandhinagar",
    isPhoneVerified: true,
    verifiedAt: "2026-01-15T00:00:00.000Z",
    titleBadge: "Level 2 Citizen (Full SC/ST Verified)",
  },
  {
    id: "user-pol-004",
    phone: "+919800000003",
    email: "mla.vaghela@gramseva.dev",
    name: "Dr. Kantilal Vaghela",
    role: "POLITICIAN",
    level: 2,
    community: "SC",
    subCaste: "Meghwal",
    state: "Gujarat",
    district: "Ahmedabad",
    isPhoneVerified: true,
    verifiedAt: "2025-06-01T00:00:00.000Z",
    titleBadge: "Elected Representative (Politician Role)",
  },
  {
    id: "user-emp-005",
    phone: "+919800000004",
    email: "pooja.recruiter@gramseva.dev",
    name: "Pooja Rathod",
    role: "EMPLOYER",
    level: 1,
    community: "ST",
    subCaste: "Bhil",
    state: "Gujarat",
    district: "Vadodara",
    isPhoneVerified: true,
    verifiedAt: null,
    titleBadge: "Corporate Recruiter (Employer Role)",
  },
  {
    id: "user-admin-006",
    phone: "+919800000005",
    email: "admin@gramseva.dev",
    name: "Bharat Gamit",
    role: "ADMIN",
    level: 2,
    community: "ST",
    subCaste: "Gamit",
    state: "Gujarat",
    district: "Surat",
    isPhoneVerified: true,
    verifiedAt: "2025-01-01T00:00:00.000Z",
    titleBadge: "Platform Administrator (Full Permissions)",
  },
];

export const SEED_EMPLOYERS: SeedEmployer[] = [
  {
    id: "emp-001",
    userId: "user-emp-005",
    companyName: "Ashoka Tech Solutions",
    industry: "Information Technology",
    companySize: "50-200",
    website: "https://ashokatech.example.org",
    verifiedCompany: true,
    isApproved: true,
    state: "Gujarat",
    city: "Ahmedabad",
    address: "SG Highway, Bodakdev, Ahmedabad",
  },
  {
    id: "emp-002",
    userId: "user-unapproved-emp",
    companyName: "Surat Textile Innovations Ltd",
    industry: "Manufacturing & Textiles",
    companySize: "100-500",
    website: "https://surattextiles.example.org",
    verifiedCompany: false,
    isApproved: false,
    state: "Gujarat",
    city: "Surat",
    address: "Ring Road, Surat",
  },
];

export const SEED_RELATION_TYPES: SeedRelationType[] = [
  {
    code: "FATHER",
    nameEn: "Father",
    nameGu: "પિતા (Father)",
    nameHi: "पिता (Father)",
    inverseRelationCode: "SON",
    isSymmetric: false,
  },
  {
    code: "MOTHER",
    nameEn: "Mother",
    nameGu: "માતા (Mother)",
    nameHi: "माता (Mother)",
    inverseRelationCode: "SON",
    isSymmetric: false,
  },
  {
    code: "SON",
    nameEn: "Son",
    nameGu: "પુત્ર (Son)",
    nameHi: "पुत्र (Son)",
    inverseRelationCode: "FATHER",
    isSymmetric: false,
  },
  {
    code: "DAUGHTER",
    nameEn: "Daughter",
    nameGu: "પુત્રી (Daughter)",
    nameHi: "पुत्री (Daughter)",
    inverseRelationCode: "FATHER",
    isSymmetric: false,
  },
  {
    code: "BROTHER",
    nameEn: "Brother",
    nameGu: "ભાઈ (Brother)",
    nameHi: "भाई (Brother)",
    inverseRelationCode: "BROTHER",
    isSymmetric: true,
  },
  {
    code: "SISTER",
    nameEn: "Sister",
    nameGu: "બહેન (Sister)",
    nameHi: "बहन (Sister)",
    inverseRelationCode: "SISTER",
    isSymmetric: true,
  },
  {
    code: "SPOUSE",
    nameEn: "Spouse",
    nameGu: "પતિ/પત્ની (Spouse)",
    nameHi: "पति/पत्नी (Spouse)",
    inverseRelationCode: "SPOUSE",
    isSymmetric: true,
  },
  {
    code: "FRIEND",
    nameEn: "Friend",
    nameGu: "મિત્ર (Friend)",
    nameHi: "मित्र (Friend)",
    inverseRelationCode: "FRIEND",
    isSymmetric: true,
  },
  {
    code: "RELATIVE",
    nameEn: "Relative",
    nameGu: "સગાં-સંબંધી (Relative)",
    nameHi: "रिश्तेदार (Relative)",
    inverseRelationCode: "RELATIVE",
    isSymmetric: true,
  },
];

export const SEED_POLITICIANS: SeedPolitician[] = [
  {
    id: "pol-001",
    userId: "user-pol-004",
    name: "Dr. Kantilal Vaghela",
    constituency: "Asarwa (SC Reserved)",
    constituencyType: "VIDHAN_SABHA",
    party: "Jan Kalyan Party",
    designation: "Member of Legislative Assembly (MLA)",
    state: "Gujarat",
    district: "Ahmedabad",
    reservedSeat: true,
    termStart: "2022-12-08T00:00:00.000Z",
    termEnd: "2027-12-07T00:00:00.000Z",
    bio: "Passionate community leader focusing on educational infrastructure, SC/ST youth scholarships, and civic amenities.",
    officeAddress: "Plot 14, Civil Hospital Road, Asarwa, Ahmedabad - 380016",
    contactEmail: "mla.vaghela@gramseva.dev",
    contactPhone: "+917922123456",
    bannerUrl: "/politicians/vaghela.jpg",
    isVerified: true,
    worksCount: 18,
  },
  {
    id: "pol-002",
    userId: "user-pol-002",
    name: "Smt. Maniben Vasava",
    constituency: "Narmada (ST Reserved)",
    constituencyType: "LOK_SABHA",
    party: "Adivasi Vikas Party",
    designation: "Member of Parliament (MP)",
    state: "Gujarat",
    district: "Narmada",
    reservedSeat: true,
    termStart: "2024-06-04T00:00:00.000Z",
    termEnd: "2029-06-03T00:00:00.000Z",
    bio: "Advocating for tribal land rights, forest rights act compliance, and residential tribal school modernization.",
    officeAddress: "Near Rajpipla Court, Narmada District - 393145",
    contactEmail: "mp.vasava@gramseva.dev",
    contactPhone: "+912640223344",
    bannerUrl: "/politicians/vasava.jpg",
    isVerified: true,
    worksCount: 24,
  },
  {
    id: "pol-003",
    userId: "user-pol-003",
    name: "Shri Jignesh Mevani",
    constituency: "Vadgam (SC Reserved)",
    constituencyType: "VIDHAN_SABHA",
    party: "Indian National Congress",
    designation: "Member of Legislative Assembly (MLA)",
    state: "Gujarat",
    district: "Banaskantha",
    reservedSeat: true,
    termStart: "2022-12-08T00:00:00.000Z",
    termEnd: "2027-12-07T00:00:00.000Z",
    bio: "Prominent lawyer and social activist campaigning for land allocation and anti-discrimination enforcement.",
    officeAddress: "Vadgam Taluka Seva Sadan Road, Banaskantha - 385410",
    contactEmail: "jignesh.vadgam@gramseva.dev",
    contactPhone: "+912743224455",
    bannerUrl: "/politicians/mevani.jpg",
    isVerified: true,
    worksCount: 31,
  },
  {
    id: "pol-004",
    userId: "user-pol-004-sub",
    name: "Smt. Anandi Gamit",
    constituency: "Vyara (ST Reserved)",
    constituencyType: "VIDHAN_SABHA",
    party: "Tribal Rights Front",
    designation: "Member of Legislative Assembly (MLA)",
    state: "Gujarat",
    district: "Tapi",
    reservedSeat: true,
    termStart: "2022-12-08T00:00:00.000Z",
    termEnd: "2027-12-07T00:00:00.000Z",
    bio: "Championing healthcare centers and mother-child nutrition in Tapi district forest belts.",
    officeAddress: "Station Road, Vyara, Tapi - 394650",
    contactEmail: "anandi.gamit@gramseva.dev",
    contactPhone: "+912626221199",
    bannerUrl: "/politicians/gamit.jpg",
    isVerified: true,
    worksCount: 15,
  },
  {
    id: "pol-005",
    userId: "user-pol-005",
    name: "Shri Mohanbhai Rathwa",
    constituency: "Chhota Udaipur (ST Reserved)",
    constituencyType: "VIDHAN_SABHA",
    party: "Bharatiya Janata Party",
    designation: "Member of Legislative Assembly (MLA)",
    state: "Gujarat",
    district: "Chhota Udaipur",
    reservedSeat: true,
    termStart: "2022-12-08T00:00:00.000Z",
    termEnd: "2027-12-07T00:00:00.000Z",
    bio: "Senior tribal leader dedicated to agricultural check-dams and lift irrigation projects.",
    officeAddress: "Taluka Panchayat Campus, Chhota Udaipur - 391165",
    contactEmail: "mohan.rathwa@gramseva.dev",
    contactPhone: "+912669232323",
    bannerUrl: "/politicians/rathwa.jpg",
    isVerified: true,
    worksCount: 42,
  },
  {
    id: "pol-006",
    userId: "user-pol-006",
    name: "Shri Pradeep Parmar",
    constituency: "Danilimda (SC Reserved)",
    constituencyType: "VIDHAN_SABHA",
    party: "Bharatiya Janata Party",
    designation: "Former Cabinet Minister & MLA",
    state: "Gujarat",
    district: "Ahmedabad",
    reservedSeat: true,
    termStart: "2022-12-08T00:00:00.000Z",
    termEnd: "2027-12-07T00:00:00.000Z",
    bio: "Focusing on urban slum redevelopment, piped water systems, and vocational training centers.",
    officeAddress: "Danilimda Cross Road, Ahmedabad - 380028",
    contactEmail: "pradeep.parmar@gramseva.dev",
    contactPhone: "+917925347890",
    bannerUrl: "/politicians/parmar.jpg",
    isVerified: true,
    worksCount: 29,
  },
  {
    id: "pol-007",
    userId: "user-pol-007",
    name: "Dr. Nimaben Acharya",
    constituency: "Kutch (SC/General)",
    constituencyType: "VIDHAN_SABHA",
    party: "Bharatiya Janata Party",
    designation: "Senior Representative",
    state: "Gujarat",
    district: "Kutch",
    reservedSeat: false,
    termStart: "2022-12-08T00:00:00.000Z",
    termEnd: "2027-12-07T00:00:00.000Z",
    bio: "Leading rural health drives, girls education hostels, and drinking water pipelines across Kutch.",
    officeAddress: "Bhuj Collectorate Road, Bhuj, Kutch - 370001",
    contactEmail: "nimaben.bhuj@gramseva.dev",
    contactPhone: "+912832250100",
    bannerUrl: "/politicians/acharya.jpg",
    isVerified: true,
    worksCount: 35,
  },
  {
    id: "pol-008",
    userId: "user-pol-008",
    name: "Shri Chaitar Vasava",
    constituency: "Dediapada (ST Reserved)",
    constituencyType: "VIDHAN_SABHA",
    party: "Aam Aadmi Party",
    designation: "Member of Legislative Assembly (MLA)",
    state: "Gujarat",
    district: "Narmada",
    reservedSeat: true,
    termStart: "2022-12-08T00:00:00.000Z",
    termEnd: "2027-12-07T00:00:00.000Z",
    bio: "Grassroots worker advocating for forest workers minimum wage and primary healthcare dispensaries.",
    officeAddress: "Dediapada Main Bazaar, Narmada - 393040",
    contactEmail: "chaitar.vasava@gramseva.dev",
    contactPhone: "+912649235050",
    bannerUrl: "/politicians/cvasava.jpg",
    isVerified: true,
    worksCount: 20,
  },
  {
    id: "pol-009",
    userId: "user-pol-009",
    name: "Smt. Geeta Chaudhari",
    constituency: "Mandvi (ST Reserved)",
    constituencyType: "VIDHAN_SABHA",
    party: "Indian National Congress",
    designation: "Member of Legislative Assembly (MLA)",
    state: "Gujarat",
    district: "Surat",
    reservedSeat: true,
    termStart: "2022-12-08T00:00:00.000Z",
    termEnd: "2027-12-07T00:00:00.000Z",
    bio: "Dedicated to tribal women dairy cooperatives, self-help groups, and secondary school transport.",
    officeAddress: "Mandvi Town Hall, Mandvi, Surat - 394160",
    contactEmail: "geeta.chaudhari@gramseva.dev",
    contactPhone: "+912623221055",
    bannerUrl: "/politicians/chaudhari.jpg",
    isVerified: true,
    worksCount: 22,
  },
  {
    id: "pol-010",
    userId: "user-pol-010",
    name: "Shri Nareshbhai Patel",
    constituency: "Gandevi (ST Reserved)",
    constituencyType: "VIDHAN_SABHA",
    party: "Bharatiya Janata Party",
    designation: "Minister of Tribal Development",
    state: "Gujarat",
    district: "Navsari",
    reservedSeat: true,
    termStart: "2022-12-08T00:00:00.000Z",
    termEnd: "2027-12-07T00:00:00.000Z",
    bio: "Overseeing state tribal welfare schemes, ITI colleges in scheduled areas, and housing allocations.",
    officeAddress: "Block 2, New Sachivalaya, Gandhinagar - 382010",
    contactEmail: "naresh.tribal@gramseva.dev",
    contactPhone: "+917923250011",
    bannerUrl: "/politicians/npatel.jpg",
    isVerified: true,
    worksCount: 48,
  },
];

export const SEED_JOBS: SeedJob[] = [
  {
    id: "job-001",
    title: "Senior Full-Stack Engineer (Next.js / Node.js)",
    employerName: "Ashoka Tech Solutions",
    category: "IT",
    jobType: "FULL_TIME",
    workplaceType: "HYBRID",
    state: "Gujarat",
    district: "Ahmedabad",
    city: "Ahmedabad",
    minSalary: 800000,
    maxSalary: 1400000,
    isReservedForScSt: true,
    targetCommunity: "SC",
    vacancies: 3,
    deadline: "2026-12-31T23:59:59.000Z",
    description: "Looking for talented engineers to develop digital public goods. SC/ST affirmative hiring priority.",
  },
  {
    id: "job-002",
    title: "Junior Data Analyst",
    employerName: "Panchayat Data Analytics",
    category: "IT",
    jobType: "FULL_TIME",
    workplaceType: "REMOTE",
    state: "Gujarat",
    district: "Gandhinagar",
    city: "Gandhinagar",
    minSalary: 400000,
    maxSalary: 650000,
    isReservedForScSt: true,
    targetCommunity: null,
    vacancies: 5,
    deadline: "2026-11-30T23:59:59.000Z",
    description: "Analyze rural development indicators, citizen grievance resolutions, and demographic trends.",
  },
  {
    id: "job-003",
    title: "Assistant Engineer (Civil - Rural Works)",
    employerName: "Gujarat State Rural Infra Corp",
    category: "GOVERNMENT_PSC",
    jobType: "GOVERNMENT",
    workplaceType: "ON_SITE",
    state: "Gujarat",
    district: "Vadodara",
    city: "Vadodara",
    minSalary: 550000,
    maxSalary: 850000,
    isReservedForScSt: true,
    targetCommunity: "ST",
    vacancies: 8,
    deadline: "2026-12-15T23:59:59.000Z",
    description: "Special recruitment drive for Scheduled Tribe candidates in road and water reservoir works.",
  },
  {
    id: "job-004",
    title: "Staff Nurse (Community Health Center)",
    employerName: "District Health Society",
    category: "HEALTHCARE",
    jobType: "FULL_TIME",
    workplaceType: "ON_SITE",
    state: "Gujarat",
    district: "Surat",
    city: "Mandvi",
    minSalary: 360000,
    maxSalary: 520000,
    isReservedForScSt: true,
    targetCommunity: "ST",
    vacancies: 12,
    deadline: "2026-11-20T23:59:59.000Z",
    description: "Delivery of primary maternal care and child immunization in tribal talukas.",
  },
  {
    id: "job-005",
    title: "Primary School Teacher (Gujarati & English)",
    employerName: "Eklavya Model Residential Schools",
    category: "EDUCATION",
    jobType: "FULL_TIME",
    workplaceType: "ON_SITE",
    state: "Gujarat",
    district: "Narmada",
    city: "Rajpipla",
    minSalary: 420000,
    maxSalary: 600000,
    isReservedForScSt: true,
    targetCommunity: "ST",
    vacancies: 6,
    deadline: "2026-12-10T23:59:59.000Z",
    description: "Inspire next-generation tribal students with state-of-the-art residential teaching facilities.",
  },
  {
    id: "job-006",
    title: "Probationary Officer (Financial Inclusion)",
    employerName: "Baroda Gujarat Gramin Bank",
    category: "BANKING",
    jobType: "FULL_TIME",
    workplaceType: "ON_SITE",
    state: "Gujarat",
    district: "Mehsana",
    city: "Mehsana",
    minSalary: 600000,
    maxSalary: 950000,
    isReservedForScSt: true,
    targetCommunity: "SC",
    vacancies: 15,
    deadline: "2026-12-05T23:59:59.000Z",
    description: "Manage branch agricultural credit, mudra micro-loans, and SHG credit linkage.",
  },
  {
    id: "job-007",
    title: "UI/UX Designer (Accessible & Multilingual)",
    employerName: "Ashoka Tech Solutions",
    category: "IT",
    jobType: "FULL_TIME",
    workplaceType: "REMOTE",
    state: "Gujarat",
    district: "Ahmedabad",
    city: "Ahmedabad",
    minSalary: 600000,
    maxSalary: 1100000,
    isReservedForScSt: false,
    targetCommunity: null,
    vacancies: 2,
    deadline: "2026-12-25T23:59:59.000Z",
    description: "Design low-bandwidth, multilingual interfaces optimized for first-time smartphone users.",
  },
  {
    id: "job-008",
    title: "Vocational Instructor (Solar Electrician)",
    employerName: "Tribal Youth Skill Academy",
    category: "SKILLED_LABOR",
    jobType: "CONTRACT",
    workplaceType: "ON_SITE",
    state: "Gujarat",
    district: "Dahod",
    city: "Dahod",
    minSalary: 300000,
    maxSalary: 450000,
    isReservedForScSt: true,
    targetCommunity: "ST",
    vacancies: 4,
    deadline: "2026-11-28T23:59:59.000Z",
    description: "Train youth in rooftop solar installation, maintenance, and grid synchronization.",
  },
  {
    id: "job-009",
    title: "Legal Associate (Human Rights & Land Tenure)",
    employerName: "Nyaya Sahay NGO",
    category: "LEGAL",
    jobType: "FULL_TIME",
    workplaceType: "HYBRID",
    state: "Gujarat",
    district: "Gandhinagar",
    city: "Gandhinagar",
    minSalary: 480000,
    maxSalary: 720000,
    isReservedForScSt: true,
    targetCommunity: "SC",
    vacancies: 3,
    deadline: "2026-12-20T23:59:59.000Z",
    description: "Provide legal aid and file representations under SC/ST Prevention of Atrocities Act.",
  },
  {
    id: "job-010",
    title: "Accounts Officer (Sub-Treasury)",
    employerName: "State Finance Department",
    category: "GOVERNMENT_PSC",
    jobType: "GOVERNMENT",
    workplaceType: "ON_SITE",
    state: "Gujarat",
    district: "Rajkot",
    city: "Rajkot",
    minSalary: 500000,
    maxSalary: 780000,
    isReservedForScSt: true,
    targetCommunity: null,
    vacancies: 4,
    deadline: "2026-12-18T23:59:59.000Z",
    description: "Audit public expenditure and monitor direct benefit transfer (DBT) scheme reconciliations.",
  },
  {
    id: "job-011",
    title: "Field Coordinator (Self-Help Groups)",
    employerName: "Mahila Vikas Mission",
    category: "SOCIAL_SECTOR",
    jobType: "FULL_TIME",
    workplaceType: "ON_SITE",
    state: "Gujarat",
    district: "Banaskantha",
    city: "Palanpur",
    minSalary: 280000,
    maxSalary: 380000,
    isReservedForScSt: true,
    targetCommunity: "SC",
    vacancies: 7,
    deadline: "2026-11-30T23:59:59.000Z",
    description: "Empower Dalit and Adivasi women collectives through financial literacy and enterprise setup.",
  },
  {
    id: "job-012",
    title: "Database Administrator (PostgreSQL)",
    employerName: "Gujarat e-Governance Center",
    category: "IT",
    jobType: "CONTRACT",
    workplaceType: "HYBRID",
    state: "Gujarat",
    district: "Gandhinagar",
    city: "Gandhinagar",
    minSalary: 900000,
    maxSalary: 1500000,
    isReservedForScSt: false,
    targetCommunity: null,
    vacancies: 2,
    deadline: "2026-12-31T23:59:59.000Z",
    description: "High-performance database clustering, query tuning, and zero-loss replication.",
  },
  {
    id: "job-013",
    title: "Assistant Professor (Sociology & Social Work)",
    employerName: "Dr. B.R. Ambedkar Open University",
    category: "EDUCATION",
    jobType: "FULL_TIME",
    workplaceType: "ON_SITE",
    state: "Gujarat",
    district: "Ahmedabad",
    city: "Ahmedabad",
    minSalary: 750000,
    maxSalary: 1250000,
    isReservedForScSt: true,
    targetCommunity: "SC",
    vacancies: 2,
    deadline: "2026-12-28T23:59:59.000Z",
    description: "Curriculum delivery on subaltern studies, constitutional safeguards, and caste dynamics.",
  },
  {
    id: "job-014",
    title: "Agronomy Specialist (Millet & Organic Farming)",
    employerName: "Tribal Organic Producers Co-op",
    category: "AGRICULTURE",
    jobType: "FULL_TIME",
    workplaceType: "ON_SITE",
    state: "Gujarat",
    district: "Dang",
    city: "Ahwa",
    minSalary: 450000,
    maxSalary: 680000,
    isReservedForScSt: true,
    targetCommunity: "ST",
    vacancies: 3,
    deadline: "2026-12-14T23:59:59.000Z",
    description: "Introduce organic certification and indigenous millet crop value-addition in Dangs.",
  },
  {
    id: "job-015",
    title: "Customer Support Associate (Gujarati/Hindi)",
    employerName: "Jan Sahay Call Center",
    category: "CUSTOMER_SERVICE",
    jobType: "FULL_TIME",
    workplaceType: "REMOTE",
    state: "Gujarat",
    district: "Surat",
    city: "Surat",
    minSalary: 260000,
    maxSalary: 350000,
    isReservedForScSt: false,
    targetCommunity: null,
    vacancies: 10,
    deadline: "2026-11-25T23:59:59.000Z",
    description: "Assist citizens with portal navigation, certificate tracking, and grievance status queries.",
  },
  {
    id: "job-016",
    title: "Micro-Credit Loan Recovery Officer",
    employerName: "Gramin Arthik Seva",
    category: "BANKING",
    jobType: "FULL_TIME",
    workplaceType: "ON_SITE",
    state: "Gujarat",
    district: "Kheda",
    city: "Nadiad",
    minSalary: 320000,
    maxSalary: 480000,
    isReservedForScSt: true,
    targetCommunity: "SC",
    vacancies: 5,
    deadline: "2026-12-08T23:59:59.000Z",
    description: "Support small entrepreneurs with ethical loan restructuring and repayments.",
  },
  {
    id: "job-017",
    title: "Quality Inspector (Manufacturing)",
    employerName: "Vibrant Auto Ancillaries",
    category: "ENGINEERING",
    jobType: "FULL_TIME",
    workplaceType: "ON_SITE",
    state: "Gujarat",
    district: "Ahmedabad",
    city: "Sanand",
    minSalary: 360000,
    maxSalary: 500000,
    isReservedForScSt: true,
    targetCommunity: null,
    vacancies: 8,
    deadline: "2026-12-02T23:59:59.000Z",
    description: "Automotive component dimension inspection, gauge calibration, and quality logs.",
  },
  {
    id: "job-018",
    title: "Cyber Security Analyst (SOC Tier 1)",
    employerName: "Ashoka Tech Solutions",
    category: "IT",
    jobType: "FULL_TIME",
    workplaceType: "HYBRID",
    state: "Gujarat",
    district: "Gandhinagar",
    city: "GIFT City",
    minSalary: 650000,
    maxSalary: 1050000,
    isReservedForScSt: true,
    targetCommunity: "SC",
    vacancies: 4,
    deadline: "2026-12-22T23:59:59.000Z",
    description: "Monitor SIEM alerts, identify threat vectors, and maintain security incident compliance.",
  },
  {
    id: "job-019",
    title: "Veterinary Officer (Rural Mobile Clinic)",
    employerName: "Animal Welfare Department",
    category: "HEALTHCARE",
    jobType: "GOVERNMENT",
    workplaceType: "ON_SITE",
    state: "Gujarat",
    district: "Patan",
    city: "Patan",
    minSalary: 580000,
    maxSalary: 880000,
    isReservedForScSt: true,
    targetCommunity: null,
    vacancies: 3,
    deadline: "2026-12-19T23:59:59.000Z",
    description: "Mobile veterinary healthcare, cattle vaccination campaigns, and disease outbreak containment.",
  },
  {
    id: "job-020",
    title: "Youth Apprenticeship (Full-Stack React & Node)",
    employerName: "Ashoka Tech Solutions",
    category: "IT",
    jobType: "INTERNSHIP",
    workplaceType: "REMOTE",
    state: "Gujarat",
    district: "Ahmedabad",
    city: "Ahmedabad",
    minSalary: 180000,
    maxSalary: 240000,
    isReservedForScSt: true,
    targetCommunity: null,
    vacancies: 15,
    deadline: "2026-12-31T23:59:59.000Z",
    description: "Paid 6-month intensive fellowship for SC/ST graduates with conversion opportunity.",
  },
];

export const SEED_SCHOLARSHIPS: SeedScholarship[] = [
  {
    id: "sch-001",
    title: "Post-Matric Scholarship for SC Students (Gujarat)",
    provider: "Social Justice & Special Assistance Department, Govt of Gujarat",
    educationLevel: "POST_MATRIC",
    category: "POST_MATRIC",
    course: "GENERAL",
    classLevel: "UG",
    community: "SC",
    awardAmount: 48000,
    deadline: "2026-11-30T23:59:59.000Z",
    state: "Gujarat",
    isNational: false,
    minPercentage: 50,
    maxFamilyIncome: 250000,
    description: "100% tuition waiver and maintenance allowance for SC students pursuing class 11 to doctorate degrees.",
    applicationUrl: "https://digitalgujarat.gov.in",
    sourceUrl: "https://sje.gujarat.gov.in/schemes/sc-post-matric",
    howToApplySteps: [
      "Register on Digital Gujarat Portal using Aadhaar mobile OTP",
      "Fill student profile, taluka, village, and institute details",
      "Upload self-attested caste certificate and current year income certificate",
      "Attach verified bank passbook showing active NPCI DBT seeding",
      "Submit printout with fee receipt to college scholarship nodal officer"
    ],
    documentsRequired: [
      "SC Caste Certificate issued by competent Gujarat authority",
      "Income Certificate (Family income under ₹2.5 Lakhs)",
      "Current Year College Admission & Fee Receipt",
      "Aadhaar Card linked to Bank Account (NPCI enabled)",
      "Previous Year Final Marksheet"
    ],
    commonRejectionReasons: [
      "Income certificate issued by unauthorized authority or expired validity",
      "Bank account not mapped to NPCI Aadhaar payment bridge (DBT bounce)",
      "Name mismatch between Aadhaar card and HSC/SSC marksheets",
      "Failure to submit hardcopy verification to the college nodal desk"
    ],
    lastVerifiedAt: "2026-10-01T00:00:00.000Z",
    status: "OPEN"
  },
  {
    id: "sch-002",
    title: "National Overseas Scholarship for SC & ST Candidates",
    provider: "Ministry of Social Justice and Empowerment, Govt of India",
    educationLevel: "OVERSEAS_POSTGRADUATE",
    category: "ABROAD",
    course: "STEM",
    classLevel: "PG",
    community: null,
    awardAmount: 2500000,
    deadline: "2026-12-15T23:59:59.000Z",
    state: null,
    isNational: true,
    minPercentage: 60,
    maxFamilyIncome: 800000,
    description: "Full tuition funding, economy airfare, and annual living allowance for Master's and Ph.D. studies in top 500 QS world-ranked universities.",
    applicationUrl: "https://nosmsje.gov.in",
    sourceUrl: "https://socialjustice.gov.in/schemes/nos",
    howToApplySteps: [
      "Secure an unconditional offer letter from a foreign university ranked in the top 500 QS rankings",
      "Register on the NOS portal (nosmsje.gov.in) with Passport and Aadhaar credentials",
      "Upload verified caste validity certificate and latest income tax return (ITR) or Tahsildar income certificate",
      "Submit GRE/GEL/IELTS scorecards and statement of purpose",
      "Review application before final lock and download verification copy"
    ],
    documentsRequired: [
      "Valid Indian Passport (minimum 2 years validity)",
      "Unconditional Admission Offer Letter from Top 500 QS University",
      "SC/ST Caste Validity Certificate",
      "Income Certificate / ITR showing family income under ₹8 Lakhs",
      "Degree Certificate and Consolidated Marksheets (Minimum 60% marks)"
    ],
    commonRejectionReasons: [
      "Conditional admission letter submitted instead of unconditional offer",
      "University ranking exceeds the top 500 QS global ranking cutoff",
      "Family gross annual income exceeds ₹8.00 Lakhs ceiling",
      "Caste certificate lacking district magistrate or digital verification seal"
    ],
    lastVerifiedAt: "2026-10-05T00:00:00.000Z",
    status: "OPEN"
  },
  {
    id: "sch-003",
    title: "Dr. B.R. Ambedkar National Merit Award for Meritorious SC Students",
    provider: "Dr. Ambedkar Foundation, Govt of India",
    educationLevel: "SECONDARY_AND_HIGHER",
    category: "POST_MATRIC",
    course: "GENERAL",
    classLevel: "CLASS_11_12",
    community: "SC",
    awardAmount: 60000,
    deadline: "2026-12-31T23:59:59.000Z",
    state: null,
    isNational: true,
    minPercentage: 75,
    maxFamilyIncome: 500000,
    description: "One-time cash incentive awarded to top SC board rankers in 10th and 12th standard secondary school examinations.",
    applicationUrl: "https://ambedkarfoundation.nic.in",
    sourceUrl: "https://ambedkarfoundation.nic.in/schemes/national-merit-award",
    howToApplySteps: [
      "Verify board rank with State Education Board / CBSE / ICSE gazette",
      "Download nomination application form from Dr. Ambedkar Foundation website",
      "Obtain school principal and District Education Officer (DEO) attestation",
      "Submit dossier online along with attested marksheets and bank mandate"
    ],
    documentsRequired: [
      "Class 10 or 12 Board Examination Marksheet (75%+ score)",
      "State or National Board Merit Rank Certificate",
      "SC Caste Certificate",
      "Bank Passbook copy showing IFSC and Account Number"
    ],
    commonRejectionReasons: [
      "Marksheet percentage strictly below 75% threshold",
      "Missing endorsement from District Education Officer (DEO)",
      "Delayed submission past the calendar financial year window"
    ],
    lastVerifiedAt: "2026-09-28T00:00:00.000Z",
    status: "OPEN"
  },
  {
    id: "sch-004",
    title: "Post-Matric Scholarship Scheme for Scheduled Tribes (ST)",
    provider: "Ministry of Tribal Affairs, Govt of India",
    educationLevel: "POST_MATRIC",
    category: "POST_MATRIC",
    course: "GENERAL",
    classLevel: "UG",
    community: "ST",
    awardAmount: 52000,
    deadline: "2026-11-30T23:59:59.000Z",
    state: null,
    isNational: true,
    minPercentage: 45,
    maxFamilyIncome: 250000,
    description: "Covers non-refundable university fees, study tour expenses, and book allowances for Scheduled Tribe candidates.",
    applicationUrl: "https://scholarships.gov.in",
    sourceUrl: "https://tribal.nic.in/schemes/post-matric-st",
    howToApplySteps: [
      "Visit National Scholarship Portal (NSP scholarships.gov.in)",
      "Authenticate with OTR (One Time Registration) using Aadhaar Face RD or OTP",
      "Select Scheme: Ministry of Tribal Affairs Post-Matric ST Scheme",
      "Upload institutional Bonafide certificate and fee breakdown"
    ],
    documentsRequired: [
      "ST Tribe Certificate issued by Sub-Divisional Magistrate",
      "Income Certificate (Under ₹2.5 Lakhs)",
      "College Bonafide Certificate and Fee Structure",
      "Aadhaar seeded bank account passbook"
    ],
    commonRejectionReasons: [
      "College verification officer failed to authenticate student in NSP portal within cutoff",
      "Invalid or expired income certificate date",
      "Application marked as duplicate under state vs central quota"
    ],
    lastVerifiedAt: "2026-10-02T00:00:00.000Z",
    status: "OPEN"
  },
  {
    id: "sch-005",
    title: "Rajiv Gandhi National Fellowship for SC Research Scholars",
    provider: "University Grants Commission (UGC)",
    educationLevel: "PHD_MPHIL",
    category: "HIGHER_STUDY",
    course: "STEM",
    classLevel: "PHD",
    community: "SC",
    awardAmount: 384000,
    deadline: "2026-12-10T23:59:59.000Z",
    state: null,
    isNational: true,
    minPercentage: 55,
    maxFamilyIncome: 600000,
    description: "Monthly fellowship of ₹31,000 + HRA for SC students pursuing full-time research degrees (Ph.D. / M.Phil) in recognized universities.",
    applicationUrl: "https://ugc.ac.in",
    sourceUrl: "https://ugc.ac.in/schemes/rgnf-sc",
    howToApplySteps: [
      "Secure university Ph.D. registration confirmation",
      "Fill online fellowship registration on UGC portal with research synopsis",
      "Upload recommendation letter from research supervisor and Head of Department",
      "Submit joint declaration of non-receipt of other UGC/CSIR stipends"
    ],
    documentsRequired: [
      "University Ph.D. Registration / Admission Letter",
      "Postgraduate Master Degree Certificate (Minimum 55%)",
      "SC Caste Certificate",
      "Research Supervisor and Dean Recommendation Letter",
      "Undertaking of full-time dedicated research without other employment"
    ],
    commonRejectionReasons: [
      "Part-time Ph.D. enrollment (only regular full-time scholars eligible)",
      "Candidate already drawing salary or secondary fellowship grant",
      "Supervisor recommendation not countersigned by University Registrar"
    ],
    lastVerifiedAt: "2026-10-04T00:00:00.000Z",
    status: "OPEN"
  },
  {
    id: "sch-006",
    title: "Mukhyamantri Yuva Swavalamban Yojana (MYSY) - SC/ST Component",
    provider: "Education Department, Govt of Gujarat",
    educationLevel: "UNDERGRADUATE",
    category: "POST_MATRIC",
    course: "STEM",
    classLevel: "UG",
    community: null,
    awardAmount: 100000,
    deadline: "2026-12-20T23:59:59.000Z",
    state: "Gujarat",
    isNational: false,
    minPercentage: 80,
    maxFamilyIncome: 600000,
    description: "50% tuition reimbursement up to ₹2 Lakhs per year for engineering, pharmacy, and medical colleges for Gujarat domicile students.",
    applicationUrl: "https://mysy.guj.nic.in",
    sourceUrl: "https://mysy.guj.nic.in/terms",
    howToApplySteps: [
      "Register on MYSY portal with 12th Board seat number and passing year",
      "Upload admission slip from ACPC / ACPDC / Admission Committee",
      "Upload self-declaration form signed by parents and student",
      "Submit physically at authorized MYSY Help Center for document verification"
    ],
    documentsRequired: [
      "Gujarat HSC (Class 12) Marksheet with 80+ percentile score",
      "ACPC / Govt Admission Committee College Allotment Letter",
      "Income Certificate (Under ₹6 Lakhs)",
      "Bank Account details with IFSC",
      "Gujarat Domicile Proof"
    ],
    commonRejectionReasons: [
      "Percentile rank below 80 in Class 12 board examination",
      "Admission secured under Management / NRI quota rather than merit committee",
      "Help center physical verification skipped within 15 days of online submission"
    ],
    lastVerifiedAt: "2026-10-08T00:00:00.000Z",
    status: "OPEN"
  },
  {
    id: "sch-007",
    title: "Central Sector Top Class Education Scheme for SC Students",
    provider: "Ministry of Social Justice & Empowerment",
    educationLevel: "PREMIER_INSTITUTES",
    category: "HIGHER_STUDY",
    course: "ALL",
    classLevel: "UG",
    community: "SC",
    awardAmount: 220000,
    deadline: "2026-11-25T23:59:59.000Z",
    state: null,
    isNational: true,
    minPercentage: 60,
    maxFamilyIncome: 800000,
    description: "Full tuition fee coverage, living expenses allowance, and computer allowance at premier institutes (IITs, IIMs, NITs, AIIMS, NLUs).",
    applicationUrl: "https://scholarships.gov.in",
    sourceUrl: "https://socialjustice.gov.in/schemes/top-class-education-sc",
    howToApplySteps: [
      "Obtain admission into designated premier institute (IIT/IIM/NIT/AIIMS/NLU)",
      "Apply through National Scholarship Portal under Central Schemes",
      "Institute nodal officer completes verification on NSP backend",
      "DBT credit disbursed directly into student bank account"
    ],
    documentsRequired: [
      "Institute Admission Card and Fee Structure",
      "SC Caste Certificate",
      "Income Certificate (Under ₹8 Lakhs)",
      "Aadhaar Card copy"
    ],
    commonRejectionReasons: [
      "College is not in the notified central list of premier institutes",
      "Income exceeds the ₹8.00 Lakhs annual threshold",
      "Institute quota of allocated slots exhausted"
    ],
    lastVerifiedAt: "2026-10-03T00:00:00.000Z",
    status: "OPEN"
  },
  {
    id: "sch-008",
    title: "Pre-Matric Scholarship for ST Children (Classes 9 & 10)",
    provider: "Tribal Development Department, Gujarat",
    educationLevel: "PRE_MATRIC",
    category: "PRE_MATRIC",
    course: "GENERAL",
    classLevel: "CLASS_9_10",
    community: "ST",
    awardAmount: 7000,
    deadline: "2026-11-15T23:59:59.000Z",
    state: "Gujarat",
    isNational: false,
    minPercentage: 40,
    maxFamilyIncome: 200000,
    description: "Financial assistance towards books, uniforms, and stationery aimed at reducing drop-out rates in secondary school transition across tribal talukas.",
    applicationUrl: "https://digitalgujarat.gov.in",
    sourceUrl: "https://tribal.gujarat.gov.in/schemes/pre-matric",
    howToApplySteps: [
      "School scholarship in-charge initiates bulk entry for enrolled ST students",
      "Parents provide caste certificate and bank passbook details to school headmaster",
      "Headmaster verifies attendance and submits data to Taluka Primary Education Officer"
    ],
    documentsRequired: [
      "ST Certificate of student or father",
      "Income Certificate (Under ₹2.0 Lakhs)",
      "Student Aadhaar Card copy",
      "Previous year class pass marksheet"
    ],
    commonRejectionReasons: [
      "School attendance lower than mandatory 75% attendance threshold",
      "Bank account details inactive or dormant in postal bank",
      "Student migrated to non-recognized school without transfer certificate"
    ],
    lastVerifiedAt: "2026-09-25T00:00:00.000Z",
    status: "OPEN"
  },
  {
    id: "sch-009",
    title: "Savitribai Phule Special Girls Fellowship",
    provider: "Gujarat Safai Kamdar Vikas Nigam",
    educationLevel: "UNDERGRADUATE",
    category: "HIGHER_STUDY",
    course: "GENERAL",
    classLevel: "UG",
    community: "SC",
    awardAmount: 36000,
    deadline: "2026-12-05T23:59:59.000Z",
    state: "Gujarat",
    isNational: false,
    minPercentage: 50,
    maxFamilyIncome: 300000,
    description: "Special empowerment grant for daughters of sanitation workers and allied workers enrolled in degree and diploma courses in Gujarat.",
    applicationUrl: "https://gskvn.gujarat.gov.in",
    sourceUrl: "https://gskvn.gujarat.gov.in/schemes/savitribai-phule",
    howToApplySteps: [
      "Obtain employment verification certificate of parents from Municipal Corporation or Nagar Palika",
      "Submit application on GSKVN portal with college bonafide letter",
      "Attach recommendation from district social welfare officer"
    ],
    documentsRequired: [
      "Parent Sanitation Worker Employment / Identity Proof",
      "SC Caste Certificate",
      "College Enrolment Receipt",
      "Aadhaar Card and Bank Passbook"
    ],
    commonRejectionReasons: [
      "Failure to provide Municipal sanitation worker certification",
      "Applicant is not enrolled in a recognized university degree",
      "Missing municipal department seal"
    ],
    lastVerifiedAt: "2026-10-06T00:00:00.000Z",
    status: "OPEN"
  },
  {
    id: "sch-010",
    title: "National Fellowship for Higher Education of ST Students (NFST)",
    provider: "Ministry of Tribal Affairs",
    educationLevel: "PHD_MPHIL",
    category: "HIGHER_STUDY",
    course: "STEM",
    classLevel: "PHD",
    community: "ST",
    awardAmount: 420000,
    deadline: "2026-12-18T23:59:59.000Z",
    state: null,
    isNational: true,
    minPercentage: 55,
    maxFamilyIncome: 600000,
    description: "Full research fellowship of ₹35,000/month + contingency grant for Scheduled Tribe scholars pursuing regular Ph.D. degrees in sciences and humanities.",
    applicationUrl: "https://tribal.nic.in",
    sourceUrl: "https://tribal.nic.in/fellowship.aspx",
    howToApplySteps: [
      "Enroll in a full-time regular Ph.D. program in a UGC recognized university",
      "Submit application on Ministry of Tribal Affairs fellowship portal",
      "Upload research proposal vetted by institutional research board",
      "Complete biometric / Aadhaar verification"
    ],
    documentsRequired: [
      "Scheduled Tribe (ST) Certificate",
      "Postgraduate Degree Certificate (55%+ marks)",
      "University Ph.D. Admission / Confirmation Order",
      "Research Topic Synopsis with Supervisor signature"
    ],
    commonRejectionReasons: [
      "Ph.D. admission is provisional without confirmed course-work completion",
      "Tribe certificate issued outside scheduled area jurisdiction without state validity",
      "Non-availability of designated university registration number"
    ],
    lastVerifiedAt: "2026-10-07T00:00:00.000Z",
    status: "OPEN"
  },
  {
    id: "sch-011",
    title: "Dr. Ambedkar Free Coaching Scheme for SC & OBC Students",
    provider: "Ministry of Social Justice & Empowerment",
    educationLevel: "COMPETITIVE_EXAMS",
    category: "COACHING",
    course: "GENERAL",
    classLevel: "UG",
    community: "SC",
    awardAmount: 75000,
    deadline: "2026-12-28T23:59:59.000Z",
    state: null,
    isNational: true,
    minPercentage: 50,
    maxFamilyIncome: 800000,
    description: "100% free coaching fee coverage + ₹4,000 monthly living stipend for UPSC Civil Services, State PSC, Banking, and SSC entrance exams.",
    applicationUrl: "https://coaching.dosje.gov.in",
    sourceUrl: "https://coaching.dosje.gov.in/guidelines",
    howToApplySteps: [
      "Register on the Free Coaching Scheme portal (coaching.dosje.gov.in)",
      "Select desired competitive exam stream and empanelled coaching institute",
      "Upload graduation degree marksheet and category certificate",
      "Undergo common entrance / merit ranking by the ministry"
    ],
    documentsRequired: [
      "Graduation Degree / Final Year Student ID",
      "SC Caste Certificate",
      "Income Certificate (Under ₹8 Lakhs)",
      "Aadhaar Card and Passport Photograph"
    ],
    commonRejectionReasons: [
      "Institute chosen is not on the Ministry's empanelled coaching center roster",
      "Candidate already availed scheme benefits in a previous exam cycle (1-time policy)",
      "Income exceeds ₹8.00 Lakhs ceiling"
    ],
    lastVerifiedAt: "2026-10-03T00:00:00.000Z",
    status: "OPEN"
  },
  {
    id: "sch-012",
    title: "Gujarat State Financial Assistance for SC/ST Boarding & Lodging",
    provider: "Directorate of Scheduled Caste Welfare, Gujarat",
    educationLevel: "COLLEGE_HOSTEL",
    category: "HOSTEL",
    course: "GENERAL",
    classLevel: "UG",
    community: "SC",
    awardAmount: 30000,
    deadline: "2026-12-08T23:59:59.000Z",
    state: "Gujarat",
    isNational: false,
    minPercentage: 45,
    maxFamilyIncome: 300000,
    description: "Monthly meal and accommodation stipend of ₹3,000 for SC/ST college students staying in private recognized hostels away from hometown.",
    applicationUrl: "https://sje.gujarat.gov.in",
    sourceUrl: "https://sje.gujarat.gov.in/schemes/hostel-aid",
    howToApplySteps: [
      "Obtain hostel rent and boarding agreement letter from registered hostel manager",
      "Apply through Digital Gujarat portal under Social Welfare Directorate",
      "Get application certified by college principal showing distance from native residence (>25km)"
    ],
    documentsRequired: [
      "Hostel Admission Slip & Rent Receipt",
      "SC/ST Certificate",
      "Distance Certificate or Native Village proof",
      "College Bonafide Certificate",
      "Bank Account details"
    ],
    commonRejectionReasons: [
      "Distance between native place and college is under 25 km radius",
      "Hostel is unregistered or unverified by local civic body",
      "Student simultaneously residing in a government-funded samaj kalyan hostel"
    ],
    lastVerifiedAt: "2026-10-02T00:00:00.000Z",
    status: "OPEN"
  },
  {
    id: "sch-013",
    title: "Dr. B.R. Ambedkar Overseas Studies Scheme (Gujarat State)",
    provider: "Department of Social Justice and Empowerment, Gujarat",
    educationLevel: "OVERSEAS_POSTGRADUATE",
    category: "ABROAD",
    course: "STEM",
    classLevel: "PG",
    community: "SC",
    awardAmount: 1500000,
    deadline: "2026-12-25T23:59:59.000Z",
    state: "Gujarat",
    isNational: false,
    minPercentage: 55,
    maxFamilyIncome: 600000,
    description: "State loan-cum-subsidy up to ₹15 Lakhs at nominal 4% interest for Scheduled Caste students pursuing foreign master degrees.",
    applicationUrl: "https://sje.gujarat.gov.in",
    sourceUrl: "https://sje.gujarat.gov.in/schemes/ambedkar-overseas",
    howToApplySteps: [
      "Obtain foreign university confirmed I-20 or visa eligibility certificate",
      "Apply online on Gujarat Social Justice portal",
      "Furnish 2 government employee guarantors or property mortgage surety",
      "Sign loan agreement at District Social Welfare Office"
    ],
    documentsRequired: [
      "Confirmed Foreign University Admission Letter and I-20",
      "Valid Passport & Student Visa Stamp",
      "Gujarat Domicile Certificate",
      "SC Caste Certificate",
      "Surety / Guarantor documents"
    ],
    commonRejectionReasons: [
      "Absence of valid student visa / SEVIS confirmation",
      "Surety guarantors fail to meet eligibility criteria",
      "Family income exceeds state eligibility slab"
    ],
    lastVerifiedAt: "2026-10-09T00:00:00.000Z",
    status: "OPEN"
  },
  {
    id: "sch-014",
    title: "Eklavya Tribal Student Higher Education Mentorship Fellowship",
    provider: "Eklavya Tribal Foundation",
    educationLevel: "UNDERGRADUATE_STEM",
    category: "HIGHER_STUDY",
    course: "STEM",
    classLevel: "UG",
    community: "ST",
    awardAmount: 65000,
    deadline: "2026-12-22T23:59:59.000Z",
    state: "Gujarat",
    isNational: false,
    minPercentage: 55,
    maxFamilyIncome: 350000,
    description: "Laptop grant + ₹4,000 monthly study allowance for tribal students studying Data Science, Computer Science, or AI in Gujarat.",
    applicationUrl: "https://eklavyafoundation.org",
    sourceUrl: "https://eklavyafoundation.org/fellowships",
    howToApplySteps: [
      "Submit online coding / aptitude quiz on Foundation portal",
      "Upload first semester engineering grade report",
      "Attend virtual interview with technical mentor"
    ],
    documentsRequired: [
      "ST Tribe Certificate",
      "B.Tech / BCA Semester Marksheet",
      "Income Certificate",
      "College Bonafide"
    ],
    commonRejectionReasons: [
      "Non-computer science stream discipline",
      "Incomplete online coding assessment submission"
    ],
    lastVerifiedAt: "2026-10-05T00:00:00.000Z",
    status: "OPEN"
  },
  {
    id: "sch-015",
    title: "Special Coaching Assistance for GPSC Class 1 & 2 (SC Candidates) [Ended Cycle]",
    provider: "Directorate of Scheduled Caste Welfare, Gujarat",
    educationLevel: "COMPETITIVE_EXAMS",
    category: "COACHING",
    course: "GENERAL",
    classLevel: "UG",
    community: "SC",
    awardAmount: 20000,
    deadline: "2026-08-31T23:59:59.000Z",
    state: "Gujarat",
    isNational: false,
    minPercentage: 50,
    maxFamilyIncome: 450000,
    description: "Previous cycle coaching grant of ₹20,000 for SC aspirants enrolled in GPSC preliminary exam coaching.",
    applicationUrl: "https://digitalgujarat.gov.in",
    sourceUrl: "https://sje.gujarat.gov.in/schemes/gpsc-coaching-ended",
    howToApplySteps: [
      "Cycle closed. Applications were invited prior to August 31, 2026.",
      "Track updates for next academic cycle."
    ],
    documentsRequired: [
      "SC Caste Certificate",
      "GPSC Exam Hall Ticket / Application Confirmation",
      "Registered Coaching Center Receipt"
    ],
    commonRejectionReasons: [
      "Application submitted after cycle closing deadline",
      "Coaching institute not recognized by State Training Academy"
    ],
    lastVerifiedAt: "2026-08-31T00:00:00.000Z",
    status: "CLOSED"
  },
  {
    id: "sch-016",
    title: "Central Sector Pre-Matric Scholarship for SC Students (Classes 9 & 10) [Ended Cycle]",
    provider: "Ministry of Social Justice and Empowerment",
    educationLevel: "PRE_MATRIC",
    category: "PRE_MATRIC",
    course: "GENERAL",
    classLevel: "CLASS_9_10",
    community: "SC",
    awardAmount: 4000,
    deadline: "2026-07-31T23:59:59.000Z",
    state: null,
    isNational: true,
    minPercentage: 40,
    maxFamilyIncome: 250000,
    description: "Annual maintenance stipend for Class 9 and 10 students from SC families to curb school drop-out rates.",
    applicationUrl: "https://scholarships.gov.in",
    sourceUrl: "https://socialjustice.gov.in/schemes/pre-matric-sc",
    howToApplySteps: [
      "Cycle closed for 2025-26 batch on July 31, 2026.",
      "Check National Scholarship Portal for upcoming academic notification."
    ],
    documentsRequired: [
      "SC Certificate",
      "Previous Class Marksheet",
      "Family Income Proof"
    ],
    commonRejectionReasons: [
      "Deadline expired for current cycle",
      "Failure of school verification before portal closing"
    ],
    lastVerifiedAt: "2026-07-31T00:00:00.000Z",
    status: "CLOSED"
  },
  {
    id: "sch-017",
    title: "AICTE Pragati & Saksham Scholarship for SC/ST Technical Girls",
    provider: "All India Council for Technical Education (AICTE)",
    educationLevel: "DIPLOMA_DEGREE",
    category: "HIGHER_STUDY",
    course: "STEM",
    classLevel: "UG",
    community: null,
    awardAmount: 50000,
    deadline: "2026-11-30T23:59:59.000Z",
    state: null,
    isNational: true,
    minPercentage: 50,
    maxFamilyIncome: 800000,
    description: "₹50,000 per annum towards college fee, books, equipment, and laptop purchases for SC/ST girls admitted to technical degree courses.",
    applicationUrl: "https://www.aicte-india.org",
    sourceUrl: "https://www.aicte-india.org/schemes/students-development-schemes/pragati",
    howToApplySteps: [
      "Apply through National Scholarship Portal (NSP)",
      "Upload AICTE approved college admission letter and fee challan",
      "Ensure college verifies student record before AICTE closing date"
    ],
    documentsRequired: [
      "AICTE Approved College Admission Letter",
      "Class 12 Marksheet",
      "Family Income Certificate (Under ₹8 Lakhs)",
      "Aadhaar linked Bank Passbook"
    ],
    commonRejectionReasons: [
      "Institute is not AICTE approved for the current session",
      "Student enrolled in general non-technical program (BA/BCom)",
      "More than two girls from same family claiming benefit without twin clause"
    ],
    lastVerifiedAt: "2026-10-04T00:00:00.000Z",
    status: "OPEN"
  },
  {
    id: "sch-018",
    title: "Gujarat Tribal Development Corporation (GTDC) Educational Loan Subsidy",
    provider: "Gujarat Tribal Development Corporation",
    educationLevel: "PROFESSIONAL_DEGREE",
    category: "HIGHER_STUDY",
    course: "MEDICAL",
    classLevel: "UG",
    community: "ST",
    awardAmount: 150000,
    deadline: "2026-12-31T23:59:59.000Z",
    state: "Gujarat",
    isNational: false,
    minPercentage: 55,
    maxFamilyIncome: 400000,
    description: "4% interest subsidized loan up to ₹10 Lakhs for professional medical, flight training, and technology courses.",
    applicationUrl: "https://gtdc.gujarat.gov.in",
    sourceUrl: "https://gtdc.gujarat.gov.in/schemes/education-loan",
    howToApplySteps: [
      "Submit loan assistance form on GTDC portal",
      "Upload medical / pilot / engineering entrance exam rank card and college fee schedule",
      "Appear for counseling at GTDC Gandhinagar office"
    ],
    documentsRequired: [
      "ST Tribe Certificate",
      "NEET / JEE / Pilot Training Admission Letter",
      "Parental Income Certificate",
      "Guarantor Agreement"
    ],
    commonRejectionReasons: [
      "Course is not on approved list of professional higher qualifications",
      "Missing second-party guarantor documentation"
    ],
    lastVerifiedAt: "2026-10-08T00:00:00.000Z",
    status: "OPEN"
  },
  {
    id: "sch-019",
    title: "ONGC Foundation SC/ST Merit Scholarship (Engineering & MBBS)",
    provider: "ONGC Foundation",
    educationLevel: "UNDERGRADUATE_STEM",
    category: "HIGHER_STUDY",
    course: "STEM",
    classLevel: "UG",
    community: null,
    awardAmount: 48000,
    deadline: "2026-12-12T23:59:59.000Z",
    state: null,
    isNational: true,
    minPercentage: 60,
    maxFamilyIncome: 450000,
    description: "Annual grant for 1st year SC/ST students enrolled in full-time Engineering, MBBS, and MBA programs across India.",
    applicationUrl: "https://ongcscholar.org",
    sourceUrl: "https://ongcscholar.org/rules",
    howToApplySteps: [
      "Apply through ONGC Scholar online portal",
      "Upload 1st semester marksheet or JEE/NEET rank score",
      "Get application certified by Dean of Academic Affairs"
    ],
    documentsRequired: [
      "SC or ST Caste Certificate",
      "Class 12 Marksheet (60%+ score)",
      "Family Income Certificate (Under ₹4.5 Lakhs)",
      "College Student ID Card"
    ],
    commonRejectionReasons: [
      "Applicant is in 2nd or higher year (only 1st year freshers eligible)",
      "Income exceeds ₹4.5 Lakhs limit"
    ],
    lastVerifiedAt: "2026-10-05T00:00:00.000Z",
    status: "OPEN"
  },
  {
    id: "sch-020",
    title: "Vidyasaarathi Tata Trusts ST Higher Education Grant",
    provider: "Tata Trusts Educational Grants",
    educationLevel: "POSTGRADUATE",
    category: "HIGHER_STUDY",
    course: "GENERAL",
    classLevel: "PG",
    community: "ST",
    awardAmount: 75000,
    deadline: "2026-12-25T23:59:59.000Z",
    state: null,
    isNational: true,
    minPercentage: 60,
    maxFamilyIncome: 500000,
    description: "Need-cum-merit fee subsidy for deserving tribal postgraduate students pursuing degrees in social work, public health, and environment.",
    applicationUrl: "https://vidyasaarathi.co.in",
    sourceUrl: "https://tatatrusts.org/our-work/education/scholarships",
    howToApplySteps: [
      "Register on Vidyasaarathi portal",
      "Search for Tata Trusts Scheduled Tribe PG Scholarship scheme",
      "Upload income and graduation certificates",
      "Submit before deadline"
    ],
    documentsRequired: [
      "ST Certificate",
      "Graduation Degree Certificate",
      "Current PG College Bonafide",
      "Income Certificate"
    ],
    commonRejectionReasons: [
      "Incomplete college bonafide upload without seal",
      "Graduation percentage below 60%"
    ],
    lastVerifiedAt: "2026-10-01T00:00:00.000Z",
    status: "OPEN"
  }
];
