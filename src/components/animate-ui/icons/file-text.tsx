'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';
import { IconWrapper, type IconProps, useAnimateIconContext, getVariants } from './icon';

const variants: Variants = {
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

const FileTextIcon = (props: IconProps) => {
  const selectedVariants = getVariants({
    default: variants,
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
            <motion.path
              d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"
              variants={selectedVariants}
            />
            <motion.path d="M14 2v4a2 2 0 0 0 2 2h4" variants={selectedVariants} />
            <motion.path d="M10 9H8" variants={selectedVariants} />
            <motion.path d="M16 13H8" variants={selectedVariants} />
            <motion.path d="M16 17H8" variants={selectedVariants} />
          </motion.svg>
        );
      }}
      {...props}
    />
  );
};

export { FileTextIcon };
