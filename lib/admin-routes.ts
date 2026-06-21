export const ADMIN_BASE_PATH = "/wqitakadmin098";
export const ADMIN_LOGIN_PATH = `${ADMIN_BASE_PATH}/login`;
export const ADMIN_ORDERS_PATH = `${ADMIN_BASE_PATH}/orders`;
export const ADMIN_PRODUCTS_PATH = `${ADMIN_BASE_PATH}/products`;
export const ADMIN_CATEGORIES_PATH = `${ADMIN_BASE_PATH}/categories`;
export const ADMIN_CUSTOMERS_PATH = `${ADMIN_BASE_PATH}/customers`;
export const ADMIN_SETTINGS_PATH = `${ADMIN_BASE_PATH}/settings`;
export const ADMIN_ALL_TEXTS_PATH = `${ADMIN_BASE_PATH}/all-texts`;
export const LEGACY_ADMIN_BASE_PATH = "/admin";

function isPathInsideBase(pathname: string | null | undefined, basePath: string) {
  return pathname === basePath || Boolean(pathname?.startsWith(`${basePath}/`));
}

export function isAdminPath(pathname: string | null | undefined) {
  return isPathInsideBase(pathname, ADMIN_BASE_PATH);
}

export function isLegacyAdminPath(pathname: string | null | undefined) {
  return isPathInsideBase(pathname, LEGACY_ADMIN_BASE_PATH);
}
