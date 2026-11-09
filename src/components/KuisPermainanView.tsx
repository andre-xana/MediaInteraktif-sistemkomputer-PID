import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { quizQuestions } from '../data/quizQuestions';
import { matchingGameItems, CATEGORY_DEFINITIONS } from '../data/matchingGameData';
import { DeviceItem, DeviceCategory } from '../types';
import {
  HelpCircle,
  Gamepad2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  Trophy,
  Sparkles,
  MousePointerClick,
  Check,
  AlertCircle
} from 'lucide-react';

export const KuisPermainanView: React.FC = () => {
  const [subMode, setSubMode] = useState<'kuis' | 'permainan'>('kuis');

  // --- KUIS CEPAT STATE ---
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [hasAnsweredCurrent, setHasAnsweredCurrent] = useState<boolean>(false);
  const [isQuizFinished, setIsQuizFinished] = useState<boolean>(false);

  // --- MATCHING GAME STATE ---
  const [matchedItems, setMatchedItems] = useState<Record<string, DeviceCategory>>({});
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [gameMessage, setGameMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isGameFinished, setIsGameFinished] = useState<boolean>(false);

  // Handler for Quiz Option Select
  const handleSelectQuizOption = (optionIndex: number) => {
    if (hasAnsweredCurrent) return;

    const question = quizQuestions[currentQuizIndex];
    const isCorrect = optionIndex === question.correctIndex;

    setSelectedAnswers((prev) => ({
      ...prev,
      [question.id]: optionIndex
    }));
    setHasAnsweredCurrent(true);

    if (isCorrect) {
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.8 }
      });
    }
  };

  const handleNextQuizQuestion = () => {
    if (currentQuizIndex + 1 < quizQuestions.length) {
      setCurrentQuizIndex((prev) => prev + 1);
      setHasAnsweredCurrent(false);
    } else {
      setIsQuizFinished(true);
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedAnswers({});
    setHasAnsweredCurrent(false);
    setIsQuizFinished(false);
  };

  // Calculate Quiz Score
  const calculateQuizScore = () => {
    let correctCount = 0;
    quizQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });
    return {
      correctCount,
      total: quizQuestions.length,
      percentage: Math.round((correctCount / quizQuestions.length) * 100)
    };
  };

  // --- MATCHING GAME LOGIC ---
  const handlePlaceCardIntoCategory = (cardId: string, targetCategory: DeviceCategory) => {
    const card = matchingGameItems.find((item) => item.id === cardId);
    if (!card) return;

    if (card.category === targetCategory) {
      // Correct match!
      const updated = { ...matchedItems, [cardId]: targetCategory };
      setMatchedItems(updated);
      setSelectedCardId(null);
      setGameMessage({
        text: `Hebat! "${card.name}" tepat dimasukkan ke kategori ${targetCategory.toUpperCase()}!`,
        type: 'success'
      });

      confetti({
        particleCount: 20,
        spread: 50,
        origin: { y: 0.8 }
      });

      // Check if all matched
      if (Object.keys(updated).length === matchingGameItems.length) {
        setIsGameFinished(true);
        confetti({
          particleCount: 100,
          spread: 100,
          origin: { y: 0.5 }
        });
      }
    } else {
      // Incorrect match
      setGameMessage({
        text: `Kurang tepat. "${card.name}" bukan perangkat ${targetCategory.toUpperCase()}. Petunjuk: ${card.hint}`,
        type: 'error'
      });
    }
  };

  const handleResetMatchingGame = () => {
    setMatchedItems({});
    setSelectedCardId(null);
    setGameMessage(null);
    setIsGameFinished(false);
  };

  // HTML5 Drag and drop helpers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, category: DeviceCategory) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (id) {
      handlePlaceCardIntoCategory(id, category);
    }
  };

  const currentQ = quizQuestions[currentQuizIndex];
  const currentAnswer = selectedAnswers[currentQ?.id];
  const isAnswered = hasAnsweredCurrent;

  return (
    <div className="space-y-6 pb-12">
      {/* Sub-tab navigation */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 sm:p-2.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setSubMode('kuis')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              subMode === 'kuis'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Kuis Cepat (10 Soal)</span>
          </button>

          <button
            type="button"
            onClick={() => setSubMode('permainan')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              subMode === 'permainan'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Permainan Mencocokkan (IPOS)</span>
          </button>
        </div>

        <span className="text-xs text-slate-500 font-medium hidden md:inline px-3">
          {subMode === 'kuis' ? '1 Soal per Layar + Pembahasan' : 'Drag & Drop atau Sentuh Kartu'}
        </span>
      </div>

      {/* ========================================================= */}
      {/* MODE 1: KUIS CEPAT */}
      {/* ========================================================= */}
      {subMode === 'kuis' && (
        <div>
          {!isQuizFinished ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 shadow-xs">
              {/* Question Header & Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 mb-2">
                  <span className="font-bold text-sky-700 uppercase tracking-wider">
                    {currentQ.category}
                  </span>
                  <span className="font-mono font-bold text-slate-700">
                    Soal {currentQuizIndex + 1} dari {quizQuestions.length}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-sky-600 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${((currentQuizIndex + 1) / quizQuestions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* The Question Text */}
              <div className="mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {currentQ.question}
                </h3>
              </div>

              {/* Large Touch-friendly Option Buttons */}
              <div className="space-y-3 mb-6">
                {currentQ.options.map((optText, optIdx) => {
                  const isSelected = currentAnswer === optIdx;
                  const isCorrect = optIdx === currentQ.correctIndex;

                  let buttonStyle = 'bg-white text-slate-800 border-slate-200 hover:border-sky-300 hover:bg-sky-50/50';

                  if (isAnswered) {
                    if (isCorrect) {
                      buttonStyle = 'bg-emerald-50 text-emerald-900 border-emerald-400 ring-2 ring-emerald-200';
                    } else if (isSelected && !isCorrect) {
                      buttonStyle = 'bg-rose-50 text-rose-900 border-rose-400 ring-2 ring-rose-200';
                    } else {
                      buttonStyle = 'bg-slate-50 text-slate-400 border-slate-200 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => handleSelectQuizOption(optIdx)}
                      className={`w-full text-left p-4 sm:p-4.5 rounded-xl border-2 font-medium text-sm sm:text-base transition-all flex items-center justify-between cursor-pointer min-h-[56px] ${buttonStyle}`}
                    >
                      <span className="pr-3 leading-relaxed">{optText}</span>
                      {isAnswered && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      {isAnswered && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Instant Feedback & Educational Explanation */}
              {isAnswered && (
                <div
                  className={`p-4 sm:p-5 rounded-xl border mb-6 animate-fadeIn ${
                    currentAnswer === currentQ.correctIndex
                      ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                      : 'bg-rose-50/90 border-rose-300 text-rose-950'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm sm:text-base mb-1.5">
                    {currentAnswer === currentQ.correctIndex ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>Jawabanmu Tepat Sekali!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-rose-600" />
                        <span>Jawaban Kurang Tepat</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed opacity-90">
                    <span className="font-semibold">Pembahasan: </span>
                    {currentQ.explanation}
                  </p>
                </div>
              )}

              {/* Bottom Action Button */}
              {isAnswered && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextQuizQuestion}
                    className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span>
                      {currentQuizIndex + 1 < quizQuestions.length ? 'Lanjut ke Soal Berikutnya' : 'Lihat Skor Akhir'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Quiz Completed Score Card */
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 text-center shadow-xs max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8" />
              </div>

              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Kuis Cepat Selesai
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
                Hasil Pencapaian Belajarmu
              </h3>

              {(() => {
                const score = calculateQuizScore();
                return (
                  <div className="my-6">
                    <div className="text-5xl sm:text-6xl font-extrabold font-mono text-sky-600 mb-2">
                      {score.percentage}
                      <span className="text-2xl font-bold text-slate-400">/100</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-700">
                      Kamu berhasil menjawab benar <span className="text-sky-600 font-bold">{score.correctCount}</span> dari {score.total} soal kuis.
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {score.percentage >= 80
                        ? 'Luar biasa! Pemahaman konsep sistem komputermu sudah sangat mantap.'
                        : score.percentage >= 60
                        ? 'Bagus! Kamu sudah memahami sebagian besar materi, coba ulangi untuk nilai sempurna.'
                        : 'Tetap semangat! Kamu bisa membaca ulang materi pada tab Materi lalu mencobanya kembali.'}
                    </p>
                  </div>
                );
              })()}

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleResetQuiz}
                  className="w-full sm:w-auto px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Ulangi Kuis Cepat</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSubMode('permainan')}
                  className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Gamepad2 className="w-4 h-4" />
                  <span>Mainkan Permainan Mencocokkan</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* MODE 2: PERMAINAN MENCOCOKKAN (DRAG & DROP / TAP TO MATCH) */}
      {/* ========================================================= */}
      {subMode === 'permainan' && (
        <div className="space-y-6">
          {/* Instructions banner */}
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-sky-900 uppercase tracking-wider mb-0.5">
                <Sparkles className="w-4 h-4 text-sky-600" />
                Cara Bermain
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Jodohkan setiap perangkat komputer ke dalam kotak kategori yang sesuai (Input, Proses, Output, atau Storage).
                <br />
                <span className="font-semibold text-sky-800">Di Laptop:</span> Seret (Drag) kartu dan lepaskan (Drop) di kotak tujuan.
                <span className="font-semibold text-sky-800 ml-2">Di HP:</span> Cukup sentuh (Tap) kartu perangkat, lalu sentuh kotak kategori tujuannya!
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <span className="text-xs font-bold text-sky-800 bg-white px-3 py-1.5 rounded-lg border border-sky-200 font-mono">
                Tercocokkan: {Object.keys(matchedItems).length} / {matchingGameItems.length}
              </span>
              <button
                type="button"
                onClick={handleResetMatchingGame}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Ulangi</span>
              </button>
            </div>
          </div>

          {/* Feedback message banner if user just matched or made a mistake */}
          {gameMessage && (
            <div
              className={`p-3.5 rounded-xl border flex items-center gap-2 text-xs sm:text-sm animate-fadeIn ${
                gameMessage.type === 'success'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-rose-50 border-rose-300 text-rose-900'
              }`}
            >
              {gameMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <span>{gameMessage.text}</span>
            </div>
          )}

          {/* Target 4 Drop Zones Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORY_DEFINITIONS.map((cat) => {
              const matchedInCat = matchingGameItems.filter(
                (item) => matchedItems[item.id] === cat.id
              );

              return (
                <div
                  key={cat.id}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, cat.id)}
                  onClick={() => {
                    if (selectedCardId) {
                      handlePlaceCardIntoCategory(selectedCardId, cat.id);
                    }
                  }}
                  className={`rounded-2xl border-2 p-4 transition-all min-h-[220px] flex flex-col justify-between cursor-pointer ${
                    cat.colorBg
                  } ${cat.colorBorder} ${
                    selectedCardId ? 'ring-2 ring-sky-400 ring-offset-2' : ''
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${cat.colorBadge}`}>
                        {cat.name}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-slate-500">
                        {matchedInCat.length} Perangkat
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mb-3 leading-snug">
                      {cat.description}
                    </p>

                    {/* Matched devices tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {matchedInCat.map((item) => (
                        <div
                          key={item.id}
                          className="text-xs bg-white text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200/80 shadow-2xs font-semibold flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/60 text-center">
                    <span className="text-[11px] text-slate-500 font-medium">
                      {selectedCardId
                        ? '👉 Klik di sini untuk menempatkan kartu pilihanmu'
                        : 'Tarik kartu atau pilih di bawah'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cards to match pool */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-base sm:text-lg font-bold text-slate-900">
                  Kartu Perangkat Komputer (Klik atau Seret)
                </h4>
                <p className="text-xs text-slate-500">
                  Pilih kartu di bawah ini untuk dicocokkan ke dalam 4 kotak kategori di atas.
                </p>
              </div>
              <span className="text-xs font-mono font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                Sisa: {matchingGameItems.length - Object.keys(matchedItems).length}
              </span>
            </div>

            {Object.keys(matchedItems).length === matchingGameItems.length ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <Trophy className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-1">
                  Selamat! Semua Perangkat Cocok dengan Sempurna!
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-5">
                  Kamu telah sukses mengelompokkan ke-16 perangkat input, proses, output, dan storage dengan tepat tanpa kesalahan klasifikasi.
                </p>
                <button
                  type="button"
                  onClick={handleResetMatchingGame}
                  className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Mainkan Sekali Lagi</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {matchingGameItems.map((item: DeviceItem) => {
                  const isAlreadyMatched = Boolean(matchedItems[item.id]);
                  const isSelected = selectedCardId === item.id;

                  if (isAlreadyMatched) return null;

                  return (
                    <div
                      key={item.id}
                      draggable={!isAlreadyMatched}
                      onDragStart={(e) => handleDragStart(e, item.id)}
                      onClick={() => {
                        setSelectedCardId(isSelected ? null : item.id);
                      }}
                      className={`p-3.5 rounded-xl border-2 transition-all cursor-grab active:cursor-grabbing select-none text-left ${
                        isSelected
                          ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-300 shadow-md scale-102'
                          : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-sm text-slate-900 truncate">
                          {item.name}
                        </span>
                        <MousePointerClick className="w-4 h-4 text-slate-400 shrink-0" />
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-snug">
                        {item.description}
                      </p>
                      {isSelected && (
                        <div className="mt-2 text-[10px] font-bold text-sky-700 bg-sky-100/70 px-2 py-0.5 rounded text-center">
                          Kartu Terpilih: Klik Kotak Kategori di Atas
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
