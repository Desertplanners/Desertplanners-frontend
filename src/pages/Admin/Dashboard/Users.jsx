import React from "react";
import Section from "../Dashboard/Section";

export default function Users() {
  return (
    <Section title="User Management">
      <div className="bg-[var(--color-white)] shadow rounded-md p-4">
        <p className="text-[var(--color-neutral)] opacity-70">
          All users and their booking history...
        </p>
      </div>
    </Section>
  );
}
