import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddItem() {
  const [name, setName] = useState('');
  const [type, setType] = useState('T-Shirt');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const reader = new FileReader();
      const additionalReaders = additionalImages.map(() => new FileReader());
      let coverImageUrl = 'https://picsum.photos/150/150';
      const additionalImageUrls = [];

      const saveItem = async () => {
        const newItem = {
          id: Date.now(),
          name,
          type,
          description,
          coverImage: coverImageUrl,
          additionalImages: additionalImageUrls,
        };

        const response = await fetch('http://localhost:5000/api/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem),
        });

        if (!response.ok) throw new Error('Failed to upload item');

        setSuccess(true);
        setName('');
        setType('T-Shirt');
        setDescription('');
        setCoverImage(null);
        setAdditionalImages([]);
        setTimeout(() => {
          setSuccess(false);
          navigate('/');
        }, 2000);
      };

      let completedReaders = 0;
      if (additionalImages.length > 0) {
        additionalImages.forEach((file, index) => {
          additionalReaders[index].onload = () => {
            additionalImageUrls.push(additionalReaders[index].result);
            completedReaders++;
            if (completedReaders === additionalImages.length && (!coverImage || reader.readyState === 2)) {
              saveItem();
            }
          };
          additionalReaders[index].readAsDataURL(file);
        });
      } else if (!coverImage) {
        await saveItem();
      }

      if (coverImage) {
        reader.onload = () => {
          coverImageUrl = reader.result;
          if (additionalImages.length === 0 || completedReaders === additionalImages.length) {
            saveItem();
          }
        };
        reader.readAsDataURL(coverImage);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to upload item. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Add Item</h2>
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Item successfully added
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
        <div>
          <label className="block text-sm font-medium text-gray-700">Item Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Item Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>T-Shirt</option>
            <option>Pants</option>
            <option>Shirt</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Item Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Cover Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverImage(e.target.files[0])}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Additional Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setAdditionalImages([...e.target.files])}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add Item
        </button>
      </form>
    </div>
  );
}

export default AddItem;