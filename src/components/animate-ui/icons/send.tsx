'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';
import { IconWrapper, type IconProps, useAnimateIconContext, getVariants } from './icon';

const sendVariants: Variants = {
  default: {
    x: 0,
    y: 0,
  },
  animate: {
    x: [0, 2, 0],
    y: [0, -2, 0],
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    },
  },
};

const SendIcon = (props: IconProps) => {
  const selectedVariants = getVariants({
    default: sendVariants,
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
            <motion.path d="m22 2-7 20-4-9-9-4Z" variants={selectedVariants} />
            <motion.path d="M22 2 11 13" variants={selectedVariants} />
          </motion.svg>
        );
      }}
      {...props}
    />
  );
};

export { SendIcon };
