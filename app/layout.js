import "./globals.css";

export const metadata = {
  title: "AayPlus Admin Portal • Marketplace Operations & Dispute Arbitration",
  description: "Enterprise operations portal for AayPlus Peer-to-Peer Rental Marketplace — Dispute arbitration, escrow management, KYC verification, listings and late return rules.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}
