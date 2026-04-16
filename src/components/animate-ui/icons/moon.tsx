'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';
import { IconWrapper, type IconProps, useAnimateIconContext, getVariants } from './icon';

const moonVariants: Variants = {
  default: {
    rotate: 0,
  },
  animate: {
    rotate: -15,
    transition: {
      duration: 0.6,
      ease: 'easeInOut',
    },
  },
};

const MoonIcon = (props: IconProps) => {
  const selectedVariants = getVariants({
    default: moonVariants,
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
            <motion.path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9" variants={selectedVariants} />
          </motion.svg>
        );
      }}
      {...props}
    />
  );
};

export { MoonIcon };
