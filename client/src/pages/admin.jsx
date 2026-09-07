import { useEffect, useState } from "react";
import axios from "axios";

const Messages = () => {


  return (
    <div>
        
      <h1>Contact Messages</h1>

      {messages.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        messages.map((m) => (
          <div key={m._id}>
            <h3>{m.name}</h3>

            <p>{m.email}</p>

            <p>{m.message}</p>

            <small>
              {new Date(
                m.createdAt
              ).toLocaleString()}
            </small>
          </div>
        ))
      )}
    </div>
  );
};

export default Messages;