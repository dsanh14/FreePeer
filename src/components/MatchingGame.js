import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

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

  const generateCards = async () => {
    if (!topic.trim()) {
      setError('Please enter a valid academic topic');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const prompt = `Create 8 educational matching pairs about ${topic}. 
      Each pair should consist of a term and its definition.
      Format the response as a JSON array of objects with the following structure:
      [
        {"term": "Term 1", "definition": "Definition 1"},
        {"term": "Term 2", "definition": "Definition 2"},
        ...
      ]`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const pairs = JSON.parse(text);
        // Create cards array with both terms and definitions
        const newCards = pairs.flatMap(pair => [
          { ...pair, type: 'term', id: Math.random() },
          { ...pair, type: 'definition', id: Math.random() }
        ]);
        // Shuffle the cards
        setCards(newCards.sort(() => Math.random() - 0.5));
        setFlippedCards([]);
        setMatchedPairs([]);
        setGameComplete(false);
      } catch (err) {
        setError('Failed to parse the response. Please try again.');
      }
    } catch (err) {
      setError('Failed to generate cards. Please try again.');
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
    <div className="min-h-screen bg-gray-50 py-12">
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
              {cards.map((card, index) => (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(index)}
                  className={`aspect-square flex items-center justify-center p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                    flippedCards.includes(index) || matchedPairs.includes(index)
                      ? 'bg-white shadow-lg'
                      : 'bg-primary-600 hover:bg-primary-700'
                  }`}
                >
                  {(flippedCards.includes(index) || matchedPairs.includes(index)) ? (
                    <p className="text-center text-gray-700">
                      {card.type === 'term' ? card.term : card.definition}
                    </p>
                  ) : (
                    <span className="text-white">?</span>
                  )}
                </div>
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