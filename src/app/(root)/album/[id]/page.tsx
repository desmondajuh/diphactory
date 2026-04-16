import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Album | Private Gallery",
  description:
    "View your private photography album. Securely access and download your professionally captured moments.",
  keywords: [
    "client gallery",
    "private photo album",
    "wedding album",
    "photo delivery",
  ],
  openGraph: {
    title: "Client Album",
    description:
      "Securely view and download your private photography collection.",
    url: "/album",
    images: [
      {
        url: "/og/album.jpg",
        width: 1200,
        height: 630,
        alt: "Client album preview",
      },
    ],
  },
  robots: {
    index: false, // 🔥 IMPORTANT for private galleries
    follow: false,
  },
};

export default function Page({ params }: { params: { id: string } }) {
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">
        Photography Album ID: {params.id}
      </h1>
    </>
  );
}
