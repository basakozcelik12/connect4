type ResetButtonProps = {
  onClick: () => void;
};

export function ResetButton({ onClick }: ResetButtonProps) {
  return (
    <button
      className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100 cursor-pointer"
      onClick={onClick}
    >
      Restart the game
    </button>
  );
}
