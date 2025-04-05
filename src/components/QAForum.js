import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function QAForum() {
  const { user } = useAuth();
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [questions, setQuestions] = useState([
    {
      id: 1,
      title: 'How to solve quadratic equations?',
      content: 'I\'m having trouble understanding how to solve quadratic equations using the quadratic formula. Can someone explain it step by step?',
      author: 'John Doe',
      date: '2024-03-15',
      answers: [
        {
          id: 1,
          content: 'The quadratic formula is x = (-b ± √(b² - 4ac)) / 2a. Let me break it down step by step...',
          author: 'Jane Smith',
          date: '2024-03-15'
        }
      ]
    },
    {
      id: 2,
      title: 'Best resources for learning Python?',
      content: 'I\'m new to programming and want to learn Python. What are the best resources for beginners?',
      author: 'Alice Johnson',
      date: '2024-03-14',
      answers: [
        {
          id: 1,
          content: 'I recommend starting with Python.org\'s official tutorial and then moving to Codecademy\'s Python course.',
          author: 'Bob Wilson',
          date: '2024-03-14'
        }
      ]
    }
  ]);

  const handleQuestionClick = (question) => {
    setSelectedQuestion(question);
    setShowOverlay(true);
  };

  const handleSubmitQuestion = (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    const question = {
      id: questions.length + 1,
      title: newQuestion,
      content: newQuestion,
      author: user?.displayName || 'Anonymous',
      date: new Date().toISOString().split('T')[0],
      answers: []
    };

    setQuestions([question, ...questions]);
    setNewQuestion('');
  };

  const handleSubmitAnswer = (e) => {
    e.preventDefault();
    if (!newAnswer.trim() || !selectedQuestion) return;

    const answer = {
      id: selectedQuestion.answers.length + 1,
      content: newAnswer,
      author: user?.displayName || 'Anonymous',
      date: new Date().toISOString().split('T')[0]
    };

    const updatedQuestions = questions.map(q => {
      if (q.id === selectedQuestion.id) {
        return {
          ...q,
          answers: [...q.answers, answer]
        };
      }
      return q;
    });

    setQuestions(updatedQuestions);
    setSelectedQuestion(updatedQuestions.find(q => q.id === selectedQuestion.id));
    setNewAnswer('');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Q&A Forum</h1>
        
        {/* New Question Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Ask a Question</h2>
          <form onSubmit={handleSubmitQuestion} className="space-y-4">
            <div>
              <textarea
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Type your question here..."
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-[#3B82F6] hover:bg-[#2563EB] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Post Question
            </button>
          </form>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {questions.map((question) => (
            <div
              key={question.id}
              onClick={() => handleQuestionClick(question)}
              className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{question.title}</h3>
              <p className="text-gray-600 mb-4">{question.content}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>By {question.author}</span>
                <span>{question.date}</span>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                {question.answers.length} {question.answers.length === 1 ? 'answer' : 'answers'}
              </div>
            </div>
          ))}
        </div>

        {/* Question Overlay */}
        {showOverlay && selectedQuestion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedQuestion.title}</h2>
                  <button
                    onClick={() => setShowOverlay(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-600 mb-6">{selectedQuestion.content}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                  <span>By {selectedQuestion.author}</span>
                  <span>{selectedQuestion.date}</span>
                </div>

                {/* Answers Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {selectedQuestion.answers.length} {selectedQuestion.answers.length === 1 ? 'Answer' : 'Answers'}
                  </h3>
                  {selectedQuestion.answers.map((answer) => (
                    <div key={answer.id} className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-600 mb-2">{answer.content}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>By {answer.author}</span>
                        <span>{answer.date}</span>
                      </div>
                    </div>
                  ))}

                  {/* New Answer Form */}
                  <form onSubmit={handleSubmitAnswer} className="mt-6">
                    <div className="mb-4">
                      <textarea
                        value={newAnswer}
                        onChange={(e) => setNewAnswer(e.target.value)}
                        placeholder="Write your answer..."
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        rows={3}
                      />
                    </div>
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-[#3B82F6] hover:bg-[#2563EB] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Post Answer
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 