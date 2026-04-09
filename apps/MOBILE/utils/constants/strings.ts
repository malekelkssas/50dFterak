export const CUSTOMERS_STRINGS = {
  SCREEN_TITLE: 'زبايني',
  TAB_ORDERS: 'الطلبات',
  TAB_CUSTOMERS: 'الزبائن',
  ORDERS_EMPTY_STATE: 'لا توجد طلبات لعرضها حالياً',
  SEARCH_PLACEHOLDER: 'بحث بالاسم أو الرقم...',
  ADD_BUTTON: 'إضافة',
  NO_NAME_FALLBACK: 'بدون اسم',
  BALANCE_LABEL: 'الرصيد',
  AVAILABLE_BALANCE_LABEL: 'الرصيد المتاح',
  KILO_UNIT: 'كيلو',
  CUSTOMERS_EMPTY_SEARCH: 'لا يوجد زبائن مطابقين للبحث',
  MODAL_ADD_TITLE: 'إضافة زبون جديد',
  LABEL_NAME: 'الاسم',
  LABEL_PHONE: 'رقم الهاتف',
  LABEL_FLOUR: 'رصيد الدقيق الافتتاحي (كيلو)',
  ERR_NAME_REQUIRED: 'الاسم مطلوب',
  ERR_PHONE_INVALID: 'يجب أن يكون الرقم مصري صحيح (11 رقم يبدأ بـ 01)',
  ERR_PHONE_EXISTS: 'رقم الهاتف مسجل مسبقاً',
  ERR_FLOUR_INVALID: 'يجب أن يكون الرصيد رقماً موجباً',
  BTN_SAVE: 'حفظ',
  BTN_CANCEL: 'إلغاء',

  // User Details & Edit
  MODAL_EDIT_TITLE: 'تعديل بيانات الزبون',
  BTN_EDIT: 'تعديل',
  BTN_DELETE: 'حذف',
  PENDING_FLOUR_LABEL: 'الرصيد المعلق',
  DELETE_WARNING_TITLE: 'تأكيد الحذف',
  DELETE_WARNING_TEXT:
    'هل أنت متأكد من حذف هذا الزبون وجميع طلباته المرتبطة؟ لا يمكن التراجع عن هذا الإجراء.',
  CREATE_ORDER_BTN: 'طلب جديد',
  ORDER_PENDING: 'معلق',
  ORDER_DONE: 'مكتمل',

  // Add Order Modal
  MODAL_ADD_ORDER_TITLE: 'طلب جديد',
  LABEL_ORDER_FLOUR: 'كمية الدقيق (كيلو)',
  LABEL_ORDER_DATE: 'تاريخ الطلب',
  ERR_ORDER_FLOUR_INVALID: 'يجب أن تكون الكمية رقماً أكبر من صفر',
  WARNING_EXCEEDS_BALANCE: 'تحذير: الكمية المطلوبة تتجاوز رصيد الزبون الحالي',

  DIALOG_DELETE_ORDER_TITLE: 'حذف الطلب',
  DIALOG_DELETE_ORDER_DESC: 'هل أنت متأكد من حذف هذا الطلب نهائياً؟',
} as const;

export const CUSTOMER_TABS = {
  ORDERS: 'orders',
  CUSTOMERS: 'customers',
} as const;

/** Bilingual pricing UI copy — EN matches 02-UI-SPEC canonical strings. */
export const PRICING_STRINGS = {
  en: {
    primaryCta: 'Save flour price',
    emptyHeading: 'Set your flour price',
    emptyBody:
      'Enter what you charge per kilogram. New orders will use this rate when they are created.',
    invalidPriceTitle: 'Enter a valid price per kilogram',
    invalidPriceBody:
      'Use a positive number. You can use up to two decimal places.',
    saveFailedTitle: 'Could not save price',
    saveFailedBody: 'Check that the app has storage access and try again.',
    screenTitle: 'Flour price per kg',
    rateLabel: 'Price per kilogram',
  },
  ar: {
    primaryCta: 'حفظ سعر الدقيق',
    emptyHeading: 'حدد سعر الدقيق',
    emptyBody:
      'أدخل ما تتقاضاه لكل كيلو. الطلبات الجديدة ستستخدم هذا السعر عند إنشائها.',
    invalidPriceTitle: 'أدخل سعراً صحيحاً للكيلو',
    invalidPriceBody:
      'استخدم رقماً موجباً. يمكنك استخدام رقمين عشريين كحد أقصى.',
    saveFailedTitle: 'تعذر حفظ السعر',
    saveFailedBody: 'تأكد من وصول التطبيق للتخزين ثم أعد المحاولة.',
    screenTitle: 'سعر الدقيق للكيلو',
    rateLabel: 'السعر لكل كيلو',
  },
} as const;

/** Order row snapshot money labels (list + detail via OrderCard). */
export const ORDER_MONEY_STRINGS = {
  en: {
    snapshotTotalLabel: 'Total',
    snapshotRateLabel: 'Per kg',
  },
  ar: {
    snapshotTotalLabel: 'الإجمالي',
    snapshotRateLabel: 'للكيلو',
  },
} as const;
