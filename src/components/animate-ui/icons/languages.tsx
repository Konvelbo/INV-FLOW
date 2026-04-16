'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';
import { IconWrapper, type IconProps, useAnimateIconContext, getVariants } from './icon';

const languagesVariants: Variants = {
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

const LanguagesIcon = (props: IconProps) => {
  const selectedVariants = getVariants({
    default: languagesVariants,
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
            <motion.path d="m5 8 6 6" variants={selectedVariants} />
            <motion.path d="m4 14 6-6 2-3" variants={selectedVariants} />
            <motion.path d="M2 5h12" variants={selectedVariants} />
            <motion.path d="M7 2h1" variants={selectedVariants} />
            <motion.path d="m22 22-5-10-5 10" variants={selectedVariants} />
            <motion.path d="M14 18h6" variants={selectedVariants} />
          </motion.svg>
        );
      }}
      {...props}
    />
  );
};

export { LanguagesIcon };
