import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

type PortalUpdateEvent = {
    type: 'mount' | 'update' | 'unmount';
    key: string;
    children?: ReactNode;
};

interface PortalContextType {
    mount: (key: string, children: ReactNode) => void;
    update: (key: string, children: ReactNode) => void;
    unmount: (key: string) => void;
}

const PortalContext = createContext<PortalContextType | null>(null);

let nextKey = 0;

export interface PortalHostProps {
    children: ReactNode;
}

// We separate the portal renderer from the host's children 
// so updating portals doesn't re-render the entire app tree.
const PortalManager = React.memo(({ emitter }: { emitter: any }) => {
    const [portals, setPortals] = useState<Record<string, ReactNode>>({});

    useEffect(() => {
        const handleEvent = (e: PortalUpdateEvent) => {
            if (e.type === 'mount' || e.type === 'update') {
                setPortals(prev => ({ ...prev, [e.key]: e.children }));
            } else if (e.type === 'unmount') {
                setPortals(prev => {
                    const next = { ...prev };
                    delete next[e.key];
                    return next;
                });
            }
        };

        emitter.addListener('portal', handleEvent);
        return () => {
            emitter.removeListener('portal', handleEvent);
        };
    }, [emitter]);

    return (
        <>
            {Object.entries(portals).map(([key, child]) => (
                <View
                    key={key}
                    style={StyleSheet.absoluteFill}
                    pointerEvents="box-none"
                    className="z-50"
                >
                    {child}
                </View>
            ))}
        </>
    );
});

// Simple event emitter
class EventEmitter {
    private listeners: Record<string, Function[]> = {};
    addListener(event: string, cb: Function) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(cb);
    }
    removeListener(event: string, cb: Function) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(l => l !== cb);
    }
    emit(event: string, data: any) {
        if (!this.listeners[event]) return;
        this.listeners[event].forEach(cb => cb(data));
    }
}

export function PortalHost({ children }: PortalHostProps) {
    const [emitter] = useState(() => new EventEmitter());

    const contextValue = React.useMemo<PortalContextType>(() => ({
        mount: (key, child) => emitter.emit('portal', { type: 'mount', key, children: child }),
        update: (key, child) => emitter.emit('portal', { type: 'update', key, children: child }),
        unmount: (key) => emitter.emit('portal', { type: 'unmount', key }),
    }), [emitter]);

    return (
        <PortalContext.Provider value={contextValue}>
            {children}
            <PortalManager emitter={emitter} />
        </PortalContext.Provider>
    );
}

export interface PortalProps {
    children: ReactNode;
}

export function Portal({ children }: PortalProps) {
    const context = useContext(PortalContext);
    const [key] = useState(() => `portal-${nextKey++}`);

    // Mount and Unmount
    useEffect(() => {
        if (!context) return;
        context.mount(key, children);
        return () => context.unmount(key);
    }, []); // Run only once

    // Update
    useEffect(() => {
        if (!context) return;
        context.update(key, children);
    }, [children, context, key]);

    if (!context) {
        return <>{children}</>;
    }

    return null;
}

Portal.Host = PortalHost;
