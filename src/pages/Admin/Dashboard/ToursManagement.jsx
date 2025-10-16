import React from "react";
import Section from "../Dashboard/Section";

export default function ToursManagement() {
  return (
    <Section title="Manage Tours">
      <button className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-4 py-2 rounded-md mb-4">
        + Add New Tour
      </button>
      <div className="bg-[var(--color-white)] shadow rounded-md p-4">
        <p className="text-[var(--color-neutral)] opacity-70">List of all tours will appear here...</p>
      </div>
    </Section>
  );
}
