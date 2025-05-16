import React, { useState, useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";
import { db, auth } from "./firebase";
import { useSpeechSynthesis } from "react-speech-kit";
import Avatar from "./components/Avatar";

const questions = [
  {
    question: "What is the name of the newest powerful space telescope?",
    options: ["Hubble", "James Webb", "Kepler", "Spitzer"],
    answer: "James Webb",
  },
  {
    question: "What planet is NASA exploring with the Perseverance rover?",
    options: ["Mars", "Venus", "Jupiter", "Saturn"],
    answer: "Mars",
  },
  {
    question: "Which company is developing Starship for deep space missions?",
    options: ["Blue Origin", "SpaceX", "NASA", "Virgin Galactic"],
    answer: "SpaceX",
  },
];

export default function App() {
  const [userId, setUserId] = useState(null);
  const [step, setStep] = useState("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [videoStream, setVideoStream] = useState(null);
  const { speak } = useSpeechSynthesis();

  useEffect(() => {
    signInAnonymously(auth).then((result) => {
      setUserId(result.user.uid);
    });
  }, []);

  useEffect(() => {
    if (step === "intro") {
      speak({ text: "Hi there! I'm Nova. Let's explore what's new in space!" });
    }
  }, [step, speak]);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      setVideoStream(stream);
      const videoElement = document.getElementById("userVideo");
      if (videoElement) videoElement.srcObject = stream;
    });
  }, []);

  const handleAnswer = (option) => {
    setSelected(option);
    const isCorrect = option === questions[currentQuestion].answer;
    if (isCorrect) setScore(score + 1);

    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setSelected(null);
      } else {
        setStep("result");
        saveProgress();
      }
    }, 1000);
  };

  const saveProgress = async () => {
    if (userId) {
      await setDoc(doc(db, "progress", userId), {
        lesson: "space_exploration",
        completed: true,
        score,
      });
    }
  };

  const renderIntro = () => (
    <div className="text-center">
      <Avatar speaking={true} />
      <h1 className="text-3xl font-bold mt-4">Welcome, Explorer!</h1>
      <p className="my-4">I’m Nova, your guide to the stars 🌟</p>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => setStep("lesson")}
      >
        Start Lesson
      </button>
    </div>
  );

  const renderLesson = () => (
    <div className="text-center">
      <Avatar speaking={true} />
      <h2 className="text-2xl font-semibold">Lesson: What’s New in Space Exploration</h2>
      <p className="my-4">
        Humans are going back to the Moon with Artemis. The James Webb Telescope is capturing amazing images. Robots are exploring Mars, and private companies are racing to build reusable rockets!
      </p>
      <button
        className="bg-green-600 text-white px-4 py-2 rounded"
        onClick={() => setStep("quiz")}
      >
        Start Quiz
      </button>
    </div>
  );

  const renderQuiz = () => (
    <div className="text-center">
      <h2 className="text-xl font-bold mb-2">Question {currentQuestion + 1}</h2>
      <p className="mb-4">{questions[currentQuestion].question}</p>
      <div className="flex flex-col items-center">
        {questions[currentQuestion].options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleAnswer(opt)}
            className={`my-1 px-4 py-2 rounded w-60 ${selected === opt ? 'bg-yellow-300' : 'bg-gray-200'}`}
            disabled={!!selected}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  const renderResult = () => (
    <div className="text-center">
      <h2 className="text-2xl font-bold">All done!</h2>
      <p className="my-2">Your score: {score} / {questions.length}</p>
      {score >= 3 ? (
        <p className="text-green-600 font-semibold">🏆 Great work, you earned the Space Explorer badge!</p>
      ) : (
        <p className="text-red-500">Let’s try again and aim higher next time!</p>
      )}
    </div>
  );

  return (
    <div className="p-6 max-w-xl mx-auto">
      <video id="userVideo" autoPlay playsInline muted className="w-32 h-32 rounded-full border mb-4" />
      {step === "intro" && renderIntro()}
      {step === "lesson" && renderLesson()}
      {step === "quiz" && renderQuiz()}
      {step === "result" && renderResult()}
    </div>
  );
}
