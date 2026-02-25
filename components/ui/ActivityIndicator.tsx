import React from 'react';
import {
    ActivityIndicator as NativeActivityIndicator,
    type ActivityIndicatorProps as NativeActivityIndicatorProps,
} from 'react-native';

export interface ActivityIndicatorProps extends NativeActivityIndicatorProps {
    /**
     * Additional className for the ActivityIndicator
     */
    className?: string;
}

/**
 * ActivityIndicator component that wraps the native ActivityIndicator
 * and provides theme styling defaults similar to react-native-paper.
 */
export function ActivityIndicator({
    className = '',
    color,
    ...props
}: ActivityIndicatorProps) {
    return (
        <NativeActivityIndicator
            color={color}
            className={`text-primary ${className}`}
            {...props}
        />
    );
}
