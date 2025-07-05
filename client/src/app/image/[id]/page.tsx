'use client';

import { useParams } from 'next/navigation';
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from 'react';
import { useAppDispatch } from '@/app/store/hooks';
import { useSelector } from 'react-redux';
import { fetchComments, postComment } from '@/app/store/commentsSlice';
import toast from 'react-hot-toast';

import { RootState } from '@/app/store';

const ImageDetailPage = () => {
    const { id } = useParams();
    const imageId = Array.isArray(id) ? id[0] : id;
    const dispatch = useAppDispatch();
    const { comments, loading, error, isPosting } = useSelector((state: RootState) => state.comments);

    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        if (imageId) {
            dispatch(fetchComments(imageId));
        }
    }, [dispatch, imageId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            await dispatch(postComment({
                imageId, text: newComment,
                token: null
            })).unwrap();
            toast.success('Comment posted!');
            setNewComment('');
        } catch (error) {
            toast.error('Failed to post comment');
        }
    };


    return (
        <div className="max-w-3xl mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-6">Image Detail</h1>

            {/* Comments Section */}
            <section className="mt-8">
                <h2 className="text-xl font-semibold mb-4">💬 Comments</h2>

                {loading && <p>Loading comments...</p>}
                {error && <p className="text-red-500">{error}</p>}

                <ul className="space-y-3 mb-6">
                    {comments.map((comment: { id: Key | null | undefined; text: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; createdAt: string | number | Date; }) => (
                        <li key={comment.id} className="bg-gray-100 p-3 rounded">
                            <p>{comment.text}</p>
                            <span className="text-xs text-gray-500">🕒 {new Date(comment.createdAt).toLocaleString()}</span>
                        </li>
                    ))}
                </ul>

                {/* Comment Form */}
                <form onSubmit={handleSubmit} className="space-y-2">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write your comment..."
                        className="w-full p-3 rounded border border-gray-300"
                        rows={3}
                        minLength={3}
                        required
                    ></textarea>

                    <button
                        type="submit"
                        className={`px-4 py-2 rounded text-white ${isPosting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                        disabled={isPosting}
                    >
                        {isPosting ? 'Posting...' : 'Submit Comment'}
                    </button>

                </form>
            </section>
        </div>
    );
};

export default ImageDetailPage;
