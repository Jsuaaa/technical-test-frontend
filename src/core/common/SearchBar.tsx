import { ChangeEvent, useEffect, useState } from "react";
import { Search } from "@carbon/react";

import useDebounce from "../hooks/useDebounce";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
};

const SearchBar = ({ value, onChange, onClear }: SearchBarProps) => {
  const [inputValue, setInputValue] = useState(value);
  const debouncedValue = useDebounce(inputValue, 400);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (debouncedValue === value) {
      return;
    }

    onChange(debouncedValue);

    if (debouncedValue === "") {
      onClear?.();
    }
  }, [debouncedValue, value, onChange, onClear]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleClear = () => {
    setInputValue("");
    onChange("");
    onClear?.();
  };

  return (
    <div className="w-full max-w-md">
      <Search
        id="task-search-bar"
        labelText="Buscar tareas"
        placeholder="Buscar por ID, título o descripción"
        size="lg"
        value={inputValue}
        onChange={handleChange}
        closeButtonLabelText="Limpiar búsqueda"
        onClear={handleClear}
      />
    </div>
  );
};

export default SearchBar;
