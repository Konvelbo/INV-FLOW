'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';
import { IconWrapper, type IconProps, useAnimateIconContext, getVariants } from './icon';

const crownVariants: Variants = {
  default: {
    y: 0,
  },
  animate: {
    y: [0, -2, 0],
    transition: {
      duration: 0.6,
      ease: 'easeInOut',
    },
  },
};

const CrownIcon = (props: IconProps) => {
  const selectedVariants = getVariants({
    default: crownVariants,
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
            <motion.path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7Z" variants={selectedVariants} />
          </motion.svg>
        );
      }}
      {...props}
    />
  );
};

export { CrownIcon };
