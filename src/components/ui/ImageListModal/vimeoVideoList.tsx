'use client';

import LoadingForDataFetch from '@/components/Utlis/LoadingForDataFetch';
import { useSearchVideosByNameQuery } from '@/redux/api/vimeoBaseApi';
import { useDebounced } from '@/redux/hooks';
import { useState } from 'react';

import { ReloadOutlined } from '@ant-design/icons';
import { Button, Input, message, Modal, Tooltip } from 'antd';
import Image from 'next/image';

export default function VimeoVideoList() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearchTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });

  const { data, isFetching, isLoading, refetch } = useSearchVideosByNameQuery(
    debouncedSearchTerm,
    {
      skip: !debouncedSearchTerm && !searchTerm,
    },
  );

  const videoList = data?.data || [];

  const resetFilters = () => setSearchTerm('');
  const handlePageChange = (page: number, pageSize?: number) => {
    setPage(page);
    if (pageSize) setLimit(pageSize);
  };

  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenModal = (videoLink: string) => {
    setSelectedVideo(videoLink);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
    setModalVisible(false);
  };

  return (
    <div className="p-4">
      {/* Search and Reload */}
      <div className="flex items-center justify-between mb-4 gap-3">
        <Input
          size="large"
          placeholder="Search Vimeo Videos"
          allowClear
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
        {refetch && (
          <Button
            onClick={() => refetch()}
            loading={isFetching}
            icon={<ReloadOutlined />}
          >
            Reload
          </Button>
        )}
      </div>

      {/* Loading */}
      {(isLoading || isFetching) && <LoadingForDataFetch />}

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4">
        {videoList.map((video) => {
          const thumbnail = video?.pictures?.sizes?.[2]?.link || '';
          return (
            <div
              key={video.uri}
              className="relative border rounded-md overflow-hidden group shadow-sm hover:shadow-md transition-shadow"
            >
              <Tooltip title={video.name}>
                <Image
                  src={thumbnail}
                  height={300}
                  width={300}
                  alt={typeof video.name === 'string' ? video.name : 'Vimeo Video'}
                  className="w-full  object-cover cursor-pointer"
                  onClick={() => handleOpenModal(video.link)}
                />
              </Tooltip>
              <div className="p-2 bg-white">
                <p className="text-sm font-medium ">
                  {typeof video.name === 'string' ? video.name : 'Untitled'}
                </p>

                <div className="flex items-center justify-between mt-1">
                  <button
                    onClick={() => handleOpenModal(video.link)}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Watch on Vimeo
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(video.link || '');
                      message.success('Video link copied!');
                    }}
                    className="text-xs text-gray-600 hover:text-blue-500 transition"
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination (fake total) */}
      {/* {videoList.length > 0 && (
        <div className="flex justify-end mt-6">
          <Pagination
            current={page}
            total={100}
            pageSize={limit}
            onChange={handlePageChange}
            showSizeChanger
            showQuickJumper
            pageSizeOptions={['10', '20', '50']}
          />
        </div>
      )} */}

      {/* Video Modal */}
      <Modal
        open={modalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={800}
        destroyOnClose
      >
        <Modal
          open={modalVisible}
          onCancel={handleCloseModal}
          footer={null}
          width={800}
          destroyOnClose
        >
          {selectedVideo && (
            <div className="space-y-3">
              <iframe
                src={
                  selectedVideo.replace('vimeo.com', 'player.vimeo.com/video') +
                  '?autoplay=1'
                }
                width="100%"
                height="450"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />

              <div className="flex items-center justify-between text-sm text-gray-600">
                <span className="text-xs truncate">{selectedVideo}</span>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedVideo);
                    message.success('Link copied to clipboard!');
                  }}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Copy Link
                </button>
              </div>
            </div>
          )}
        </Modal>
      </Modal>
    </div>
  );
}
