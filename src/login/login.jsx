import React from 'react';

export function Login() {
  return (
    <main>
            <div className="box-container">
            <img src="https://media.istockphoto.com/id/1395140920/photo/peach-blueberry-and-arugula-fresh-fruit-salad-with-cheese-and-almond-nuts-top-view.jpg?s=612x612&w=0&k=20&c=IrRb7_0bFeO5uD0tfBoJxTElJHQ372li_ODfPEd7Vdk=" width="450" height="250"/> 
            <h4>login</h4>
            <form method="post">
                <div>
                    <input type="text" placeholder="cougars@byu.edu"/>
                </div>
                <div>
                    <input type="password" placeholder="***"/>
                </div>
                <button type="submit">Login</button>
                <button type="submit">Create</button>
            </form>
        </div>
        </main>
  );
}