import React, { useState } from 'react';
import { View } from 'react-native';
import { Text, SegmentedButtons } from '@/components/ui';
import { CUSTOMERS_STRINGS, CUSTOMER_TABS } from '@/utils/constants';
import { Users, ShoppingBag } from 'lucide-react-native';
import { CustomersTab } from '@/components/customers/CustomersTab';
import { OrdersTab } from '@/components/customers/OrdersTab';

export function CustomersScreen() {
    const [activeTab, setActiveTab] = useState<string>(CUSTOMER_TABS.CUSTOMERS);

    return (
        <View className="flex-1 bg-background">
            {/* Header / Tabs */}
            <View className="p-4 bg-surface border-b border-border shadow-sm z-10">
                <Text variant="headlineMedium" className="mb-4 text-center font-bold">
                    {CUSTOMERS_STRINGS.SCREEN_TITLE}
                </Text>
                <SegmentedButtons
                    value={activeTab}
                    onValueChange={setActiveTab}
                    buttons={[
                        { value: CUSTOMER_TABS.ORDERS, label: CUSTOMERS_STRINGS.TAB_ORDERS, icon: <ShoppingBag size={18} color={activeTab === CUSTOMER_TABS.ORDERS ? '#3b82f6' : '#64748b'} /> },
                        { value: CUSTOMER_TABS.CUSTOMERS, label: CUSTOMERS_STRINGS.TAB_CUSTOMERS, icon: <Users size={18} color={activeTab === CUSTOMER_TABS.CUSTOMERS ? '#3b82f6' : '#64748b'} /> },
                    ]}
                />
            </View>

            {activeTab === CUSTOMER_TABS.ORDERS ? (
                <OrdersTab />
            ) : (
                <CustomersTab />
            )}
        </View>
    );
}
