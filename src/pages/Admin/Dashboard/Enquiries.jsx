import React from "react";
import Section from "../Dashboard/Section";

export default function Enquiries() {
  return (
    <Section title="Enquiries">
      <div className="bg-[var(--color-white)] shadow rounded-md p-4">
        <p className="text-[var(--color-neutral)] opacity-70">
          User enquiries and contact form submissions...
        </p>
      </div>
    </Section>
  );
}
