import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import ItemCard from '../items/ItemCard';

export default function UserItems() {
  const [activeTab, setActiveTab] = useState('listings');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const endpoint = activeTab === 'listings' ? 'items' : 'rentals';
        const response = await axios.get(
          `https://mern-stack2-plum.vercel.app/api/users/${endpoint}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setItems(response.data.data);
      } catch (error) {
        toast.error(
          error.response?.data?.message || 'Failed to fetch items'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [activeTab, token]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('listings')}
            className={`${
              activeTab === 'listings'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            My Listings
          </button>
          <button
            onClick={() => setActiveTab('rentals')}
            className={`${
              activeTab === 'rentals'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            My Rentals
          </button>
        </nav>
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">
              No {activeTab === 'listings' ? 'listings' : 'rentals'} found
            </h3>
            {activeTab === 'listings' && (
              <div className="mt-6">
                <Link to="/items/new" className="btn-primary">
                  Create New Listing
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
