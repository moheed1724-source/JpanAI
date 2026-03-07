import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { calculateScore, UserInput, AssessmentResult } from '../utils/scoring';
import { Lock, X, CheckCircle } from 'lucide-react';
import qrcodeImg from '../qrcode.png';

export const AssessmentSection: React.FC = () => {
  const [step, setStep] = useState<'form' | 'result'>('form');
  const [loading, setLoading] = useState(false);
  const [showFullReport, setShowFullReport] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const [formData, setFormData] = useState<UserInput & { contact: string }>({
    degree: 'bachelor', eju: 550, jlpt: 'N2', english: 'none', major: '经济学', city: '不限', contact: ''
  });

  const updateForm = (field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      setResult(calculateScore(formData as UserInput));
      setLoading(false);
      setStep('result');
      setTimeout(() => setShowFullReport(true), 3000); 
    }, 1500); 
  };

  const submitLead = async () => {
    if (!formData.contact) return alert("请输入您的手机号或微信号！");
    setIsSubmitting(true);
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: "a531da67-7614-4c7b-992d-e87c02d63ac2", // 你的原版 Key
          subject: '🔔 收到新的日本留学AI评估留资！',
          '联系方式': formData.contact,
          '申请阶段': formData.degree === 'bachelor' ? '学部(本科)' : '大学院(修士)',
          'EJU预估分': formData.eju, '日语等级': formData.jlpt, '英语成绩': formData.english,
          '目标大类': formData.major, '意向地区': formData.city
        })
      });
      if (response.ok) setContactSubmitted(true);
    } catch (error) {}
    setIsSubmitting(false);
  };

  return (
    // 负边距 -mt-32 强行拉高，悬浮在Hero区块之上
    <section id="assessment" className="relative z-20 -mt-32 max-w-4xl mx-auto px-4 mb-24">
      <div className="bg-jp-dark/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-[0_0_50px_rgba(230,0,18,0.15)]">
        <AnimatePresence mode="wait">
          {step === 'form' ? (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="space-y-8">
                {/* 阶段与大类并排 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-3 border-l-2 border-jp-red pl-2">考学阶段</label>
                    <div className="flex gap-2">
                      {[ {v: 'bachelor', l: '考学部 (本科)'}, {v: 'master', l: '考大学院 (修士)'} ].map((t) => (
                        <button key={t.v} onClick={() => updateForm('degree', t.v)} 
                          className={`flex-1 py-3 rounded-xl font-bold transition-all border ${formData.degree === t.v ? 'bg-jp-red border-jp-red text-white' : 'bg-jp-black border-white/5 text-gray-400 hover:border-white/20'}`}>
                          {t.l}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-3 border-l-2 border-jp-red pl-2">目标专业大类</label>
                    <select value={formData.major} onChange={(e) => updateForm('major', e.target.value)} className="w-full bg-jp-black border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-jp-red transition-colors h-[50px]">
                      <option value="文科">文科综合 (社会/文学)</option><option value="经济学">经济 / 经营 / 商学</option><option value="理科">理学 (数理化生)</option><option value="工科">工学 (机械/信息)</option>
                    </select>
                  </div>
                </div>

                {/* EJU 滑动条 */}
                <div className="bg-jp-black p-6 rounded-2xl border border-white/5">
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-sm font-bold text-white">EJU 留考预估总分</label>
                    <span className="text-3xl font-black text-jp-pink">{formData.eju} <span className="text-sm text-gray-500 font-normal">/800</span></span>
                  </div>
                  <input type="range" min="300" max="800" step="10" value={formData.eju} onChange={(e) => updateForm('eju', parseInt(e.target.value))} className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer accent-jp-red" />
                </div>

                {/* 外语条件并排 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-3 border-l-2 border-jp-red pl-2">JLPT 日语等级</label>
                    <div className="grid grid-cols-4 gap-2">
                      {['N1', 'N2', 'N3', '无'].map(lv => (
                        <button key={lv} onClick={() => updateForm('jlpt', lv === '无' ? 'other' : lv)} className={`py-3 rounded-lg text-sm transition-all border ${formData.jlpt === (lv === '无' ? 'other' : lv) ? 'bg-jp-red/20 border-jp-red text-jp-pink' : 'bg-jp-black border-white/5 text-gray-400 hover:border-white/20'}`}>
                          {lv}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-3 border-l-2 border-jp-red pl-2">英语成绩 (上位校必看)</label>
                    <select value={formData.english} onChange={(e) => updateForm('english', e.target.value)} className="w-full bg-jp-black border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-jp-red transition-colors h-[46px]">
                      <option value="none">暂无可用英语成绩</option><option value="toefl_80">托福 80+ / 雅思 6.0+</option><option value="toeic_700">托业 700+</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <button onClick={handleGenerate} disabled={loading} className="w-full bg-gradient-to-r from-jp-red to-[#b0000d] hover:to-jp-red text-white font-bold py-5 rounded-xl shadow-lg shadow-jp-red/20 transition-all text-lg">
                  {loading ? 'AI 算法匹配中...' : '免费生成日本升学方案'}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">出愿匹配分析完成</h3>
                <p className="text-gray-400 text-sm bg-white/5 p-4 rounded-xl">{result?.suggestion}</p>
              </div>

              <div className="space-y-3 mb-8">
                {result?.predictions.map((pred, i) => (
                  <div key={i} className="bg-jp-black border border-white/5 hover:border-white/20 transition-colors rounded-xl p-5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white text-lg">{pred.name}</span>
                      <span className={`ml-3 text-xs px-2 py-1 rounded ${pred.type==='reach'?'bg-red-500/20 text-red-400': pred.type==='match'?'bg-green-500/20 text-green-400':'bg-blue-500/20 text-blue-400'}`}>
                        {pred.type==='reach'?'冲刺': pred.type==='match'?'相符':'保底'}
                      </span>
                    </div>
                    <div className="text-jp-pink font-bold">{pred.probability}% 录取率</div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-jp-red/20 to-jp-pink/10 rounded-xl p-6 text-center border border-jp-red/30">
                <div className="p-3 bg-white/10 rounded-full inline-block mb-3"><Lock className="text-jp-pink" size={24} /></div>
                <h4 className="text-white font-bold mb-2">解锁目标大学出愿时间与校内考真题</h4>
                <button onClick={() => setShowFullReport(true)} className="bg-white text-jp-black font-bold py-3 px-8 rounded-lg mt-2 hover:bg-gray-200">
                  输入联系方式，获取完整资料包
                </button>
              </div>
              
              <div className="mt-6 text-center">
                <button onClick={() => setStep('form')} className="text-gray-500 hover:text-white text-sm underline">重新评估</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 留资漏斗：保证跟之前一样的功能 */}
      <AnimatePresence>
        {showFullReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowFullReport(false)}></div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="relative bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl z-10">
              <button onClick={() => setShowFullReport(false)} className="absolute top-4 right-4 text-gray-400"><X size={24} /></button>
              
              {!contactSubmitted ? (
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-jp-black mb-2">获取详细升学资料</h3>
                  <p className="text-gray-600 mb-6 text-sm">解锁包含各大学出愿时间线、历年分数线及校内考备考指南的完整内部资料包。</p>
                  
                  <div className="mb-6 text-left">
                    <label className="block text-sm font-medium text-gray-700 mb-2">手机号或微信号 <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="接收方案与资料用" value={formData.contact} onChange={(e) => updateForm('contact', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-jp-red" />
                  </div>
                  
                  <button onClick={submitLead} disabled={isSubmitting} className="w-full bg-jp-red hover:bg-red-700 text-white font-bold py-3 rounded-xl">
                    {isSubmitting ? '正在安全提交...' : '立即获取完整报告'}
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="text-green-500" size={32} /></div>
                  <h3 className="text-2xl font-bold text-jp-black mb-2">资料已生成！</h3>
                  <p className="text-gray-600 mb-6 text-sm">您的专属考学顾问已收到需求，将尽快联系您发送资料。</p>
                  <img src={qrcodeImg} alt="WeChat QR Code" className="w-40 h-40 mx-auto border" />
                  <p className="text-sm mt-2 text-jp-red font-bold">扫码也可直接获取</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
