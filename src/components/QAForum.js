import React, { useState } from 'react';

export default function QAForum() {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      title: 'How to solve quadratic equations?',
      content: 'I\'m having trouble understanding the quadratic formula. Can someone explain it step by step?',
      author: 'John Doe',
      date: '2024-03-15',
      tags: ['Mathematics', 'Algebra'],
      answers: [
        {
          id: 1,
          content: 'The quadratic formula is x = (-b ± √(b²-4ac))/(2a). Let me break it down...',
          author: 'Jane Smith',
          date: '2024-03-16',
          upvotes: 5
        }
      ]
    },
    {
      id: 2,
      title: 'Best resources for learning React?',
      content: 'Looking for recommendations on the best tutorials and documentation for learning React.',
      author: 'Alice Johnson',
      date: '2024-03-14',
      tags: ['Programming', 'React'],
      answers: [
        {
          id: 1,
          content: 'The official React documentation is a great place to start. Also check out freeCodeCamp...',
          author: 'Bob Wilson',
          date: '2024-03-15',
          upvotes: 3
        }
      ]
    }
  ]);

  const [newQuestion, setNewQuestion] = useState({
    title: '',
    content: '',
    tags: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const question = {
      id: questions.length + 1,
      ...newQuestion,
      author: 'Current User',
      date: new Date().toISOString().split('T')[0],
      tags: newQuestion.tags.split(',').map(tag => tag.trim()),
      answers: []
    };
    setQuestions([question, ...questions]);
    setNewQuestion({ title: '', content: '', tags: '' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Q&A Forum
          </h1>
          <p className="text-xl text-gray-600">
            Ask questions and get help from the community
          </p>
        </div>

        <div className="mb-12">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8">
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Question Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={newQuestion.title}
                  onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3"
                  placeholder="What would you like to ask?"
                  required
                />
              </div>
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Question Details
                </label>
                <textarea
                  id="content"
                  value={newQuestion.content}
                  onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
                  rows={4}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3"
                  placeholder="Provide more context about your question..."
                  required
                />
              </div>
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  value={newQuestion.tags}
                  onChange={(e) => setNewQuestion({ ...newQuestion, tags: e.target.value })}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3"
                  placeholder="e.g., Mathematics, Algebra (comma-separated)"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-base font-medium text-white bg-[#3B82F6] hover:bg-[#2563EB] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Post Question
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          {questions.map((question) => (
            <div key={question.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">{question.title}</h2>
                  <span className="text-sm text-gray-500">{question.date}</span>
                </div>
                <p className="text-gray-600 mb-4">{question.content}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">By {question.author}</span>
                  <div className="flex gap-2">
                    {question.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Answers</h3>
                {question.answers.map((answer) => (
                  <div key={answer.id} className="mb-6 last:mb-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">By {answer.author}</span>
                      <span className="text-sm text-gray-500">{answer.date}</span>
                    </div>
                    <p className="text-gray-600 mb-3">{answer.content}</p>
                    <button className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                      </svg>
                      Upvote ({answer.upvotes})
                    </button>
                  </div>
                ))}
                <div className="mt-6">
                  <textarea
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3"
                    rows={3}
                    placeholder="Write your answer..."
                  />
                  <button className="mt-3 inline-flex justify-center py-2 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-[#3B82F6] hover:bg-[#2563EB] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                    Post Answer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 