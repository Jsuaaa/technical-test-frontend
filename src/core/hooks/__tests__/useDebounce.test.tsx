import { act, render, screen } from "@testing-library/react";
import { useState } from "react";

import useDebounce from "../useDebounce";

const TestComponent = ({
  initialValue,
  delay,
}: {
  initialValue: string;
  delay: number;
}) => {
  const [value, setValue] = useState(initialValue);
  const debouncedValue = useDebounce(value, delay);

  return (
    <div>
      <span data-testid="debounced-value">{debouncedValue}</span>
      <button type="button" onClick={() => setValue("siguiente-valor")}>
        cambiar
      </button>
    </div>
  );
};

describe("useDebounce", () => {
  const delay = 300;

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it("retorna el valor inicial inmediatamente y actualiza tras el retardo", () => {
    render(<TestComponent initialValue="valor-inicial" delay={delay} />);

    expect(screen.getByTestId("debounced-value")).toHaveTextContent(
      "valor-inicial"
    );

    act(() => {
      screen.getByRole("button", { name: /cambiar/i }).click();
    });

    expect(screen.getByTestId("debounced-value")).toHaveTextContent(
      "valor-inicial"
    );

    act(() => {
      jest.advanceTimersByTime(delay);
    });

    expect(screen.getByTestId("debounced-value")).toHaveTextContent(
      "siguiente-valor"
    );
  });

  it("limpia el temporizador cuando el componente se desmonta", () => {
    const clearTimeoutSpy = jest.spyOn(window, "clearTimeout");
    const { unmount } = render(
      <TestComponent initialValue="valor" delay={delay} />
    );

    act(() => {
      screen.getByRole("button", { name: /cambiar/i }).click();
    });

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
