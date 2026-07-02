import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlay, FiPause, FiVolume2, FiVolumeX,
  FiMaximize, FiMinimize, FiSettings,
  FiSkipForward, FiType, FiMonitor,
} from 'react-icons/fi';
import ReactPlayer from 'react-player/youtube';
import { QUALITY_OPTIONS, PLAYBACK_SPEEDS } from '../../utils/constants';

interface VideoPlayerProps {
  url: string;
  isPlaying: boolean;
  onPlayPause: () => void;
  onProgress?: (progress: number) => void;
}

export const VideoPlayer = ({ url, isPlaying, onPlayPause, onProgress }: VideoPlayerProps) => {
  const playerRef = useRef<ReactPlayer>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [quality, setQuality] = useState('auto');
  const [showSubtitles, setShowSubtitles] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [duration, setDuration] = useState(0);
  const controlsTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const playedRef = useRef(0);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'k') { e.preventDefault(); onPlayPause(); }
      if (e.key === 'f') toggleFullscreen();
      if (e.key === 'm') setIsMuted(!isMuted);
      if (e.key === 'ArrowRight') seekTo(Math.min(1, playedRef.current + 0.05));
      if (e.key === 'ArrowLeft') seekTo(Math.max(0, playedRef.current - 0.05));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isPlaying, isMuted]);

  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  }, [isPlaying]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const seekTo = (value: number) => {
    playerRef.current?.seekTo(value, 'fraction');
    setPlayed(value);
    playedRef.current = value;
  };

  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    if (!seeking) {
      setPlayed(state.played);
      playedRef.current = state.played;
      onProgress?.(state.played);
    }
  };

  const handleDuration = (dur: number) => setDuration(dur);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-black group"
      onMouseMove={showControlsTemporarily}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <ReactPlayer
        ref={playerRef}
        url={url}
        playing={isPlaying}
        muted={isMuted}
        volume={volume}
        playbackRate={playbackSpeed}
        width="100%"
        height="100%"
        onProgress={handleProgress}
        onDuration={handleDuration}
        className="absolute top-0 left-0"

      />

      <AnimatePresence>
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer"
            onClick={onPlayPause}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-20 h-20 rounded-full bg-streamly-red/90 flex items-center justify-center"
            >
              <FiPlay size={36} className="text-white ml-1" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none"
          >
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 pointer-events-auto">
              <div className="relative mb-2 group/seek">
                <input
                  type="range"
                  min={0}
                  max={0.999999}
                  step={0.001}
                  value={played}
                  onChange={(e) => { setSeeking(true); setPlayed(parseFloat(e.target.value)); }}
                  onMouseUp={(e) => { seekTo(parseFloat((e.target as HTMLInputElement).value)); setSeeking(false); }}
                  onTouchEnd={(e) => { seekTo(parseFloat((e.target as HTMLInputElement).value)); setSeeking(false); }}
                  className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-streamly-red [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:opacity-0 group-hover/seek:[&::-webkit-slider-thumb]:opacity-100 transition-opacity"
                  style={{
                    background: `linear-gradient(to right, #ff1e2d ${played * 100}%, rgba(255,255,255,0.3) ${played * 100}%)`,
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={onPlayPause}
                    className="text-white hover:text-streamly-red transition-colors"
                  >
                    {isPlaying ? <FiPause size={22} /> : <FiPlay size={22} />}
                  </button>

                  <button
                    onClick={() => seekTo(Math.min(1, played + 0.1))}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    <FiSkipForward size={20} />
                  </button>

                  <div className="flex items-center gap-2 group/vol">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      {isMuted || volume === 0 ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
                    </button>
                    <div className="w-0 group-hover/vol:w-20 overflow-hidden transition-all duration-300">
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={isMuted ? 0 : volume}
                        onChange={(e) => { setVolume(parseFloat(e.target.value)); setIsMuted(false); }}
                        className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                        style={{
                          background: `linear-gradient(to right, white ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.3) ${(isMuted ? 0 : volume) * 100}%)`,
                        }}
                      />
                    </div>
                  </div>

                  <span className="text-xs text-white/60 font-mono">
                    {formatTime(played * duration)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <button
                      onClick={() => setShowSubtitles(!showSubtitles)}
                      className={`transition-colors ${showSubtitles ? 'text-streamly-red' : 'text-white/70 hover:text-white'}`}
                    >
                      <FiType size={18} />
                    </button>
                    {showSubtitles && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-streamly-red rounded-full" />
                    )}
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => setShowSettings(!showSettings)}
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      <FiSettings size={18} />
                    </button>
                    <AnimatePresence>
                      {showSettings && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute bottom-10 right-0 w-52 bg-streamly-darker/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl"
                        >
                          <div className="p-3 border-b border-white/10">
                            <p className="text-xs font-semibold text-streamly-gray uppercase">Speed</p>
                            <div className="grid grid-cols-4 gap-1 mt-2">
                              {PLAYBACK_SPEEDS.map((speed) => (
                                <button
                                  key={speed}
                                  onClick={() => { setPlaybackSpeed(speed); setShowSettings(false); }}
                                  className={`text-xs py-1.5 rounded transition-colors ${
                                    playbackSpeed === speed
                                      ? 'bg-streamly-red text-white'
                                      : 'text-streamly-gray-light hover:bg-white/10'
                                  }`}
                                >
                                  {speed}x
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="p-3">
                            <p className="text-xs font-semibold text-streamly-gray uppercase mb-2">Quality</p>
                            {QUALITY_OPTIONS.map((opt) => (
                              <button
                                key={opt.value}
                                onClick={() => { setQuality(opt.value); setShowSettings(false); }}
                                className={`flex items-center gap-2 w-full px-3 py-1.5 text-xs rounded transition-colors ${
                                  quality === opt.value
                                    ? 'bg-streamly-red/20 text-streamly-red'
                                    : 'text-streamly-gray-light hover:bg-white/10'
                                }`}
                              >
                                <FiMonitor size={12} />
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <button
                    onClick={toggleFullscreen}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {isFullscreen ? <FiMinimize size={18} /> : <FiMaximize size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-4 left-4">
        <span className="text-xs px-2 py-1 bg-black/50 rounded text-white/60">
          {quality === 'auto' ? 'Auto' : quality}
        </span>
      </div>
    </div>
  );
};
