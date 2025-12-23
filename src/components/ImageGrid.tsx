'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageGridProps {
  images: string[];
  alt?: string;
}

export default function ImageGrid({ images, alt = "Student work" }: ImageGridProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!images || images.length === 0) {
    return <div className="text-center text-gray-500">No images to display</div>;
  }

  // Split images into two columns, then move last left image to right for balance
  const leftColumn = images.filter((_, index) => index % 2 === 0);
  const rightColumn = images.filter((_, index) => index % 2 === 1);
  
  // Move the last image from left to right column for better balance
  if (leftColumn.length > rightColumn.length) {
    const lastLeftImage = leftColumn.pop();
    if (lastLeftImage) {
      rightColumn.push(lastLeftImage);
    }
  }

  return (
    <>
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            {leftColumn.map((image) => (
              <div
                key={image}
                className="cursor-pointer"
                onClick={() => setSelectedImage(image)}
              >
                <div className="relative overflow-hidden rounded-lg shadow-md">
                  <Image
                    src={image}
                    alt={`${alt} ${leftColumn.indexOf(image) * 2 + 1}`}
                    width={400}
                    height={300}
                    className="w-full h-auto object-contain bg-gray-50"
                    style={{ aspectRatio: 'auto' }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {rightColumn.map((image) => (
              <div
                key={image}
                className="cursor-pointer"
                onClick={() => setSelectedImage(image)}
              >
                <div className="relative overflow-hidden rounded-lg shadow-md">
                  <Image
                    src={image}
                    alt={`${alt} ${rightColumn.indexOf(image) * 2 + 2}`}
                    width={400}
                    height={300}
                    className="w-full h-auto object-contain bg-gray-50"
                    style={{ aspectRatio: 'auto' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for enlarged view */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-auto"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full h-full flex items-center justify-center min-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white text-2xl font-bold hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
              aria-label="Close"
            >
              ×
            </button>
            <Image
              src={selectedImage}
              alt={`${alt} - enlarged view`}
              width={1200}
              height={800}
              className="max-w-full max-h-full object-contain rounded-lg"
              style={{ maxWidth: '90vw', maxHeight: '90vh' }}
            />
          </div>
        </div>
      )}
    </>
  );
}