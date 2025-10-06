import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Heart, Search, RotateCcw, Smile, X } from 'lucide-react';

// Define placeholder URLs for the custom image assets
// 🚨 IMPORTANT: REPLACE THIS URL with the public URL of your actual QR code image!
// NOTE: Google Drive "sharing" links do not work here. You must use a direct image URL.
// We are using a generic placeholder that definitely works for now.
const PLACEHOLDER_QR_URL = "https://misalnitin1504.github.io/qr-code/my-qr-code.png";

// Confetti Component for high scores
const ConfettiOverlay = () => {
    // Generate an array of 20 elements for hearts
    const hearts = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        // Random horizontal position (0% to 100%)
        left: `${Math.random() * 100}%`,
        // Random delay for a scattered falling effect (0s to 2s)
        delay: `${Math.random() * 2}s`,
        // Random size (1x to 2x)
        scale: `${1 + Math.random()}`,
    }));

    return (
        <div className="confetti-container">
            {hearts.map(heart => (
                <div 
                    key={heart.id} 
                    className="heart-confetti" 
                    style={{ 
                        left: heart.left,
                        animationDelay: heart.delay,
                        transform: `scale(${heart.scale})`
                    }}
                >
                    ❤️
                </div>
            ))}
        </div>
    );
};


// Main App component
export default function App() {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [resultPercentage, setResultPercentage] = useState(null);
  const [resultMessage, setResultMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showDonationCard, setShowDonationCard] = useState(false);
  
  // State for the Confetti feature
  const [showConfetti, setShowConfetti] = useState(false); 
  
  // --- Utility Functions ---

  const calculateLovePercentage = (n1, n2) => {
    if (!n1 || !n2) return 0;
    const combined = (n1.toLowerCase() + n2.toLowerCase()).replace(/[^a-z]/g, '');
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      hash = (hash << 5) - hash + combined.charCodeAt(i);
      hash |= 0;
    }
    let percentage = Math.abs(hash % 100);
    if (percentage < 40) {
      percentage += 40;
    }
    if (percentage > 99) {
      percentage = 99;
    }
    return percentage;
  };

  const getLoveMessage = (percentage) => {
    if (percentage >= 95) {
      return "Cosmic connection! Your souls are perfectly aligned. Prepare for magic!";
    } else if (percentage >= 80) {
      return "A match made in the stars! Great compatibility and huge potential for adventure.";
    } else if (percentage >= 65) {
      return "Spark is definitely there! You two have a solid foundation for something special.";
    } else if (percentage >= 50) {
      return "Friendly potential! Give it a shot—sometimes the slow burns are the best ones.";
    } else {
      return "Interesting result! Opposites attract, right? The story is yours to write!";
    }
  };

  // --- Event Handlers ---

  const handleCalculate = () => {
    if (!name1.trim() || !name2.trim()) {
      setResultMessage("Please enter both names to start the calculation!");
      setResultPercentage(null);
      return;
    }

    setIsLoading(true);
    setResultPercentage(null);
    setResultMessage('');
    setShowConfetti(false); // Reset confetti before calculation

    // Simulate network delay for a fun loading effect
    setTimeout(() => {
      const percentage = calculateLovePercentage(name1.trim(), name2.trim());
      const message = getLoveMessage(percentage);

      setResultPercentage(percentage);
      setResultMessage(message);
      setIsLoading(false);
      setShowResultModal(true); // Show the modal after calculation
      
      // 💖 Trigger confetti for high scores (85% and up)
      if (percentage >= 85) {
        setShowConfetti(true);
      }
    }, 1500);
  };

  const handleContinueToDonation = () => {
    setShowResultModal(false);
    setShowDonationCard(true); // Transition to the QR code modal
    setShowConfetti(false); // Hide confetti when transitioning
  };

  const handleFinalReset = () => {
    setName1('');
    setName2('');
    setResultPercentage(null);
    setResultMessage('');
    setIsLoading(false);
    setShowResultModal(false);
    setShowDonationCard(false); // Close the QR modal
    setShowConfetti(false); // Clear confetti state
  }

  // --- Conditional Display Components ---

  const LoadingIndicator = () => (
    <div className="mt-8 p-6 flex flex-col items-center justify-center bg-white rounded-xl shadow-xl border-4 border-pink-400 animate-pulse">
      <Heart size={48} className="text-pink-500 animate-bounce" />
      <p className="mt-4 text-lg font-semibold text-gray-600">
        Calculating the cosmic alignment...
      </p>
    </div>
  );

  const ResultModal = () => (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50 p-4 transition duration-300 animate-fade-in">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm transform scale-100 transition duration-300 border-t-8 border-red-500">
        <div className="text-center">
          
          {/* Love Calculation Result */}
          <Heart size={48} className="mx-auto text-red-500 mb-4 drop-shadow-lg" fill="currentColor" />
          <h2 className="text-5xl font-extrabold text-pink-600 mb-2">
            {resultPercentage}%
          </h2>
          <p className="text-xl font-semibold text-gray-800 mb-4">
            {name1} & {name2}
          </p>
          <p className="text-gray-600 italic mb-6">
            "{resultMessage}"
          </p>
          
          {/* Button now triggers the display of the QR code modal */}
          <button
            onClick={handleContinueToDonation}
            className="w-full mt-4 flex items-center justify-center space-x-2 px-4 py-3 bg-red-500 text-white font-bold rounded-lg shadow-md hover:bg-red-600 transition duration-300 transform hover:scale-[1.02]"
          >
            <RotateCcw size={18} />
            <span>Start A New Calculation</span> 
          </button>
        </div>
      </div>
    </div>
  );

  // Updated DonationCard to be a full-screen modal with a close button
  const QRModal = () => {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50 p-4 transition duration-300 animate-fade-in">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm transform scale-100 transition duration-300 border-t-8 border-pink-500 relative">
          
          {/* Close Button */}
          <button 
            onClick={handleFinalReset}
            className="absolute top-3 right-3 p-2 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition duration-150"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <div className="text-center">
            
            {/* Thank You Message - Pink color */}
            <p className="mt-3 text-2xl md:text-3xl font-extrabold text-pink-600 mb-6 flex items-center justify-center space-x-2">
                <Smile className="text-pink-500" size={28} />
                <span>Thank You!</span>
            </p>

            {/* Donation Section */}
            <p className="text-lg text-gray-600 mb-6 font-medium">
              Scan this code to Donate Us and support the app:
            </p>
            <img 
              src={PLACEHOLDER_QR_URL} 
              alt="Donation QR Code" 
              className="mx-auto w-40 h-40 rounded-lg shadow-xl border-4 border-pink-400 object-cover" 
            />
            
            <p className="mt-6 text-sm text-gray-500 italic">
              Click the 'X' in the corner to return to the calculator.
            </p>
          </div>
        </div>
      </div>
    );
  };

  // --- Main Render ---

  return (
    <div className="min-h-screen bg-pink-100 flex items-center justify-center p-4 font-inter relative overflow-hidden">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out; }

        /* Confetti CSS */
        @keyframes fall {
            0% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
            10% { opacity: 1; }
            100% { transform: translateY(100vh) scale(1.5); opacity: 0.5; }
        }

        .confetti-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            overflow: hidden;
            z-index: 100; /* Ensure it's above everything else */
        }

        .heart-confetti {
            position: absolute;
            font-size: 20px; /* Base size for the emoji heart */
            top: 0;
            animation: fall 5s linear infinite;
        }
      `}</style>
      
      {/* 💖 Confetti Overlay for high scores 💖 */}
      {showConfetti && <ConfettiOverlay />}
      
      {/* Main Container */}
      <div className="w-full max-w-lg">

        {/* 1. Show Calculator/Loading UI when not on donation card */}
        {!showDonationCard && (
          <div className="bg-white p-8 rounded-3xl shadow-2xl border-b-8 border-pink-500">
              <div className="text-center mb-10">
                <Heart size={40} className="mx-auto text-red-500 mb-2 drop-shadow-md" fill="currentColor" />
                <h1 className="text-4xl font-bold text-gray-800">
                  The <span className="text-red-500">Love</span> Calculator
                </h1>
                <p className="text-gray-500 mt-2 italic">For pure entertainment purposes only!</p>
              </div>

              {/* Input Fields & Button (Visible unless loading) */}
              {!isLoading && (
                  <>
                      <div className="space-y-6">
                          <div className="relative">
                              <input
                              type="text"
                              placeholder="Your Name"
                              value={name1}
                              onChange={(e) => setName1(e.target.value)}
                              disabled={isLoading}
                              className="w-full p-4 pl-12 border-2 border-pink-300 rounded-lg text-lg focus:ring-pink-500 focus:border-pink-500 transition duration-150 shadow-inner disabled:bg-gray-50"
                              aria-label="First Name"
                              />
                              <Heart size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-400" />
                          </div>

                          <div className="relative">
                              <input
                              type="text"
                              placeholder="Partner's Name"
                              value={name2}
                              onChange={(e) => setName2(e.target.value)}
                              disabled={isLoading}
                              className="w-full p-4 pl-12 border-2 border-pink-300 rounded-lg text-lg focus:ring-pink-500 focus:border-pink-500 transition duration-150 shadow-inner disabled:bg-gray-50"
                              aria-label="Second Name"
                              />
                              <Heart size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-400" />
                          </div>
                      </div>

                      <button
                          onClick={handleCalculate}
                          disabled={isLoading || !name1.trim() || !name2.trim()}
                          className={`w-full mt-8 flex items-center justify-center space-x-2 px-6 py-4 text-lg font-bold rounded-xl transition duration-300 transform ${
                              isLoading || !name1.trim() || !name2.trim()
                              ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                              : 'bg-red-500 text-white shadow-xl hover:bg-red-600 hover:scale-[1.02] active:scale-95'
                          }`}
                      >
                          {isLoading ? (
                              <>
                                  <Search size={20} className="animate-spin" />
                                  <span>Searching...</span>
                              </>
                          ) : (
                              <>
                                  <Heart size={20} fill="currentColor" />
                                  <span>Calculate Love!</span>
                              </>
                          )}
                      </button>
                      {resultPercentage === null && !isLoading && resultMessage && (
                          <p className="mt-4 text-center text-red-500 font-medium">{resultMessage}</p>
                      )}
                  </>
              )}
              
              {/* Loading Area */}
              {isLoading && <LoadingIndicator />}
          </div>
        )}
        
        {/* 2. Show Donation Card as a Modal when showDonationCard is true */}
        {showDonationCard && <QRModal />}
      
        {/* 3. Result Modal (Overlays everything) */}
        {showResultModal && <ResultModal />}
      </div>
    </div>
  );
}