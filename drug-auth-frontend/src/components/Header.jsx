// src/components/Header.jsx
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-blue-700 text-white px-6 py-4 shadow-md flex justify-between items-center">
      <h1 className="text-2xl font-bold">DrugAuth</h1>
      <nav className="space-x-6 text-lg">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/about" className="hover:underline">About</Link>
      </nav>
    </header>
  );
}
