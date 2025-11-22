import { Baloo_2 } from "next/font/google";
import "./globals.css";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata = {
  title: "Zoomy Racers | Fun Car Races for Kids",
  description:
    "Start colorful car races, unlock silly power-ups, and cheer on your favorite racers in this playful racing playground for kids.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={baloo.className}>
      <body>{children}</body>
    </html>
  );
}
