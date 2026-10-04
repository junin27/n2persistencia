import { render, screen } from "@testing-library/react";
import Home from "../app/page";

describe("Home", () => {
  it("renderiza o título inicial da página", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});
