
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchWordsByCategory = async (categoryName: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `초등학생들이 알만한 '${categoryName}' 카테고리의 단어들을 20개 정도 추천해줘.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            words: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "초등학생 수준의 단어 리스트",
            },
          },
          required: ["words"],
        },
      },
    });

    const data = JSON.parse(response.text);
    return data.words || [];
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback static words if API fails
    const fallbacks: Record<string, string[]> = {
      '동물 친구들': ['강아지', '고양이', '호랑이', '사자', '기린', '코끼리', '토끼', '다람쥐', '펭귄', '판다'],
      '맛있는 음식': ['떡볶이', '피자', '치킨', '햄버거', '탕수육', '자장면', '김밥', '라면', '돈가스', '샌드위치'],
      '학교 물건': ['연필', '지우개', '공책', '필통', '가방', '칠판', '분필', '실내화', '교과서', '자'],
      'default': ['사과', '바나나', '포도', '수박', '딸기', '메론', '귤', '키위', '복숭아', '참외']
    };
    return fallbacks[categoryName] || fallbacks['default'];
  }
};
