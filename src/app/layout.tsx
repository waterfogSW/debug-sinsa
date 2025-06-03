import type { Metadata } from 'next';
import './globals.css';
import { ReduxProviders } from './Providers';

export const metadata: Metadata = {
  title: '디버그 신사 🏮 - 버그 퇴치의 성지',
  description: '모든 버그를 물리치는 신성한 성지',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <ReduxProviders>{children}</ReduxProviders>
        <div id="modal-root"></div>
      </body>
    </html>
  )
}
