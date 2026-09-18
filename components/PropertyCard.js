import Link from 'next/link';

export default function PropertyCard({ property }) {
  const {
    _id,
    title,
    price,
    rentOrSale,
    type,
    city,
    state,
    beds,
    baths,
    sqft,
    images
  } = property;

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(price);

  const displayImage = images && images.length > 0
    ? images[0]
    : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col">
      {/* Image & Badge */}
      <div className="relative h-48 w-full bg-gray-200 overflow-hidden">
        <img
          src={displayImage}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full uppercase tracking-wider text-white ${
            rentOrSale === 'sale' ? 'bg-primary' : 'bg-accent'
          }`}>
            For {rentOrSale}
          </span>
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full uppercase tracking-wider bg-gray-900/70 text-white backdrop-blur-sm">
            {type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <p className="text-2xl font-bold text-primary mb-1">
            {formattedPrice}
            {rentOrSale === 'rent' && <span className="text-sm font-normal text-gray-500"> /mo</span>}
          </p>
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 mb-1">
            {title}
          </h3>
          <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
            <span>📍</span> {city}, {state}
          </p>
        </div>

        {/* Features Strip */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <span className="font-semibold">{beds}</span> Beds
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <span className="font-semibold">{baths}</span> Baths
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <span className="font-semibold">{sqft}</span> sqft
          </div>
        </div>

        <Link
          href={`/properties/${_id}`}
          className="mt-4 block w-full text-center py-2 px-4 bg-gray-50 hover:bg-primary hover:text-white text-gray-700 font-medium rounded-lg text-sm transition-colors duration-200 border border-gray-200 hover:border-transparent"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}