import React from "react";
import { MessageCircleQuestionMark, Star, Smartphone, CheckCheck } from "lucide-react";
import { Button } from "@/components/UI/button";

const LessonButton = ({ index, locked, buttonType = "lesson", subIndex }) => {
  const offset = 30;

  let horizontalShift;

  if (buttonType === "lesson" || buttonType === "quiz" || buttonType === "check") {
    horizontalShift = -30;
  } else {
    index % 2 === 0 ? (horizontalShift = offset) : (horizontalShift = -100);
  }

  const icons = {
    lesson: Star,
    ar: Smartphone,
    quiz: MessageCircleQuestionMark,
    check: CheckCheck,
  };

  const Icon = icons[buttonType];

  const verticalPosition = subIndex * 105;

  return (
    <Button
      size="rounded"
      className="cursor-pointer"
      variant={
        buttonType === "check"
          ? "lessonDone"
          : locked
          ? "lessonLocked"
          : "lessonOpen"
      }
      style={{
        marginTop: `${verticalPosition}px`,
        left: `${horizontalShift}px`,
      }}
    >
      <Icon
        className={`w-10! h-10! ${
          buttonType === "check"
            ? "text-white fill-white"
            : locked
            ? "text-[#b7b7b7] fill-[#b7b7b7]"
            : "text-white fill-white"
        }`}
      />
    </Button>
  );
};

export default LessonButton;
