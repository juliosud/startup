import React from 'react';
import './app.css';

export default function App() {
    return <div className="body">
        <header>
            <h1>SmartEats.AI</h1>
            <nav>
                <a href="index.html">Login</a> |
                <a href="home.html">Home</a> |
                <a href="meal_tracker.html">Meal Tracker</a>
            </nav>
        </header>
    
        <main>App components go here</main>
        <footer>
            <span className="text-reset">j. ferreira</span> | 
            <a href="https://github.com/juliosud/startup">GitHub</a>
        </footer>
    </div>;
}