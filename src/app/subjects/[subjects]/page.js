"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import StickyWrapper from "@/components/DetailSubject/StickyWrapper";
import ContentWrapper from "@/components/DetailSubject/ContentWrapper";
import EachUtils from "@/utils/EachUtils";
import LessonButton from "@/components/LessonButton";
import TopicTitle from "@/components/TopicTitle";
import { apiRequest } from "@/utils/api";
import Link from "next/link";
import { MoveLeft } from "lucide-react";
import DetailSubjectsSkeleton from "@/components/DetailSubject/Skeleton";
import AuthGuard from "@/utils/authGuard";
import Image from "next/image";
import { getResults } from "@/services/quizService";

function DetailSubjectContent() {
  const router = useRouter();
  const { subjects: subjectSlug } = useParams();
  const [topics, setTopics] = useState([]);
  const [subjectDetail, setSubjectDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fact, setFact] = useState(null);
  const [quizResults, setQuizResults] = useState([]);

  // === Fetch Data ===
  // 1. Fetch Quiz Results
  const fetchQuizResults = async () => {
    try {
      const results = await getResults();
      if (results && results.status === "success" && Array.isArray(results.data)) {
        setQuizResults(results.data);
      } else {
        setQuizResults([]);
      }
    } catch (error) {
      console.error("Failed to fetch quiz results:", error);
      setQuizResults([]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const subjectRes = await apiRequest(`/subjects/${subjectSlug}`, {
          method: "GET",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (subjectRes.status !== "success" || !subjectRes.data) {
          router.push("/not-found");
          return;
        }

        setSubjectDetail(subjectRes.data);

        const topicRes = await apiRequest(`/subjects/${subjectSlug}/topics`, {
          method: "GET",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (topicRes.status === "success" && topicRes.data.length > 0) {
          setTopics(topicRes.data.sort((a, b) => a.id - b.id));
        } else {
          router.push("/not-found");
        }

        const factRes = await apiRequest(`/subjects/${subjectSlug}/fact`, {
          method: "GET",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        
        if (factRes.status === "success" && factRes.data) {
          setFact(factRes.data.answer);
        }        
      } catch (err) {
        console.error(err);
        router.push("/not-found");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    fetchQuizResults();
  }, [subjectSlug, router]);

  if (loading) return <DetailSubjectsSkeleton />;
  if (!subjectDetail) return null;

  // console.log(topics);

  return (
    <div className="flex flex-row-reverse gap-12 px-6 pb-30 md:pb-0">
      <StickyWrapper>
        <div className="w-full border-2 rounded-xl flex flex-col gap-3 p-5 shadow-xs mt-5">
          <h1 className="text-lg font-bold text-shadow-gray-800">
            AI Fact tentang {subjectSlug}
          </h1>
          <div className="flex items-center space-x-5">
            <img src="/dyk.png" width="50px" />
            <p className="text-slate-700 text-sm">
              {fact ? fact : "Memuat fakta menarik..."}
            </p>
          </div>
        </div>
      </StickyWrapper>
      <ContentWrapper>
        <div className="w-full rounded-xl border-2 border-b-4 bg-white mb-10 p-5 flex flex-col gap-y-1 ">
          <div className="flex items-center gap-3">
            <Link href="/subjects">
              <MoveLeft />
            </Link>
            <h3 className="font-bold text-xl">{subjectDetail.name}</h3>
          </div>
          <p className="text-sm font-medium">{subjectDetail.desc}</p>
        </div>

        <EachUtils
          of={topics}
          render={(topic, index) => (
            <div className="h-[350px] w-full mb-3" key={topic.id}>
              <TopicTitle text={topic.title} />

              {/* floating image each topics */}
              <div className="w-2 h-1 relative mx-auto flex gap-x-3">
                <Link
                  href={`/subjects/${subjectSlug}/${topic.slug}`}
                  key={index + 1}
                >
                  <LessonButton
                    buttonType="lesson"
                    locked={false}
                    index={index}
                    subIndex={0}
                  />
                </Link>
                <Link
                  href={`/subjects/${subjectSlug}/${topic.slug}/ar`}
                  key={index + 2}
                >
                  <LessonButton
                    buttonType="ar"
                    locked={false}
                    index={index}
                    subIndex={1}
                  />
                </Link>
                {Array.isArray(topic.quizzes) && topic.quizzes.length > 0 ? (() => {
                  // Cari apakah hasil quiz untuk topic ini sudah ada
                  const userResult = quizResults &&
                    Array.isArray(quizResults) &&
                    quizResults.find(qr => qr.topic_id === topic.id);

                  // Jika sudah pernah mengerjakan, arahkan ke /result/:quizResultUuid
                  if (userResult && userResult.uuid) {
                    return (
                      <Link
                        href={`/result/${userResult.uuid}`}
                        key={index + 3}
                      >
                        <LessonButton
                          buttonType="check"
                          locked={true}
                          index={index}
                          subIndex={2}
                        />
                      </Link>
                    );
                  }

                  // Jika belum pernah, arahkan ke halaman quiz
                  return (
                    <Link
                      href={`/subjects/${subjectSlug}/${topic.slug}/quiz`}
                      key={index + 3}
                    >
                      <LessonButton
                        buttonType="quiz"
                        locked={false}
                        index={index}
                        subIndex={2}
                      />
                    </Link>
                  );
                })() : (
                  <LessonButton
                    buttonType="quiz"
                    locked={true}
                    index={index}
                    subIndex={2}
                  />
                )}
              </div>
            </div>
          )}
        />
      </ContentWrapper>
    </div>
  );
}

export default function DetailSubject() {
  return (
    <AuthGuard>
      <DetailSubjectContent />
    </AuthGuard>
  );
}
