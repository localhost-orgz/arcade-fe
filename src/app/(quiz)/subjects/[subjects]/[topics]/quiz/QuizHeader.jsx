import React, { useState } from "react";
import { X, CircleQuestionMark } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";

import Link from "next/link";

const QuizHeader = () => {
  const [isShowing, setIsShowing] = useState(false);

  // Ambil slug subject & topic dari params
  const params = useParams();
  const router = useRouter();

  // Simpan slug dari URL
  const { subjects: subjectSlug, topics: topicSlug } = params;

  // Simulasi mapping slug ke judul (bisa diimprove fetch dari API jika perlu)
  // Untuk saat ini tetap gunakan capitalize dan replace dash
  function humanize(str) {
    if (!str) return "";
    return str
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }

  return (
    <div className="w-full h-20 border-b-2 bg-white flex justify-center">
      <nav className="w-5xl h-full px-5 flex items-center justify-between">
        <Link href={`/subjects/${subjectSlug}`}>
          <X />
        </Link>
        <div className="flex flex-col items-center">
          <p className="text-sm">{humanize(subjectSlug)}</p>
          <h4 className="text-xl font-extrabold">{humanize(topicSlug)}</h4>
        </div>
        <div
          className="relative"
          onClick={() => setIsShowing(!isShowing)}
          onMouseEnter={() => setIsShowing(true)}
          onMouseLeave={() => setIsShowing(false)}
        >
          <CircleQuestionMark />
          {isShowing && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute cursor-default w-40 top-10 -left-12 lg:left-1/2 -translate-x-1/2 border-2 p-3 rounded-xl bg-white z-2"
              >
                <div className="w-5 h-5 border-l-2 border-t-2 rotate-45 absolute -top-[11px] left-34 md:left-1/2 -translate-x-1/2 -z-1 bg-white"></div>
                <div className="w-5 h-5 absolute -top-5 left-34 md:left-1/2 -translate-x-1/2 -z-2 bg-transparent"></div>
                <ol className="text-xs leading-4">
                  <li className="mb-2">
                    1️⃣ Baca setiap pertanyaan dengan teliti sebelum menjawab
                  </li>
                  <li className="mb-2">
                    2️⃣ Pilih satu jawaban yang benar dan sesuai pengetahuan kamu
                  </li>
                  <li className="mb-2">
                    3️⃣ Gunakan tombol Skip jika kamu belum yakin menjawab
                  </li>
                  <li className="mb-2">
                    4️⃣ Nilai akhir akan ditampilkan setelah seluruh soal selesai
                  </li>
                </ol>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </nav>
    </div>
  );
};

export default QuizHeader;
