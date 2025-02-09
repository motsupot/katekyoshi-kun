import React from "react";
import "./LoadingSpinner.css"; // スタイルをインポート

export const LoadingSpinner: React.FC = () => (
  <div className="spinner-container">
    <div className="spinner"></div>
  </div>
);
