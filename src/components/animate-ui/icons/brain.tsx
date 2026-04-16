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

const BrainIcon = (props: IconProps) => {
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
            <motion.path d="M9.5 2A5 5 0 0 1 12 10a5 5 0 0 1 2.5-8" variants={selectedVariants} />
            <motion.path d="M12 10v4" variants={selectedVariants} />
            <motion.path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5" variants={selectedVariants} />
            <motion.path d="M12 22a7 7 0 0 1-7-7c0-2 1-3.9 3-5" variants={selectedVariants} />
            <motion.path d="M12 14c-1.5 0-3-1-3-3" variants={selectedVariants} />
            <motion.path d="M12 14c1.5 0 3-1 3-3" variants={selectedVariants} />
          </motion.svg>
        );
      }}
      {...props}
    />
  );
};

export { BrainIcon };
