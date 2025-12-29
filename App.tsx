
import React, { useState, useCallback, useEffect } from 'react';
import { GameState, GameStep, Player, Category } from './types';
import { CATEGORIES, MIN_PLAYERS, MAX_PLAYERS } from './constants';
import { fetchWordsByCategory } from './services/geminiService';
import { Button, Card, Title, Badge } from './components/UI';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    step: 'SETUP',
    players: [
      { id: '1', name: '플레이어 1', role: 'CITIZEN', isRevealed: false, votes: 0 },
      { id: '2', name: '플레이어 2', role: 'CITIZEN', isRevealed: false, votes: 0 },
      { id: '3', name: '플레이어 3', role: 'CITIZEN', isRevealed: false, votes: 0 },
    ],
    selectedCategory: null,
    targetWord: '',
    liarId: '',
    currentPlayerIndex: 0,
    winner: null,
    caughtLiarId: null,
  });

  const [newPlayerName, setNewPlayerName] = useState('');
  const [timer, setTimer] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Sound effects logic (mocked)
  const playSound = (type: 'pop' | 'success' | 'fail' | 'tick') => {
    console.log(`Sound: ${type}`);
  };

  const addPlayer = () => {
    if (gameState.players.length >= MAX_PLAYERS) return;
    const name = newPlayerName.trim() || `플레이어 ${gameState.players.length + 1}`;
    setGameState(prev => ({
      ...prev,
      players: [...prev.players, {
        id: Math.random().toString(36).substr(2, 9),
        name,
        role: 'CITIZEN',
        isRevealed: false,
        votes: 0
      }]
    }));
    setNewPlayerName('');
    playSound('pop');
  };

  const removePlayer = (id: string) => {
    if (gameState.players.length <= MIN_PLAYERS) return;
    setGameState(prev => ({
      ...prev,
      players: prev.players.filter(p => p.id !== id)
    }));
  };

  const startGame = (category: Category) => {
    setGameState(prev => ({ ...prev, step: 'REVEAL', selectedCategory: category }));
    prepareWords(category.name);
  };

  const prepareWords = async (categoryName: string) => {
    const words = await fetchWordsByCategory(categoryName);
    const word = words[Math.floor(Math.random() * words.length)];
    const liarIdx = Math.floor(Math.random() * gameState.players.length);
    const liarId = gameState.players[liarIdx].id;

    setGameState(prev => ({
      ...prev,
      targetWord: word,
      liarId: liarId,
      players: prev.players.map((p, idx) => ({
        ...p,
        role: idx === liarIdx ? 'LIAR' : 'CITIZEN',
        isRevealed: false,
        votes: 0
      }))
    }));
  };

  const nextReveal = () => {
    if (gameState.currentPlayerIndex < gameState.players.length - 1) {
      setGameState(prev => ({
        ...prev,
        currentPlayerIndex: prev.currentPlayerIndex + 1
      }));
    } else {
      setGameState(prev => ({ ...prev, step: 'PLAY', currentPlayerIndex: 0 }));
      setTimer(gameState.players.length * 20); // Give 20s per player
      setIsTimerRunning(true);
    }
  };

  const handleVote = (targetId: string) => {
    const target = gameState.players.find(p => p.id === targetId);
    if (!target) return;

    if (target.id === gameState.liarId) {
      setGameState(prev => ({ ...prev, step: 'LIAR_CHANCE', caughtLiarId: targetId }));
    } else {
      setGameState(prev => ({ ...prev, step: 'RESULT', winner: 'LIAR' }));
    }
  };

  const handleLiarGuess = (word: string) => {
    if (word.trim() === gameState.targetWord) {
      setGameState(prev => ({ ...prev, step: 'RESULT', winner: 'LIAR' }));
    } else {
      setGameState(prev => ({ ...prev, step: 'RESULT', winner: 'CITIZENS' }));
    }
  };

  const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      step: 'SETUP',
      currentPlayerIndex: 0,
      winner: null,
      targetWord: '',
      liarId: '',
      selectedCategory: null,
      caughtLiarId: null,
    }));
    setIsTimerRunning(false);
  };

  // Timer Effect
  useEffect(() => {
    let interval: any;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(t => t - 1);
        if (timer <= 5) playSound('tick');
      }, 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
      if (gameState.step === 'PLAY') {
        setGameState(prev => ({ ...prev, step: 'VOTE' }));
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer, gameState.step]);

  return (
    <div className="min-h-screen p-4 flex flex-col max-w-md mx-auto relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-200 rounded-full blur-3xl opacity-50 -z-10"></div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-200 rounded-full blur-3xl opacity-50 -z-10"></div>

      <header className="mb-6 mt-8 flex flex-col items-center">
        <div className="text-6xl mb-2">🕵️‍♂️</div>
        <Title>라이어 게임</Title>
        <p className="text-gray-500 font-bold">친구들 중 거짓말쟁이는 누구?</p>
      </header>

      <main className="flex-grow flex flex-col">
        {gameState.step === 'SETUP' && (
          <Card className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-center text-gray-700">함께할 친구들을 적어줘!</h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="친구 이름 (예: 김철수)"
                className="flex-grow bg-gray-50 border-2 border-yellow-200 rounded-xl px-4 py-2 focus:outline-none focus:border-yellow-400 font-bold"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
              />
              <Button onClick={addPlayer} className="px-4 py-2 text-base">추가</Button>
            </div>

            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 border-2 border-dashed border-yellow-100 rounded-xl">
              {gameState.players.map(p => (
                <div key={p.id} className="bg-yellow-50 px-3 py-1 rounded-full flex items-center gap-2 shadow-sm border border-yellow-200">
                  <span className="font-bold">{p.name}</span>
                  <button onClick={() => removePlayer(p.id)} className="text-red-400 hover:text-red-600 font-bold">×</button>
                </div>
              ))}
            </div>

            <Button
              onClick={() => setGameState(prev => ({ ...prev, step: 'CATEGORY' }))}
              disabled={gameState.players.length < MIN_PLAYERS}
              className="mt-2"
            >
              다 적었어! ({gameState.players.length}명)
            </Button>
            {gameState.players.length < MIN_PLAYERS && (
              <p className="text-center text-red-400 text-sm">최소 3명이 필요해요!</p>
            )}
          </Card>
        )}

        {gameState.step === 'CATEGORY' && (
          <div className="grid grid-cols-2 gap-4">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => startGame(cat)}
                className={`${cat.color} p-6 rounded-3xl shadow-lg bouncy flex flex-col items-center justify-center gap-2 border-4 border-white/50 text-white`}
              >
                <span className="text-5xl">{cat.icon}</span>
                <span className="text-xl font-bold">{cat.name}</span>
              </button>
            ))}
            <div className="col-span-2 mt-4">
              <Button onClick={() => setGameState(prev => ({ ...prev, step: 'SETUP' }))} variant="ghost" className="w-full">
                이전으로
              </Button>
            </div>
          </div>
        )}

        {gameState.step === 'REVEAL' && (
          <Card className="flex flex-col items-center gap-6 py-10">
            <Badge color="bg-blue-100">차례차례 확인해요!</Badge>
            <h2 className="text-3xl font-bold text-center">
              <span className="text-orange-500">{gameState.players[gameState.currentPlayerIndex].name}</span>님,<br/>카드를 확인하세요!
            </h2>
            
            <div className="w-48 h-64 bg-yellow-400 rounded-3xl shadow-xl flex items-center justify-center relative overflow-hidden group">
               <div className="absolute inset-2 border-2 border-dashed border-white/50 rounded-2xl"></div>
               <span className="text-8xl animate-bounce">🎁</span>
               <div className="absolute inset-0 bg-white flex flex-col items-center justify-center p-4 transition-transform duration-500 translate-y-full group-hover:translate-y-0 cursor-pointer">
                  <span className="text-gray-400 mb-2">당신의 정체는...</span>
                  {gameState.players[gameState.currentPlayerIndex].role === 'LIAR' ? (
                    <div className="flex flex-col items-center">
                      <span className="text-6xl mb-2">🕵️‍♀️</span>
                      <span className="text-3xl font-bold text-red-500">당신은 라이어!</span>
                      <p className="text-sm text-center mt-2 text-gray-500">다른 친구들이 말하는걸 보고 정답을 맞춰보세요!</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <span className="text-3xl text-blue-500 font-bold mb-2">제시어</span>
                      <span className="text-5xl font-bold text-blue-600">{gameState.targetWord}</span>
                      <p className="text-sm text-center mt-4 text-gray-500">라이어가 눈치채지 못하게 설명해주세요!</p>
                    </div>
                  )}
               </div>
            </div>

            <Button onClick={nextReveal} className="w-full">
              확인했습니다!
            </Button>
          </Card>
        )}

        {gameState.step === 'PLAY' && (
          <Card className="flex flex-col items-center gap-6 text-center">
            <div className={`w-32 h-32 rounded-full border-8 flex items-center justify-center text-4xl font-bold ${timer < 10 ? 'border-red-400 text-red-500 animate-pulse' : 'border-green-400 text-green-500'}`}>
              {timer}
            </div>
            <h2 className="text-2xl font-bold">서로 질문하며 범인을 찾으세요!</h2>
            <p className="text-gray-500">라이어는 자기가 정답을 아는 척 연기하세요.</p>
            
            <div className="grid grid-cols-2 gap-2 w-full">
              {gameState.players.map(p => (
                <div key={p.id} className="bg-gray-50 p-3 rounded-xl border border-gray-200 font-bold">
                  {p.name}
                </div>
              ))}
            </div>

            <Button onClick={() => setGameState(prev => ({ ...prev, step: 'VOTE' }))} variant="secondary" className="w-full">
              투표 시작하기
            </Button>
          </Card>
        )}

        {gameState.step === 'VOTE' && (
          <Card className="flex flex-col gap-4">
             <h2 className="text-2xl font-bold text-center">범인은 누구인가요?</h2>
             <div className="grid grid-cols-1 gap-3">
               {gameState.players.map(p => (
                 <button
                   key={p.id}
                   onClick={() => handleVote(p.id)}
                   className="bg-yellow-50 hover:bg-yellow-100 p-4 rounded-2xl border-2 border-yellow-200 text-left flex justify-between items-center group bouncy"
                 >
                   <span className="text-xl font-bold text-gray-700">{p.name}</span>
                   <span className="opacity-0 group-hover:opacity-100 text-yellow-500 font-bold">의심돼요! 👈</span>
                 </button>
               ))}
             </div>
          </Card>
        )}

        {gameState.step === 'LIAR_CHANCE' && (
          <Card className="flex flex-col items-center gap-6">
            <span className="text-6xl animate-bounce">🎯</span>
            <h2 className="text-2xl font-bold text-center">라이어를 찾았어요!<br/><span className="text-red-500">마지막 기회</span>를 드립니다.</h2>
            <p className="text-gray-600">제시어가 무엇인지 맞춰보세요!</p>
            
            <input
              type="text"
              placeholder="정답은 무엇일까?"
              className="w-full bg-gray-50 border-2 border-yellow-300 rounded-2xl px-6 py-4 text-2xl font-bold text-center focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleLiarGuess((e.target as HTMLInputElement).value);
              }}
            />

            <Button onClick={() => handleLiarGuess('')} variant="ghost" className="text-sm">
              모르겠어요 (포기)
            </Button>
          </Card>
        )}

        {gameState.step === 'RESULT' && (
          <Card className="flex flex-col items-center gap-8 py-10 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-400"></div>
            
            {gameState.winner === 'LIAR' ? (
              <div className="flex flex-col items-center gap-4">
                <span className="text-8xl">😎</span>
                <h2 className="text-4xl font-bold text-orange-500">라이어 승리!</h2>
                <p className="text-xl">정말 감쪽같았어요!</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <span className="text-8xl">👏</span>
                <h2 className="text-4xl font-bold text-blue-500">시민 승리!</h2>
                <p className="text-xl">라이어를 멋지게 찾아냈어요!</p>
              </div>
            )}

            <div className="bg-gray-100 p-6 rounded-3xl w-full text-center border-2 border-dashed border-gray-300">
               <span className="text-gray-500 text-sm block mb-1">정답은...</span>
               <span className="text-4xl font-bold text-gray-800">{gameState.targetWord}</span>
            </div>

            <Button onClick={resetGame} className="w-full">
              한 판 더 할래!
            </Button>
          </Card>
        )}
      </main>

      <footer className="mt-6 text-center text-gray-400 text-sm">
        © 2024 우당탕탕 라이어 게임 - 친구와 함께 즐겨요!
      </footer>
    </div>
  );
};

export default App;
