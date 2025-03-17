import React, { useState, useEffect } from 'react';
import { Authenticated } from "./authenticated";
import { Unauthenticated } from "./unauthenticated";

export function Login() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/profile', { credentials: 'include' })
      .then(response => response.json())
      .then(data => {
        if (data.email) {
          setUser(data.email);
        }
      })
      .catch(() => setUser(null));
  }, []);

  return (
    <main>
      <div className="box-container">
        <img src="https://media.istockphoto.com/id/1395140920/photo/peach-blueberry-and-arugula-fresh-fruit-salad-with-cheese-and-almond-nuts-top-view.jpg?s=612x612&w=0&k=20&c=IrRb7_0bFeO5uD0tfBoJxTElJHQ372li_ODfPEd7Vdk=" width="450" height="250" alt="Healthy Food" />
        {user ? <Authenticated user={user} onLogout={() => setUser(null)} /> : <Unauthenticated onLogin={setUser} />}
      </div>
    </main>
  );
}
