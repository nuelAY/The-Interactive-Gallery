'use client';
// import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import toast from 'react-hot-toast';
import { postComment } from '../store/commentsSlice';
import { useAppDispatch } from '../store/hooks';
// import TagDisplay from './tagDisplay';

interface Props {
  image: any;
  onClose: () => void;
}

const ImageModal: React.FC<Props> = ({ image, onClose }) => {
  // const router = useRouter();
  const { token } = useSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();

  const [newComment, setNewComment] = useState('');

  const handleCommentSubmit = async (imageId: string, text: string) => {
    try {
      await dispatch(
        postComment({ imageId, text, token })
      ).unwrap();
      toast.success('Comment posted!');
      setNewComment('');
    } catch (err) {
      console.error(err);
      toast.error('Failed to post comment');
    }
  };

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 bottom-0 bg-gray-700 backdrop-blur z-30 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-900 p-4 rounded-xl max-w-lg w-full shadow-lg"
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <img
          src={image.urls.full}
          alt={image.alt_description}
          className="w-[500px] h-[250px] object-cover rounded mb-4"
        />
        <h2 className="text-xl font-semibold">
          {image.alt_description || 'Untitled'}
        </h2>
        <div className="p-4 text-sm text-gray-700 dark:text-gray-300 space-y-3">
          {/* Author Name */}
          <p className="text-base font-semibold text-gray-800 dark:text-white">
            📸 {image.user.name}
          </p>

          {/* Author Bio */}
          {image.user.bio && (
            <p className="text-sm text-gray-600 dark:text-gray-400 italic">
              {image.user.bio}
            </p>
          )}

          {/* Comment Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newComment.trim()) return;
              handleCommentSubmit(image.id, newComment); // assumes you define this
            }}
            className="space-y-2"
          >
            <textarea
              rows={2}
              placeholder="Leave a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-[#1e1e1e] text-sm"
              required
            />
            <button
              type="submit"
              className="px-4 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
            >
              Submit Comment
            </button>
          </form>
        </div>

      </motion.div>
    </motion.div>
  );
};

export default ImageModal;
