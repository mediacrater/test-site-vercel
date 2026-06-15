import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buy Tokens | Mediacrater',
  description: 'Purchase ad scanning tokens with volume discounts. Calculate your price with our pricing calculator.',
};

export default function BuyTokensLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
