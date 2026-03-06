export interface AssessmentResult {
  score: number;
  predictions: { name: string; probability: number; type: 'reach' | 'match' | 'safety'; }[];
  suggestion: string;
}

// 针对日本留学的用户输入模型
export interface UserInput {
  degree: 'bachelor' | 'master'; // 考学部(本科) / 考大学院(修士)
  eju: number; // EJU留考预估总分 (0-800)
  jlpt: 'N1' | 'N2' | 'N3' | 'other'; // 日语等级
  english: 'toefl_80' | 'toeic_700' | 'none'; // 英语成绩
  major: string;
  city: string;
}

import universitiesData from '../data/universities.json';

export const calculateScore = (input: UserInput): AssessmentResult => {
  let score = 0;

  // 1. EJU 留考得分体系 (满分800)
  if (input.eju >= 700) score += 40;
  else if (input.eju >= 650) score += 32;
  else if (input.eju >= 600) score += 25;
  else if (input.eju >= 500) score += 15;
  else score += 5;

  // 2. 日语 JLPT 加成
  const jlptScores: Record<string, number> = { 'N1': 30, 'N2': 20, 'N3': 10, 'other': 0 };
  score += jlptScores[input.jlpt] || 0;

  // 3. 英语加成 (日本上位校极看重英语)
  const engScores: Record<string, number> = { 'toefl_80': 20, 'toeic_700': 15, 'none': 0 };
  score += engScores[input.english] || 0;

  // ================= 智能过滤与匹配逻辑 =================
  let relevantUnis = universitiesData.filter(uni => uni.majors.includes(input.major));
  if (relevantUnis.length === 0) relevantUnis = universitiesData.slice(0, 5); 

  const predictions = relevantUnis.map(uni => {
    let prob = 50; 
    
    // EJU 差距影响
    let ejuDiff = input.eju - uni.minEju;
    prob += ejuDiff * 0.2; // 差10分影响2%概率

    // 日语硬性要求判定
    if (uni.minJlpt === 'N1' && input.jlpt !== 'N1') prob -= 30;
    if (uni.minJlpt === 'N2' && ['N3', 'other'].includes(input.jlpt)) prob -= 25;

    // 英语硬性要求判定
    if (uni.reqEnglish && input.english === 'none') prob -= 35;

    // 城市偏好
    if (input.city !== '不限' && (
      (input.city === '东京圈' && ['东京大学', '早稻田大学', '庆应义塾大学', '上智大学', '明治大学', '立教大学', '中央大学', '法政大学', '日本大学', '东洋大学'].includes(uni.name)) ||
      (input.city === '关西圈' && ['京都大学', '大阪大学', '关西大学', '立命馆大学'].includes(uni.name))
    )) { prob += 10; }

    prob = Math.max(5, Math.min(98, prob));

    let type: 'reach' | 'match' | 'safety';
    if (prob < 40) type = 'reach'; 
    else if (prob < 75) type = 'match'; 
    else type = 'safety'; 

    return { name: uni.name, probability: Math.round(prob), type };
  });

  const sortedPredictions = predictions.sort((a, b) => b.probability - a.probability);
  
  const reach = sortedPredictions.find(p => p.type === 'reach');
  const match = sortedPredictions.find(p => p.type === 'match');
  const safety = sortedPredictions.find(p => p.type === 'safety');

  const displayPredictions = [];
  if (reach) displayPredictions.push(reach);
  if (match) displayPredictions.push(match);
  if (safety) displayPredictions.push(safety);
  
  while (displayPredictions.length < 4 && displayPredictions.length < sortedPredictions.length) {
    const nextUni = sortedPredictions.find(p => !displayPredictions.includes(p));
    if (nextUni) displayPredictions.push(nextUni); else break;
  }

  // 4. 生成专业评语
  let suggestion = "";
  if (input.eju < 500) {
    suggestion = `您的 EJU 预估分目前基础较薄弱。想要考入好大学，建议加强留考文/理科目的刷题，并重点提升日语听读能力。`;
  } else if (input.jlpt !== 'N1' && input.english === 'none') {
    suggestion = `您的分数有机会冲击 MARCH 级别院校！但由于缺少英语成绩（托福/托业），无法报考上位校。建议突击一下英语。`;
  } else if (score >= 80) {
    suggestion = `极具竞争力的学术背景！您完全有实力通过校内考冲击帝国大学或早庆上。建议提早准备志望理由书与面试。`;
  } else {
    suggestion = `您的背景中规中矩，建议采取“冲刺上位校 + 保底日东驹专”的出愿策略，切勿错过大学的出愿时间。`;
  }

  return {
    score,
    predictions: displayPredictions.sort((a, b) => a.probability - b.probability),
    suggestion
  };
};
