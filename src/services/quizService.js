import { apiRequest } from "@/utils/api";

const getToken = () => (typeof window !== "undefined" ? localStorage.getItem("token") : null);

export const getAllQuizzes = async () => {
  const token = getToken();
  return apiRequest(`/quizzes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const addQuiz = async (subSlug, topSlug, data) => {
  const token = getToken();
  return await apiRequest(`/subjects/${subSlug}/topics/${topSlug}/quizzes`, {
    method: "POST",
    body: data,
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateQuiz = async (subSlug, topSlug, uuid, data) => {
  const token = getToken();
  return await apiRequest(`/subjects/${subSlug}/topics/${topSlug}/quizzes/${uuid}`, {
    method: "PUT",
    body: data,
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteQuiz = async (subSlug, topSlug, uuid) => {
  const token = getToken();
  return await apiRequest(`/subjects/${subSlug}/topics/${topSlug}/quizzes/${uuid}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getQuizzesByTopic = async (subSlug, topSlug) => {
  const token = getToken();
  return apiRequest(`/subjects/${subSlug}/topics/${topSlug}/quizzes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const submitQuiz = async (subSlug, topSlug, data) => {
  const token = getToken();
  return await apiRequest(`/subjects/${subSlug}/topics/${topSlug}/quizzes/submit`, {
    method: "POST",
    body: data,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export const getResults = async () => {
  const token = localStorage.getItem("token");
  return apiRequest("/quiz-results", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getResultDetail = async (uuid) => {
  const token = localStorage.getItem("token");
  return apiRequest(`/quiz-results/${uuid}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
