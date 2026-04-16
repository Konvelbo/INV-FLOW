'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';
import { IconWrapper, type IconProps, useAnimateIconContext, getVariants } from './icon';

const cameraVariants: Variants = {
  default: {
    strokeDasharray: '1 0',
  },
  animate: {
    strokeDasharray: ['1 1', '1 0'],
    strokeDashoffset: [1, 0],
    transition: {
      duration: 0.6,
      ease: 'easeInOut',
    },
  },
};

const CameraIcon = (props: IconProps) => {
  const selectedVariants = getVariants({
    default: cameraVariants,
  });

  return (
    <IconWrapper
      icon={({ className, size, ...props }) => {
        const { controls } = useAnimateIconContext();

        return (
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            animate={controls}
            {...props}
          >
            <motion.path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" variants={selectedVariants} />
            <motion.circle cx="12" cy="13" r="3" variants={selectedVariants} />
          </motion.svg>
        );
      }}
      {...props}
    />
  );
};

export { CameraIcon };
