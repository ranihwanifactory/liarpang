
import React, { useState, useEffect } from 'react';

export const Button: React.FC<{
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  disabled?: boolean;
  className?: string;
}> = ({ onClick, children, variant = 'primary', disabled = false, className = '' }) => {
  const baseStyles = "px-6 py-3 rounded-2xl font-bold text-xl bouncy shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200";
  const variants = {
    primary: "bg-yellow-400 text-yellow-900 hover:bg-yellow-500",
    secondary: "bg-orange-400 text-white hover:bg-orange-500",
    danger: "bg-red-500 text-white hover:bg-red-600",
    ghost: "bg-white/50 text-gray-700 border-2 border-dashed border-gray-300",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export const VoiceButton: React.FC<{
  onResult: (text: string) => void;
  className?: string;
}> = ({ onResult, className = '' }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.lang = 'ko-KR';
      recognitionInstance.interimResults = false;
      recognitionInstance.maxAlternatives = 1;

      recognitionInstance.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        onResult(text);
        setIsListening(false);
      };

      recognitionInstance.onerror = () => {
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [onResult]);

  const toggleListening = () => {
    if (!recognition) {
      alert('이 브라우저는 음성 인식을 지원하지 않아요 😢');
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  return (
    <button
      onClick={toggleListening}
      className={`p-3 rounded-xl transition-all duration-300 ${
        isListening ? 'bg-red-500 animate-pulse text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
      } ${className}`}
      title="음성으로 입력하기"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-3xl p-6 shadow-xl border-4 border-yellow-200 ${className}`}>
    {children}
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = 'bg-yellow-100' }) => (
  <span className={`${color} text-yellow-800 px-3 py-1 rounded-full text-sm font-bold`}>
    {children}
  </span>
);

export const Title: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h1 className="text-4xl font-bold text-center text-orange-600 drop-shadow-sm mb-4">
    {children}
  </h1>
);
