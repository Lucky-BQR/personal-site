'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import styles from './ProjectPoster.module.css';

const MIN_ZOOM = 0.2;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.25;

type ZoomablePosterProps = {
  src: string;
  alt: string;
  label: string;
  caption: string;
  width?: number;
  height?: number;
};

function clampZoom(value: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));
}

function withBasePath(src: string) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

  if (!basePath || !src.startsWith('/') || src.startsWith(`${basePath}/`)) {
    return src;
  }

  return `${basePath}${src}`;
}

export default function ZoomablePoster({
  src,
  alt,
  label,
  caption,
  width = 1600,
  height = 1100,
}: ZoomablePosterProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [zoom, setZoom] = useState(1);
  const imageSrc = withBasePath(src);

  function fitToScreen() {
    const horizontalSpace = Math.max(window.innerWidth - 48, 240);
    const verticalSpace = Math.max(window.innerHeight - 120, 180);
    const fittedZoom = Math.min(horizontalSpace / width, verticalSpace / height, 1);

    setZoom(clampZoom(fittedZoom));
  }

  function openViewer() {
    fitToScreen();
    dialogRef.current?.showModal();
  }

  function closeViewer() {
    dialogRef.current?.close();
  }

  function changeZoom(delta: number) {
    setZoom((currentZoom) => clampZoom(currentZoom + delta));
  }

  return (
    <figure className={styles.figure}>
      <button
        type="button"
        className={styles.trigger}
        onClick={openViewer}
        aria-label={`放大查看${label}`}
      >
        <span className={styles.frame}>
          <Image
            src={imageSrc}
            alt={alt}
            width={width}
            height={height}
            sizes="(max-width: 768px) 100vw, 900px"
            unoptimized
          />
        </span>
        <span className={styles.zoomHint} aria-hidden="true">
          <span>＋</span>
          点击放大
        </span>
      </button>

      <figcaption className={styles.caption}>
        <span>{label}</span>
        <p>{caption}</p>
      </figcaption>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-label={`${label}全屏查看器`}
        onCancel={(event) => {
          event.preventDefault();
          closeViewer();
        }}
      >
        <div className={styles.viewer}>
          <div className={styles.toolbar}>
            <div className={styles.viewerTitle}>
              <span>POSTER VIEWER</span>
              <strong>{label}</strong>
            </div>

            <div className={styles.zoomControls} aria-label="图片缩放控制">
              <button type="button" onClick={fitToScreen}>
                适应屏幕
              </button>
              <button
                type="button"
                aria-label="缩小"
                onClick={() => changeZoom(-ZOOM_STEP)}
                disabled={zoom <= MIN_ZOOM}
              >
                −
              </button>
              <output aria-live="polite">{Math.round(zoom * 100)}%</output>
              <button
                type="button"
                aria-label="放大"
                onClick={() => changeZoom(ZOOM_STEP)}
                disabled={zoom >= MAX_ZOOM}
              >
                ＋
              </button>
              <a href={imageSrc} target="_blank" rel="noreferrer">
                查看原图
              </a>
              <button type="button" className={styles.closeButton} onClick={closeViewer}>
                关闭
              </button>
            </div>
          </div>

          <div className={styles.stage}>
            <div className={styles.canvas}>
              <Image
                className={styles.fullImage}
                src={imageSrc}
                alt={alt}
                width={width}
                height={height}
                unoptimized
                priority
                style={{
                  width: `${width * zoom}px`,
                  height: `${height * zoom}px`,
                }}
              />
            </div>
          </div>
        </div>
      </dialog>
    </figure>
  );
}
