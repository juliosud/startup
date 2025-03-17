import React, { useState, useEffect } from 'react';

export function Login() {
  // State for user input
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [error, setError] = useState('');

  // new - Check if user is authenticated on page load
  useEffect(() => {
    fetch('/api/profile', { credentials: 'include' }) // new - Ensures cookies are sent
      .then(response => response.json())
      .then(data => {
        if (data.email) {
          setLoggedInUser(data.email); // new - Set logged-in user from API response
        }
      })
      .catch(() => {
        setLoggedInUser(null);
      });
  }, []);

  // new - Handle user login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/auth/login', { // new - API call to backend login
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // new - Ensures backend can set cookies
      });

      if (response.ok) {
        const data = await response.json();
        setLoggedInUser(data.email); // new - Store logged-in user
      } else {
        const errorData = await response.json();
        setError(errorData.msg); // new - Show error message from backend
      }
    } catch (err) {
      setError('Network error. Please try again.'); // new - Handle network failure
    }
  };

  // new - Handle user logout
  const handleLogout = async () => {
    await fetch('/api/auth/logout', {
      method: 'DELETE',
      credentials: 'include', // new - Ensures session is properly cleared
    });
    setLoggedInUser(null); // new - Remove logged-in user state
  };

  return (
    <main>
      <div className="box-container">
        <img 
          src="https://media.istockphoto.com/id/1395140920/photo/peach-blueberry-and-arugula-fresh-fruit-salad-with-cheese-and-almond-nuts-top-view.jpg?s=612x612&w=0&k=20&c=IrRb7_0bFeO5uD0tfBoJxTElJHQ372li_ODfPEd7Vdk=" 
          width="450" height="250"
        /> 

        {loggedInUser ? (
          <>
            <h4>Welcome, {loggedInUser}!</h4>
            <button onClick={handleLogout}>Logout</button> {/* new - Calls handleLogout */}
          </>
        ) : (
          <>
            <h4>Login</h4>
            <form onSubmit={handleLogin}> {/* new - Calls handleLogin */}
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
              {error && <p style={{ color: 'red' }}>{error}</p>} {/* new - Show error message */}
              <button type="submit">Login</button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
