export const ARABIC_MONTHS = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
] as const;

export const ARABIC_DAYS = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'] as const;

/** Same order but starting from Saturday (Arabic week start) */
export const ARABIC_DAYS_SAT_START = ['سبت', 'أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة'] as const;
