import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function ItemDetail() {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rentDays, setRentDays] = useState(1);

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`https://mern-stack2-plum.vercel.app/api/items/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItem(response.data.data);
      } catch (error) {
        toast.error('Failed to fetch item details');
        navigate('/items');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id, token, navigate]);

  const handleRent = async () => {
    try {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + parseInt(rentDays));

      const response = await axios.patch(
        `https://mern-stack2-plum.vercel.app/api/items/${id}/rent`,
        { endDate },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setItem(response.data.data);
      toast.success('Item rented successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to rent item');
    }
  };

  const handleReturn = async () => {
    try {
      const response = await axios.patch(
        `https://mern-stack2-plum.vercel.app/api/items/${id}/return`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setItem(response.data.data);
      toast.success('Item returned successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to return item');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!item) {
    return null;
  }

  const isOwner = item.owner._id === user?._id;
  const isCurrentRenter = item.currentRenter?._id === user?._id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
        {/* Images */}
        <div className="aspect-h-4 aspect-w-3 rounded-lg bg-gray-100 overflow-hidden">
          {item.images.length > 0 ? (
            <img
              src={item.images[0]}
              alt={item.title}
              className="object-cover object-center"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>

        {/* Item details */}
        <div className="mt-8 lg:mt-0">
          <h1 className="text-3xl font-bold text-gray-900">{item.title}</h1>
          
          <div className="mt-4">
            <span className="text-2xl font-bold text-primary-600">
              ₹{item.price}/day
            </span>
          </div>

          <div className="mt-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
              {item.category}
            </span>
            <span
              className={`ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                item.status === 'available'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </span>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-900">Description</h3>
            <p className="mt-2 text-gray-600">{item.description}</p>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-900">Owner Details</h3>
            <div className="mt-2 flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-700 font-medium">
                  {item.owner.name[0].toUpperCase()}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {item.owner.name}
                </p>
                <p className="text-sm text-gray-500">
                  Room: {item.owner.hostelRoom}
                </p>
              </div>
            </div>
          </div>

          {!isOwner && item.status === 'available' && (
            <div className="mt-8">
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  min="1"
                  value={rentDays}
                  onChange={(e) => setRentDays(e.target.value)}
                  className="input-field w-24"
                />
                <button onClick={handleRent} className="btn-primary">
                  Rent for {rentDays} day{rentDays > 1 ? 's' : ''}
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Total cost: ₹{item.price * rentDays}
              </p>
            </div>
          )}

          {isCurrentRenter && (
            <div className="mt-8">
              <button onClick={handleReturn} className="btn-primary">
                Return Item
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
