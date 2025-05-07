import type { CSSProperties } from "react";

// Standardized sizes
export const sizes = {
  small: "small" as const,
  middle: "middle" as const,
  large: "large" as const,
};

// Common styles for consistent UI elements
export const styles = {
  // Form elements
  formItemFullWidth: {
    width: "100%",
  } as CSSProperties,

  // Buttons
  buttonSpacing: {
    marginRight: 8,
  } as CSSProperties,

  // Cards
  cardSpacing: {
    marginBottom: 16,
  } as CSSProperties,

  // Tables
  tableContainer: {
    overflow: "auto",
  } as CSSProperties,

  // Pagination
  paginationContainer: {
    marginTop: 16,
    textAlign: "right",
  } as CSSProperties,

  // Layout spacing
  contentSpacing: {
    marginBottom: 24,
  } as CSSProperties,

  rowGutter: [16, 16] as [number, number],
  modalFormRowGutter: [16, 24] as [number, number],
};

// Common props for components
export const props = {
  button: {
    size: sizes.middle,
  },
  input: {
    size: sizes.middle,
  },
  select: {
    size: sizes.middle,
  },
  datePicker: {
    size: sizes.middle,
  },
  pagination: {
    size: sizes.small,
  },
  table: {
    size: sizes.middle,
  },
};
