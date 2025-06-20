import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white font-bold text-xl hover:text-gray-300">Item Management</Link>
        <div className="space-x-4">
          <Link to="/" className="text-white hover:text-gray-300">View Items</Link>
          <Link to="/add" className="text-white hover:text-gray-300">Add Item</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;