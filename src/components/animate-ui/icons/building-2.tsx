'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';
import { IconWrapper, type IconProps, useAnimateIconContext, getVariants } from './icon';

const buildingVariants: Variants = {
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

const Building2Icon = (props: IconProps) => {
  const selectedVariants = getVariants({
    default: buildingVariants,
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
            <motion.path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" variants={selectedVariants} />
            <motion.path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" variants={selectedVariants} />
            <motion.path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" variants={selectedVariants} />
            <motion.path d="M10 6h4" variants={selectedVariants} />
            <motion.path d="M10 10h4" variants={selectedVariants} />
            <motion.path d="M10 14h4" variants={selectedVariants} />
            <motion.path d="M10 18h4" variants={selectedVariants} />
          </motion.svg>
        );
      }}
      {...props}
    />
  );
};

export { Building2Icon };
