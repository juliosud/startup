import React, { useState, useEffect } from 'react';

export function Meal_tracker() {
  // Meal state
  const [meals, setMeals] = useState([]);
  const [mealInput, setMealInput] = useState({
    food: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
  });

  // Nutrients summary state
  const [nutrients, setNutrients] = useState({
    calories: 2200,
    protein: 136,
    carbs: 289,
    fat: 63,
  });

  // Load meals from localStorage when the component mounts
  useEffect(() => {
    const savedMeals = JSON.parse(localStorage.getItem('meals')) || [];
    setMeals(savedMeals);
  }, []);

  // Save meals and update nutrient summary when meals change
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

  // Handle form input change
  const handleInputChange = (e) => {
    setMealInput({ ...mealInput, [e.target.name]: e.target.value });
  };

  // Add a new meal
  const addMeal = (e) => {
    e.preventDefault();
    if (mealInput.food.trim()) {
      const newMeals = [...meals, { ...mealInput }];
      setMeals(newMeals);
      setMealInput({ food: '', calories: '', protein: '', carbs: '', fat: '' });
      localStorage.setItem('meals', JSON.stringify(newMeals));
    }
  };

  // Edit state
  const [editingIndex, setEditingIndex] = useState(null);
  const [editMeal, setEditMeal] = useState({
    food: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
  });

  // Start editing a meal
  const startEditing = (index, meal) => {
    setEditingIndex(index);
    setEditMeal({ ...meal }); // Create a copy to avoid modifying state directly
  };

  // Handle editing input change
  const handleEditChange = (field, value) => {
    setEditMeal((prevMeal) => ({
      ...prevMeal,
      [field]: value,
    }));
  };

  // Save edited meal
  const saveEdit = (index) => {
    if (editingIndex === null) return; // Prevent saving if no row is being edited

    const updatedMeals = [...meals];
    updatedMeals[index] = { ...editMeal }; // Ensure we store a new object
    setMeals(updatedMeals);
    setEditingIndex(null); // Exit edit mode
    localStorage.setItem('meals', JSON.stringify(updatedMeals)); // Persist changes
  };

  return (
    <main>
      {/* Nutrients Table */}
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

      {/* Meal Tracker Table */}
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
            {meals.length > 0 ? (
              meals.map((meal, index) => (
                <tr key={index}>
                  <td>
                    {editingIndex === index ? (
                      <input
                        type="text"
                        value={editMeal.food}
                        onChange={(e) => handleEditChange('food', e.target.value)}
                      />
                    ) : (
                      meal.food
                    )}
                  </td>
                  <td>
                    {editingIndex === index ? (
                      <input
                        type="number"
                        value={editMeal.calories}
                        onChange={(e) => handleEditChange('calories', e.target.value)}
                      />
                    ) : (
                      meal.calories
                    )}
                  </td>
                  <td>
                    {editingIndex === index ? (
                      <input
                        type="number"
                        value={editMeal.protein}
                        onChange={(e) => handleEditChange('protein', e.target.value)}
                      />
                    ) : (
                      meal.protein
                    )}
                  </td>
                  <td>
                    {editingIndex === index ? (
                      <input
                        type="number"
                        value={editMeal.carbs}
                        onChange={(e) => handleEditChange('carbs', e.target.value)}
                      />
                    ) : (
                      meal.carbs
                    )}
                  </td>
                  <td>
                    {editingIndex === index ? (
                      <input
                        type="number"
                        value={editMeal.fat}
                        onChange={(e) => handleEditChange('fat', e.target.value)}
                      />
                    ) : (
                      meal.fat
                    )}
                  </td>
                  <td>
                    {editingIndex === index ? (
                      <button onClick={() => saveEdit(index)}>Save</button>
                    ) : (
                      <button onClick={() => startEditing(index, meal)}>Edit</button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No meals added yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Meal Form */}
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
