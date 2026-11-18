import "./globals.css";

import "./globals.css";
import { getMessages } from "next-intl/server";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Load i18n messages for the requested locale (optional, can be omitted)
  const messages = await getMessages();
  return (
    <html lang={params.locale}>
      <head />
      <body className="bg-gray-50" suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}

