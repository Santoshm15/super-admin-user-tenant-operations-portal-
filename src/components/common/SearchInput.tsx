interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  disabled = false,
}: SearchInputProps) {
  return (
    <div className="common-search-input">
      <span className="common-search-icon" aria-hidden="true">
        ⌕
      </span>

      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={placeholder}
      />

      {value ? (
        <button
          type="button"
          className="common-search-clear"
          onClick={() => onChange("")}
          disabled={disabled}
          aria-label="Clear search"
        >
          ×
        </button>
      ) : null}
    </div>
  );
}

export default SearchInput;
