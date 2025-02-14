import React from 'react';

export function Home() {
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
                            <td>2200</td>
                            <td>136</td>
                            <td>289</td>
                            <td>63</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="box-container">
            <form method="post">
                <div>
                    <textarea name="Hungry?" placeholder="What would you like to eat?"></textarea>
                    <button type="submit">Go</button>
                </div>
            </form>
        </div>
        </main>
  );
}