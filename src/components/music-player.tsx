
'use client';

import * as React from 'react';
import { useAudioPlayer, AudioPlayerProvider } from 'react-use-audio-player';
import { songs } from '@/lib/data';
import type { Song } from '@/lib/types';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ListMusic,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';

const formatTime = (seconds: number) => {
  const floored = Math.floor(seconds);
  const min = Math.floor(floored / 60);
  const sec = floored % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
};

function Player() {
  const {
    playing,
    duration,
    getPosition,
    volume,
    setVolume,
    togglePlayPause,
    seek,
    load,
  } = useAudioPlayer();
  
  const [songIndex, setSongIndex] = React.useState(0);
  const [showPlaylist, setShowPlaylist] = React.useState(false);
  const [position, setPosition] = React.useState(0);
  const [currentVolume, setCurrentVolume] = React.useState(volume);

  const currentSong = songs[songIndex];

  const handleNext = () => {
    setSongIndex((prev) => (prev + 1) % songs.length);
  };

  React.useEffect(() => {
    if (currentSong && load) {
      load({
        src: currentSong.audioSrc,
        autoplay: playing,
        html5: true,
        format: ["mp3"],
        onend: handleNext,
      } as any);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songIndex, load, playing, handleNext]);
  
  React.useEffect(() => {
      const interval = setInterval(() => {
          if (playing && typeof getPosition === 'function') {
              setPosition(getPosition());
          }
      }, 1000);
      return () => clearInterval(interval);
  }, [playing, getPosition]);

  React.useEffect(() => {
    setCurrentVolume(volume);
  }, [volume]);


  const handlePrev = () => {
    setSongIndex((prev) => (prev - 1 + songs.length) % songs.length);
  };
  
  const handleSongSelect = (index: number) => {
    setSongIndex(index);
    setShowPlaylist(false);
    if (!playing) {
      togglePlayPause();
    }
  }

  const handleVolumeChange = (value: number[]) => {
      const newVolume = value[0];
      setVolume(newVolume);
      setCurrentVolume(newVolume);
  }

  const toggleMute = () => {
      if (currentVolume > 0) {
          setVolume(0);
          setCurrentVolume(0);
      } else {
          setVolume(0.5); // Restore to a default volume
          setCurrentVolume(0.5);
      }
  }


  if (!currentSong) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <img
          src={currentSong.albumArtUrl}
          alt={currentSong.title}
          className={cn("w-full rounded-md object-cover transition-all", showPlaylist && "blur-sm brightness-50")}
          data-ai-hint="album art"
        />

        {showPlaylist && (
             <div className="absolute inset-0">
                <ScrollArea className="h-full w-full">
                    <div className="p-4">
                        <h3 className="text-lg font-bold text-white mb-2">Playlist</h3>
                        <ul className="space-y-2">
                           {songs.map((song, index) => (
                               <li 
                                    key={index}
                                    onClick={() => handleSongSelect(index)}
                                    className={cn(
                                        "flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors",
                                        songIndex === index ? "bg-primary/80" : "bg-black/50 hover:bg-black/70"
                                    )}
                                >
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={song.albumArtUrl} />
                                        <AvatarFallback>{song.title[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold text-white truncate text-sm">{song.title}</p>
                                        <p className="text-xs text-white/70">{song.artist}</p>
                                    </div>
                               </li>
                           ))}
                        </ul>
                    </div>
                </ScrollArea>
             </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={currentSong.albumArtUrl} />
            <AvatarFallback>{currentSong.title[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold truncate">{currentSong.title}</p>
            <p className="text-xs text-muted-foreground">{currentSong.artist}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setShowPlaylist(p => !p)}>
            <ListMusic className="h-5 w-5"/>
        </Button>
      </div>

      <div>
        <Slider
          value={[position]}
          max={duration}
          onValueChange={(value) => seek(value[0])}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{formatTime(position)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
          >
            {currentVolume > 0 ? <Volume2 /> : <VolumeX />}
          </Button>
          <Slider
            value={[currentVolume]}
            max={1}
            step={0.1}
            onValueChange={handleVolumeChange}
            className="w-24"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handlePrev}>
            <SkipBack />
          </Button>
          <Button size="icon" onClick={togglePlayPause}>
            {playing ? <Pause /> : <Play />}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleNext}>
            <SkipForward />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function MusicPlayer() {
    return (
        <AudioPlayerProvider>
            <Player />
        </AudioPlayerProvider>
    )
}
