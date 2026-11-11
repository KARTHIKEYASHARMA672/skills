---
name: ffmpeg
description: >-
  Probe, transcode, compress, trim, concatenate, resize, mix audio, burn or
  extract subtitles, and hardware-encode media files using FFmpeg and FFprobe.
  Use when converting video/audio formats, normalizing loudness (EBU R128),
  ducking background music under voiceovers, preparing assets or post-processing
  exports for HyperFrames or Lemo-Opuscar, capturing thumbnails/GIFs, or
  inspecting stream metadata and decoding integrity. Not for generating animated
  videos from HTML/code from scratch (use hyperframes or lemo-opuscar).
---

# FFmpeg Media Engineering

Use `ffprobe` to inspect every input before mutating streams, keep FFmpeg option ordering strict, and verify every encoded output with `ffprobe` and decode checks.

## Command Order & Core Rules

FFmpeg applies non-global options **only to the immediately following `-i` input or output file**:

```text
ffmpeg [global_options] {[input_options] -i input} ... {[output_options] output}
```

| Rule | Why It Matters |
|---|---|
| **Probe first** | Check codec, resolution, SAR/DAR, FPS, `pix_fmt`, and audio presence (`0:a:0?`) before writing filters. |
| **Seek order** | `-ss` before `-i` does fast keyframe seeking; `-ss` after `-i` decodes frame-accurately. For `-c copy`, align near keyframes or re-encode clean cuts. |
| **Filter vs Copy** | Filters (`-vf`, `-af`, `-filter_complex`) require decoding and re-encoding; they cannot be combined with `-c copy` on the same stream. |
| **Web/Browser Invariants** | Universal MP4 playback needs `-c:v libx264 -pix_fmt yuv420p -movflags +faststart` and even width/height (`-vf "scale=trunc(iw/2)*2:trunc(ih/2)*2"` or `-2`). |
| **Non-destructive outputs** | Write to a new output path rather than overwriting source inputs in place; use `-n` (fail if exists) or `-y` (explicit overwrite) and `-nostdin` in scripts. |
| **Windows PowerShell quoting** | Wrap filter strings containing commas, brackets, or colons cleanly (`"scale=1920:-2,fps=30"`), avoid bash `\` line continuations (use single lines, backtick `` ` ``, or Git Bash `C:\Program Files\Git\bin\sh.exe`), and escape Windows drive letters inside subtitle filter paths as `C\:/dir/subs.srt`. |

## Quick Workflow

### 1. Inspect Input Streams

```powershell
# Compact stream & container summary
ffprobe -v error -show_entries format=duration,size,bit_rate:stream=index,codec_type,codec_name,width,height,r_frame_rate,pix_fmt,sample_rate,channels -of json input.mp4
```

### 2. Stream Copy / Remux / Exact Trim

```powershell
# Fast remux without quality loss (MKV -> MP4 when codecs are compatible)
ffmpeg -nostdin -hide_banner -i input.mkv -map 0:v:0 -map 0:a:0? -c copy -movflags +faststart output.mp4

# Frame-accurate trim (put -ss before -i for fast coarse seek, or re-encode for clean cut points)
ffmpeg -nostdin -hide_banner -ss 00:00:12.500 -i input.mp4 -t 00:00:15 -c:v libx264 -crf 18 -preset medium -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart clip.mp4
```

### 3. Transcode, Compress, or GPU-Accelerate (NVENC)

```powershell
# Universal high-compatibility H.264 CPU encode (CRF 18=master, 20-23=balanced, 26+=small web)
ffmpeg -nostdin -hide_banner -i input.mp4 -c:v libx264 -crf 22 -preset medium -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart output.mp4

# NVIDIA NVENC H.264 GPU encode (verify GPU works with your driver; use -rc vbr -cq for quality target)
ffmpeg -nostdin -hide_banner -i input.mp4 -c:v h264_nvenc -preset p5 -rc vbr -cq 22 -b:v 0 -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart output_nvenc.mp4
```

### 4. Resize, Aspect-Fit, Vertical 9:16, or Thumbnail / GIF

```powershell
# Letterbox / pillarbox into exact 1920x1080 without distortion
ffmpeg -nostdin -hide_banner -i input.mp4 -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:black,setsar=1" -c:v libx264 -crf 20 -pix_fmt yuv420p -c:a copy fit_1080p.mp4

# High-quality GIF via 2-stage palettegen in one filtergraph
ffmpeg -nostdin -hide_banner -ss 0 -t 5 -i input.mp4 -vf "fps=15,scale=640:-1:flags=lanczos,split[s0][s1];[s0]palettegen=stats_mode=diff[p];[s1][p]paletteuse=dither=bayer" preview.gif
```

### 5. Extract, Normalize Loudness, & Mix Audio

```powershell
# EBU R128 1-pass loudness normalization (-14 LUFS social/web, -16 LUFS podcasts/dialogue)
# Note: loudnorm internally upsamples to 192 kHz; keep -ar 48000 to avoid 96 kHz AAC outputs
ffmpeg -nostdin -hide_banner -i input.mp4 -c:v copy -af "loudnorm=I=-14:TP=-1.5:LRA=11" -c:a aac -b:a 192k -ar 48000 normalized.mp4

# Duck background music under voiceover (0=voice, 1=music)
ffmpeg -nostdin -hide_banner -i voice.wav -i bgm.mp3 -filter_complex "[0:a]asplit=2[vo_sc][vo_mix];[1:a]volume=0.35[bgm];[bgm][vo_sc]sidechaincompress=threshold=0.04:ratio=6:attack=20:release=300[ducked];[vo_mix][ducked]amix=inputs=2:duration=first:normalize=0[out]" -map "[out]" -c:a aac -b:a 192k mixed.m4a
```

### 6. Concatenate Clips

Use the concat demuxer when resolution, FPS, pixel format, and codecs match; otherwise normalize streams first with the `concat` filter (`[0:v][0:a][1:v][1:a]concat=n=2:v=1:a=1[v][a]`):

```powershell
# Concat demuxer with matching streams
@("file 'clip1.mp4'", "file 'clip2.mp4'") | Set-Content -Encoding ASCII list.txt
ffmpeg -nostdin -hide_banner -f concat -safe 0 -i list.txt -c copy merged.mp4
```

### 7. Integration with HyperFrames & Lemo-Opuscar

- **Input asset prep:** Normalize external footage to constant frame rate (`fps=30` or composition FPS), `yuv420p`, `libx264`, `-ar 48000` AAC, and `+faststart` before embedding inside HyperFrames `<video>` elements or Lemo-Opuscar scenes.
- **FFmpeg 8.1+ built-in `whisper` audio filter:** When a `whisper.cpp` GGML model file (`ggml-*.bin`) is present locally, FFmpeg 8.1 (`--enable-whisper`) can transcribe directly: `-af "whisper=model=C\:/models/ggml-base.bin:language=auto:format=srt:destination=subs.srt"`.
- **Master delivery:** Encode masters cleanly at CRF 16–18 (`-preset slow`), then spin platform deliverables (YouTube, 9:16 Reels/Shorts, LinkedIn, WebM) from the master. Note `hyperframes doctor` checks `loudnorm` reference parity specifically against FFmpeg 8.0.1, though `8.1.1-full_build` runs `loudnorm` normally.

## Output Verification Checklist

After every transformation, confirm the output is non-empty, valid, and matches expected streams:

1. Check exit status (`$LASTEXITCODE -eq 0`) and file size > 0 bytes.
2. Probe output streams and duration:
   `ffprobe -v error -show_entries format=duration,size:stream=codec_type,codec_name,width,height,r_frame_rate,pix_fmt,sample_rate -of json output.mp4`
3. Verify packet/frame decode integrity on critical masters:
   `ffmpeg -nostdin -v error -i output.mp4 -f null -`

## References

- [Codec, Container, Filter & Platform Export Recipes](./references/filters-and-recipes.md)
- [FFprobe Inspection, Audio/Video Diagnostics & Error Troubleshooting](./references/ffprobe-and-diagnostics.md)
