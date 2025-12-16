import React, { useState, useMemo, useEffect } from 'react';
import htm from 'htm';
import { EDUCATION_SYSTEM, TRANSLATIONS } from './constants.js';
import { getAcademicAdvice } from './services/geminiService.js';
import LanguageSwitcher from './components/LanguageSwitcher.jsx';
import { 
  GraduationCap, 
  BookOpen, 
  TrendingUp, 
  Plus, 
  Trash2, 
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Save,
  RotateCcw,
  History
} from 'lucide-react';

const html = htm.bind(React.createElement);
const STORAGE_KEY = 'moyenne_dz_data';

const App = () => {
  // --- State ---
  const [lang, setLang] = useState('ar');
  const [level, setLevel] = useState(null);
  const [stream, setStream] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [targetAvg, setTargetAvg] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [hasSavedData, setHasSavedData] = useState(false);
  const [showSaveMsg, setShowSaveMsg] = useState(false);
  
  // AI State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState(null);

  // --- Computed ---
  const t = TRANSLATIONS;
  const isRTL = lang === 'ar';
  
  const currentAvg = useMemo(() => {
    let totalScore = 0;
    let totalCoeff = 0;
    
    subjects.forEach(sub => {
      if (sub.grade !== undefined && !isNaN(sub.grade)) {
        totalScore += sub.grade * sub.coefficient;
        totalCoeff += sub.coefficient;
      }
    });
    
    return totalCoeff === 0 ? 0 : totalScore / totalCoeff;
  }, [subjects]);

  // --- Effects ---

  // Check for saved data on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setHasSavedData(true);

    // Set document direction
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.body.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
  }, [isRTL, lang]);

  // --- Handlers ---

  const saveData = () => {
    if (!level || !stream) return;
    const data = {
      levelId: level.id,
      streamId: stream.id,
      subjects,
      targetAvg,
      timestamp: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setHasSavedData(true);
    setShowSaveMsg(true);
    setTimeout(() => setShowSaveMsg(false), 2000);
  };

  const loadData = () => {
    try {
      const savedStr = localStorage.getItem(STORAGE_KEY);
      if (!savedStr) return;
      const saved = JSON.parse(savedStr);

      const foundLevel = EDUCATION_SYSTEM.find(l => l.id === saved.levelId);
      if (!foundLevel) return;

      const foundStream = foundLevel.streams.find(s => s.id === saved.streamId);
      if (!foundStream) return;

      setLevel(foundLevel);
      setStream(foundStream);
      setSubjects(saved.subjects || []);
      setTargetAvg(saved.targetAvg || '');
      setAiAdvice(null);
    } catch (e) {
      console.error("Failed to load data", e);
    }
  };

  const handleLevelSelect = (l) => {
    setLevel(l);
    setStream(null);
    setSubjects([]);
    setShowResults(false);
    setAiAdvice(null);
    
    // Auto-select stream if only one exists (like CEM)
    if (l.streams.length === 1) {
      handleStreamSelect(l.streams[0]);
    }
  };

  const handleStreamSelect = (s) => {
    setStream(s);
    setSubjects(s.defaultSubjects.map(sub => ({...sub}))); 
    setShowResults(false);
    setAiAdvice(null);
  };

  const restoreDefaultSubjects = () => {
    if (stream) {
      if (confirm(t.restore[lang] + '?')) {
        setSubjects(stream.defaultSubjects.map(sub => ({...sub})));
      }
    }
  };

  const handleGradeChange = (id, val) => {
    const num = parseFloat(val);
    setSubjects(prev => prev.map(s => 
      s.id === id ? { ...s, grade: isNaN(num) ? undefined : Math.min(Math.max(num, 0), 20) } : s
    ));
  };

  const handleCoeffChange = (id, val) => {
    const num = parseFloat(val);
    if (isNaN(num)) return;
    setSubjects(prev => prev.map(s => 
      s.id === id ? { ...s, coefficient: num } : s
    ));
  };

  const addCustomSubject = () => {
    const newId = `custom_${Date.now()}`;
    const newSub = {
      id: newId,
      name: { ar: 'مادة جديدة', fr: 'Nouvelle Matière', en: 'New Subject' },
      coefficient: 1,
      isCustom: true
    };
    setSubjects([...subjects, newSub]);
  };

  const removeSubject = (id) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  const triggerAiAnalysis = async () => {
    if (!level || !stream) return;
    setAiLoading(true);
    const advice = await getAcademicAdvice(
      subjects,
      currentAvg,
      parseFloat(targetAvg) || 10,
      level.name[lang],
      stream.name[lang],
      lang
    );
    setAiAdvice(advice);
    setAiLoading(false);
  };

  // --- Render Steps ---

  const renderLevelSelection = () => html`
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
      ${EDUCATION_SYSTEM.map((l) => html`
        <button
          key=${l.id}
          onClick=${() => handleLevelSelect(l)}
          className=${`p-6 rounded-xl border-2 transition-all duration-200 text-start flex items-center justify-between group
            ${level?.id === l.id 
              ? 'border-emerald-500 bg-emerald-50 shadow-md' 
              : 'border-gray-200 bg-white hover:border-emerald-300 hover:shadow-sm'
            }`}
        >
          <span className="font-semibold text-lg text-gray-800">${l.name[lang]}</span>
          ${isRTL 
            ? html`<${ChevronLeft} className="text-gray-400 group-hover:text-emerald-500" />`
            : html`<${ChevronRight} className="text-gray-400 group-hover:text-emerald-500" />`
          }
        </button>
      `)}
    </div>
  `;

  const renderStreamSelection = () => {
    if (!level || level.streams.length <= 1) return null;
    return html`
      <div className="space-y-4 mt-8 animate-fade-in">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <${BookOpen} className="w-5 h-5 text-emerald-600" />
          ${t.selectStream[lang]}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${level.streams.map((s) => html`
            <button
              key=${s.id}
              onClick=${() => handleStreamSelect(s)}
              className=${`p-5 rounded-xl border-2 transition-all duration-200 text-start
                ${stream?.id === s.id 
                  ? 'border-emerald-500 bg-emerald-50' 
                  : 'border-gray-200 bg-white hover:border-emerald-300'
                }`}
            >
               <span className="font-medium text-gray-700">${s.name[lang]}</span>
            </button>
          `)}
        </div>
      </div>
    `;
  };

  const renderCalculator = () => {
    if (!stream) return null;
    
    return html`
      <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg text-gray-700">${stream.name[lang]}</h3>
            ${showSaveMsg && html`<span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded animate-pulse">${t.savedMsg[lang]}</span>`}
          </div>
          <div className="flex gap-2">
             <button 
              onClick=${restoreDefaultSubjects}
              className="flex items-center gap-1 text-sm bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-200 text-gray-600"
              title=${t.restore[lang]}
            >
              <${RotateCcw} className="w-4 h-4" />
            </button>
            <button 
              onClick=${addCustomSubject}
              className="flex items-center gap-1 text-sm bg-white border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 text-gray-600"
            >
              <${Plus} className="w-4 h-4" />
              ${t.addSubject[lang]}
            </button>
            <button 
              onClick=${saveData}
              className="flex items-center gap-1 text-sm bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-100 text-emerald-700 font-medium"
            >
              <${Save} className="w-4 h-4" />
              ${t.save[lang]}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">${t.subject[lang]}</th>
                <th scope="col" className="px-6 py-3 w-24 text-center">${t.coeff[lang]}</th>
                <th scope="col" className="px-6 py-3 w-32 text-center">${t.grade[lang]}</th>
                <th scope="col" className="px-6 py-3 w-16"></th>
              </tr>
            </thead>
            <tbody>
              ${subjects.map((sub) => html`
                <tr key=${sub.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    ${sub.isCustom ? html`
                      <input 
                        type="text" 
                        defaultValue=${sub.name[lang]}
                        className="bg-transparent border-b border-gray-300 focus:border-emerald-500 outline-none w-full"
                        onBlur=${(e) => {
                          const newName = e.target.value;
                          setSubjects(prev => prev.map(s => s.id === sub.id ? {...s, name: {ar: newName, fr: newName, en: newName}} : s));
                        }}
                      />
                    ` : 
                      sub.name[lang]
                    }
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="number"
                      value=${sub.coefficient}
                      onChange=${(e) => handleCoeffChange(sub.id, e.target.value)}
                      className="w-16 text-center bg-gray-50 border border-gray-300 rounded-md py-1 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="number"
                      placeholder="--"
                      max="20"
                      min="0"
                      step="0.25"
                      value=${sub.grade ?? ''}
                      onChange=${(e) => handleGradeChange(sub.id, e.target.value)}
                      className=${`w-20 text-center border rounded-md py-1.5 font-bold outline-none focus:ring-2 transition-all
                        ${(sub.grade || 0) >= 10 
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700 focus:ring-emerald-500' 
                          : (sub.grade !== undefined ? 'border-red-200 bg-red-50 text-red-700 focus:ring-red-500' : 'border-gray-300 bg-white')
                        }`}
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick=${() => removeSubject(sub.id)} 
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title=${t.actions[lang]}
                    >
                      <${Trash2} className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              `)}
            </tbody>
          </table>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
           <!-- Target Input -->
           <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm w-full md:w-auto">
              <${TrendingUp} className="w-5 h-5 text-purple-500" />
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 font-medium">${t.setGoal[lang]}</span>
                <input 
                  type="number" 
                  placeholder="15" 
                  step="0.25"
                  className="font-bold text-gray-800 outline-none w-20"
                  value=${targetAvg}
                  onChange=${(e) => setTargetAvg(e.target.value)}
                />
              </div>
           </div>

           <!-- Results Display -->
           <div className="flex items-center gap-6">
              <div className="text-end">
                 <p className="text-sm text-gray-500">${t.yourAverage[lang]}</p>
                 <p className=${`text-3xl font-bold ${currentAvg >= 10 ? 'text-emerald-600' : 'text-red-500'}`}>
                   ${currentAvg.toFixed(2)}<span className="text-lg text-gray-400">/20</span>
                 </p>
              </div>
           </div>
        </div>
        
        <!-- Action Bar -->
        <div className="p-4 bg-white border-t flex flex-col sm:flex-row gap-3 justify-end">
           <button 
             onClick=${() => {
                setSubjects([]);
                setLevel(null);
                setStream(null);
                setHasSavedData(false);
             }}
             className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
           >
             ${t.reset[lang]}
           </button>
           
           <button 
             onClick=${triggerAiAnalysis}
             disabled=${aiLoading || !targetAvg}
             className=${`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white shadow-lg shadow-blue-500/30 transition-all
               ${aiLoading || !targetAvg 
                 ? 'bg-blue-300 cursor-not-allowed' 
                 : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl transform hover:-translate-y-0.5'
               }`}
           >
             ${aiLoading ? html`
               <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
             ` : html`
               <${Sparkles} className="w-5 h-5" />
             `}
             ${aiLoading ? t.loadingAi[lang] : t.getAiAdvice[lang]}
           </button>
        </div>
      </div>
    `;
  };

  const renderAdvice = () => {
    if (!aiAdvice) return null;
    return html`
      <div className="mt-8 bg-gradient-to-br from-indigo-50 to-white rounded-2xl shadow-lg border border-indigo-100 p-6 animate-fade-in relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        
        <h3 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2 relative z-10">
          <${Sparkles} className="w-5 h-5 text-indigo-500" />
          AI Advisor
        </h3>

        <div className="space-y-6 relative z-10">
          <div className="bg-white/60 p-4 rounded-xl backdrop-blur-sm border border-indigo-50">
            <h4 className="font-semibold text-indigo-800 mb-2">Analysis</h4>
            <p className="text-gray-700 leading-relaxed">${aiAdvice.analysis}</p>
          </div>

          <div className="bg-white/60 p-4 rounded-xl backdrop-blur-sm border border-indigo-50">
             <h4 className="font-semibold text-indigo-800 mb-2">Action Plan</h4>
             <ul className="space-y-2">
               ${aiAdvice.tips.map((tip, idx) => html`
                 <li key=${idx} className="flex items-start gap-2 text-gray-700">
                   <span className="flex-shrink-0 w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                     ${idx + 1}
                   </span>
                   ${tip}
                 </li>
               `)}
             </ul>
          </div>

          <div className="bg-indigo-600 text-white p-4 rounded-xl shadow-md">
            <p className="font-medium text-center italic">"${aiAdvice.encouragement}"</p>
          </div>
        </div>
      </div>
    `;
  };

  return html`
    <div className=${`min-h-screen bg-gray-50 flex flex-col font-sans ${isRTL ? 'text-right' : 'text-left'}`}>
      
      <!-- Header -->
      <header className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
               <${GraduationCap} className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight">${t.title[lang]}</h1>
              <p className="text-xs text-emerald-100 opacity-90 hidden sm:block">${t.subtitle[lang]}</p>
            </div>
          </div>
          <${LanguageSwitcher} current=${lang} onChange=${setLang} />
        </div>
      </header>

      <!-- Main Content -->
      <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
        
        <!-- Hero / Intro -->
        ${!level && html`
          <div className="text-center mb-12 animate-fade-in">
             <h2 className="text-3xl font-bold text-gray-800 mb-4 mt-8">${t.selectLevel[lang]}</h2>
             <p className="text-gray-500 max-w-lg mx-auto mb-6">
               ${lang === 'ar' 
                 ? 'ابدأ باختيار الطور الدراسي لحساب معدلك والحصول على نصائح مخصصة لتحسين نتائجك.' 
                 : lang === 'fr' 
                 ? 'Commencez par sélectionner votre niveau pour calculer votre moyenne et obtenir des conseils personnalisés.'
                 : 'Start by selecting your education level to calculate your GPA and get personalized tips.'}
             </p>
             ${hasSavedData && html`
                <button 
                  onClick=${loadData}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-emerald-500 text-emerald-600 rounded-xl font-bold hover:bg-emerald-50 transition-colors shadow-sm"
                >
                  <${History} className="w-5 h-5" />
                  ${t.resume[lang]}
                </button>
             `}
          </div>
        `}

        <!-- Wizard Steps -->
        <div className="space-y-6">
           ${renderLevelSelection()}
           ${renderStreamSelection()}
           ${renderCalculator()}
           ${renderAdvice()}
        </div>

      </main>
      
      <!-- Footer -->
      <footer className="bg-white border-t border-gray-200 mt-12 py-8">
        <div className="max-w-5xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© ${new Date().getFullYear()} Moyenne Dz Pro. Built with Khalil BAZ.</p>
        </div>
      </footer>
    </div>
  `;
};

export default App;