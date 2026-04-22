import type { Metadata } from "next";
import { SharedAlbumView } from "@/features/albums/shared/shared-album-view";

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
    index: false,
    follow: false,
  },
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <SharedAlbumView slug={id} />;
}
