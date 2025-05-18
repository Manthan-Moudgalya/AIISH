import { defaultTransformValue } from "framer-motion";
import { useState } from "react";

function WellnessTips() {
  const [specialist, setSpecialist] = useState("slp");
  
  const toggleSpecialist = () => {
    setSpecialist(specialist === "slp" ? "audiologist" : "slp");
  };

  // Define wellness tips for each specialist
  const slpTips = [
    {
      title: "Daily Vocal Rest",
      description: "Schedule 15-30 minutes of vocal rest each day to prevent strain on your vocal cords.",
      icon: "🔇"
    },
    {
      title: "Hydration Matters",
      description: "Drink 8-10 glasses of water daily to keep your vocal folds hydrated and functioning optimally.",
      icon: "💧"
    },
    {
      title: "Practice Makes Perfect",
      description: "Set aside 10-15 minutes each day to practice the exercises provided by your speech therapist.",
      icon: "🔄"
    },
    {
      title: "Mindful Communication",
      description: "Slow down and be deliberate with your speech to improve clarity and fluency.",
      icon: "🧠"
    },
    {
      title: "Reduce Caffeine & Alcohol",
      description: "These can dehydrate your vocal folds and impact your speech performance.",
      icon: "☕"
    }
  ];

  const audiologistTips = [
    {
      title: "Hearing Protection",
      description: "Use earplugs or earmuffs in noisy environments to prevent further hearing damage.",
      icon: "🔊"
    },
    {
      title: "Regular Maintenance",
      description: "Clean your hearing aids weekly and replace batteries as recommended by your audiologist.",
      icon: "🧹"
    },
    {
      title: "Listening Breaks",
      description: "Take regular breaks from noisy environments to give your ears a rest.",
      icon: "⏸️"
    },
    {
      title: "Be Proactive",
      description: "Position yourself in quieter areas during conversations to optimize your hearing ability.",
      icon: "👂"
    },
    {
      title: "Regular Check-ups",
      description: "Visit your audiologist every 6-12 months for hearing assessments and device adjustments.",
      icon: "📅"
    }
  ];

  const tips = specialist === "slp" ? slpTips : audiologistTips;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Wellness Tips for {specialist === "slp" ? "Speech Therapy" : "Audiology"} Patients
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Simple habits to improve your {specialist === "slp" ? "speech and communication" : "hearing and ear health"} between appointments
          </p>
          
          {/* Toggle Switch */}
          <div className="flex items-center justify-center mb-4">
            <span className={`mr-3 font-medium ${specialist === "slp" ? "text-blue-600" : "text-gray-500"}`}>
              Speech Therapy
            </span>
            <div 
              className="relative cursor-pointer w-16 h-8 rounded-full p-1 transition-colors duration-300 ease-in-out bg-gray-200"
              onClick={toggleSpecialist}
            >
              <div 
                className={`absolute w-6 h-6 rounded-full transition-transform duration-300 ease-in-out bg-white shadow-md ${
                  specialist === "audiologist" ? "transform translate-x-8" : ""
                }`} 
              />
            </div>
            <span className={`ml-3 font-medium ${specialist === "audiologist" ? "text-blue-600" : "text-gray-500"}`}>
              Audiology
            </span>
          </div>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map((tip, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="text-4xl mb-4">{tip.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{tip.title}</h3>
              <p className="text-gray-600">{tip.description}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default WellnessTips;