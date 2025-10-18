import { useState, useEffect } from 'react';

const QuizQuestion = ({ 
  question, 
  questionNumber, 
  totalQuestions, 
  selectedOption, 
  onOptionSelect,
  showResult = false 
}) => {
  const [localSelected, setLocalSelected] = useState(selectedOption);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setLocalSelected(selectedOption);
  }, [selectedOption]);

  const handleOptionClick = (optionIndex) => {
    if (!showResult) {
      setIsAnimating(true);
      setLocalSelected(optionIndex);
      setTimeout(() => {
        onOptionSelect(question.id, optionIndex);
        setIsAnimating(false);
      }, 150);
    }
  };

  const getOptionStyle = (optionIndex) => {
    if (!showResult) {
      return localSelected === optionIndex
        ? 'border-blue-500 bg-blue-500/20 scale-105 shadow-lg shadow-blue-500/25'
        : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10 hover:scale-105';
    } else {
      // Show results - correct/incorrect styling
      if (optionIndex === question.correctAnswer) {
        return 'border-green-500 bg-green-500/20 scale-105 shadow-lg shadow-green-500/25';
      } else if (localSelected === optionIndex && optionIndex !== question.correctAnswer) {
        return 'border-red-500 bg-red-500/20 scale-105 shadow-lg shadow-red-500/25';
      } else {
        return 'border-white/10 bg-white/5 opacity-70';
      }
    }
  };

  const getOptionIcon = (optionIndex) => {
    const labels = ['A', 'B', 'C', 'D'];
    
    if (!showResult) {
      return localSelected === optionIndex 
        ? '🔘' 
        : '⚪';
    } else {
      if (optionIndex === question.correctAnswer) {
        return '✅';
      } else if (localSelected === optionIndex && optionIndex !== question.correctAnswer) {
        return '❌';
      } else {
        return '⚪';
      }
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto transition-all duration-500 ${isAnimating ? 'scale-95' : 'scale-100'}`}>
      {/* Question Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center space-x-4 px-6 py-3 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl mb-4">
          <span className="text-sm font-semibold text-gray-400">QUESTION</span>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {questionNumber} of {totalQuestions}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-white/10 rounded-full h-2 mb-6">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 mb-8 transform transition-all duration-500 hover:shadow-2xl">
        <div className="flex items-start space-x-4 mb-2">
          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
            Q
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-100 leading-tight flex-1">
            {question.question}
          </h2>
        </div>
        
        {showResult && (
          <div className={`mt-4 p-4 rounded-xl border ${
            localSelected === question.correctAnswer 
              ? 'border-green-500 bg-green-500/10' 
              : 'border-red-500 bg-red-500/10'
          }`}>
            <div className="flex items-center space-x-2">
              <span className={`text-lg ${
                localSelected === question.correctAnswer ? 'text-green-400' : 'text-red-400'
              }`}>
                {localSelected === question.correctAnswer ? '✅ Correct!' : '❌ Incorrect'}
              </span>
              {localSelected !== question.correctAnswer && (
                <span className="text-gray-300 text-sm">
                  Correct answer: {question.options[question.correctAnswer]}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.options.map((option, index) => (
          <div
            key={index}
            onClick={() => handleOptionClick(index)}
            className={`
              relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform
              ${getOptionStyle(index)}
              group overflow-hidden
            `}
          >
            {/* Background Animation */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Option Content */}
            <div className="relative z-10 flex items-center space-x-4">
              {/* Option Icon */}
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-lg group-hover:scale-110 transition-transform duration-300">
                {getOptionIcon(index)}
              </div>
              
              {/* Option Text */}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-semibold text-gray-400">
                    OPTION {String.fromCharCode(65 + index)}
                  </span>
                </div>
                <p className="text-lg font-medium text-white leading-relaxed">
                  {option}
                </p>
              </div>
            </div>

            {/* Selection Glow Effect */}
            {localSelected === index && (
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-600/10 border-2 border-blue-400/30"></div>
            )}

            {/* Hover Particles */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-white/10 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-white/10 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Selection Hint */}
      {!showResult && localSelected !== null && (
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-xl">
            <span className="text-blue-400">💡</span>
            <span className="text-sm text-blue-300">Option selected. Ready for next question!</span>
          </div>
        </div>
      )}

      {/* Bottom Decoration */}
      <div className="mt-8 flex justify-center">
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full"></div>
      </div>
    </div>
  );
};

// Example usage component for demonstration
const QuizQuestionDemo = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const demoQuestion = {
    id: 1,
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Modern Language", 
      "Hyper Transfer Markup Language",
      "Home Tool Markup Language"
    ],
    correctAnswer: 0
  };

  const handleOptionSelect = (questionId, optionIndex) => {
    setSelectedOption(optionIndex);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Quiz Question Demo
          </h1>
          <button
            onClick={() => setShowResult(!showResult)}
            className="px-6 py-2 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all"
          >
            {showResult ? 'Hide Results' : 'Show Results'}
          </button>
        </div>
        
        <QuizQuestion
          question={demoQuestion}
          questionNumber={1}
          totalQuestions={5}
          selectedOption={selectedOption}
          onOptionSelect={handleOptionSelect}
          showResult={showResult}
        />
      </div>
    </div>
  );
};

export default QuizQuestion;
// export { QuizQuestionDemo }; // Uncomment for demo purposes