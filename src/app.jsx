import React from 'react';
import './app.css';

import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from "./login/login";
import { Home } from "./home/home";
import { Meal_tracker } from "./meal_tracker/meal_tracker";



export default function App() {
    return (
        <BrowserRouter>
            <div className="body">
                <header>
                    <h1>SmartEats.AI</h1>
                    <nav>
                        <NavLink to="/">Login</NavLink> |
                        <NavLink to="/home">Home</NavLink> |
                        <NavLink to="/meal_tracker">Meal Tracker</NavLink>
                    </nav>
                </header>
            
                <Routes>
                    <Route path='/' element={<Login />} exact />
                    <Route path='/home' element={<Home />} />
                    <Route path='/meal_tracker' element={<Meal_tracker />} />
                    <Route path='*' element={<NotFound />} />
                </Routes>

                <footer>
                    <span className="text-reset">julio ferreira</span> | 
                    <NavLink to="https://github.com/juliosud/startup">GitHub</NavLink>
                </footer>
            </div>
        </BrowserRouter>
      );
}


function NotFound() {
    return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
}