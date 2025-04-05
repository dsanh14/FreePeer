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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Q&A Forum
          </h1>
          <p className="mt-3 text-xl text-gray-500 sm:mt-4">
            Ask questions and get help from the community
          </p>
        </div>

        <div className="mt-8">
          <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Question Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={newQuestion.title}
                  onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Question Content
                </label>
                <textarea
                  id="content"
                  value={newQuestion.content}
                  onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  id="tags"
                  value={newQuestion.tags}
                  onChange={(e) => setNewQuestion({ ...newQuestion, tags: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., Mathematics, Algebra"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Post Question
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="mt-8 space-y-6">
          {questions.map((question) => (
            <div key={question.id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">{question.title}</h2>
                  <span className="text-sm text-gray-500">{question.date}</span>
                </div>
                <p className="mt-2 text-gray-600">{question.content}</p>
                <div className="mt-4 flex items-center space-x-4">
                  <span className="text-sm text-gray-500">By {question.author}</span>
                  <div className="flex space-x-2">
                    {question.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4">
                <h3 className="text-lg font-medium text-gray-900">Answers</h3>
                {question.answers.map((answer) => (
                  <div key={answer.id} className="mt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">By {answer.author}</span>
                      <span className="text-sm text-gray-500">{answer.date}</span>
                    </div>
                    <p className="mt-2 text-gray-600">{answer.content}</p>
                    <div className="mt-2 flex items-center">
                      <button className="text-gray-500 hover:text-gray-700">
                        <span className="text-sm">Upvote ({answer.upvotes})</span>
                      </button>
                    </div>
                  </div>
                ))}
                <div className="mt-4">
                  <textarea
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows={3}
                    placeholder="Write your answer..."
                  />
                  <button className="mt-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
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