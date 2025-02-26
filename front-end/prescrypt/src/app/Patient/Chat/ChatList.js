import React from 'react';

export default function ChatList({ contacts, selectChat, selectedContact }) {
  return (
    <div className="chat-list">
      <h2>TeleHealth</h2>
      {contacts.map((contact, index) => (
        <div
          key={index}
          className={`contact ${selectedContact?.id === contact.id ? "selected" : ""}`}
          onClick={() => selectChat(contact)}
        >
          <div className="contact-header">
            <p className="doctor-name">{contact.name}</p>
            <p className="recent-message">{contact.recentMessage}</p>
          </div>
        </div>
      ))}
    </div>
  );
}