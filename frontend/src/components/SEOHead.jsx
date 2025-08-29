import { useEffect } from 'react';

const SEOHead = ({ title, description, keywords, image }) => {
  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title;
    }

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && description) {
      metaDescription.setAttribute('content', description);
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords && keywords) {
      metaKeywords.setAttribute('content', keywords);
    }

    // Update og:image
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage && image) {
      ogImage.setAttribute('content', image);
    }
  }, [title, description, keywords, image]);

  return null;
};

export default SEOHead;