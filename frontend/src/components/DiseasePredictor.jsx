import React, { useState, useEffect } from 'react';

const symptomsList = [
  "fever", "cough", "sore throat", "headache", "nausea", "vomiting", "rash", "joint pain",
  "chest pain", "shortness of breath", "fatigue", "weight loss", "increased thirst",
  "abdominal pain", "itching", "diarrhea", "dehydration", "night sweats", "stiffness",
  "swelling", "stiff neck", "high blood pressure", "blurred vision", "frequent urination",
  "abdominal cramps", "bloating", "pale skin", "dizziness", "rapid heartbeat", "confusion",
  "slurred speech", "drooping face", "weight gain", "cold intolerance", "excessive sweating",
  "muscle weakness", "vision issues", "memory loss", "persistent cough", "blood in sputum",
  "abdominal bloating", "pelvic pain", "bone pain", "frequent fractures", "loss of appetite",
  "jaundice", "eye pain", "sensitivity to light", "eye redness", "ear pain", "hearing loss",
  "runny nose", "sneezing", "chills", "difficulty swallowing", "hoarseness", "burning urination",
  "increased hunger", "shaky hands", "hunger", "dry skin", "irritability", "bedwetting",
  "muscle cramps", "bloody stools", "lower back pain", "urination issues"
];

const DiseasePredictor = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [prediction, setPrediction] = useState(null);

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
  };

  const predictDisease = async () => {
    if (selectedSymptoms.length === 0) {
      alert("Please select at least one symptom.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: selectedSymptoms })
      });

      const data = await response.json();
      setPrediction(data);
      setSelectedSymptoms([]);
    } catch (error) {
      console.error("Error fetching prediction:", error);
      alert("Failed to contact backend API.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">AI-Based Disease Predictor</h2>
        <label className="block text-gray-700 font-medium mb-2">Select Symptoms:</label>

        <div className="border border-gray-300 rounded-lg p-3 h-52 overflow-y-auto shadow-sm bg-white">
          {symptomsList.map(symptom => (
            <div key={symptom} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={symptom}
                checked={selectedSymptoms.includes(symptom)}
                onChange={() => toggleSymptom(symptom)}
                className="h-5 w-5 text-blue-600"
              />
              <label htmlFor={symptom} className="ml-2 block text-gray-700 select-none">
                {symptom}
              </label>
            </div>
          ))}
        </div>

        <button
          onClick={predictDisease}
          className="mt-5 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Predict Disease
        </button>

        {prediction && (
          <div className="mt-6 p-4 bg-green-50 border border-green-300 rounded-lg text-gray-800 shadow-sm">
            <h3 className="text-xl font-semibold text-green-700 mb-2">Prediction Result</h3>
            <p><strong>Disease:</strong> {prediction.predicted_disease}</p>
            <p><strong>Description:</strong> {prediction.description}</p>
            <p><strong>Causes:</strong> {prediction.causes}</p>
            <p><strong>Emergency:</strong> {prediction.emergency}</p>
            <p><strong>Cure:</strong> {prediction.cure}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiseasePredictor;
