"use client";

import { getResultDetail } from "@/services/quizService";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/UI/button";
import { CountingNumber } from "@/components/UI/shadcn-io/counting-number";
import Link from "next/link";

export default function ResultDetailPage() {
  const { result } = useParams();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetail() {
      try {
        const response = await getResultDetail(result);
        setDetail(response?.data);
      } catch (err) {
        setDetail(null);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [result]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <span className="text-xl font-semibold">Memuat hasil...</span>
      </div>
    );
  }

  // Handle error state
  if (!detail) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <span className="text-xl font-semibold text-red-500">
          Gagal memuat hasil quiz.
        </span>
      </div>
    );
  }

  // Adaptasi ke struktur baru detail:
  // Quiz & topic diambil dari detail.topic, jawaban user dari detail.quiz_answers, XP dari detail.xp, dsb
  const { topic = {}, quiz_answers = [], xp = null } = detail;

  // quizzes pada topic
  const quizzes = Array.isArray(topic.quizzes) ? topic.quizzes : [];

  // selected = { [quizId]: jawabanUser }
  const selected = {};
  quiz_answers.forEach((qa, idx) => {
    // treat answer: jika "-" anggap skipped (undefined), selain itu string jawaban
    selected[quizzes[idx]?.id] = qa.answer && qa.answer !== "-" ? qa.answer : undefined;
  });

  // subject_slug dari topic.subject.slug
  const subject_slug = topic.subject?.slug || "";

  // XP (jika null, hitung manual)
  // correctCount: dari quiz_answers dan field is_correct === true
  const correctCount = quiz_answers.filter((qa) => qa.is_correct).length;
  const skippedCount = quiz_answers.filter((qa) => qa.answer === "-").length;
  const wrongCount = quiz_answers.length - correctCount - skippedCount;

  const _xp = xp == null ? correctCount * 10 : xp;

  return (
    <div className="min-h-screen w-full py-10 px-4 md:px-10">
      {/* 🎉 Header Result */}
      <div className="max-w-3xl mx-auto text-center mb-10">
        <p className="text-4xl">🎉</p>
        <h2 className="text-3xl font-bold text-gray-800 mt-2">Quiz Selesai!</h2>
        <p className="text-lg text-gray-700 mt-2">
          Kamu benar <strong>{correctCount}</strong> dari {quizzes.length} soal.
        </p>
        <p className="text-lg text-gray-800 mt-2">
          Kamu mendapatkan{" "}
          <CountingNumber
            number={_xp}
            transition={{ stiffness: 40, damping: 30 }}
          />{" "}
          XP!
        </p>
      </div>

      {/* 📊 Summary Boxes */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-5 mb-10">
        <div className="flex flex-col items-center justify-center w-full max-w-[220px] h-[120px] rounded-xl border-2 border-b-4 border-r-4 border-green-600 bg-green-400 text-white">
          <h3 className="text-lg font-bold">Jawaban Benar</h3>
          <p className="text-3xl font-bold">{correctCount}</p>
        </div>

        <div className="flex flex-col items-center justify-center w-full max-w-[220px] h-[120px] rounded-xl border-2 border-b-4 border-r-4 border-red-600 bg-red-500 text-white">
          <h3 className="text-lg font-bold">Jawaban Salah</h3>
          <p className="text-3xl font-bold">{wrongCount}</p>
        </div>

        <div className="flex flex-col items-center justify-center w-full max-w-[220px] h-[120px] rounded-xl border-2 border-b-4 border-r-4 border-gray-600 bg-gray-400 text-white">
          <h3 className="text-lg font-bold">Dilewati</h3>
          <p className="text-3xl font-bold">{skippedCount}</p>
        </div>
      </div>

      {/* 🧾 Detail Results */}
      <div className="max-w-3xl mx-auto bg-white rounded-xl p-5 border-2 border-r-4 border-b-4">
        <h1 className="text-2xl font-bold mb-5 text-gray-800">
          Ringkasan Hasil
        </h1>
        <div className="space-y-3 mb-3">
          {quizzes.map((quiz, idx) => {
            const userAnswer = quiz_answers[idx]?.answer;
            const correctAnswer = quiz.correct_answer;

            const userOption =
              quiz.options.find((o) => o.id === userAnswer) ?? undefined;
            const correctOption = quiz.options.find(
              (o) => o.id === correctAnswer
            );

            const isCorrect = quiz_answers[idx]?.is_correct === true;
            const isSkipped = userAnswer === "-" || userAnswer === undefined;
            const isWrong = !isCorrect && !isSkipped;

            return (
              <div
                key={quiz.id}
                className={`p-4 rounded-xl border ${
                  isCorrect
                    ? "border-green-400 bg-green-50"
                    : isWrong
                    ? "border-red-400 bg-red-50"
                    : "border-gray-400 bg-gray-100"
                }`}
              >
                <p className="font-semibold text-gray-800">
                  {idx + 1}. {quiz.question}
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  Jawaban kamu:{" "}
                  <span
                    className={`font-semibold ${
                      isCorrect
                        ? "text-green-600"
                        : isWrong
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                  >
                    {isSkipped ? "-" : userOption?.text || "-"}
                  </span>
                </p>

                {!isCorrect && correctOption && (
                  <p className="text-sm text-green-600">
                    {" "}
                    ✅ Jawaban yang benar: {correctOption.text}
                  </p>
                )}
                {quiz.explain && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <span className="font-semibold text-blue-700">Penjelasan: </span>
                    <span className="text-blue-900">{quiz.explain}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="w-full flex flex-col md:flex-row gap-2">
          <Link href="/profile" className="flex-1">
            <Button
              variant={"primary"}
              size={"lg"}
              className={"cursor-pointer w-full"}
            >
              Kembali ke profil
            </Button>
          </Link>
          <Link href="/leaderboard" className="flex-1">
            <Button
              variant={"secondary"}
              size={"lg"}
              className={"cursor-pointer w-full"}
            >
              Lihat Leaderboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
