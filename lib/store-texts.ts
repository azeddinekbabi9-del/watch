import type { StoreLanguage } from "@/lib/preferences";

export type StoreTextKey =
  | "nav_home"
  | "nav_products"
  | "nav_track"
  | "hero_eyebrow"
  | "hero_title"
  | "hero_subtitle"
  | "hero_cta"
  | "hero_whatsapp"
  | "hero_stat_cod_title"
  | "hero_stat_cod_text"
  | "hero_stat_premium_title"
  | "hero_stat_premium_text"
  | "hero_stat_fast_title"
  | "hero_stat_fast_text"
  | "featured_eyebrow"
  | "featured_title"
  | "featured_all"
  | "featured_empty_title"
  | "featured_empty_description"
  | "categories_eyebrow"
  | "categories_title"
  | "benefit_quality_title"
  | "benefit_quality_text"
  | "benefit_order_title"
  | "benefit_order_text"
  | "benefit_cod_title"
  | "benefit_cod_text"
  | "products_eyebrow"
  | "products_title"
  | "products_subtitle"
  | "products_all"
  | "products_empty_title"
  | "products_empty_description"
  | "product_back"
  | "product_description_title"
  | "product_description_fallback"
  | "product_order_intro"
  | "product_available"
  | "product_out_of_stock"
  | "order_form_eyebrow"
  | "order_form_title"
  | "order_name"
  | "order_phone"
  | "order_city"
  | "order_address"
  | "order_address_placeholder"
  | "order_quantity"
  | "order_total"
  | "order_now"
  | "track_eyebrow"
  | "track_title"
  | "track_subtitle"
  | "track_phone"
  | "track_order_code"
  | "track_button"
  | "track_empty_title"
  | "track_empty_description"
  | "search_placeholder"
  | "search_empty"
  | "footer_description"
  | "thank_you_title"
  | "thank_you_message"
  | "thank_you_next_title"
  | "thank_you_next_text";

export type StoreTextRecord = {
  key: StoreTextKey;
  section: string;
  label: string;
  en: string;
  ar: string;
};

export type StoreTextMap = Record<StoreTextKey, { en: string; ar: string }>;

export const defaultStoreTexts: StoreTextRecord[] = [
  { key: "nav_home", section: "Navigation", label: "Home link", en: "Home", ar: "الرئيسية" },
  { key: "nav_products", section: "Navigation", label: "Products link", en: "Watches", ar: "الساعات" },
  { key: "nav_track", section: "Navigation", label: "Track link", en: "Track Order", ar: "تتبع الطلب" },
  { key: "hero_eyebrow", section: "Home", label: "Hero eyebrow", en: "Luxury wristwatches", ar: "ساعات يد فاخرة" },
  { key: "hero_title", section: "Home", label: "Hero title", en: "WQITAK", ar: "WQITAK" },
  { key: "hero_subtitle", section: "Home", label: "Hero subtitle", en: "Elegant watches with a luxury design and high quality. Order now and pay on delivery.", ar: "ساعات أنيقة بتصميم فاخر وجودة عالية. اطلب الآن والدفع عند الاستلام." },
  { key: "hero_cta", section: "Home", label: "Hero button", en: "Order Now", ar: "اطلب الآن" },
  { key: "hero_whatsapp", section: "Home", label: "WhatsApp button", en: "WhatsApp", ar: "واتساب" },
  { key: "hero_stat_cod_title", section: "Home", label: "COD stat title", en: "COD", ar: "الدفع" },
  { key: "hero_stat_cod_text", section: "Home", label: "COD stat text", en: "Pay on delivery", ar: "عند الاستلام" },
  { key: "hero_stat_premium_title", section: "Home", label: "Premium stat title", en: "Premium", ar: "فاخر" },
  { key: "hero_stat_premium_text", section: "Home", label: "Premium stat text", en: "Curated watches", ar: "اختيارات مميزة" },
  { key: "hero_stat_fast_title", section: "Home", label: "Fast stat title", en: "Fast", ar: "سريع" },
  { key: "hero_stat_fast_text", section: "Home", label: "Fast stat text", en: "Direct confirmation", ar: "تأكيد مباشر" },
  { key: "featured_eyebrow", section: "Home", label: "Featured eyebrow", en: "WQITAK Selection", ar: "اختيارات WQITAK" },
  { key: "featured_title", section: "Home", label: "Featured title", en: "Selected watches for a premium presence", ar: "ساعات مختارة لإطلالة فاخرة" },
  { key: "featured_all", section: "Home", label: "All products link", en: "All watches", ar: "كل الساعات" },
  { key: "featured_empty_title", section: "Home", label: "Featured empty title", en: "Selected WQITAK watches will appear soon", ar: "ستظهر ساعات WQITAK المختارة قريبا" },
  { key: "featured_empty_description", section: "Home", label: "Featured empty description", en: "Mark products as featured in the admin dashboard to show them here.", ar: "ضع المنتجات كمميزة من لوحة الإدارة لتظهر هنا." },
  { key: "categories_eyebrow", section: "Home", label: "Categories eyebrow", en: "Collections", ar: "المجموعات" },
  { key: "categories_title", section: "Home", label: "Categories title", en: "WQITAK categories", ar: "تصنيفات WQITAK" },
  { key: "benefit_quality_title", section: "Home", label: "Quality benefit title", en: "Curated quality", ar: "جودة مختارة" },
  { key: "benefit_quality_text", section: "Home", label: "Quality benefit text", en: "Every watch is presented with refined details and a premium look.", ar: "كل ساعة تقدم بتفاصيل راقية ومظهر فاخر." },
  { key: "benefit_order_title", section: "Home", label: "Order benefit title", en: "Direct ordering", ar: "طلب مباشر" },
  { key: "benefit_order_text", section: "Home", label: "Order benefit text", en: "Choose your watch, send your details, and WQITAK confirms your order.", ar: "اختر الساعة، أرسل معلوماتك، وسيؤكد فريق WQITAK طلبك." },
  { key: "benefit_cod_title", section: "Home", label: "COD benefit title", en: "Cash on delivery", ar: "الدفع عند الاستلام" },
  { key: "benefit_cod_text", section: "Home", label: "COD benefit text", en: "Delivery with confirmation by phone or WhatsApp.", ar: "توصيل مع تأكيد عبر الهاتف أو واتساب." },
  { key: "products_eyebrow", section: "Products", label: "Products eyebrow", en: "WQITAK Watches", ar: "ساعات WQITAK" },
  { key: "products_title", section: "Products", label: "Products title", en: "Luxury watches", ar: "ساعات فاخرة" },
  { key: "products_subtitle", section: "Products", label: "Products subtitle", en: "Choose your favorite watch and order directly with cash on delivery.", ar: "اختر ساعتك المفضلة واطلب مباشرة مع الدفع عند الاستلام." },
  { key: "products_all", section: "Products", label: "All filter", en: "All watches", ar: "كل الساعات" },
  { key: "products_empty_title", section: "Products", label: "Empty title", en: "No watches are available right now", ar: "لا توجد ساعات متاحة حاليا" },
  { key: "products_empty_description", section: "Products", label: "Empty description", en: "Try another category or add active products from the admin dashboard.", ar: "جرب تصنيفا آخر أو أضف منتجات نشطة من لوحة الإدارة." },
  { key: "product_back", section: "Product", label: "Back link", en: "Back to watches", ar: "الرجوع للساعات" },
  { key: "product_description_title", section: "Product", label: "Description title", en: "Product description", ar: "وصف المنتج" },
  { key: "product_description_fallback", section: "Product", label: "Description fallback", en: "A luxury WQITAK watch available for direct order with quick confirmation and cash on delivery.", ar: "ساعة فاخرة من WQITAK متاحة للطلب المباشر مع تأكيد سريع والدفع عند الاستلام." },
  { key: "product_order_intro", section: "Product", label: "Order intro", en: "Enter your details so we can confirm the order and delivery. Payment is on delivery.", ar: "أدخل معلوماتك لتأكيد الطلب والتوصيل. الدفع يكون عند الاستلام." },
  { key: "product_available", section: "Product", label: "Available label", en: "Available", ar: "متوفر" },
  { key: "product_out_of_stock", section: "Product", label: "Out of stock label", en: "Out of stock", ar: "غير متوفر" },
  { key: "order_form_eyebrow", section: "Order form", label: "Order form eyebrow", en: "Cash on delivery", ar: "الدفع عند الاستلام" },
  { key: "order_form_title", section: "Order form", label: "Order form title", en: "Order Now", ar: "اطلب الآن" },
  { key: "order_name", section: "Order form", label: "Name field", en: "Name", ar: "الاسم" },
  { key: "order_phone", section: "Order form", label: "Phone field", en: "Phone", ar: "رقم الهاتف" },
  { key: "order_city", section: "Order form", label: "City field", en: "City", ar: "المدينة" },
  { key: "order_address", section: "Order form", label: "Address field", en: "Address", ar: "العنوان" },
  { key: "order_address_placeholder", section: "Order form", label: "Address placeholder", en: "Optional", ar: "اختياري" },
  { key: "order_quantity", section: "Order form", label: "Quantity field", en: "Quantity", ar: "الكمية" },
  { key: "order_total", section: "Order form", label: "Total label", en: "Total", ar: "المجموع" },
  { key: "order_now", section: "Order form", label: "Order button", en: "Order Now", ar: "اطلب الآن" },
  { key: "track_eyebrow", section: "Tracking", label: "Tracking eyebrow", en: "WQITAK Tracking", ar: "تتبع WQITAK" },
  { key: "track_title", section: "Tracking", label: "Tracking title", en: "Track your order", ar: "تتبع طلبك" },
  { key: "track_subtitle", section: "Tracking", label: "Tracking subtitle", en: "Enter your phone number or order ID to check your order status.", ar: "أدخل رقم الهاتف أو رقم الطلب لمعرفة حالة طلبك." },
  { key: "track_phone", section: "Tracking", label: "Track by phone", en: "Phone number", ar: "رقم الهاتف" },
  { key: "track_order_code", section: "Tracking", label: "Track by order code", en: "Order ID", ar: "رقم الطلب" },
  { key: "track_button", section: "Tracking", label: "Track button", en: "Track Order", ar: "تتبع الطلب" },
  { key: "track_empty_title", section: "Tracking", label: "Tracking empty title", en: "Order status will appear here", ar: "ستظهر حالة الطلب هنا" },
  { key: "track_empty_description", section: "Tracking", label: "Tracking empty description", en: "Your order details stay private. We only show matching orders for the phone number or order ID.", ar: "تبقى معلومات طلبك خاصة. نعرض فقط الطلبات المطابقة لرقم الهاتف أو رقم الطلب." },
  { key: "search_placeholder", section: "Search", label: "Search placeholder", en: "Search for a watch...", ar: "ابحث عن ساعة..." },
  { key: "search_empty", section: "Search", label: "Search empty text", en: "No watch was found with that name.", ar: "لم يتم العثور على ساعة بهذا الاسم." },
  { key: "footer_description", section: "Footer", label: "Footer description", en: "Elegant luxury watches with direct ordering and cash on delivery.", ar: "ساعات أنيقة بتصميم فاخر مع طلب مباشر والدفع عند الاستلام." },
  { key: "thank_you_title", section: "Thank you", label: "Thank you title", en: "Your order has been received", ar: "تم استلام طلبك" },
  { key: "thank_you_message", section: "Thank you", label: "Thank you message", en: "Thank you for choosing WQITAK. We will contact you to confirm the watch, delivery details, and cash on delivery.", ar: "شكرا لاختيارك WQITAK. سنتواصل معك لتأكيد الساعة، معلومات التوصيل، والدفع عند الاستلام." },
  { key: "thank_you_next_title", section: "Thank you", label: "Next title", en: "What happens next?", ar: "ما الخطوة التالية؟" },
  { key: "thank_you_next_text", section: "Thank you", label: "Next text", en: "Keep your order ID for tracking. You can return to the watches or contact us on WhatsApp.", ar: "احتفظ برقم الطلب لتتبعه. يمكنك العودة للساعات أو التواصل معنا عبر واتساب." }
];

export const defaultStoreTextMap = defaultStoreTexts.reduce((map, item) => {
  map[item.key] = { en: item.en, ar: item.ar };
  return map;
}, {} as StoreTextMap);

export function textFromMap(
  texts: StoreTextMap,
  key: StoreTextKey,
  language: StoreLanguage
) {
  return texts[key]?.[language] || defaultStoreTextMap[key][language];
}
