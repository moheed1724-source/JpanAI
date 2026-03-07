export interface AssessmentResult {
  score: number;
  predictions: { name: string; probability: number; type: 'reach' | 'match' | 'safety'; }[];
  suggestion: string;
}

export interface UserInput {
  degree: 'bachelor' | 'master'; 
  eju: number; 
  jlpt: 'N1' | 'N2' | 'N3' | 'other'; 
  english: 'toefl_80' | 'toeic_700' | 'none'; 
  major: string;
  city: string;
}

import universitiesData from '../data/universities.json';

export const calculateScore = (input: UserInput): AssessmentResult => {
  let score = 0;

  if (input.eju >= 700) score += 40;
  else if (input.eju >= 650) score += 32;
  else if (input.eju >= 600) score += 25;
  else if (input.eju >= 500) score += 15;
  else score += 5;

  const jlptScores: Record<string, number> = { 'N1': 30, 'N2': 20, 'N3': 10, 'other': 0 };
  score += jlptScores[input.jlpt] || 0;

  const engScores: Record<string, number> = { 'toefl_80': 20, 'toeic_700': 15, 'none': 0 };
  score += engScores[input.english] || 0;

  let relevantUnis = universitiesData.filter(uni => uni.majors.includes(input.major));
  if (relevantUnis.length === 0) relevantUnis = universitiesData.slice(0, 5); 

  const predictions = relevantUnis.map(uni => {
    let prob = 50; 
    let ejuDiff = input.eju - uni.minEju;
    prob += ejuDiff * 0.2; 

    if (uni.minJlpt === 'N1' && input.jlpt !== 'N1') prob -= 30;
    if (uni.minJlpt === 'N2' && ['N3', 'other'].includes(input.jlpt)) prob -= 25;
    if (uni.reqEnglish && input.english === 'none') prob -= 35;

    prob = Math.max(5, Math.min(98, prob));
    let type: 'reach' | 'match' | 'safety' = prob < 40 ? 'reach' : prob < 75 ? 'match' : 'safety';
    return { name: uni.name, probability: Math.round(prob), type };
  });

  const sortedPredictions = predictions.sort((a, b) => b.probability - a.probability);
  
  const displayPredictions = [];
  if (sortedPredictions.find(p => p.type === 'reach')) displayPredictions.push(sortedPredictions.find(p => p.type === 'reach')!);
  if (sortedPredictions.find(p => p.type === 'match')) displayPredictions.push(sortedPredictions.find(p => p.type === 'match')!);
  if (sortedPredictions.find(p => p.type === 'safety')) displayPredictions.push(sortedPredictions.find(p => p.type === 'safety')!);
  
  while (displayPredictions.length < 4 && displayPredictions.length < sortedPredictions.length) {
    const nextUni = sortedPredictions.find(p => !displayPredictions.includes(p));
    if (nextUni) displayPredictions.push(nextUni); else break;
  }

  let suggestion = "";
  if (input.eju < 500) suggestion = `您的 EJU 预估分基础较薄弱。建议加强留考文/理科目的刷题，并重点提升日语听读能力。`;
  else if (input.jlpt !== 'N1' && input.english === 'none') suggestion = `您的分数有机会冲击 MARCH 级别院校！但由于缺少英语成绩，无法报考上位校，建议突击英语。`;
  else if (score >= 80) suggestion = `极具竞争力的学术背景！您完全有实力通过校内考冲击帝国大学或早庆上。建议提早准备志望理由书。`;
  else suggestion = `您的背景中规中矩，建议采取“冲刺上位校 + 保底日东驹专”的出愿策略。`;

  return { score, predictions: displayPredictions.sort((a, b) => a.probability - b.probability), suggestion };
};
