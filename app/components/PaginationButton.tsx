interface PaginationButtonProps {
  disabled: boolean;
  onClick: () => void;
  title: string;
}

export default function PaginationButton({
  disabled,
  onClick,
  title,
}: PaginationButtonProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="px-4 py-2 text-sm font-medium rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {title}
    </button>
  );
}
