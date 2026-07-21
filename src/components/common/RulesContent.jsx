"use client";
import React from "react";
import { 
  FileText, 
  HelpCircle, 
  HeartHandshake, 
  ShieldAlert, 
  UserPlus, 
  CalendarDays, 
  AlertTriangle, 
  Users, 
  SearchCheck, 
  FileSpreadsheet, 
  Scale, 
  Info,
  Flame,
  Fingerprint
} from "lucide-react";
import { useSidebarColor } from "../../hooks/useSidebarColor";

const RulesContent = () => {
  const sidebarColor = useSidebarColor();

  const rules = [
    {
      id: "1",
      icon: FileText,
      title: "સહાય માટે અરજી ફરજિયાત",
      desc: "જે કોઈ વ્યક્તિને ગ્રુપ તરફથી આર્થિક સહાયની જરૂર હોય, તેણે વેબસાઇટમાં ઉપલબ્ધ સહાય અરજી ફોર્મ સંપૂર્ણ અને સાચી માહિતી સાથે ભરવું ફરજિયાત રહેશે. ફોર્મ ભર્યા વગર કોઈપણ પ્રકારની સહાય આપવામાં આવશે નહીં."
    },
    {
      id: "2",
      icon: SearchCheck,
      title: "સહાય મેળવવાની પાત્રતા",
      desc: "માત્ર એવા અરજદારોની અરજી પર વિચાર કરવામાં આવશે જેમનો અંદાજિત અથવા થયેલો ખર્ચ ₹75,000 અથવા તેથી વધુ હોય. જો જરૂરી લાગશે તો ગ્રુપ સમિતિ સ્થળ તપાસ પણ કરી શકશે."
    },
    {
      id: "3",
      icon: FileSpreadsheet,
      title: "સંપૂર્ણ તપાસ બાદ જ સહાય",
      desc: "અરજી મળ્યા બાદ અરજદારની તમામ માહિતી, જરૂરી દસ્તાવેજો અને પરિસ્થિતિની સંપૂર્ણ તપાસ કરવામાં આવશે. તપાસ પૂર્ણ થયા બાદ જ ગ્રુપ સમિતિ અંતિમ નિર્ણય કરશે કે સહાય આપવી કે નહીં. ગ્રુપનો નિર્ણય અંતિમ અને સર્વમાન્ય રહેશે."
    },
    {
      id: "4",
      icon: UserPlus,
      title: "સભ્યપદ ફરજિયાત",
      desc: "જે પરિવારે ગ્રુપ તરફથી સહાય મેળવી હશે, તે પરિવારમાંથી ઓછામાં ઓછો એક સભ્ય ગ્રુપમાં જોડાશે. આ નિયમનો હેતુ માત્ર સભ્યો વધારવાનો નથી, પરંતુ આજે સહાય મેળવનાર વ્યક્તિ આવતીકાલે બીજા કોઈ જરૂરિયાતમંદ વ્યક્તિની મદદ કરી શકે તેવો સેવા સંકલ્પ છે."
    },
    {
      id: "5",
      icon: CalendarDays,
      title: "માસિક ફંડ સમયસર જમા કરાવવું",
      desc: "દરેક સભ્યે દર મહીનાની 1લી તારીખથી 10મી તારીખ દરમિયાન પોતાનો માસિક ફંડ ફરજિયાત રીતે જમા કરાવવાનો રહેશે. જે સભ્યને ફંડ એકત્રિત કરવાની જવાબદારી સોંપવામાં આવી હશે, તેની ફરજ રહેશે કે દરેક સભ્યે સમયસર યાદ કરાવે અને નક્કી કરેલી તારીખ પહેલાં ફંડ જમા કરાવે."
    },
    {
      id: "6",
      icon: ShieldAlert,
      title: "ગ્રુપ છોડનાર માટેનો કડક નિયમ",
      desc: "જો કોઈ સભ્ય પોતાની ઇચ્છાથી ગ્રુપ છોડશે, તો ભવિષ્યમાં કોઈપણ સમયે આ ગ્રુપ પાસેથી આર્થિક સહાય મેળવવાનો અધિકાર રહેશે નહીં. આ ગ્રુપનો કડક અને અંતિમ નિયમ છે."
    },
    {
      id: "7",
      icon: AlertTriangle,
      title: "કોઈની વાતમાં આવીને ગ્રુપ ન છોડવું",
      desc: "જો કોઈ સભ્ય કોઈની વાતમાં આવીને ગ્રુપ છોડવાનો નિર્ણય લેતો હોય, તો પહેલા ગ્રુપના મુખ્ય સભ્યો અથવા સમિતિ સાથે ચર્ચા કરીને સંપૂર્ણ હકીકત જાણી લેવી. ઉતાવળમાં લેવામાં આવેલ નિર્ણય ભવિષ્યમાં પસ્તાવો કરાવી શકે છે."
    },
    {
      id: "8",
      icon: Info,
      title: "ગ્રુપ પોતાની જવાબદારી સ્વીકારે છે",
      desc: "જો ગ્રુપ તરફથી કોઈપણ પ્રકારની ભૂલ થશે, તો ગ્રુપ તે ભૂલ સ્વીકારી યોગ્ય સુધારો કરવા માટે સંપૂર્ણ જવાબદારી નિભાવશે."
    },
    {
      id: "9",
      icon: Flame,
      title: "સાચી માહિતી આપવી ફરજિયાત",
      desc: "અરજીમાં ખોટી માહિતી, ખોટા દસ્તાવેજો અથવા ગેરમાર્ગે દોરતી માહિતી આપનાર વ્યક્તિની અરજી તરત જ રદ કરવામાં આવશે અને જરૂર પડે તો તેની સામે યોગ્ય કાર્યવાહી પણ કરવામાં આવશે."
    },
    {
      id: "10",
      icon: HeartHandshake,
      title: "સહાયનો યોગ્ય ઉપયોગ",
      desc: "ગ્રુપ દ્વારા આપવામાં આવેલી સહાયનો ઉપયોગ માત્ર દર્શાવેલા હેતુ માટે જ કરવો રહેશે. સહાયનો દુરુપયોગ થતો જણાશે તો ભવિષ્યમાં સહાય મેળવવાનો અધિકાર રદ થઈ શકે છે."
    },
    {
      id: "11",
      icon: Users,
      title: "આદર, વિશ્વાસ અને ભાઈચારો",
      desc: "દરેક સભ્યે એકબીજા સાથે આદર, વિશ્વાસ, પ્રેમ અને ભાઈચારાથી વર્તન કરવું ફરજિયાત રહેશે. કોઈપણ પ્રકારના વિવાદ, અપમાનજનક વર્તન અથવા ગ્રુપની પ્રતિષ્ઠાને નુકસાન પહોંચાડે તેવું વર્તન સ્વીકાર્ય રહેશે નહીં."
    },
    {
      id: "12",
      icon: Fingerprint,
      title: "વ્યક્તિગત માહિતીની ગુપ્તતા",
      desc: "અરજદાર દ્વારા આપવામાં આવેલી તમામ માહિતી અને દસ્તાવેજો સંપૂર્ણ ગુપ્ત રાખવામાં આવશે. તેની માહિતીનો ઉપયોગ માત્ર સહાય પ્રક્રિયા માટે જ કરવામાં આવશે."
    },
    {
      id: "13",
      icon: Scale,
      title: "ગ્રુપનો નિર્ણય સર્વોપરી",
      desc: "સહાય મંજૂર કરવી કે નહીં, સહાયની રકમ, તપાસ અને અન્ય તમામ બાબતોમાં ગ્રુપ સમિતિનો નિર્ણય અંતિમ અને સર્વમાન્ય રહેશે."
    },
    {
      id: "14",
      icon: HelpCircle,
      title: "નિયમોમાં ફેરફાર કરવાનો અધિકાર",
      desc: "સમય, પરિસ્થિતિ અને જરૂરિયાત મુજબ ગ્રુપ નવા નિયમો ઉમેરી શકે છે અથવા હાલના નિયમોમાં સુધારા કરી શકે છે. આવા તમામ નિયમો દરેક સભ્ય માટે ફરજિયાત રહેશે."
    }
  ];

  return (
    <div className="w-full space-y-10 py-6 max-w-7xl mx-auto font-sans text-slate-800">
      
      {/* Pledge Card */}
      <div 
        style={{ borderColor: `#${sidebarColor}25` }}
        className="w-full bg-white border rounded-[2.5rem] p-6 sm:p-10 shadow-xs relative overflow-hidden transition-all duration-300 hover:shadow-sm"
      >
        <div 
          style={{ backgroundColor: `#${sidebarColor}08` }}
          className="absolute inset-0 bg-radial-gradient opacity-40 pointer-events-none"
        />
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
          <div 
            style={{ 
              backgroundColor: `#${sidebarColor}12`,
              color: `#${sidebarColor}`
            }}
            className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 border border-white shadow-xs"
          >
            <HeartHandshake size={32} className="animate-pulse" />
          </div>
          <div className="space-y-3 text-center md:text-left">
            <span 
              style={{
                color: `#${sidebarColor}`,
                backgroundColor: `#${sidebarColor}10`,
                borderColor: `#${sidebarColor}20`
              }}
              className="inline-block text-xs font-black uppercase tracking-widest border px-3 py-1 rounded-full"
            >
              અમારી પ્રતિજ્ઞા
            </span>
            <h3 className="text-2xl font-black text-slate-900 leading-tight">
              &ldquo;માનવ સેવા એ જ સર્વોત્તમ સેવા.&rdquo;
            </h3>
            <p className="text-slate-500 text-sm font-semibold max-w-3xl leading-relaxed">
              CHHAPI DONATION GROUP નો મુખ્ય હેતુ જરૂરિયાતમંદ પરિવારોને યોગ્ય સમયે, સંપૂર્ણ પારદર્સિતા, નિષ્પક્ષતા અને વિશ્વાસ સાથે આર્થિક સહાય પહોંચાડવાનો છે. ગ્રુપનો દરેક નિર્ણય સમિતિ દ્વારા યોગ્ય તપાસ અને સર્વસંમતિથી લેવામાં આવશે.
            </p>
          </div>
        </div>
      </div>

      {/* Rules Grid */}
      <div className="space-y-6">
        <div className="px-2">
          <h4 className="text-lg font-black text-slate-900 tracking-tight">નિયમો અને શરતો (Rules & Regulations)</h4>
          <p className="text-slate-500 text-xs mt-0.5 font-semibold">ગ્રુપના સુચારુ સંચાલન માટે દરેક સભ્યે નિયમોનું પાલન કરવું ફરજિયાત છે</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rules.map((rule) => (
            <div 
              key={rule.id}
              className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex gap-4 group"
            >
              <div 
                style={{ 
                  backgroundColor: `#${sidebarColor}08`,
                  color: `#${sidebarColor}`
                }}
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border border-slate-100/50 group-hover:scale-105 transition-transform duration-300"
              >
                <rule.icon size={22} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span 
                    style={{ color: `#${sidebarColor}` }}
                    className="text-sm font-black"
                  >
                    {rule.id}.
                  </span>
                  <h5 className="font-extrabold text-slate-900 tracking-tight text-base">
                    {rule.title}
                  </h5>
                </div>
                <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                  {rule.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Request Footer Card */}
      <div 
        style={{ borderColor: `#${sidebarColor}20` }}
        className="w-full bg-slate-900 text-white rounded-[2.5rem] p-8 sm:p-10 shadow-lg relative overflow-hidden"
      >
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
            <HeartHandshake size={28} className="text-teal-400" />
            <h4 className="text-xl font-black tracking-tight">🤝 અમારી નમ્ર વિનંતી</h4>
          </div>
          <p className="text-slate-300 text-sm font-semibold leading-relaxed max-w-3xl">
            CHHAPI DONATION GROUP માત્ર એક ગ્રુપ નથી, પરંતુ <span className="text-teal-300 font-bold">માનવતા, વિશ્વાસ, સેવા અને એકતાનો પરિવાર છે.</span> દરેક સભ્યનો નાનો ફાળો કોઈ એક પરિવારના જીવનમાં નવી આશા અને નવું સ્મિત લાવી શકે છે. ચાલો, સૌ મળીને એક એવો સમાજ બનાવીએ જ્યાં જરૂરિયાતમંદ વ્યક્તિ ક્યારેય એકલો ન અનુભવાય.
          </p>
          <div className="border-t border-slate-800 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition duration-300">
              <p className="text-xs font-bold text-teal-300 leading-relaxed uppercase tracking-wider mb-1">મહત્વનો સેવા સંકલ્પ</p>
              <p className="text-xs font-extrabold text-slate-200 leading-relaxed">
                &ldquo;આજે તમે કોઈના દુઃખમાં સાથ આપશો, તો આવતી કાલે તમારી મુશ્કેલીમાં આખું ગ્રુપ તમારી સાથે ખભે ખભા મિલાવીને ઊભું રહેશે.&rdquo;
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition duration-300">
              <p className="text-xs font-bold text-amber-300 leading-relaxed uppercase tracking-wider mb-1">દાનનું મહત્વ</p>
              <p className="text-xs font-extrabold text-slate-200 leading-relaxed">
                &ldquo;દાનથી સંપત્તિ ઓછી થતી નથી, પરંતુ માનવતા અને વિશ્વાસ અનેક ગણો વધે છે.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default RulesContent;
