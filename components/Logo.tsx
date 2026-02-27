import React from 'react';
import { Image, ImageProps } from 'react-native';

interface LogoProps extends Omit<ImageProps, 'source'> {
    className?: string;
}

export function Logo({ className, ...props }: LogoProps) {
    return (
        <Image
            source={require('../assets/logo.png')}
            className={`w-24 h-24 ${className || ''}`}
            resizeMode="contain"
            {...props}
        />
    );
}
