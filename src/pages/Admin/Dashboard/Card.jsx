import React from "react";

export default function Card({ title, value }) {
  return (
    <div className="bg-[var(--color-white)] shadow rounded-lg p-5 text-center border border-[var(--color-light-gray)]">
      <h3 className="text-[var(--color-neutral)] text-sm">{title}</h3>
      <p className="text-2xl font-bold mt-2 text-[var(--color-primary)]">{value}</p>
    </div>
  );
}
