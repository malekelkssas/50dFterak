import React from 'react';
import { View, StyleSheet, ScrollView, type ViewStyle, type StyleProp } from 'react-native';
import { Modal, type ModalProps } from './Modal';
import { Text } from './Text';

export interface DialogProps extends Omit<ModalProps, 'contentContainerStyle' | 'style' | 'overlayClassName'> {
    /**
     * Determines whether clicking outside the dialog dismisses it.
     */
    dismissable?: boolean;
    /**
     * Returns a callback that is called when the user dismisses the dialog.
     */
    onDismiss?: () => void;
    /**
     * Determines whether the dialog is visible.
     */
    visible: boolean;
    /**
     * Content of the `Dialog`.
     */
    children: React.ReactNode;
    /**
     * Style for the dialog wrapper (the inner card itself).
     */
    style?: StyleProp<ViewStyle>;
    /**
     * Additional className for the wrapper container.
     */
    className?: string;
    /**
     * Optional icon to display at the top of the dialog.
     */
    icon?: React.ReactNode;
}

/**
 * Dialogs inform users about a specific task and may contain critical information, require decisions, or involve multiple tasks.
 * To render the `Dialog` above other components, you'll need to wrap it with the `Portal` component.
 */
function Dialog({
    dismissable = true,
    visible = false,
    onDismiss,
    children,
    style,
    className = '',
    icon,
    ...rest
}: DialogProps) {
    return (
        <Modal
            dismissable={dismissable}
            onDismiss={onDismiss}
            visible={visible}
            contentContainerStyle={[
                {
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 24,
                },
            ]}
            {...rest}
        >
            <View
                style={[
                    {
                        width: '100%',
                        maxWidth: 380, // standardized max width for dialogs on larger screens
                        minWidth: 280,
                        borderRadius: 24,
                        paddingBottom: 24,
                        overflow: 'hidden',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.15,
                        shadowRadius: 10,
                        elevation: 6,
                    },
                    style,
                ]}
                className={`bg-white dark:bg-zinc-900 ${className}`}
            >
                {icon && <DialogIcon icon={icon} />}
                {children}
            </View>
        </Modal>
    );
}

// -------------------------
// Subcomponents
// -------------------------

export interface DialogTitleProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    className?: string;
    /**
     * Style for the title text component.
     */
    titleStyle?: StyleProp<ViewStyle>;
}

function DialogTitle({ children, style, className = '', titleStyle }: DialogTitleProps) {
    return (
        <View style={[{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16 }, style]} className={className}>
            <Text variant="headlineSmall" style={[{ textAlign: 'center' }, titleStyle]} className="text-foreground">
                {children}
            </Text>
        </View>
    );
}

export interface DialogContentProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    className?: string;
}

function DialogContent({ children, style, className = '' }: DialogContentProps) {
    return (
        <View style={[{ paddingHorizontal: 24, paddingBottom: 24 }, style]} className={className}>
            {children}
        </View>
    );
}

export interface DialogActionsProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    className?: string;
}

function DialogActions({ children, style, className = '' }: DialogActionsProps) {
    return (
        <View
            style={[
                {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingHorizontal: 24,
                    paddingTop: 8,
                    gap: 8,
                },
                style,
            ]}
            className={className}
        >
            {React.Children.map(children, (child) =>
                React.isValidElement(child)
                    ? React.cloneElement(child as React.ReactElement<any>, {
                        compact: true,
                    })
                    : child
            )}
        </View>
    );
}

export interface DialogScrollAreaProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    className?: string;
}

function DialogScrollArea({ children, style, className = '' }: DialogScrollAreaProps) {
    return (
        <View
            style={[
                {
                    borderTopWidth: StyleSheet.hairlineWidth,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    paddingHorizontal: 24,
                    flexGrow: 1,
                    flexShrink: 1,
                },
                style,
            ]}
            className={`border-gray-200 dark:border-white/10 ${className}`}
        >
            <ScrollView
                contentContainerStyle={{
                    paddingTop: 24,
                    paddingBottom: 24,
                }}
            >
                {children}
            </ScrollView>
        </View>
    );
}

export interface DialogIconProps {
    icon: React.ReactNode;
    size?: number;
    style?: StyleProp<ViewStyle>;
    className?: string;
}

function DialogIcon({ icon, size = 24, style, className = '' }: DialogIconProps) {
    return (
        <View style={[{ alignItems: 'center', justifyContent: 'center', paddingTop: 24 }, style]} className={className}>
            {icon}
        </View>
    );
}

// -------------------------
// Attach Subcomponents to Main
// -------------------------
Dialog.Content = DialogContent;
Dialog.Actions = DialogActions;
Dialog.Title = DialogTitle;
Dialog.ScrollArea = DialogScrollArea;
Dialog.Icon = DialogIcon;

export { Dialog };
