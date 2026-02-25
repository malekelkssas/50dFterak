import React, { createContext, useContext } from 'react';
import {
    View,
    Pressable,
    type StyleProp,
    type ViewStyle,
} from 'react-native';

// ── Types ───────────────────────────────────────────────────────────────

export interface ToggleButtonProps {
    /** Icon element to display */
    icon: React.ReactNode;
    /** String value for this button */
    value: string;
    /** Toggle status. Controlled externally or by Group context */
    status?: 'checked' | 'unchecked';
    /** Callback when pressed */
    onPress?: (value: string) => void;
    /** Whether the button is disabled */
    disabled?: boolean;
    /** Size of the button container */
    size?: number;
    /** Accessibility label */
    accessibilityLabel?: string;
    /** Additional NativeWind className */
    className?: string;
    /** Style override */
    style?: StyleProp<ViewStyle>;
}

// ── Group Context ───────────────────────────────────────────────────────

interface ToggleGroupContextType {
    value: string | null;
    onValueChange: (value: string) => void;
}

const ToggleGroupContext = createContext<ToggleGroupContextType | null>(null);

// ── ToggleButton Component ──────────────────────────────────────────────

function ToggleButtonRoot({
    icon,
    value,
    status: statusProp,
    onPress,
    disabled = false,
    size = 44,
    accessibilityLabel,
    className = '',
    style,
}: ToggleButtonProps) {
    const groupCtx = useContext(ToggleGroupContext);

    // Determine checked status: prop > group context > unchecked
    const isChecked =
        statusProp !== undefined
            ? statusProp === 'checked'
            : groupCtx
                ? groupCtx.value === value
                : false;

    const handlePress = () => {
        if (disabled) return;
        if (groupCtx) {
            groupCtx.onValueChange(value);
        }
        onPress?.(value);
    };

    return (
        <Pressable
            onPress={handlePress}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel || value}
            accessibilityState={{ selected: isChecked, disabled }}
            className={`items-center justify-center rounded-md ${isChecked ? 'bg-primary/15' : 'bg-transparent'
                } ${disabled ? 'opacity-50' : ''} ${className}`}
            style={[{ width: size, height: size }, style]}
        >
            {icon}
        </Pressable>
    );
}

// ── ToggleButton.Group ──────────────────────────────────────────────────

export interface ToggleButtonGroupProps {
    /** Currently selected value */
    value: string | null;
    /** Called when a button is pressed with its value */
    onValueChange: (value: string) => void;
    children: React.ReactNode;
}

function ToggleButtonGroup({ value, onValueChange, children }: ToggleButtonGroupProps) {
    return (
        <ToggleGroupContext.Provider value={{ value, onValueChange }}>
            {children}
        </ToggleGroupContext.Provider>
    );
}

// ── ToggleButton.Row ────────────────────────────────────────────────────

export interface ToggleButtonRowProps {
    /** Currently selected value */
    value: string | null;
    /** Called when a button is pressed */
    onValueChange: (value: string) => void;
    children: React.ReactNode;
    /** Additional NativeWind className */
    className?: string;
}

function ToggleButtonRow({
    value,
    onValueChange,
    children,
    className = '',
}: ToggleButtonRowProps) {
    return (
        <ToggleGroupContext.Provider value={{ value, onValueChange }}>
            <View
                className={`flex-row items-center border border-secondary/30 rounded-lg overflow-hidden ${className}`}
            >
                {React.Children.map(children, (child, index) => (
                    <View
                        className={`${index > 0 ? 'border-l border-secondary/30' : ''
                            }`}
                    >
                        {child}
                    </View>
                ))}
            </View>
        </ToggleGroupContext.Provider>
    );
}

// ── Compose ─────────────────────────────────────────────────────────────

export const ToggleButton = Object.assign(ToggleButtonRoot, {
    Group: ToggleButtonGroup,
    Row: ToggleButtonRow,
});
