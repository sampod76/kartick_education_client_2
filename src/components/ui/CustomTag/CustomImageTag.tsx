/* eslint-disable @typescript-eslint/no-unused-expressions */
import { message } from 'antd';
import { saveAs } from 'file-saver';
import { useState } from 'react';

import Image from 'next/image';
import fileObjectToLink from '../../../utils/fileObjectToLink';
import { cn } from '@/utils/cn';

type ImageTagProps = {
  src: any;
  width?: number;
  height?: number;
  alt?: string;
  preview?: boolean;
  className?: string;
};

export default function CustomImageTag({
  src,
  width,
  height,
  alt = 'Image',
  preview = true,
  className,
  ...props
}: ImageTagProps) {
  const [openModal, setOpenModal] = useState(false);
  const imageSrc = fileObjectToLink(src);

  return (
    <div className="z-50">
      <Image
        src={imageSrc}
        width={width || 750}
        height={height || 750}
        alt={alt || 'Images'}
        loading="lazy"
        className={cn(className)}
        onClick={() => {
          preview && setOpenModal(true);
        }}
        {...props}
      />

      {/* Modal */}
      <div
        onClick={() => setOpenModal(false)}
        className={`fixed z-50 flex items-center justify-center ${
          openModal ? 'opacity-1 visible' : 'invisible opacity-0'
        } inset-0 h-full w-full bg-black/70 duration-100`}
      >
        <div
          onClick={(e_) => e_.stopPropagation()}
          className={`absolute rounded-lg drop-shadow-2xl ${
            openModal
              ? 'opacity-1 translate-y-0 duration-300'
              : '-translate-y-20 opacity-0 duration-150'
          } group overflow-hidden`}
        >
          {/* Favorite button */}
          <svg
            className="absolute left-2 top-2 mx-auto w-8 cursor-pointer rounded-lg drop-shadow-[0_0_10px_black]"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Close button */}
          <svg
            onClick={() => setOpenModal(false)}
            className="absolute right-0 mx-auto w-10 cursor-pointer drop-shadow-[0_0_10px_black] hover:opacity-60"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z"
              fill="#fff"
            />
          </svg>

          {/* Image in modal */}
          <Image
            src={imageSrc}
            className="min-h-[200px] min-w-[300px] bg-black/20 md:h-[90vh] md:max-w-[90vw]"
            alt="modal navigate ui"
            height={1200}
            width={1200}
          />

          {/* Share + Download */}
          <div className="absolute bottom-0 right-0 drop-shadow-[0_0_5px_black] duration-200">
            <p
              onClick={() => {
                navigator.clipboard.writeText(imageSrc);
                message.success('Link Copy Success');
              }}
              className="p-3 text-xl text-[#fff] duration-200 hover:opacity-60 cursor-pointer"
            >
              Share
            </p>
            <button
              onClick={() =>
                typeof imageSrc === 'string' && saveAs(imageSrc, 'image.jpg')
              }
              className="p-3 text-xl text-[#fff] duration-200 hover:opacity-60"
            >
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
