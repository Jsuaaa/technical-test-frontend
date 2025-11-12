import { ChangeEvent, useEffect } from "react";
import { Search } from "@carbon/react";

import useDebounce from "../hooks/useDebounce";
import { useTaskBoard } from "../providers/TaskBoardProvider";

const SearchBar = () => {
  const { searchTerm, handleSearch, clearSearch } = useTaskBoard();
  const debouncedValue = useDebounce(searchTerm, 400);

  useEffect(() => {
    if (debouncedValue === searchTerm) {
      return;
    }

    handleSearch(debouncedValue);

    if (debouncedValue === "") {
      clearSearch();
    }
  }, [debouncedValue, handleSearch, clearSearch]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleSearch(event.target.value);
  };

  const handleClear = () => {
    clearSearch();
  };

  return (
    <div className="w-full max-w-md">
      <Search
        id="task-search-bar"
        labelText="Buscar tareas"
        placeholder="Buscar por ID, título o descripción"
        size="lg"
        value={searchTerm}
        onChange={handleChange}
        closeButtonLabelText="Limpiar búsqueda"
        onClear={handleClear}
      />
    </div>
  );
};

export default SearchBar;
