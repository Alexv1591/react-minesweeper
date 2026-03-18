export const CellState = {
  Hidden: 0,
  Revealed: 1,
  Flagged: 2
} as const;

export type CellState = typeof CellState[keyof typeof CellState];

//unnecessary file, but I want to keep it for now in case I want to add more states later