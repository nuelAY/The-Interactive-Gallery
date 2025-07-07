import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAppDispatch } from '../store/hooks';
import { fetchTags } from '@/app/store/tagSlice';
import { RootState } from '@/app/store';

const TagDisplay = ({ imageId }: { imageId: string }) => {
  const dispatch = useAppDispatch();
  const { tags, loading } = useSelector((state: RootState) => state.tags);

  useEffect(() => {
    if (imageId) {
      dispatch(fetchTags(imageId));
    }
  }, [imageId, dispatch]);

  if (loading) return <p>Loading tags...</p>;

  return (
    <div className="flex gap-2 mt-2 flex-wrap">
      {tags.map((tag) => (
        <span key={tag.id} className="bg-gray-200 text-sm px-2 py-1 rounded-full">
          #{tag.name}
        </span>
      ))}
    </div>
  );
};

export default TagDisplay;
