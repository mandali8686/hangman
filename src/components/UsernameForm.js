import React, { useState } from "react";

function UsernameForm(props) {
  const [username, setUsername] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    props.onSubmit(username);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="username">Enter your username:</label>
      <input
        id="username"
        type="text"
        value={username}
        onChange={handleUsernameChange}
        required
      />
      <button type="submit">Start Game</button>
    </form>
  );
}

export default UsernameForm;