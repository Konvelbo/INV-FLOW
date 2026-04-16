'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';
import { IconWrapper, type IconProps, useAnimateIconContext, getVariants } from './icon';

const bellVariants: Variants = {
  default: {
    rotate: 0,
  },
  animate: {
    rotate: [0, -15, 15, -15, 15, 0],
    transition: {
      duration: 0.8,
      ease: 'easeInOut',
    },
  },
};

const BellIcon = (props: IconProps) => {
  const selectedVariants = getVariants({
    default: bellVariants,
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
            <motion.path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" variants={selectedVariants} />
            <motion.path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" variants={selectedVariants} />
          </motion.svg>
        );
      }}
      {...props}
    />
  );
};

export { BellIcon };
