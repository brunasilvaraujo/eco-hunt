import React from 'react';

export default function InfoPopup({ message }) {
  return (
    <div className="info-popup">
      <p>{message}</p>
    </div>
  );
}