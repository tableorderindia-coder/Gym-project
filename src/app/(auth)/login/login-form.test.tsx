import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const replace = vi.fn();
const refresh = vi.fn();
const signInWithPassword = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh,
    replace,
  }),
}));

vi.mock("../../../lib/supabase/browser", () => ({
  createSupabaseBrowserClient: vi.fn(() => ({
    auth: {
      signInWithPassword,
    },
  })),
}));

import { LoginForm } from "./login-form";

describe("LoginForm", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    replace.mockReset();
    refresh.mockReset();
    signInWithPassword.mockReset();
  });

  it("shows the Supabase error message and does not redirect when sign-in fails", async () => {
    signInWithPassword.mockResolvedValueOnce({
      data: { user: null, session: null },
      error: { message: "Invalid credentials" },
    });

    render(<LoginForm nextPath="/member" />);

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "member@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "wrong-password" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await screen.findByRole("alert");

    expect(screen.getByRole("alert").textContent).toBe("Invalid credentials");
    expect(replace).not.toHaveBeenCalled();
    expect(refresh).not.toHaveBeenCalled();
  });

  it("refreshes the router and redirects after successful sign-in", async () => {
    signInWithPassword.mockResolvedValueOnce({
      data: { user: { id: "user-1" }, session: { access_token: "token" } },
      error: null,
    });

    render(<LoginForm nextPath="/member" />);

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "member@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "correct-password" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(refresh).toHaveBeenCalledTimes(1);
      expect(replace).toHaveBeenCalledWith("/member");
    });
  });
});
