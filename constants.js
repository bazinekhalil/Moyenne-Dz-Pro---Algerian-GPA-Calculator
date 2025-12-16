export const TRANSLATIONS = {
  title: {
    ar: 'حساب المعدل الفصلي - الجزائر',
    fr: 'Calculateur de Moyenne - Algérie',
    en: 'Algerian GPA Calculator',
  },
  subtitle: {
    ar: 'لجميع الأطوار التعليمية مع مستشار الذكاء الاصطناعي',
    fr: 'Pour tous les niveaux avec conseiller IA',
    en: 'For all levels with AI Advisor',
  },
  selectLevel: {
    ar: 'اختر المستوى الدراسي',
    fr: 'Sélectionnez le niveau',
    en: 'Select Level',
  },
  selectStream: {
    ar: 'اختر الشعبة',
    fr: 'Sélectionnez la filière',
    en: 'Select Stream',
  },
  subject: {
    ar: 'المادة',
    fr: 'Matière',
    en: 'Subject',
  },
  coeff: {
    ar: 'المعامل',
    fr: 'Coeff',
    en: 'Coeff',
  },
  grade: {
    ar: 'العلامة /20',
    fr: 'Note /20',
    en: 'Grade /20',
  },
  actions: {
    ar: 'إجراءات',
    fr: 'Actions',
    en: 'Actions',
  },
  addSubject: {
    ar: 'إضافة مادة',
    fr: 'Ajouter une matière',
    en: 'Add Subject',
  },
  calcAverage: {
    ar: 'حساب المعدل',
    fr: 'Calculer la moyenne',
    en: 'Calculate Average',
  },
  yourAverage: {
    ar: 'معدلك الفصلي هو:',
    fr: 'Votre moyenne trimestrielle est :',
    en: 'Your Semester Average is:',
  },
  setGoal: {
    ar: 'حدد هدفك (المعدل المرغوب)',
    fr: 'Fixez votre objectif (Moyenne visée)',
    en: 'Set your Goal (Target GPA)',
  },
  getAiAdvice: {
    ar: 'تحليل النتائج ونصائح للتحسين',
    fr: 'Analyser les résultats et obtenir des conseils',
    en: 'Analyze Results & Get Tips',
  },
  loadingAi: {
    ar: 'جاري استشارة الذكاء الاصطناعي...',
    fr: 'Consultation de l\'IA en cours...',
    en: 'Consulting AI...',
  },
  reset: {
    ar: 'بداية جديدة',
    fr: 'Recommencer',
    en: 'Start Over',
  },
  customSubject: {
    ar: 'مادة إضافية',
    fr: 'Matière supp.',
    en: 'Custom Subject',
  },
  save: { 
    ar: 'حفظ التقدم', 
    fr: 'Sauvegarder', 
    en: 'Save Progress' 
  },
  resume: { 
    ar: 'متابعة الجلسة السابقة', 
    fr: 'Reprendre la session', 
    en: 'Resume Previous Session' 
  },
  savedMsg: { 
    ar: 'تم الحفظ بنجاح', 
    fr: 'Sauvegardé avec succès', 
    en: 'Saved Successfully' 
  },
  restore: { 
    ar: 'استرجاع المواد الأصلية', 
    fr: 'Rétablir défaut', 
    en: 'Restore Defaults' 
  },
};

// Helper to create subjects quickly
const mkSub = (id, ar, fr, en, coeff) => ({
  id,
  name: { ar, fr, en },
  coefficient: coeff,
});

// Common Subjects
const ARABIC = (c) => mkSub('arab', 'اللغة العربية', 'Langue Arabe', 'Arabic', c);
const MATH = (c) => mkSub('math', 'الرياضيات', 'Mathématiques', 'Mathematics', c);
const PHYSICS = (c) => mkSub('phys', 'العلوم الفيزيائية', 'Physique', 'Physics', c);
const SCIENCE = (c) => mkSub('scien', 'علوم الطبيعة والحياة', 'Sciences Naturelles', 'Natural Sciences', c);
const FRENCH = (c) => mkSub('fren', 'الفرنسية', 'Français', 'French', c);
const ENGLISH = (c) => mkSub('eng', 'الإنجليزية', 'Anglais', 'English', c);
const ISLAMIC = (c) => mkSub('islam', 'العلوم الإسلامية', 'Sciences Islamiques', 'Islamic Sciences', c);
const HISTORY = (c) => mkSub('hist', 'التاريخ والجغرافيا', 'Histoire-Géo', 'History-Geo', c);
const CIVICS = (c) => mkSub('civ', 'التربية المدنية', 'Éducation Civique', 'Civics', c);
const SPORT = (c) => mkSub('sport', 'التربية البدنية', 'Éducation Physique', 'Physical Education', c);
const PHILO = (c) => mkSub('philo', 'الفلسفة', 'Philosophie', 'Philosophy', c);
const TECH_MECH = (c) => mkSub('tm', 'هندسة ميكانيكية', 'Génie Mécanique', 'Mechanical Eng.', c);
const TECH_GEN = (c) => mkSub('tech', 'تكنولوجيا (هندسة)', 'Génie (Méca/Elec/Civil)', 'Technology (Eng)', c);
const ECON = (c) => mkSub('eco', 'تسيير واقتصاد', 'Management', 'Management & Economy', c);
const LAW = (c) => mkSub('law', 'القانون', 'Droit', 'Law', c);
const AMAZIGH = (c) => mkSub('amz', 'الأمازيغية', 'Tamazight', 'Tamazight', c);
const ART = (c) => mkSub('art', 'تربية فنية/موسيقية', 'Art/Musique', 'Art/Music', c);
const COMP = (c) => mkSub('inf', 'إعلام آلي', 'Informatique', 'Computer Science', c);

// Define Education System Structure
export const EDUCATION_SYSTEM = [
  // --- CEM (Middle School) ---
  {
    id: 'cem_1',
    name: { ar: 'السنة الأولى متوسط', fr: '1ère Année Moyenne (CEM)', en: '1st Year Middle School' },
    streams: [{
      id: 'cem_common', name: { ar: 'جذع مشترك', fr: 'Tronc Commun', en: 'General' },
      defaultSubjects: [ARABIC(2), MATH(2), PHYSICS(1), SCIENCE(1), FRENCH(1), ENGLISH(1), ISLAMIC(1), HISTORY(1), CIVICS(1), ART(1), SPORT(1), AMAZIGH(1), COMP(1)]
    }]
  },
  {
    id: 'cem_2',
    name: { ar: 'السنة الثانية متوسط', fr: '2ème Année Moyenne (CEM)', en: '2nd Year Middle School' },
    streams: [{
      id: 'cem_common', name: { ar: 'جذع مشترك', fr: 'Tronc Commun', en: 'General' },
      defaultSubjects: [ARABIC(3), MATH(3), PHYSICS(2), SCIENCE(2), FRENCH(2), ENGLISH(1), ISLAMIC(1), HISTORY(2), CIVICS(1), ART(1), SPORT(1)]
    }]
  },
  {
    id: 'cem_3',
    name: { ar: 'السنة الثالثة متوسط', fr: '3ème Année Moyenne (CEM)', en: '3rd Year Middle School' },
    streams: [{
      id: 'cem_common', name: { ar: 'جذع مشترك', fr: 'Tronc Commun', en: 'General' },
      defaultSubjects: [ARABIC(3), MATH(3), PHYSICS(2), SCIENCE(2), FRENCH(2), ENGLISH(1), ISLAMIC(1), HISTORY(2), CIVICS(1), ART(1), SPORT(1)]
    }]
  },
  {
    id: 'cem_4',
    name: { ar: 'السنة الرابعة متوسط (BEM)', fr: '4ème Année Moyenne (BEM)', en: '4th Year Middle School (BEM)' },
    streams: [{
      id: 'cem_common', name: { ar: 'جذع مشترك', fr: 'Tronc Commun', en: 'General' },
      defaultSubjects: [ARABIC(5), MATH(4), PHYSICS(2), SCIENCE(2), FRENCH(3), ENGLISH(2), ISLAMIC(2), HISTORY(3), CIVICS(1), ART(1), SPORT(1), AMAZIGH(2)]
    }]
  },
  
  // --- Lycée (High School) ---
  {
    id: 'lyc_1',
    name: { ar: 'السنة الأولى ثانوي', fr: '1ère Année Secondaire', en: '1st Year High School' },
    streams: [
      {
        id: 'tc_st', name: { ar: 'جذع مشترك علوم وتكنولوجيا', fr: 'Tronc Commun Sciences', en: 'Common Core Science' },
        defaultSubjects: [MATH(5), PHYSICS(4), SCIENCE(4), ARABIC(3), FRENCH(2), ENGLISH(2), ISLAMIC(2), HISTORY(2), COMP(2), TECH_MECH(2), SPORT(1)]
      },
      {
        id: 'tc_l', name: { ar: 'جذع مشترك آداب', fr: 'Tronc Commun Lettres', en: 'Common Core Literature' },
        defaultSubjects: [ARABIC(5), HISTORY(3), ISLAMIC(2), FRENCH(3), ENGLISH(3), MATH(2), PHYSICS(2), SCIENCE(2), COMP(2), SPORT(1)]
      }
    ]
  },
  {
    id: 'lyc_2',
    name: { ar: 'السنة الثانية ثانوي', fr: '2ème Année Secondaire', en: '2nd Year High School' },
    streams: [
      {
        id: '2as_s', name: { ar: 'علوم تجريبية', fr: 'Sciences Expérimentales', en: 'Experimental Sciences' },
        defaultSubjects: [MATH(5), PHYSICS(5), SCIENCE(5), ARABIC(2), FRENCH(2), ENGLISH(2), HISTORY(2), ISLAMIC(1), SPORT(1)]
      },
      {
        id: '2as_m', name: { ar: 'رياضيات', fr: 'Mathématiques', en: 'Mathematics' },
        defaultSubjects: [MATH(7), PHYSICS(6), SCIENCE(2), ARABIC(2), FRENCH(2), ENGLISH(2), HISTORY(2), ISLAMIC(1), SPORT(1)]
      },
      {
        id: '2as_tm', name: { ar: 'تقني رياضي', fr: 'Technique Mathématique', en: 'Technical Math' },
        defaultSubjects: [TECH_GEN(6), MATH(6), PHYSICS(6), ARABIC(2), FRENCH(2), ENGLISH(2), HISTORY(2), ISLAMIC(1), SPORT(1)]
      },
      {
        id: '2as_ge', name: { ar: 'تسيير واقتصاد', fr: 'Gestion et Économie', en: 'Management & Economy' },
        defaultSubjects: [ECON(5), LAW(2), MATH(4), HISTORY(4), ARABIC(2), FRENCH(2), ENGLISH(2), ISLAMIC(1), SPORT(1)]
      },
      {
        id: '2as_lp', name: { ar: 'آداب وفلسفة', fr: 'Lettres et Philosophie', en: 'Literature & Philosophy' },
        defaultSubjects: [ARABIC(5), PHILO(2), HISTORY(4), FRENCH(3), ENGLISH(3), ISLAMIC(2), MATH(2), SCIENCE(2), SPORT(1)]
      },
      {
        id: '2as_le', name: { ar: 'لغات أجنبية', fr: 'Langues Étrangères', en: 'Foreign Languages' },
        defaultSubjects: [mkSub('sp_gr', 'لغة أجنبية 3', 'Langue 3', '3rd Language', 4), ARABIC(4), FRENCH(4), ENGLISH(4), HISTORY(2), ISLAMIC(2), MATH(2), PHILO(2), SCIENCE(2), SPORT(1)]
      }
    ]
  },
  {
    id: 'lyc_3',
    name: { ar: 'السنة الثالثة ثانوي (BAC)', fr: '3ème Année Secondaire (BAC)', en: '3rd Year High School (BAC)' },
    streams: [
      {
        id: 's_exp', name: { ar: 'علوم تجريبية', fr: 'Sciences Expérimentales', en: 'Experimental Sciences' },
        defaultSubjects: [SCIENCE(6), PHYSICS(5), MATH(5), ARABIC(3), FRENCH(2), ENGLISH(2), PHILO(2), HISTORY(2), ISLAMIC(2), SPORT(1)]
      },
      {
        id: 'math', name: { ar: 'رياضيات', fr: 'Mathématiques', en: 'Mathematics' },
        defaultSubjects: [MATH(7), PHYSICS(6), SCIENCE(2), ARABIC(3), FRENCH(2), ENGLISH(2), PHILO(2), HISTORY(2), ISLAMIC(2), SPORT(1)]
      },
      {
        id: 'tm', name: { ar: 'تقني رياضي (هـ.ميكانيكية)', fr: 'Tech Math (G.Mécanique)', en: 'Tech Math (Mech)' },
        defaultSubjects: [TECH_MECH(6), MATH(6), PHYSICS(6), ARABIC(3), FRENCH(2), ENGLISH(2), PHILO(2), HISTORY(2), ISLAMIC(2), SPORT(1)]
      },
      {
        id: 'ge', name: { ar: 'تسيير واقتصاد', fr: 'Gestion et Économie', en: 'Management & Economy' },
        defaultSubjects: [ECON(6), LAW(2), MATH(5), HISTORY(4), ARABIC(3), FRENCH(2), ENGLISH(2), PHILO(2), ISLAMIC(2), SPORT(1)]
      },
      {
        id: 'lp', name: { ar: 'آداب وفلسفة', fr: 'Lettres et Philosophie', en: 'Literature & Philosophy' },
        defaultSubjects: [PHILO(6), ARABIC(6), HISTORY(4), FRENCH(3), ENGLISH(3), ISLAMIC(2), MATH(2), SPORT(1)]
      },
      {
        id: 'lang', name: { ar: 'لغات أجنبية', fr: 'Langues Étrangères', en: 'Foreign Languages' },
        defaultSubjects: [mkSub('sp_gr', 'لغة أجنبية 3 (اسبانية/المانية)', 'Langue 3 (Esp/All)', '3rd Language', 5), ARABIC(5), FRENCH(5), ENGLISH(5), HISTORY(2), ISLAMIC(2), PHILO(2), MATH(2), SPORT(1)]
      }
    ]
  }
];