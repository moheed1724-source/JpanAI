import React from 'react';
import { motion } from 'motion/react';
import { Target, BookOpen, GraduationCap, PlaneTakeoff } from 'lucide-react';

export const Hero: React.FC<{ scrollToAssessment: () => void }> = () => {
  return (
    <section id="home" className="relative pt-32 pb-48 flex flex-col justify-center items-center text-center bg-jp-black overflow-hidden">
      {/* 沉浸式日式和风光晕背景 */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-jp-red/20 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-jp-pink/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-4 relative z-10 flex flex-col items-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="flex flex-col items-center">
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-jp-red/30 bg-jp-red/10 text-jp-pink text-xs font-bold tracking-widest uppercase">
             <span className="w-2 h-2 rounded-full bg-jp-red animate-pulse"></span>
             2024 日本考学 EJU 出愿系统全面升级
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight tracking-tight mb-6">
            精准出愿预测，剑指 <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-jp-red to-jp-pink">
              七帝大 & 早庆上
            </span>
          </h1>
          
          <p className="text-lg text-gray-400 max-w-2xl leading-relaxed mb-10">
            拒绝盲目报考！依托近10年日本私塾与语校升学大数据。立刻在下方使用 AI 工具，免费生成您的专属保底与冲刺方案。
          </p>
        </motion.div>

        {/* 顶部数据条 */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
           {[
             { icon: <Target size={20}/>, num: "800+", label: "帝国大学录取" },
             { icon: <BookOpen size={20}/>, num: "150+", label: "合作优良语校" },
             { icon: <GraduationCap size={20}/>, num: "3500+", label: "成功赴日学子" },
             { icon: <PlaneTakeoff size={20}/>, num: "99%", label: "在留下发率" }
           ].map((stat, i) => (
             <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-xl flex flex-col items-center text-center backdrop-blur-sm">
                <div className="text-jp-pink mb-1">{stat.icon}</div>
                <div className="text-xl font-bold text-white">{stat.num}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
             </div>
           ))}
        </motion.div>
      </div>
    </section>
  );
};
