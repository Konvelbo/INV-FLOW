'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';
import { IconWrapper, type IconProps, useAnimateIconContext, getVariants } from './icon';

const starVariants: Variants = {
  default: {
    rotate: 0,
  },
  animate: {
    rotate: [0, 72, 144, 216, 288, 360],
    transition: {
      duration: 0.8,
      ease: 'easeInOut',
    },
  },
};

const StarIcon = (props: IconProps) => {
  const selectedVariants = getVariants({
    default: starVariants,
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
            <motion.path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a.53.53 0 0 0 .4.29l5.163.75a.53.53 0 0 1 .292.904l-3.736 3.641a.53.53 0 0 0-.152.469l.882 5.14a.53.53 0 0 1-.77.56l-4.618-2.428a.53.53 0 0 0-.492 0L7.166 18.73a.53.53 0 0 1-.77-.56l.882-5.14a.53.53 0 0 0-.152-.469L3.39 8.918a.53.53 0 0 1 .292-.904l5.163-.75a.53.53 0 0 0 .4-.29z" variants={selectedVariants} />
          </motion.svg>
        );
      }}
      {...props}
    />
  );
};

export { StarIcon };
