import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export default function TextRPG() {
  const [topic, setTopic] = useState('');
  const [story, setStory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [choices, setChoices] = useState([]);
  const [currentScene, setCurrentScene] = useState(0);
  const [characterStats, setCharacterStats] = useState({
    knowledge: 0,
    wisdom: 0,
    experience: 0
  });
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [question, setQuestion] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);

  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

  const formatResponse = (text) => {
    // Convert markdown to HTML with math support
    return (
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          p: ({ node, ...props }) => <p className="mb-4" {...props} />,
          strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
          em: ({ node, ...props }) => <em className="italic" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-4" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-4" {...props} />,
          li: ({ node, ...props }) => <li className="mb-2" {...props} />,
        }}
      >
        {text}
      </ReactMarkdown>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Please enter a valid academic topic');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const prompt = `Create an educational text-based RPG story about ${topic}. 
      The story should be engaging and educational, focusing on teaching concepts related to ${topic}.
      Use markdown formatting for emphasis, lists, and important points.
      For any mathematical equations, use LaTeX format between $$ for display equations or $ for inline equations.
      Include 3 choices for the player to make that affect the story's outcome.
      Each choice should have a different impact on the character's stats (knowledge, wisdom, experience).
      Format the response as a JSON object with the following structure:
      {
        "story": "The story text with markdown and LaTeX formatting",
        "choices": [
          {"text": "Choice 1", "outcome": "Outcome 1", "stats": {"knowledge": 1, "wisdom": 0, "experience": 2}},
          {"text": "Choice 2", "outcome": "Outcome 2", "stats": {"knowledge": 2, "wisdom": 1, "experience": 1}},
          {"text": "Choice 3", "outcome": "Outcome 3", "stats": {"knowledge": 0, "wisdom": 2, "experience": 1}}
        ]
      }`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const cleanedText = text.replace(/```json\n|\n```/g, '').trim();
        const parsedResponse = JSON.parse(cleanedText);
        
        if (!parsedResponse.story || !parsedResponse.choices) {
          throw new Error('Invalid response format');
        }
        
        setStory(parsedResponse.story);
        setChoices(parsedResponse.choices);
        setCurrentScene(0);
        setCharacterStats({
          knowledge: 0,
          wisdom: 0,
          experience: 0
        });
      } catch (err) {
        console.error('Parsing error:', err);
        setError('Failed to parse the response. Please try again.');
      }
    } catch (err) {
      console.error('API error:', err);
      setError('Failed to generate story. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChoiceSelect = (choice) => {
    setSelectedChoice(choice);
    setQuestion('');
    setUserAnswer('');
    setFeedback('');
    setIsAnswering(true);
  };

  const generateQuestion = async () => {
    setLoading(true);
    try {
      const prompt = `Based on the story about ${topic} and the choice "${selectedChoice.text}", 
      generate a challenging multiple-choice question that tests understanding of the educational content.
      Format the response as a JSON object:
      {
        "question": "The question text",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "correctAnswer": "The correct option"
      }`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const cleanedText = text.replace(/```json\n|\n```/g, '').trim();
        const parsedResponse = JSON.parse(cleanedText);
        setQuestion(parsedResponse);
      } catch (err) {
        console.error('Parsing error:', err);
        setError('Failed to generate question. Please try again.');
      }
    } catch (err) {
      console.error('API error:', err);
      setError('Failed to generate question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async () => {
    if (!userAnswer.trim()) return;

    setLoading(true);
    try {
      const prompt = `Evaluate this answer to the question about ${topic}:
      Question: ${question.question}
      User's Answer: ${userAnswer}
      Correct Answer: ${question.correctAnswer}
      
      Provide constructive feedback and explain why the answer is correct or incorrect.
      Format the response as a JSON object:
      {
        "isCorrect": boolean,
        "feedback": "Detailed feedback text",
        "explanation": "Explanation of the correct answer"
      }`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const cleanedText = text.replace(/```json\n|\n```/g, '').trim();
        const parsedResponse = JSON.parse(cleanedText);
        setFeedback(parsedResponse);
      } catch (err) {
        console.error('Parsing error:', err);
        setError('Failed to evaluate answer. Please try again.');
      }
    } catch (err) {
      console.error('API error:', err);
      setError('Failed to evaluate answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const continueStory = async () => {
    setLoading(true);
    setError('');

    // Update character stats
    setCharacterStats(prev => ({
      knowledge: prev.knowledge + (selectedChoice.stats?.knowledge || 0),
      wisdom: prev.wisdom + (selectedChoice.stats?.wisdom || 0),
      experience: prev.experience + (selectedChoice.stats?.experience || 0)
    }));

    try {
      const prompt = `Continue the educational text-based RPG story about ${topic} based on the choice: "${selectedChoice.text}".
      The story should continue to be educational and engaging.
      Use markdown formatting for emphasis, lists, and important points.
      For any mathematical equations, use LaTeX format between $$ for display equations or $ for inline equations.
      Include 3 new choices for the player to make.
      Each choice should have a different impact on the character's stats (knowledge, wisdom, experience).
      Format the response as a JSON object with the following structure:
      {
        "story": "The story text with markdown and LaTeX formatting",
        "choices": [
          {"text": "Choice 1", "outcome": "Outcome 1", "stats": {"knowledge": 1, "wisdom": 0, "experience": 2}},
          {"text": "Choice 2", "outcome": "Outcome 2", "stats": {"knowledge": 2, "wisdom": 1, "experience": 1}},
          {"text": "Choice 3", "outcome": "Outcome 3", "stats": {"knowledge": 0, "wisdom": 2, "experience": 1}}
        ]
      }`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        // Clean the response text to ensure it's valid JSON
        const cleanedText = text
          .replace(/```json\n|\n```/g, '') // Remove markdown code block markers
          .replace(/```/g, '') // Remove any remaining backticks
          .trim();
        
        const parsedResponse = JSON.parse(cleanedText);
        
        if (!parsedResponse.story || !parsedResponse.choices || !Array.isArray(parsedResponse.choices)) {
          throw new Error('Invalid response format');
        }
        
        // Validate each choice has the required properties
        const validChoices = parsedResponse.choices.every(choice => 
          choice.text && choice.outcome && choice.stats &&
          typeof choice.stats.knowledge === 'number' &&
          typeof choice.stats.wisdom === 'number' &&
          typeof choice.stats.experience === 'number'
        );
        
        if (!validChoices) {
          throw new Error('Invalid choice format');
        }
        
        setStory(prev => prev + '\n\n' + parsedResponse.story);
        setChoices(parsedResponse.choices);
        setCurrentScene(prev => prev + 1);
        setSelectedChoice(null);
        setQuestion('');
        setUserAnswer('');
        setFeedback('');
        setIsAnswering(false);
      } catch (err) {
        console.error('Parsing error:', err);
        setError('Failed to parse the response. Please try again.');
      }
    } catch (err) {
      console.error('API error:', err);
      setError('Failed to generate next part of the story. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">Educational Text RPG</h1>
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-4">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-500">Knowledge</p>
                <p className="text-lg font-semibold text-primary-600">{characterStats.knowledge}</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-500">Wisdom</p>
                <p className="text-lg font-semibold text-primary-600">{characterStats.wisdom}</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-500">Experience</p>
                <p className="text-lg font-semibold text-primary-600">{characterStats.experience}</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Scene: {currentScene + 1}
            </div>
          </div>
        </div>
        
        {!story ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <label htmlFor="topic" className="block text-lg font-medium text-gray-900 mb-2">
                Choose Your Academic Quest
              </label>
              <input
                type="text"
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="e.g., Quantum Physics, Ancient Rome, Calculus"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {loading ? 'Generating Your Adventure...' : 'Begin Your Quest'}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="prose max-w-none">
                {formatResponse(story)}
              </div>
            </div>
            
            {!isAnswering ? (
              <div className="space-y-3">
                {choices.map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => handleChoiceSelect(choice)}
                    disabled={loading}
                    className="w-full text-left p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-primary-500"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">{choice.text}</span>
                      <div className="flex space-x-2 text-sm">
                        {choice.stats?.knowledge > 0 && (
                          <span className="text-primary-600">+{choice.stats.knowledge} Knowledge</span>
                        )}
                        {choice.stats?.wisdom > 0 && (
                          <span className="text-primary-600">+{choice.stats.wisdom} Wisdom</span>
                        )}
                        {choice.stats?.experience > 0 && (
                          <span className="text-primary-600">+{choice.stats.experience} Experience</span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {!question ? (
                  <button
                    onClick={generateQuestion}
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    {loading ? 'Generating Question...' : 'Generate Question'}
                  </button>
                ) : (
                  <>
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">{question.question}</h3>
                      <div className="space-y-3">
                        {question.options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => setUserAnswer(option)}
                            className={`w-full text-left p-3 rounded-lg border ${
                              userAnswer === option
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-gray-200 hover:border-primary-500'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {!feedback ? (
                      <button
                        onClick={handleAnswerSubmit}
                        disabled={loading || !userAnswer}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        {loading ? 'Evaluating...' : 'Submit Answer'}
                      </button>
                    ) : (
                      <>
                        <div className={`bg-white rounded-xl shadow-lg p-6 ${
                          feedback.isCorrect ? 'border-green-500' : 'border-red-500'
                        }`}>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {feedback.isCorrect ? 'Correct!' : 'Incorrect'}
                          </h3>
                          <p className="text-gray-700 mb-4">{feedback.feedback}</p>
                          <p className="text-gray-600">{feedback.explanation}</p>
                        </div>
                        <button
                          onClick={continueStory}
                          disabled={loading}
                          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          {loading ? 'Continuing Story...' : 'Continue Story'}
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
            {error}
          </div>
        )}
      </div>
    </div>
  );
} 