import { useEffect, useState } from 'react';
import Appbar from '../components/Appbar';
import BlogCard from '../components/BlogCard';
import { useBlogs } from '../hooks';
import BlogSkeleton from '../skeletons/BlogsSkeleton';
import AnimatedMessage from '../components/Blog/AnimatedMessage';

const Blogs = () => {
  const [infiniteScrollRef, setInfiniteScrollRef] = useState<HTMLDivElement | null>(null);
  const [showEndMessage, setShowEndMessage] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const { blogs, loading, handleLoadMore } = useBlogs();

  useEffect(() => {
    if (!infiniteScrollRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !loading) {
          handleLoadMore();
          setShowEndMessage(true);
          setShowConfetti(true);
        }
      },
      { threshold: 0.1 }
    );

    infiniteScrollRef && observer.observe(infiniteScrollRef);

    return () => {
      if (infiniteScrollRef) observer.unobserve(infiniteScrollRef);
    };
  }, [infiniteScrollRef, loading]);

  return (
    <>
      <Appbar skipAuthCheck />
      <div className="flex flex-col justify-center items-center">
        {blogs.length > 0 &&
          blogs.map((blog) => (
            <BlogCard
              key={blog?.id}
              id={blog?.id}
              author={blog?.author}
              publishedDate={blog?.publishedDate}
              title={blog.title}
              content={blog.content}
            />
          ))}
      </div>
      {loading && (
        <div className="flex flex-col items-center gap-4 py-8">
          {[...Array(3)].map((_, i) => (
            <BlogSkeleton key={i} />
          ))}
        </div>
      )}
      {!loading && (
        <div
          ref={(e) => {
            setInfiniteScrollRef(e);
          }}
          style={{ height: '10px', width: '100%', backgroundColor: 'transparent', marginBottom: '10px' }}
        />
      )}
      {!loading && showEndMessage && (
        <AnimatedMessage showConfetti={showConfetti} onConfettiComplete={() => setShowConfetti(false)} />
      )}
    </>
  );
};

export default Blogs;
