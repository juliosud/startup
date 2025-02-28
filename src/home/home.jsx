import React, { useState, useEffect } from 'react';

export function Home() {
    const [nutrients, setNutrients] = useState({
        calories: 2200,
        protein: 136,
        carbs: 289,
        fat: 63,
    });

    const [chatMessages, setChatMessages] = useState([]);
    const [userInput, setUserInput] = useState('');

    useEffect(() => {
        const savedNutrients = JSON.parse(localStorage.getItem('nutrients'));
        if (savedNutrients) {
          setNutrients(savedNutrients);
        }
    }, []);
    
    const handleUserInput = (e) => {
        setUserInput(e.target.value);
    };
    
    const handleChatSubmit = (e) => {
        e.preventDefault();
        if (userInput.trim()) {
          const userMessage = { sender: 'User', text: userInput };
          const aiResponse = getAIResponse(userInput);
    
          setChatMessages([...chatMessages, userMessage, aiResponse]);
          setUserInput('');
        }
    };

    const getAIResponse = (userInput) => {
        return {
          sender: 'AI',
          text: `Based on "${userInput}", I estimate:
          - Calories: 500 kcal
          - Protein: 25g
          - Carbs: 60g
          - Fat: 20g`,
        };
    };

    return (
        <main>
                <div className="box-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Calories</th>
                                <th>Protein</th>
                                <th>Carbs</th>
                                <th>Fat</th>
                            </tr>
                        </thead>
                        
                        <tbody>
                            <tr>
                                <td>{nutrients.calories}</td>
                                <td>{nutrients.protein}</td>
                                <td>{nutrients.carbs}</td>
                                <td>{nutrients.fat}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="box-container">
                    <div className="chat-box">
                        {chatMessages.map((msg, index) => (
                            <div key={index} className={`chat-bubble ${msg.sender === 'User' ? 'user' : 'ai'}`}>
                            <strong>{msg.sender}:</strong> {msg.text}
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleChatSubmit} className="chat-input">
                        <textarea
                            placeholder="Enter what you ate..."
                            value={userInput}
                            onChange={handleUserInput}
                        />
                        <button type="submit">Go</button>
                    </form>
                </div>
        </main>
  );
}