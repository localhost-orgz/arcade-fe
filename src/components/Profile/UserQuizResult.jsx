import { getResults } from "@/services/quizService";
import Link from "next/link";
import { useEffect, useState } from "react";

const UserQuizResult = () => {
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchResults = async () => {
    try {
      const data = await getResults();
      setQuizResults(data.data);
    } catch (error) {
      console.error("Failed to fetch quiz results:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  if (loading) {
    return (
      <div className="flex w-full justify-center items-center py-10">
        <span className="text-base text-gray-600">Memuat hasil quiz...</span>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h1 className="text-lg font-bold mb-4">Quiz Result</h1>
      <ul className="space-y-4">
        {quizResults.length === 0 ? (
          <li className="text-gray-500 italic">Belum ada hasil quiz.</li>
        ) : (
          quizResults.map((result) => (
            <li
              key={result.id}
              className="border rounded-lg p-4 shadow-sm flex gap-4 items-start bg-white"
            >
              <img
                src={result.topic.subject.thumbnail_url}
                alt={result.topic.subject.name}
                className="w-16 h-16 rounded object-cover border"
              />
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                  <Link
                    href={`/result/${result.uuid}`}
                    className="font-semibold text-blue-800 hover:underline"
                  >
                    {result.topic.title}
                  </Link>
                  <span className="text-xs text-gray-400 ml-0 md:ml-2">
                    {result.topic.subject.name}
                  </span>
                  <span className="ml-0 md:ml-4 text-xs text-gray-400">
                    {new Date(result.created_at).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  {result.topic.desc}
                </div>
                <div className="mt-2">
                  <span className="inline-block text-xs px-2 py-1 bg-green-50 text-green-700 rounded font-semibold mr-2">
                    +{result.xp} XP
                  </span>
                  <span className="inline-block text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    Quiz ID: {result.id}
                  </span>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default UserQuizResult;