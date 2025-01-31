import { Link } from 'react-router-dom';

export default function ItemCard({ item }) {
  return (
    <Link
      to={`/items/${item._id}`}
      className="group relative bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200"
    >
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-t-lg bg-gray-200">
        <img
          src={item.images[0]}
          alt={item.title}
          className="h-48 w-full object-cover object-center group-hover:opacity-75"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
            <p className="mt-1 text-sm text-gray-500">{item.category}</p>
          </div>
          <p className="text-lg font-semibold text-primary-600">
            ₹{item.price}/day
          </p>
        </div>
        <div className="mt-2">
          <p className="text-sm text-gray-700 line-clamp-2">{item.description}</p>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-xs font-medium text-primary-700">
                {item.owner.name[0].toUpperCase()}
              </span>
            </div>
            <p className="ml-2 text-sm text-gray-500">{item.owner.hostelRoom}</p>
          </div>
          <span
            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
              item.status === 'available'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </span>
        </div>
      </div>
    </Link>
  );
}
