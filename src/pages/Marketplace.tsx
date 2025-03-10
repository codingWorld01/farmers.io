import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';

const SAMPLE_PRODUCTS = [
  {
    id: 1,
    name: 'Organic Rice',
    farmer: 'Rajesh Kumar',
    location: 'Punjab',
    price: 2500,
    quantity: '100',
    category: 'grains',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    rating: 4.5,
    reviews: 128
  },
  {
    id: 2,
    name: 'Fresh Wheat',
    farmer: 'Amit Singh',
    location: 'Haryana',
    price: 2200,
    quantity: '50',
    category: 'grains',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    rating: 4.2,
    reviews: 95
  },
  {
    id: 3,
    name: 'Fresh Tomatoes',
    farmer: 'Priya Patel',
    location: 'Maharashtra',
    price: 40,
    quantity: '20',
    category: 'vegetables',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    rating: 4.8,
    reviews: 234
  }
];

type SortOption = 'priceLowToHigh' | 'priceHighToLow' | 'newest' | 'popular';

export function Marketplace() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return SAMPLE_PRODUCTS.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.farmer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const matchesLocation = !selectedLocation || product.location === selectedLocation;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesLocation && matchesPrice;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'priceLowToHigh':
          return a.price - b.price;
        case 'priceHighToLow':
          return b.price - a.price;
        case 'popular':
          return b.reviews - a.reviews;
        default:
          return 0;
      }
    });
  }, [searchQuery, selectedCategory, selectedLocation, priceRange, sortBy]);

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('marketplace.title')}</h1>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <input
              type="text"
              placeholder={t('marketplace.searchPlaceholder')}
              className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-64 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          <Dialog.Root open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <Dialog.Trigger asChild>
              <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="h-5 w-5" />
                {t('marketplace.filters.title')}
              </button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/50" />
              <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md max-h-[85vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title className="text-xl font-semibold">
                    {t('marketplace.filters.title')}
                  </Dialog.Title>
                  <Dialog.Close className="text-gray-400 hover:text-gray-500">
                    <X className="h-5 w-5" />
                  </Dialog.Close>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('common.categories')}
                    </label>
                    <select
                      className="w-full border rounded-md py-2 px-3"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="">{t('common.categories')}</option>
                      {Object.entries(t('marketplace.filters.categories', { returnObjects: true })).map(([key, value]) => (
                        <option key={key} value={key}>{value}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('common.location')}
                    </label>
                    <select
                      className="w-full border rounded-md py-2 px-3"
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                    >
                      <option value="">All Locations</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Haryana">Haryana</option>
                      <option value="Maharashtra">Maharashtra</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('common.priceRange')}
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        className="w-full border rounded-md py-2 px-3"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      />
                      <span>-</span>
                      <input
                        type="number"
                        className="w-full border rounded-md py-2 px-3"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('common.sortBy')}
                    </label>
                    <select
                      className="w-full border rounded-md py-2 px-3"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                    >
                      {Object.entries(t('marketplace.filters.sort', { returnObjects: true })).map(([key, value]) => (
                        <option key={key} value={key}>{value}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={() => {
                        setSelectedCategory('');
                        setSelectedLocation('');
                        setPriceRange([0, 5000]);
                        setSortBy('popular');
                      }}
                      className="flex-1 py-2 px-4 border rounded-md hover:bg-gray-50"
                    >
                      {t('common.clear')}
                    </button>
                    <Dialog.Close asChild>
                      <button className="flex-1 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700">
                        {t('common.apply')}
                      </button>
                    </Dialog.Close>
                  </div>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">{t('marketplace.noResults')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden transform transition-transform hover:scale-[1.02] hover:shadow-md">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-600">
                  ★ {product.rating}
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                  <span className="text-green-600 font-semibold">₹{product.price}/{t('marketplace.perKg')}</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <img
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(product.farmer)}`}
                    alt={product.farmer}
                    className="w-6 h-6 rounded-full bg-gray-200"
                  />
                  <p className="text-sm text-gray-600">{product.farmer}</p>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span>{product.location}</span>
                  <span>{product.reviews} reviews</span>
                </div>
                <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                  {t('common.contact')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}