import "./globals.css";


export const metadata = {
  title: "Mental Health Check",
  description: "GAD-7 & PHQ-9 Self Assessment",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
