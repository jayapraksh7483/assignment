import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

function ItemModal({ item, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const allImages = [item.mainImage, ...(item.additionalImages || [])].filter(Boolean);

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init('dtkBwZRXwYpOfxSZX'); // Verify this Public Key in EmailJS dashboard
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const sendEmail = () => {
    emailjs
      .send(
        'service_zjjifnm', // Your provided Service ID
        'template_raax41p', // Your provided Template ID (ensure "To" field is {{to_email}})
        {
          item_name: item.name,
          item_type: item.type,
          item_description: item.description,
          to_email: 'sc@gmail.com', // Ensure this is a valid email; test with another if needed
        }
      )
      .then(() => alert('Enquiry email sent!'))
      .catch((error) => {
        console.error('EmailJS error:', error.text, error.status, error);
        alert(`Failed to send email: ${error.text || 'Unknown error'}`);
      });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4">{item.name}</h2>
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-300"
            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
          >
            {allImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Image ${index + 1}`}
                className="w-full h-64 object-contain flex-shrink-0"
              />
            ))}
          </div>
          {allImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-r"
              >
                Prev
              </button>
              <button
                onClick={nextImage}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-l"
              >
                Next
              </button>
            </>
          )}
        </div>
        <p className="mt-4"><strong>Type:</strong> {item.type}</p>
        <p className="mt-2"><strong>Description:</strong> {item.description}</p>
        <div className="mt-4 flex justify-between">
          <button
            onClick={sendEmail}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Enquire
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 text-white px=4 py-2 rounded hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ItemModal;