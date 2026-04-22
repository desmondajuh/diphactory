// import { DashboardPostIdView } from '@/features/dashboard/album/views/dashboard-album-id-view'

import { DashboardAlbumView } from "@/features/dashboard/albums/views/dashboard-album-view";

interface Props {
  params: Promise<{ albumId: string }>;
}

const Page = async ({ params }: Props) => {
  const { albumId } = await params;

  return <DashboardAlbumView albumId={albumId} />;
};

export default Page;
