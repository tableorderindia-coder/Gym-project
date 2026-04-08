import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import WhatsappSettingsPage from "./page";

describe("WhatsappSettingsPage", () => {
  it("renders prefilled WhatsApp templates", () => {
    render(<WhatsappSettingsPage />);

    expect(screen.getByRole("heading", { name: /follow-up templates/i })).toBeTruthy();
    expect(screen.getByText(/Hi Ravi, your membership ends on 2026-04-03/i)).toBeTruthy();
    expect(
      screen.getAllByText(/Hi Asha, thanks for visiting Strong Box/i).length,
    ).toBeGreaterThan(0);
  });
});
