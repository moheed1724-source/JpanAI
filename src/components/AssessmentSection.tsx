import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { calculateScore, UserInput, AssessmentResult } from '../utils/scoring';
import { Lock, X, BarChart3, CheckCircle } from 'lucide-react';

export const AssessmentSection: React.FC = () => {
  const [step, setStep] = useState<'form' | 'result'>('form');
  const [loading, setLoading] = useState(false);
  const [showFullReport, setShowFullReport] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  
  // 新增的状态：控制弹窗里的提交和成功界面
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const [formData, setFormData] = useState<UserInput & { contact: string }>({
    degree: 'bachelor',
    eju: 550, // 默认 EJU 550分
    jlpt: 'N2',
    english: 'none',
    major: '经济学',
    city: '不限',
    contact: ''
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 🌟 动作 1：纯粹的 AI 评估（不收集信息，不提交表单）
  const handleGenerate = () => {
    setLoading(true);
    // 模拟 AI 运算时间，增加真实感
    setTimeout(() => {
      const scoreResult = calculateScore(formData as UserInput);
      setResult(scoreResult);
      setLoading(false);
      setStep('result');
      
      // 评估完成后，延迟 2.5 秒自动弹出“解锁完整报告”的留资窗口
      setTimeout(() => setShowFullReport(true), 2500);
    }, 1500); 
  };

  // 🌟 动作 2：用户在弹窗里输入联系方式并获取报告（此时才偷偷调用 Web3Forms）
  const submitLead = async () => {
    if (!formData.contact) {
      alert("请输入您的手机号或微信号！");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
  access_key: "a531da67-7614-4c7b-992d-e87c02d63ac2", // 保持你的Key不变
  '提醒': '🔔 收到新的日本留学AI评估留资！',
  '联系方式': formData.contact,
  '申请阶段': formData.degree === 'bachelor' ? '考学部' : '考修士',
  'EJU留考分数': formData.eju,
  '日语等级': formData.jlpt,
  '英语成绩': formData.english,
  '目标专业': formData.major,
  '偏好地区': formData.city
})
        })
      });

      if (response.ok) {
        // 提交成功，让弹窗变成打勾的成功状态
        setContactSubmitted(true);
      }
    } catch (error) {
      console.error("提交失败", error);
    }

    setIsSubmitting(false);
  };

  return (
    <section id="assessment" className="py-20 bg-jicai-dark relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-jicai-blue rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 className="text-3xl md:text-4xl font-bold text-white mb-4">AI 智能评估系统</motion.h2>
          <motion.p className="text-gray-400 max-w-2xl mx-auto">基于大数据算法，3分钟精准预测您的德国名校录取概率</motion.p>
        </div>

        <div className="max-w-4xl mx-auto bg-jicai-black/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <AnimatePresence mode="wait">
            {step === 'form' ? (
              <motion.div key="form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="p-8 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* 左侧：背景信息 */}
<div className="space-y-6">
  <div>
    <label className="block text-sm font-medium text-gray-400 mb-2">升学阶段</label>
    <div className="flex gap-4">
      {['bachelor', 'master'].map((type) => (
        <button key={type} onClick={() => handleInputChange('degree', type)} className={`flex-1 py-3 px-4 rounded-xl border transition-all ${formData.degree === type ? 'bg-jicai-blue/20 border-jicai-blue text-jicai-blue' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}>
          {type === 'bachelor' ? '学部 (本科)' : '大学院 (修士)'}
        </button>
      ))}
    </div>
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-400 mb-2">EJU 留考预估总分 (满分800)</label>
    <input type="range" min="300" max="800" step="10" value={formData.eju} onChange={(e) => handleInputChange('eju', parseInt(e.target.value))} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-jicai-blue" />
    <div className="flex justify-between mt-2 text-sm text-gray-500">
      <span>300</span><span className="text-jicai-blue font-bold text-lg">{formData.eju}</span><span>800</span>
    </div>
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-400 mb-2">日语 JLPT 等级</label>
    <select value={formData.jlpt} onChange={(e) => handleInputChange('jlpt', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-jicai-blue transition-colors">
      <option value="N1">N1 (精通)</option><option value="N2">N2 (熟练)</option><option value="N3">N3 (日常)</option><option value="other">无 / 其他</option>
    </select>
  </div>
</div>

                  {/* 右侧：意向信息 */}
<div className="space-y-6">
  <div>
    <label className="block text-sm font-medium text-gray-400 mb-2">目标专业大类</label>
    <select value={formData.major} onChange={(e) => handleInputChange('major', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-jicai-blue transition-colors">
      <option value="文科">文科综合 (社会/文学/教育)</option><option value="经济学">经济 / 经营 / 商学</option><option value="理科">理学 (数理化生)</option><option value="工科">工学 (机械/计算机等)</option><option value="医学">医学 / 药学</option>
    </select>
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-400 mb-2">外语附加项 (极大影响上位校录取)</label>
    <select value={formData.english} onChange={(e) => handleInputChange('english', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-jicai-blue transition-colors">
      <option value="toefl_80">托福 80分以上</option><option value="toeic_700">托业 700分以上</option><option value="none">暂无英语成绩</option>
    </select>
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-400 mb-2">偏好地区</label>
    <div className="flex flex-wrap gap-2">
      {['不限', '东京圈', '关西圈'].map((city) => (
        <button key={city} onClick={() => handleInputChange('city', city)} className={`px-4 py-2 rounded-lg text-sm border transition-all ${formData.city === city ? 'bg-jicai-blue/20 border-jicai-blue text-jicai-blue' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}>
          {city}
        </button>
      ))}
    </div>
  </div>
</div>

                <div className="mt-10">
                  <button onClick={handleGenerate} disabled={loading} className="w-full bg-jicai-blue hover:bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                    {loading ? 'AI 正在分析您的背景...' : '开始 AI 评估'}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-8 md:p-12">
                {/* 报告结果展示 */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle className="text-gray-700" strokeWidth="8" stroke="currentColor" fill="transparent" r="58" cx="64" cy="64" />
                        <circle className="text-jicai-blue" strokeWidth="8" strokeDasharray={365} strokeDashoffset={365 - (365 * (result?.score || 0)) / 100} strokeLinecap="round" stroke="currentColor" fill="transparent" r="58" cx="64" cy="64" />
                      </svg>
                      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-white">{result?.score}</span>
                        <span className="text-xs text-gray-400">竞争力评分</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">评估已完成</h3>
                      <p className="text-gray-400 max-w-xs">{result?.suggestion}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    <BarChart3 size={20} className="text-jicai-blue" /> 初步录取概率预测
                  </h4>
                  {result?.predictions.map((pred, i) => (
                    <motion.div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-white">{pred.name}</span>
                        </div>
                        <span className="font-bold text-white">{pred.probability}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                        <motion.div animate={{ width: `${pred.probability}%` }} className={`h-full rounded-full ${pred.probability < 40 ? 'bg-red-500' : pred.probability < 70 ? 'bg-jicai-blue' : 'bg-green-500'}`}></motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* 报告底部的解锁模块 */}
                <div className="bg-gradient-to-r from-jicai-blue/20 to-purple-500/20 rounded-xl p-6 border border-white/10 text-center relative overflow-hidden">
                  <div className="absolute inset-0 backdrop-blur-sm bg-black/20 z-0"></div>
                  <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-full"><Lock className="text-white" size={24} /></div>
                    <div>
                      <h4 className="text-white font-bold mb-1">解锁您的完整留德规划</h4>
                      <p className="text-gray-300 text-sm">包含详细的背景提升建议、同等条件真实成功案例</p>
                    </div>
                    <button onClick={() => setShowFullReport(true)} className="bg-white text-jicai-black font-bold py-3 px-8 rounded-lg hover:bg-gray-200 transition-colors shadow-lg shadow-white/20">
                      输入联系方式，免费获取报告
                    </button>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <button onClick={() => { setStep('form'); setContactSubmitted(false); }} className="text-gray-500 hover:text-white text-sm underline">返回重新评估</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 🌟 全新的引流与提交弹窗：盖在报告上 */}
      <AnimatePresence>
        {showFullReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowFullReport(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl z-10">
              <button onClick={() => setShowFullReport(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
              
              {!contactSubmitted ? (
                // 状态一：要求用户填写信息以解锁报告
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-jicai-black mb-2">获取详细评估报告</h3>
                  <p className="text-gray-600 mb-6 text-sm">AI 已为您生成初步结果。请输入联系方式，解锁完整的录取概率分析与专家一对一规划。</p>
                  
                  <div className="mb-6 text-left">
                    <label className="block text-sm font-medium text-gray-700 mb-2">手机号或微信号 <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      placeholder="用于接收完整报告"
                      value={formData.contact}
                      onChange={(e) => handleInputChange('contact', e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-jicai-blue transition-colors"
                    />
                  </div>
                  
                  <button 
                    onClick={submitLead} 
                    disabled={isSubmitting} 
                    className="w-full bg-jicai-blue hover:bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? '正在安全提交...' : '立即获取完整报告'}
                  </button>
                </div>
              ) : (
                // 状态二：提交成功后的界面
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="text-green-500" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-jicai-black mb-2">报告已生成！</h3>
                  <p className="text-gray-600 mb-6 text-sm">您的专属顾问已收到评估数据，将尽快联系您发送完整方案。</p>
                  
                  <div className="bg-gray-50 p-4 rounded-xl inline-block mb-4 border border-gray-100">
                    <div className="w-40 h-40 bg-white flex items-center justify-center rounded-lg border border-gray-200 mx-auto">
                       <img src="/qrcode.png" alt="WeChat QR Code" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    </div>
                  </div>
                  <div className="space-y-1 text-sm text-gray-500">
                    <p>您也可以主动扫码添加顾问</p>
                    <p className="font-bold text-jicai-blue">微信: jicaixiaokefu</p>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
