'use client';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store';
import { fetchImages, selectGallery } from '../store/gallerySlice';
import ProtectedRoute from '@/app/components/ProtectedRoute'

const GalleryPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { images, loading, error } = useSelector(selectGallery);

  useEffect(() => {
    dispatch(fetchImages('nature'));
  }, [dispatch]);

  return (
    <ProtectedRoute>
      <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Gallery</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((image) => (
          <div key={image.id} className="rounded overflow-hidden shadow">
            <img
              src={image.urls.small}
              alt={image.alt_description || 'Unsplash Image'}
              className="w-full h-48 object-cover"
            />
            <div className="p-2 text-sm text-gray-700">📸 {image.user.name}</div>
          </div>
        ))}
      </div>
    </div>
    </ProtectedRoute>
  );
};

export default GalleryPage;
