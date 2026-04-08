import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: vi.fn(),
    replace: vi.fn(),
  }),
}));

import LoginPage from "./page";

describe("LoginPage", () => {
  it("is async so searchParams can be awaited", async () => {
    const page = LoginPage({
      searchParams: Promise.resolve({ next: "/dashboard" }),
    } as never);

    expect(page).toBeInstanceOf(Promise);
    render(await page);

    expect(
      screen.getByRole("heading", { name: /sign in to gym growth os/i }),
    ).toBeTruthy();
    expect(screen.getByLabelText(/email address/i)).toBeTruthy();
    expect(screen.getByLabelText(/^password$/i)).toBeTruthy();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeTruthy();
  });
});
