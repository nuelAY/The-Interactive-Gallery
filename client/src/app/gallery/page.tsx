'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchImages, selectGallery } from '../store/gallerySlice';
import Navbar from '../components/Navbar';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import ImageModal from '../components/imageModal';
import { AnimatePresence } from 'framer-motion';
import { fetchComments } from '../store/commentsSlice';

const GalleryPage = ({ image }: { image: any }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { images, loading, error } = useSelector(selectGallery);
  const { comments: commentsByImage } = useSelector((state: RootState) => state.comments);
  const [selectedImage, setSelectedImage] = useState<any | null>(null);

  const comments = selectedImage ? (commentsByImage[selectedImage.id] || []) : [];

  useEffect(() => {
    dispatch(fetchImages('nature'));
  }, [dispatch]);

  useEffect(() => {
    if (selectedImage?.id) {
      dispatch(fetchComments(selectedImage.id));
    }
  }, [dispatch, selectedImage?.id]);

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="p-4 relative">
        <h1 className="text-3xl font-bold mb-6">Gallery</h1>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="rounded overflow-hidden shadow cursor-pointer hover:scale-105 transition"
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.urls.small}
                alt={image.alt_description || 'Unsplash Image'}
                className="w-full h-48 object-cover"
              />
              <div className="p-2 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">📸 {image.user.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">❤️ {image.user.total_likes} likes</span>
                </div>
              </div>
              <div className="mt-4 space-y-1">
                <p className="font-semibold">Comments:</p>
                {comments.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">No comments yet.</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="text-sm border-b py-1">
                      {comment.text}
                    </div>
                  ))
                )}
              </div>

            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedImage && (
          <ImageModal
            image={selectedImage}
            onClose={() => setSelectedImage(null)}
          />
        )}
      </AnimatePresence>


    </ProtectedRoute>
  );
};

export default GalleryPage;
