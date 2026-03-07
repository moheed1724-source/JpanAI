import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Target, BookOpen, GraduationCap } from 'lucide-react';

export const Hero: React.FC<{ scrollToAssessment: () => void }> = ({ scrollToAssessment }) => {
  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-center items-center text-center bg-jp-black overflow-hidden pt-20">
      {/* 日式和风光晕背景 */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-jp-red/20 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-jp-pink/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-4 relative z-10 flex flex-col items-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="flex flex-col items-center">
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-jp-red/30 bg-jp-red/10 text-jp-pink text-xs font-bold tracking-widest uppercase">
             <span className="w-2 h-2 rounded-full bg-jp-red animate-pulse"></span>
             2024 日本考学 EJU/出愿系统全新上线
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight tracking-tight mb-6">
            精准预测，剑指 <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-jp-red to-jp-pink">
              七帝大 & 早庆上
            </span>
          </h1>
          
          <p className="text-lg text-gray-400 max-w-2xl leading-relaxed mb-10">
            拒绝盲目报考！依托近10年日本私塾与语校升学大数据。仅需3分钟，AI 为您精准匹配保底、相符与冲刺院校方案。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <button onClick={scrollToAssessment} className="px-10 py-4 bg-jp-red hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-jp-red/30 transition-all flex items-center justify-center gap-2 group transform hover:scale-105">
              立即启动 AI 评估
              <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </button>
            <button onClick={() => document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' })} className="px-10 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all backdrop-blur-sm flex items-center justify-center gap-2">
              查看日本升学时间轴
            </button>
          </div>
        </motion.div>

        {/* 数据悬浮窗 */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
           {[
             { icon: <Target size={20}/>, num: "800+", label: "帝国大学录取" },
             { icon: <BookOpen size={20}/>, num: "150+", label: "合作优良语校" },
             { icon: <GraduationCap size={20}/>, num: "3500+", label: "成功赴日学子" },
             { icon: <ChevronRight size={20}/>, num: "99%", label: "在留下发率" }
           ].map((stat, i) => (
             <div key={i} className="bg-jp-dark/50 border border-white/5 p-6 rounded-2xl flex flex-col items-center text-center backdrop-blur-sm hover:border-jp-red/30 transition-colors">
                <div className="text-jp-pink mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-white mb-1">{stat.num}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
             </div>
           ))}
        </motion.div>
      </div>
    </section>
  );
};
