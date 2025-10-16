import React from "react";

export default function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-[var(--color-neutral)] mb-4">{title}</h2>
      {children}
    </div>
  );
}
