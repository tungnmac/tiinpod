import { useTranslation } from 'react-i18next';

export const useCurrency = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';
  // Tỷ giá hối đoái giả định: 1 USD = 26,000 VND
  const EXCHANGE_RATE = 26000;

  const formatCurrency = (amount: number) => {
    if (currentLang.startsWith('en')) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
    } else {
      // Chuyển đổi từ USD sang VND nếu ngôn ngữ là tiếng Việt
      const vndAmount = amount * EXCHANGE_RATE;
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(vndAmount);
    }
  };

  return { formatCurrency, currentLang };
};
