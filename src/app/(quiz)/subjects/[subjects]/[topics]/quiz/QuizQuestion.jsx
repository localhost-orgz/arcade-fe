import React from "react";
import QuizExplanation from "./QuizExplanation";
import { Button } from "@/components/UI/button";
import QuizOption from "./QuizOption";
import { motion, AnimatePresence } from "framer-motion";

const QuizQuestion = ({ quiz, selected, handleAnswer }) => {
  const selectedOption = selected[quiz.id];
  const isAnswered = !!selectedOption;

  return (
    <div className="flex-1 lg:w-3xl w-screen lg:px-5 px-10 py-5 bg-white flex flex-col justify-center">
      <h2 className="md:text-3xl text-2xl font-bold text-gray-800">
        Pilihlah jawaban yang benar
      </h2>
      <div className="w-full flex flex-col justify-center gap-8 md:mt-15 mt-8">
        <div className="flex flex-col gap-2">
          <p className="text-md font-semibold text-gray-800">{quiz.question}</p>
        </div>
        <div className="w-full flex flex-col gap-y-2">
          {quiz.options.map((option) => (
            <QuizOption
              key={option.id}
              option={option}
              correctAnswer={quiz.correct_answer}
              selectedOption={selectedOption}
              onSelect={() => handleAnswer(quiz.id, option.id)}
            />
          ))}
        </div>
      </div>
      <AnimatePresence>
        {isAnswered && (
          <QuizExplanation
            text={quiz.explain || "Penjelasan belum tersedia."}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizQuestion;
