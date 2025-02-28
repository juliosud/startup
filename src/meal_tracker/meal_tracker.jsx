import React, { useState, useEffect } from 'react';

export function Meal_tracker() {
  const [meals, setMeals] = useState([]);
  const [mealInput, setMealInput] = useState({
    food: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
  });
  
  const [nutrients, setNutrients] = useState({
    calories: 2200,
    protein: 136,
    carbs: 289,
    fat: 63,
  });        

  useEffect(() => {
    const savedMeals = JSON.parse(localStorage.getItem('meals')) || [];
    setMeals(savedMeals);
  }, []);

  useEffect(() => {
    localStorage.setItem('meals', JSON.stringify(meals));
    const totalCalories = meals.reduce((sum, meal) => sum + Number(meal.calories), 0);
    const totalProtein = meals.reduce((sum, meal) => sum + Number(meal.protein), 0);
    const totalCarbs = meals.reduce((sum, meal) => sum + Number(meal.carbs), 0);
    const totalFat = meals.reduce((sum, meal) => sum + Number(meal.fat), 0);

    setNutrients({
      calories: totalCalories || 2200,
      protein: totalProtein || 136,
      carbs: totalCarbs || 289,
      fat: totalFat || 63,
    });

  }, [meals]);

  const handleInputChange = (e) => {
    setMealInput({ ...mealInput, [e.target.name]: e.target.value });
  };

  const addMeal = (e) => {
    e.preventDefault();
    if (mealInput.food.trim()) {
      const newMeals = [...meals, mealInput];
      setMeals(newMeals);
      setMealInput({ food: '', calories: '', protein: '', carbs: '', fat: '' });
      console.log('API CALL: Save meal to database', mealInput);
    }
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
            <table>
                <thead>
                    <tr>
                        <th>Food</th>
                        <th>Calories</th>
                        <th>Protein (g)</th>
                        <th>Carbs (g)</th>
                        <th>Fat (g)</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {meals.length > 0 ? (meals.map((meal, index) => (
                        <tr key={index}>
                            <td>{meal.food}</td>
                            <td>{meal.calories}</td>
                            <td>{meal.protein}</td>
                            <td>{meal.carbs}</td>
                            <td>{meal.fat}</td>
                        </tr>
                    ))
                    ) : (
                    <tr>
                        <td colSpan="5">No meals added yet</td>
                    </tr>
                    )}
                </tbody>
            </table>
        </div>

        <div className="box-container">          
            <form onSubmit={addMeal}>
                <div>
                    <label>Food:</label>
                    <input type="text" name="food" value={mealInput.food} onChange={handleInputChange} required />
                </div>
                <div>
                    <label>Calories:</label>
                    <input type="number" name="calories" value={mealInput.calories} onChange={handleInputChange} required />
                </div>
                <div>
                    <label>Protein (g):</label>
                    <input type="number" name="protein" value={mealInput.protein} onChange={handleInputChange} required />
                </div>
                <div>
                    <label>Carbs (g):</label>
                    <input type="number" name="carbs" value={mealInput.carbs} onChange={handleInputChange} required />
                </div>
                <div>
                    <label>Fat (g):</label>
                    <input type="number" name="fat" value={mealInput.fat} onChange={handleInputChange} required />
                </div>
                <button type="submit">Add Meal</button>
            </form>
        </div>  
        </main>
  );
}