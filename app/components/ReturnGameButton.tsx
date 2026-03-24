import Link from "next/link";

export default function ReturnGameButton() {
  return (
    <Link
      href="/"
      className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
    >
      Return Game
    </Link>
  );
}
