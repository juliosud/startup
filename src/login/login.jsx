import React, { useState, useEffect } from 'react';

export function Login() {
  // State for user input
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loggedInUser, setLoggedInUser] = useState(null);

    useEffect(() => {
    const savedUser = localStorage.getItem('userEmail');
    if (savedUser) {
      setLoggedInUser(savedUser);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      localStorage.setItem('userEmail', email);
      setLoggedInUser(email);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    setLoggedInUser(null);
  };
  return (
    <main>
            <div className="box-container">
            <img src="https://media.istockphoto.com/id/1395140920/photo/peach-blueberry-and-arugula-fresh-fruit-salad-with-cheese-and-almond-nuts-top-view.jpg?s=612x612&w=0&k=20&c=IrRb7_0bFeO5uD0tfBoJxTElJHQ372li_ODfPEd7Vdk=" width="450" height="250"/> 
            
            {loggedInUser ? (
          <>
            <h4>Welcome, {loggedInUser}!</h4>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <h4>Login</h4>
            <form onSubmit={handleLogin}>
              <div>
                <input 
                  type="text" 
                  placeholder="cougars@byu.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <input 
                  type="password" 
                  placeholder="***"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit">Login</button>
            </form>
          </>
        )}
        </div>
    </main>
  );

}