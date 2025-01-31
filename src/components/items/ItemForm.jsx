import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createItem } from '../../store/slices/itemsSlice';
import { toast } from 'react-hot-toast';

const categories = [
  'Electronics',
  'Books',
  'Sports',
  'Furniture',
  'Clothing',
  'Others',
];

export default function ItemForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    images: [],
  });
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || '' : value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    // In a real application, you would upload these files to a storage service
    // and get back URLs. For now, we'll create temporary URLs
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...imageUrls],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await dispatch(createItem(formData)).unwrap();
      toast.success('Item listed successfully!');
      navigate('/items');
    } catch (error) {
      toast.error(error.message || 'Failed to create item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">List a New Item</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="mt-1 input-field"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            required
            className="mt-1 input-field"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Price per day (₹)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            required
            min="0"
            step="1"
            className="mt-1 input-field"
            value={formData.price}
            onChange={handleChange}
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            required
            className="mt-1 input-field"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <label
            htmlFor="images"
            className="block text-sm font-medium text-gray-700"
          >
            Images
          </label>
          <input
            type="file"
            id="images"
            name="images"
            accept="image/*"
            multiple
            required
            className="mt-1 input-field"
            onChange={handleImageChange}
          />
          {formData.images.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {formData.images.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="h-24 w-24 object-cover rounded-lg"
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Listing'}
          </button>
        </div>
      </form>
    </div>
  );
}
