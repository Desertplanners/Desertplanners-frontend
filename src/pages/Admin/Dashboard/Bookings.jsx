import React from "react";
import Section from "../Dashboard/Section";

export default function Bookings() {
  return (
    <Section title="Manage Bookings">
      <div className="bg-[var(--color-white)] shadow rounded-md p-4">
        <p className="text-[var(--color-neutral)] opacity-70">
          All bookings and their status will appear here...
        </p>
      </div>
    </Section>
  );
}
