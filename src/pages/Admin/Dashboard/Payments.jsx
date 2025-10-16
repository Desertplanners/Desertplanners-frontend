import React from "react";
import Section from "../Dashboard/Section";

export default function Payments() {
  return (
    <Section title="Payments & Transactions">
      <div className="bg-[var(--color-white)] shadow rounded-md p-4">
        <p className="text-[var(--color-neutral)] opacity-70">
          Payment details, refunds, and reports section...
        </p>
      </div>
    </Section>
  );
}
