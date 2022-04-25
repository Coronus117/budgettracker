import React from "react";
import { Link } from "react-router-dom";

const buttons = [
  { label: "Budget", to: "/" },
  { label: "Expenses", to: "/expenses" },
];

function Navigation() {
  return (
    <div className="flex gap-6 p-6">
      {buttons.map((b) => {
        return (
          <nav key={b.label} className="border-2 px-5 py-3 rounded-lg">
            <Link to={`${b.to}`}>{b.label}</Link>
          </nav>
        );
      })}
    </div>
  );
}

export default Navigation;
