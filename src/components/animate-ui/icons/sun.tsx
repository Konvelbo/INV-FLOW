'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';
import { IconWrapper, type IconProps, useAnimateIconContext, getVariants } from './icon';

const sunVariants: Variants = {
  default: {
    rotate: 0,
  },
  animate: {
    rotate: 90,
    transition: {
      duration: 0.6,
      ease: 'easeInOut',
    },
  },
};

const SunIcon = (props: IconProps) => {
  const selectedVariants = getVariants({
    default: sunVariants,
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
            <motion.circle cx="12" cy="12" r="4" variants={selectedVariants} />
            <motion.path d="M12 2v2" variants={selectedVariants} />
            <motion.path d="M12 20v2" variants={selectedVariants} />
            <motion.path d="m4.93 4.93 1.41 1.41" variants={selectedVariants} />
            <motion.path d="m17.66 17.66 1.41 1.41" variants={selectedVariants} />
            <motion.path d="M2 12h2" variants={selectedVariants} />
            <motion.path d="M20 12h2" variants={selectedVariants} />
            <motion.path d="m6.34 17.66-1.41 1.41" variants={selectedVariants} />
            <motion.path d="m19.07 4.93-1.41 1.41" variants={selectedVariants} />
          </motion.svg>
        );
      }}
      {...props}
    />
  );
};

export { SunIcon };
