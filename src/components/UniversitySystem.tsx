import React, { useRef, useState, useEffect } from 'react';

// 日本顶尖大学数据
const universities = [
  { name: "东京大学", en: "The University of Tokyo", desc: "日本最高学术殿堂，七帝大之首。", image: "https://upload.wikimedia.org/wikipedia/zh/thumb/1/14/The_University_of_Tokyo_logo.svg/512px-The_University_of_Tokyo_logo.svg.png", link: "#" },
  { name: "京都大学", en: "Kyoto University", desc: "关西最高学府，科研实力极强。", image: "https://upload.wikimedia.org/wikipedia/zh/thumb/4/4c/Kyoto_University_logo.svg/512px-Kyoto_University_logo.svg.png", link: "#" },
  { name: "早稻田大学", en: "Waseda University", desc: "日本私立双雄之一，政治与商科顶尖。", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Waseda_University_Logo.svg/512px-Waseda_University_Logo.svg.png", link: "#" },
  { name: "庆应义塾大学", en: "Keio University", desc: "私立双雄之一，被誉为企业家的摇篮。", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Keio_University_logo.svg/512px-Keio_University_logo.svg.png", link: "#" },
  { name: "大阪大学", en: "Osaka University", desc: "理工科与医学实力全日名列前茅。", image: "https://upload.wikimedia.org/wikipedia/zh/thumb/3/30/Osaka_University_logo.svg/512px-Osaka_University_logo.svg.png", link: "#" }
];

const duplicatedUniversities = [...universities, ...universities, ...universities];

export const UniversitySystem: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    let animationId: number;
    const scroll = () => {
      if (scrollRef.current && !isDown) {
        scrollRef.current.scrollLeft += 1;
        if (scrollRef.current.scrollLeft >= scrollRef.current.scrollWidth / 2) {
          scrollRef.current.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(scroll);
    };
    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [isDown]);

  return (
    <section id="system" className="py-20 bg-jp-black overflow-hidden relative">
      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
      <div className="max-w-7xl mx-auto px-4 mb-12 relative z-20">
        <h2 className="text-3xl font-bold text-white mb-2 border-l-4 border-jp-red pl-4">日本名校掠影</h2>
        <p className="text-gray-400 pl-4">七帝大、早庆上、MARCH... 开启你的梦中情校</p>
      </div>

      <div className="relative w-full">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-jp-black to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-jp-black to-transparent z-10 pointer-events-none"></div>
        
        <div ref={scrollRef} 
             onMouseDown={(e) => { setIsDown(true); setStartX(e.pageX - scrollRef.current!.offsetLeft); setScrollLeft(scrollRef.current!.scrollLeft); }}
             onMouseLeave={() => setIsDown(false)} onMouseUp={() => setIsDown(false)}
             onMouseMove={(e) => { if (!isDown) return; e.preventDefault(); scrollRef.current!.scrollLeft = scrollLeft - (e.pageX - scrollRef.current!.offsetLeft - startX) * 2; }}
             className={`flex gap-6 px-32 overflow-x-auto hide-scrollbar pb-8 pt-4 ${isDown ? 'cursor-grabbing' : 'cursor-grab'}`}>
          {duplicatedUniversities.map((uni, index) => (
            <div key={index} className="w-[300px] shrink-0 group relative rounded-2xl bg-jp-dark border-t-4 border-jp-red border-x border-b border-white/5 hover:border-jp-pink transition-all block shadow-lg">
              <div className="h-40 bg-white p-6 flex items-center justify-center rounded-t-xl">
                <img src={uni.image} alt={uni.name} className="max-w-full max-h-full object-contain pointer-events-none" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-jp-pink transition-colors">{uni.name}</h3>
                <p className="text-sm text-gray-400 mb-3">{uni.en}</p>
                <p className="text-gray-500 text-sm">{uni.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
