'use client';

import { useEffect, useState } from 'react';
import styles from './BackToTop.module.css';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      setIsVisible(window.scrollY > window.innerHeight);
    };

    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    window.addEventListener('resize', updateVisibility);

    return () => {
      window.removeEventListener('scroll', updateVisibility);
      window.removeEventListener('resize', updateVisibility);
    };
  }, []);

  if (!isVisible) return null;

  function returnToTop() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  return (
    <button
      type="button"
      className={styles.button}
      onClick={returnToTop}
      aria-label="回到页面顶部"
      title="回到顶部"
    >
      <span className={styles.arrow} aria-hidden="true">↑</span>
      <span className={styles.label}>顶部</span>
    </button>
  );
}
