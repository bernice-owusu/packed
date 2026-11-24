import { Product } from '../types';

/**
 * Returns true if the product is marked as a flash sale and is currently within
 * its scheduled start and end date/time range.
 */
export const isProductFlashDealActive = (product: Product, referenceDate = new Date()): boolean => {
  if (!product.isFlashSale) {
    return false;
  }
  const now = referenceDate.getTime();

  // If a start date is specified, ensure sale has started
  if (product.flashSaleStartDate) {
    const startTimeStr = product.flashSaleStartTime || '00:00';
    const startDateTime = new Date(`${product.flashSaleStartDate}T${startTimeStr}:00`).getTime();
    if (!isNaN(startDateTime) && now < startDateTime) {
      return false; // Upcoming, not active yet
    }
  }

  // If an end date is specified, ensure sale has not expired
  if (product.flashSaleEndDate) {
    const endTimeStr = product.flashSaleEndTime || '23:59';
    const endDateTime = new Date(`${product.flashSaleEndDate}T${endTimeStr}:59`).getTime();
    if (!isNaN(endDateTime) && now > endDateTime) {
      return false; // Expired!
    }
  }

  return true;
};

/**
 * Returns a human-readable flash deal status: 'active', 'upcoming', 'expired', or 'none'.
 */
export const getFlashSaleStatus = (
  product: Product,
  referenceDate = new Date()
): { status: 'active' | 'upcoming' | 'expired' | 'none'; label: string; remainingMs?: number } => {
  if (!product.isFlashSale) {
    return { status: 'none', label: 'Regular Product' };
  }
  const now = referenceDate.getTime();

  if (product.flashSaleStartDate) {
    const startTimeStr = product.flashSaleStartTime || '00:00';
    const startDateTime = new Date(`${product.flashSaleStartDate}T${startTimeStr}:00`).getTime();
    if (!isNaN(startDateTime) && now < startDateTime) {
      return {
        status: 'upcoming',
        label: `Starts ${product.flashSaleStartDate} ${product.flashSaleStartTime || '00:00'}`
      };
    }
  }

  if (product.flashSaleEndDate) {
    const endTimeStr = product.flashSaleEndTime || '23:59';
    const endDateTime = new Date(`${product.flashSaleEndDate}T${endTimeStr}:59`).getTime();
    if (!isNaN(endDateTime)) {
      if (now > endDateTime) {
        return {
          status: 'expired',
          label: `Expired on ${product.flashSaleEndDate} ${product.flashSaleEndTime || '23:59'}`
        };
      }
      return {
        status: 'active',
        label: `Active until ${product.flashSaleEndDate} ${product.flashSaleEndTime || '23:59'}`,
        remainingMs: endDateTime - now
      };
    }
  }

  return { status: 'active', label: 'Active Flash Deal' };
};
