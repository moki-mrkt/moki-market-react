import { useInView } from 'react-intersection-observer';
import './LazyImage.css';

const LazyImage = ({ src, alt, className }) => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        rootMargin: '200px 0px',
    });

    return (
        <div ref={ref} className={className}>
            {inView ? (
                <img
                    src={src}
                    alt={alt}
                    className="fade-in"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            ) : (
                <div className="skeleton-placeholder" style={{ width: '100%', height: '100%' }} />
            )}
        </div>
    );
};

export default LazyImage;