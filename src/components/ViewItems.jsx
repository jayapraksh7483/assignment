import { useState, useEffect } from 'react';
import ItemModal from './ItemModal';

function ViewItems() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch items from backend API
    fetch('http://localhost:5000/api/items')
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch items');
        return response.json();
      })
      .then((data) => {
        // Deduplicate by id
        const uniqueItems = Array.from(
          new Map(data.map((item) => [item.id, item])).values()
        );
        setItems(uniqueItems);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load items. Please try again.');
      });
  }, []);

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">View Items</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="border p-4 rounded cursor-pointer hover:bg-gray-100"
            onClick={() => setSelectedItem(item)}
          >
            <img
              src={item.coverImage}
              alt={item.name}
              className="w-full h-48 object-cover mb-2 rounded"
            />
            <h3 className="text-lg font-semibold">{item.name}</h3>
          </div>
        ))}
      </div>
      {selectedItem && <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </div>
  );
}

export default ViewItems;