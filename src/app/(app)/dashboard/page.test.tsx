import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@/lib/supabase/queries", () => ({
  getWorkspace: vi.fn(async () => ({
    gymId: "gym-1",
    fullName: "Asha Fitness",
  })),
}));

vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: vi.fn(async () => ({
    from: (table: string) => {
      if (table === "payments") {
        return {
          select: () => ({
            eq: () => ({
              gte: async () => ({
                data: [{ amount_paid: 12000 }],
              }),
            }),
          }),
        };
      }

      if (table === "leads") {
        return {
          select: () => ({
            eq: () => {
              const leadResult = {
                count: 3,
                eq: async () => ({ count: 3 }),
              };

              return leadResult;
            },
          }),
        };
      }

      if (table === "members") {
        return {
          select: () => ({
            eq: () => ({
              lte: () => ({
                gte: async () => ({ count: 2 }),
              }),
            }),
          }),
        };
      }

      return {
        select: () => ({
          eq: async () => ({ data: [] }),
        }),
      };
    },
  })),
}));

import DashboardPage from "./page";

describe("DashboardPage", () => {
  it("renders the sellable revenue and retention cards", async () => {
    const page = await DashboardPage();
    render(page);

    expect(screen.getByText("Collections Today")).toBeTruthy();
    expect(screen.getByText("₹12,000")).toBeTruthy();
    expect(screen.getByText("Lead Conversion")).toBeTruthy();
    expect(screen.getByText("100%")).toBeTruthy();
  });
});
