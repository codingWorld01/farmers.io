import React from 'react';
import { useTranslation } from 'react-i18next';

export function RentEquipment() {
  const { t } = useTranslation();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Rent Equipment</h1>
      
      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Equipment Type</label>
          <select className="mt-1  p-1  block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500">
            <option>Tractor</option>
            <option>Harvester</option>
            <option>Plough</option>
            <option>Sprayer</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Rental Duration</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500">Start Date</label>
              <input
                type="date"
                className="mt-1  p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500">End Date</label>
              <input
                type="date"
                className="mt-1  p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            className="mt-1 p-1  block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            placeholder="Enter your location"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Purpose</label>
          <textarea
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            placeholder="Describe why you need the equipment"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Information</label>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="block  p-1 w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="block p-1  w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {t('common.submit')}
          </button>
        </div>
      </form>
    </div>
  );
}