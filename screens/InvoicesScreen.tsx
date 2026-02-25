import React, { useState, useCallback, useEffect } from 'react';
import { View, FlatList } from 'react-native';
import { Text, Button, Snackbar, Portal, ActivityIndicator } from '@/components/ui';
import { Dialog } from '@/components/ui/Dialog';
import { Plus, CalendarDays } from 'lucide-react-native';
import { HorizontalCalendar } from '@/components/invoices/HorizontalCalendar';
import { InvoiceItem } from '@/components/invoices/InvoiceItem';
import { invoiceService, Invoice } from '@/backend';
import { AddInvoiceModal } from '@/components/invoices/AddInvoiceModal';
import { EditInvoiceModal } from '@/components/invoices/EditInvoiceModal';
import { BSON } from 'realm';
import { formatCurrency } from '@/utils/formatters';

export function InvoicesScreen() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

    // Data states
    const [invoiceDays, setInvoiceDays] = useState<number[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [loadingInvoices, setLoadingInvoices] = useState(true);

    // UI states
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<BSON.ObjectId | null>(null);
    const [invoiceToEdit, setInvoiceToEdit] = useState<Invoice | null>(null);
    const [invoiceDetails, setInvoiceDetails] = useState<Invoice | null>(null);

    // Fetch badge days when month changes
    const fetchBadgeDays = useCallback((date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // getMonth is 0-indexed, Invoice service uses 1-indexed

        try {
            const days = invoiceService.getDaysWithInvoices(year, month);
            setInvoiceDays(days);
        } catch (error) {
            console.error(error);
            setErrorMsg('فشل في جلب أيام الفواتير');
        }
    }, []);

    // Fetch invoices when selected date changes
    const fetchInvoices = useCallback((date: Date) => {
        setLoadingInvoices(true);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        // Using a tiny timeout to let the UI update the selected circle and show the indicator
        // before Realm blocks the JS thread for fetching
        setTimeout(() => {
            try {
                const results = invoiceService.getInvoices(year, month, day);
                const total = invoiceService.getTotalAmountForDate(year, month, day);

                setInvoices(results);
                setTotalAmount(total);
                setLoadingInvoices(false);
            } catch (error) {
                console.error(error);
                setErrorMsg('فشل في جلب الفواتير');
                setLoadingInvoices(false);
            }
        }, 10);
    }, []);

    // Initial load and month changes
    useEffect(() => {
        fetchBadgeDays(currentMonthDate);
    }, [currentMonthDate, fetchBadgeDays]);

    // Initial load and selected date changes
    useEffect(() => {
        fetchInvoices(selectedDate);
    }, [selectedDate, fetchInvoices]);

    const handleDateChange = (date: Date) => {
        setSelectedDate(date);

        // If they click a date outside the current month strip (not really possible with our UI but good to be safe)
        if (date.getMonth() !== currentMonthDate.getMonth() || date.getFullYear() !== currentMonthDate.getFullYear()) {
            setCurrentMonthDate(new Date(date.getFullYear(), date.getMonth(), 1));
        }
    };

    const handleMonthChange = (date: Date) => {
        setCurrentMonthDate(date);
    };

    const handleBackToToday = () => {
        const today = new Date();
        setSelectedDate(today);
        setCurrentMonthDate(today);
    };

    const handleAddInvoice = () => {
        setIsAddModalVisible(true);
    };

    const handleInvoiceAdded = () => {
        setIsAddModalVisible(false);
        setSuccessMsg('تم إضافة الفاتورة بنجاح');
        // Refetch to update the list and badges
        fetchInvoices(selectedDate);
        fetchBadgeDays(currentMonthDate);
    };

    const handleInvoiceEdited = () => {
        setInvoiceToEdit(null);
        setSuccessMsg('تم تعديل الفاتورة بنجاح');
        fetchInvoices(selectedDate);
        fetchBadgeDays(currentMonthDate); // Re-fetch badge days in case the total amount for a day changes its badge status
    };

    const handleDeleteInvoiceRequest = (id: BSON.ObjectId) => {
        setItemToDelete(id);
    };

    const confirmDeleteInvoice = () => {
        if (!itemToDelete) return;
        try {
            invoiceService.deleteInvoice(itemToDelete);
            setSuccessMsg('تم حذف الفاتورة بنجاح');
            fetchInvoices(selectedDate);
            fetchBadgeDays(currentMonthDate);
        } catch (error) {
            console.error('Failed to delete invoice:', error);
            setErrorMsg('حدث خطأ أثناء حذف الفاتورة');
        } finally {
            setItemToDelete(null);
        }
    };

    const handleEditInvoice = (id: BSON.ObjectId) => {
        const inv = invoices.find(i => i._id.toHexString() === id.toHexString());
        if (inv) setInvoiceToEdit(inv);
    };

    const handleViewDetails = (invoice: Invoice) => {
        setInvoiceDetails(invoice);
    };

    return (
        <View className="flex-1 bg-background pt-4">
            <HorizontalCalendar
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
                currentMonthDate={currentMonthDate}
                onMonthChange={handleMonthChange}
                invoiceDays={invoiceDays}
                headerLeft={
                    <Button
                        mode="text"
                        onPress={handleBackToToday}
                        icon={<CalendarDays size={18} color="#007AFF" />}
                        className="p-0 pl-2"
                    >
                        <Text variant="labelSmall" className="text-[#007AFF] ml-1">اليوم</Text>
                    </Button>
                }
                headerRight={
                    <Button
                        mode="contained"
                        onPress={handleAddInvoice}
                        icon={<Plus size={20} color="white" />}
                        className="rounded-full px-4"
                    >
                        إضافة
                    </Button>
                }
            />

            <View className="flex-1">
                {loadingInvoices ? (
                    <View className="flex-1 items-center justify-center -mt-20">
                        <ActivityIndicator size="large" />
                    </View>
                ) : invoices.length === 0 ? (
                    <View className="flex-1 items-center justify-center -mt-20">
                        <Text variant="displayLarge" className="mb-4">📭</Text>
                        <Text variant="titleLarge" className="font-bold mb-2">
                            لا توجد فواتير
                        </Text>
                        <Text variant="bodyMedium" className="text-secondary text-center px-10">
                            لا يوجد فواتير مسجلة في هذا اليوم. اضغط على زر الإضافة لتسجيل فاتورة جديدة.
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={invoices}
                        keyExtractor={(item) => item._id.toHexString()}
                        contentContainerStyle={{ paddingBottom: 100, paddingTop: 8 }}
                        ListHeaderComponent={
                            <View className="mx-4 mb-4 p-4 bg-primary/10 rounded-2xl items-center flex-row justify-between">
                                <Text variant="titleMedium" className="font-bold text-primary">المجموع الكلي:</Text>
                                <Text variant="headlineSmall" className="font-extrabold text-primary">
                                    {formatCurrency(totalAmount)}
                                </Text>
                            </View>
                        }
                        renderItem={({ item }) => (
                            <InvoiceItem
                                invoice={item}
                                onDelete={handleDeleteInvoiceRequest}
                                onEdit={handleEditInvoice}
                                onViewDetails={handleViewDetails}
                            />
                        )}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>

            <Portal>
                <AddInvoiceModal
                    visible={isAddModalVisible}
                    onDismiss={() => setIsAddModalVisible(false)}
                    currentDate={selectedDate}
                    onSuccess={handleInvoiceAdded}
                />

                <EditInvoiceModal
                    visible={!!invoiceToEdit}
                    onDismiss={() => setInvoiceToEdit(null)}
                    invoice={invoiceToEdit}
                    onSuccess={handleInvoiceEdited}
                />

                <Dialog visible={!!itemToDelete} onDismiss={() => setItemToDelete(null)}>
                    <Dialog.Title>حذف الفاتورة</Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodyMedium" className="text-center text-foreground mt-2">
                            هل أنت متأكد من حذف هذه الفاتورة؟ هذه العملية لا يمكن التراجع عنها.
                        </Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button mode="text" onPress={() => setItemToDelete(null)}>
                            إلغاء
                        </Button>
                        <Button mode="contained" onPress={confirmDeleteInvoice} className="bg-red-500">
                            حذف
                        </Button>
                    </Dialog.Actions>
                </Dialog>

                <Dialog visible={!!invoiceDetails} onDismiss={() => setInvoiceDetails(null)}>
                    <Dialog.Title>{invoiceDetails?.title}</Dialog.Title>
                    <Dialog.ScrollArea className="max-h-60 mt-2">
                        <Text variant="bodyMedium" className="text-right text-foreground py-2 leading-6">
                            {invoiceDetails?.description || 'لا يوجد وصف متاح لهذه الفاتورة.'}
                        </Text>
                    </Dialog.ScrollArea>
                    <Dialog.Actions>
                        <Button mode="contained" onPress={() => setInvoiceDetails(null)}>
                            إغلاق
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            <Snackbar
                visible={!!errorMsg}
                onDismiss={() => setErrorMsg(null)}
                duration={4000}
                showDismiss
            >
                {errorMsg}
            </Snackbar>

            <Snackbar
                visible={!!successMsg}
                onDismiss={() => setSuccessMsg(null)}
                duration={3000}
                showDismiss
            >
                {successMsg}
            </Snackbar>
        </View>
    );
}
