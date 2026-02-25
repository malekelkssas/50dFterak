import React from 'react';
import { View, Pressable, StyleSheet, type ViewStyle, type StyleProp, Animated, Easing } from 'react-native';

export interface ModalProps {
    /**
     * Determines whether clicking outside the modal dismiss it.
     */
    dismissable?: boolean;
    /**
     * Callback that is called when the user dismisses the modal.
     */
    onDismiss?: () => void;
    /**
     * Determines Whether the modal is visible.
     */
    visible: boolean;
    /**
     * Content of the `Modal`.
     */
    children: React.ReactNode;
    /**
     * Style for the wrapper of the modal.
     * Use this to change the padding, margins, etc.
     */
    contentContainerStyle?: StyleProp<ViewStyle>;
    /**
     * Style for the modal background.
     */
    style?: StyleProp<ViewStyle>;
    /**
     * Additional className for the wrapper container.
     */
    className?: string;
    /**
     * Additional className for the backdrop overlay.
     */
    overlayClassName?: string;
}

/**
 * The Modal component is a simple way to present content above an enclosing view.
 * To render the `Modal` above other components, you'll need to wrap it with the `Portal` component.
 */
export function Modal({
    dismissable = true,
    visible = false,
    onDismiss,
    children,
    contentContainerStyle,
    style,
    className = '',
    overlayClassName = '',
}: ModalProps) {
    const [rendered, setRendered] = React.useState(visible);
    const opacity = React.useRef(new Animated.Value(visible ? 1 : 0)).current;

    React.useEffect(() => {
        if (visible) {
            setRendered(true);
        }
        Animated.timing(opacity, {
            toValue: visible ? 1 : 0,
            duration: 250,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        }).start(({ finished }) => {
            if (finished && !visible) {
                setRendered(false);
            }
        });
    }, [visible, opacity]);

    if (!rendered && !visible) return null;

    return (
        <View style={[StyleSheet.absoluteFill, style]} className={`justify-center items-center ${className}`} pointerEvents="box-none">
            <Animated.View
                style={[StyleSheet.absoluteFill, { opacity }]}
                pointerEvents="auto"
            >
                <Pressable
                    style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.7)' }]}
                    className={overlayClassName}
                    onPress={dismissable ? onDismiss : undefined}
                    accessible={false}
                />
            </Animated.View>

            <Animated.View
                pointerEvents="box-none"
                style={[
                    {
                        opacity,
                        transform: [
                            {
                                scale: opacity.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.95, 1],
                                }),
                            },
                        ],
                        width: '100%',
                        padding: 24,
                        justifyContent: 'center',
                    },
                    contentContainerStyle,
                ]}
            >
                {children}
            </Animated.View>
        </View>
    );
}
