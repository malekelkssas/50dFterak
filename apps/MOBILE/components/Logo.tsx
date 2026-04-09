import React from 'react';
import { Image, type ImageProps } from 'react-native';

const defaultSource = require('../src/assets/black_white_hero.png');

export interface LogoProps extends Omit<ImageProps, 'source'> {
  source?: ImageProps['source'];
}

export function Logo({
  className,
  source = defaultSource,
  ...props
}: LogoProps) {
  return (
    <Image
      source={source}
      className={['h-24 w-24', className].filter(Boolean).join(' ')}
      resizeMode="contain"
      {...props}
    />
  );
}
