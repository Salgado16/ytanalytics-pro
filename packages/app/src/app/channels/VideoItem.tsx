"use client";

import { VideoData } from "./page";
import {
  Eye,
  TrendingUp,
  BarChart2,
  Clock,
} from "lucide-react";
import { formatNumber, formatRelativeTime } from "@/lib/utils";

interface VideoItemProps {
  video: VideoData;
}

export function VideoItem({ video }: VideoItemProps) {
  return (
    <div className="video-card group rounded-xl bg-muted/50">
      <div className="flex gap-3">
        <a
          href={`https://youtube.com/watch?v=${video.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0"
        >
          {video.thumbnail ? (
            <img
              src={video.thumbnail}
              alt={video.title}
              className="video-thumbnail"
            />
          ) : (
            <div className="video-thumbnail flex items-center justify-center bg-muted">
              <BarChart2 className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
        </a>
        <div className="video-info min-w-0">
          <a
            href={`https://youtube.com/watch?v=${video.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="video-title line-clamp-2"
          >
            {video.title}
          </a>
          <div className="video-meta">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {formatNumber(video.views)}
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {video.likes ? formatNumber(video.likes) : "—"}
            </span>
            <span className="flex items-center gap-1">
              <BarChart2 className="h-3 w-3" />
              {video.comments ? formatNumber(video.comments) : "—"}
            </span>
            {video.ctr !== undefined && (
              <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <TrendingUp className="h-3 w-3" />
                CTR: {video.ctr.toFixed(1)}%
              </span>
            )}
            {video.retention !== undefined && (
              <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                <Clock className="h-3 w-3" />
                Retenção: {video.retention.toFixed(1)}%
              </span>
            )}
          </div>
          <p className="video-time">
            {formatRelativeTime(video.publishedAt)}
          </p>
        </div>
      </div>
    </div>
  );
}