import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export default function MatchingGame() {
  const [topic, setTopic] = useState('');
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gameComplete, setGameComplete] = useState(false);

  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

  const formatResponse = (text) => {
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

  const generateCards = async () => {
    setLoading(true);
    setError('');
    try {
      const prompt = `Create 8 educational matching pairs about ${topic}.
      Each pair should consist of a term and its definition.
      Use markdown formatting for emphasis and important points.
      For any mathematical equations, use LaTeX format between $$ for display equations or $ for inline equations.
      Format the response as a JSON object:
      {
        "pairs": [
          {"term": "Term 1 with markdown and LaTeX", "definition": "Definition 1 with markdown and LaTeX"},
          {"term": "Term 2 with markdown and LaTeX", "definition": "Definition 2 with markdown and LaTeX"},
          {"term": "Term 3 with markdown and LaTeX", "definition": "Definition 3 with markdown and LaTeX"},
          {"term": "Term 4 with markdown and LaTeX", "definition": "Definition 4 with markdown and LaTeX"},
          {"term": "Term 5 with markdown and LaTeX", "definition": "Definition 5 with markdown and LaTeX"},
          {"term": "Term 6 with markdown and LaTeX", "definition": "Definition 6 with markdown and LaTeX"},
          {"term": "Term 7 with markdown and LaTeX", "definition": "Definition 7 with markdown and LaTeX"},
          {"term": "Term 8 with markdown and LaTeX", "definition": "Definition 8 with markdown and LaTeX"}
        ]
      }`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const cleanedText = text
          .replace(/```json\n|\n```/g, '')
          .replace(/```/g, '')
          .trim();
        
        const parsedResponse = JSON.parse(cleanedText);
        
        if (!parsedResponse.pairs || !Array.isArray(parsedResponse.pairs) || parsedResponse.pairs.length !== 8) {
          throw new Error('Invalid pairs format');
        }
        
        // Validate each pair has the required properties
        const validPairs = parsedResponse.pairs.every(pair => 
          pair.term && pair.definition && 
          typeof pair.term === 'string' && 
          typeof pair.definition === 'string'
        );
        
        if (!validPairs) {
          throw new Error('Invalid pair format');
        }
        
        // Create cards array with unique IDs
        const cards = parsedResponse.pairs.flatMap(pair => [
          { id: Math.random().toString(36).substr(2, 9), content: pair.term, type: 'term' },
          { id: Math.random().toString(36).substr(2, 9), content: pair.definition, type: 'definition' }
        ]);
        
        // Shuffle cards
        for (let i = cards.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [cards[i], cards[j]] = [cards[j], cards[i]];
        }
        
        setCards(cards);
        setFlippedCards([]);
        setMatchedPairs([]);
        setGameComplete(false);
      } catch (err) {
        console.error('Parsing error:', err);
        setError('Failed to generate matching pairs. Please try again.');
      }
    } catch (err) {
      console.error('API error:', err);
      setError('Failed to generate matching pairs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (index) => {
    if (flippedCards.length === 2 || flippedCards.includes(index) || matchedPairs.includes(index)) {
      return;
    }

    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      const [firstIndex, secondIndex] = newFlippedCards;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.term === secondCard.term) {
        setMatchedPairs([...matchedPairs, firstIndex, secondIndex]);
        setFlippedCards([]);
        
        if (matchedPairs.length + 2 === cards.length) {
          setGameComplete(true);
        }
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Educational Matching Game</h1>
        
        {cards.length === 0 ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
                Enter an academic topic
              </label>
              <input
                type="text"
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="e.g., Biology, World History, Computer Science"
              />
            </div>
            <button
              onClick={generateCards}
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {loading ? 'Generating...' : 'Start Game'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {cards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  disabled={flippedCards.includes(card.id) || matchedPairs.includes(card.id)}
                  className={`aspect-square rounded-lg shadow-md transition-all duration-200 ${
                    flippedCards.includes(card.id) || matchedPairs.includes(card.id)
                      ? 'bg-white'
                      : 'bg-primary-600 hover:bg-primary-700'
                  }`}
                >
                  <div className="p-4 h-full flex items-center justify-center">
                    <div className="prose max-w-none text-center">
                      {formatResponse(card.content)}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {gameComplete && (
              <div className="text-center">
                <p className="text-xl font-semibold text-green-600 mb-4">Congratulations! You've matched all pairs!</p>
                <button
                  onClick={() => setCards([])}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Play Again
                </button>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </div>
    </div>
  );
} 