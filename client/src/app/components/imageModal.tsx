'use client';
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import React from 'react';

interface Props {
  image: any;
  onClose: () => void;
}

const ImageModal: React.FC<Props> = ({ image, onClose }) => {
  const router = useRouter();

  const handleDetailPage = () => {
    router.push(`/image/${image.id}`);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        onClick={(e: { stopPropagation: () => any; }) => e.stopPropagation()}
        className="bg-white p-4 rounded-xl max-w-lg w-full shadow-lg"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      >
        <img
          src={image.urls.full}
          alt={image.alt_description}
          className="w-full h-auto rounded mb-4"
        />
        <h2 className="text-xl font-semibold">{image.alt_description || 'Untitled'}</h2>
        <p className="text-sm text-gray-600 mb-4">📸 {image.user.name}</p>
        <button
          onClick={handleDetailPage}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          View Details
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ImageModal;
