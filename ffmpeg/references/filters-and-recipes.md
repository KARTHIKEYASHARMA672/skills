# FFmpeg Codecs, Filters & Export Recipes

> Tested capabilities reflect FFmpeg `8.1.1-full_build` on Windows (including `libx264`, `libx265`, `libsvtav1`, `libvpx-vp9`, `prores_ks`, `h264_nvenc`, `hevc_nvenc`, `av1_nvenc`, `aac`, `libopus`, `loudnorm`, `xfade`, `sidechaincompress`, `libass`/`subtitles`, `libvmaf`, and `whisper`).

---

## 1. Codec & Quality Reference

### Video Codecs (`-c:v`)

| Codec | Use Case | Quality Control | Essential Compatibility Flags |
|---|---|---|---|
| `libx264` | Universal H.264 (web, mobile, HyperFrames, social) | `-crf 18` (master) / `20-23` (standard) / `26` (small) | `-pix_fmt yuv420p -movflags +faststart` |
| `libx265` | High-efficiency HEVC archive (~30-40% smaller) | `-crf 22-26` | `-tag:v hvc1 -pix_fmt yuv420p` (Apple/browser compat) |
| `libsvtav1` | Modern web AV1 delivery (slow-to-medium presets `4-8`) | `-crf 28-34 -preset 6` | `-pix_fmt yuv420p10le` or `yuv420p` |
| `libvpx-vp9` | WebM transparent/web video | `-crf 30 -b:v 0 -deadline good` | `-c:a libopus` in `.webm`; supports `yuva420p` alpha |
| `prores_ks` | Editing intermediate (`-profile:v 2` Standard, `3` HQ, `4` 4444 alpha) | `-profile:v 3` | `.mov` container (`-pix_fmt yuv422p10le` or `yuva444p10le`) |
| `h264_nvenc` / `hevc_nvenc` | Fast NVIDIA GPU encoding (`p1` fastest .. `p6` slower) | `-rc vbr -cq 21 -b:v 0` | Requires CUDA/NVENC-capable NVIDIA driver; test before batching |
| `copy` | Lossless stream remux / keyframe trim | None | Cannot be used alongside `-vf` or `-af` |

### Audio Codecs (`-c:a`)

| Codec | Container | Recommended Bitrate / Quality | Notes |
|---|---|---|---|
| `aac` | `.mp4`, `.mov`, `.m4a` | `-b:a 192k -ar 48000` (music/master) / `128k` (web) | Most universal compressed audio |
| `libopus` | `.webm`, `.mkv`, `.opus` | `-b:a 128k` (stereo) / `64k` (voice) | Best speech/music efficiency at low bitrates |
| `libmp3lame` | `.mp3`, `.mp4` | `-q:a 2` (~190kbps VBR) or `-b:a 192k` | Legacy compatibility |
| `pcm_s16le` / `flac` | `.wav` / `.flac` | Lossless | Audio analysis, speech pipelines, editing stems |

---

## 2. Scaling, Aspect Ratios, Cropping & Overlays

### Maintain Aspect Ratio + Fit Box

```powershell
# Letterbox / pillarbox cleanly to 1920x1080
-vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:black,setsar=1"

# Center-crop to fill 1080x1920 (9:16 Reels/Shorts/TikTok)
-vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1"

# Downscale only if wider than 1920 (never upscale), auto even height
-vf "scale='min(1920,iw)':-2,setsar=1"
```

### Picture-in-Picture & Side-by-Side Grids

```powershell
# Corner PiP (bottom-right with 24px margin)
ffmpeg -nostdin -hide_banner -i main.mp4 -i cam.mp4 `
  -filter_complex "[1:v]scale=360:-2[pip];[0:v][pip]overlay=W-w-24:H-h-24" `
  -map 0:a? -c:v libx264 -crf 20 -pix_fmt yuv420p -c:a copy pip.mp4

# Side-by-side comparison (match height first!)
ffmpeg -nostdin -hide_banner -i left.mp4 -i right.mp4 `
  -filter_complex "[0:v]scale=-2:720[l];[1:v]scale=-2:720[r];[l][r]hstack=inputs=2[v]" `
  -map "[v]" -map 0:a? -c:v libx264 -crf 20 -pix_fmt yuv420p -c:a copy compare.mp4
```

### Concatenating Dissimilar Clips + Crossfade Transitions

```powershell
# Normalize two mismatched inputs cleanly with concat filter
ffmpeg -nostdin -hide_banner -i a.mp4 -i b.mp4 `
  -filter_complex "[0:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,fps=30,format=yuv420p,setsar=1[v0];[1:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,fps=30,format=yuv420p,setsar=1[v1];[0:a]aformat=sample_rates=48000:channel_layouts=stereo[a0];[1:a]aformat=sample_rates=48000:channel_layouts=stereo[a1];[v0][a0][v1][a1]concat=n=2:v=1:a=1[v][a]" `
  -map "[v]" -map "[a]" -c:v libx264 -crf 19 -c:a aac -b:a 192k -movflags +faststart joined.mp4

# Crossfade: clip A = 10s, 0.5s fade starting at offset = 9.5s (requires matching timebase/fps/size!)
ffmpeg -nostdin -hide_banner -i a.mp4 -i b.mp4 `
  -filter_complex "[0:v][1:v]xfade=transition=fade:duration=0.5:offset=9.5[v];[0:a][1:a]acrossfade=d=0.5[a]" `
  -map "[v]" -map "[a]" -c:v libx264 -crf 19 -pix_fmt yuv420p -c:a aac -b:a 192k xfade_out.mp4
```

---

## 3. Speed Adjustment (`setpts` + `atempo`)

Remember: `atempo` only accepts `0.5` to `2.0` per stage; chain multiple `atempo` filters for extreme speeds.

```powershell
# 1.5x speed (video + synced audio)
ffmpeg -nostdin -hide_banner -i in.mp4 -filter_complex "[0:v]setpts=PTS/1.5[v];[0:a]atempo=1.5[a]" -map "[v]" -map "[a]" -c:v libx264 -crf 20 -c:a aac speed_1_5x.mp4

# 4x speed audio + video (chaining atempo=2.0 twice)
ffmpeg -nostdin -hide_banner -i in.mp4 -filter_complex "[0:v]setpts=0.25*PTS[v];[0:a]atempo=2.0,atempo=2.0[a]" -map "[v]" -map "[a]" -c:v libx264 -crf 20 -c:a aac speed_4x.mp4

# 0.5x slow-motion without audio
ffmpeg -nostdin -hide_banner -i in.mp4 -vf "setpts=2.0*PTS" -an -c:v libx264 -crf 19 slowmo.mp4
```

---

## 4. Audio Mastering, Two-Pass Loudnorm & Loop BGM

### Two-Pass EBU R128 Loudnorm (Highest Accuracy)

> `loudnorm` upsamples internally to 192 kHz, so always pass `-ar 48000` afterwards unless 96 kHz AAC/192 kHz PCM is intended.

```powershell
# Pass 1: Measure input integrated loudness (I), LRA, true peak (TP), threshold
ffmpeg -nostdin -hide_banner -i input.mp4 -vn -af "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json" -f null -

# Pass 2: Apply exact measured values in linear mode
ffmpeg -nostdin -hide_banner -i input.mp4 -c:v copy `
  -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=-20.4:measured_LRA=6.8:measured_TP=-3.1:measured_thresh=-30.9:offset=0.2:linear=true:print_format=summary" `
  -c:a aac -b:a 192k -ar 48000 mastered.mp4
```

### Loop Short Music Under Longer Video

```powershell
ffmpeg -nostdin -hide_banner -i video.mp4 -stream_loop -1 -i bgm.mp3 `
  -filter_complex "[1:a]volume=0.25,afade=t=in:st=0:d=1.5[m]" `
  -map 0:v:0 -map "[m]" -shortest -c:v copy -c:a aac -b:a 192k scored.mp4
```

---

## 5. Subtitles & FFmpeg Built-In `whisper` Filter

```powershell
# Burn SRT/ASS subtitles on Windows (escape drive colon ':' as '\:' and use forward slashes inside filter!)
ffmpeg -nostdin -hide_banner -i input.mp4 -vf "subtitles='C\:/projects/demo/subs.srt':force_style='FontSize=22,PrimaryColour=&H00FFFFFF,Outline=2'" -c:v libx264 -crf 19 -pix_fmt yuv420p -c:a copy burned.mp4

# Soft-mux SRT track into MP4 (`mov_text`) without re-encoding video
ffmpeg -nostdin -hide_banner -i input.mp4 -i subs.srt -map 0:v -map 0:a? -map 1:s -c:v copy -c:a copy -c:s mov_text subtitled.mp4

# Transcribe directly via FFmpeg 8.1+ whisper filter (requires a whisper.cpp ggml-*.bin model file)
ffmpeg -nostdin -hide_banner -i input.mp4 -vn -af "whisper=model='C\:/models/ggml-base.bin':language=auto:format=srt:destination='C\:/temp/out.srt'" -f null -
```

---

## 6. Social & Web Delivery Presets

| Target | Resolution | Video Settings | Audio Settings |
|---|---|---|---|
| **YouTube Master** | Original 1080p/4K | `libx264 -preset slow -crf 18 -pix_fmt yuv420p` (or `h264_nvenc` / 4K HEVC) | `aac -b:a 192k -ar 48000` |
| **Shorts / Reels / TikTok** | `1080x1920` (9:16) | `libx264 -crf 20 -pix_fmt yuv420p -movflags +faststart` | `aac -b:a 192k -ar 48000` |
| **X / Twitter** | Max `1280x720` or `1920x1080` (`<=140s`) | `libx264 -profile:v high -level 4.1 -crf 23 -pix_fmt yuv420p -movflags +faststart` | `aac -b:a 128k -ar 44100` |
| **LinkedIn** | Up to `1920x1080` | `libx264 -crf 21 -pix_fmt yuv420p -movflags +faststart` | `aac -b:a 192k -ar 48000` |
| **Lightweight Web Embed** | `1280x720` or WebM VP9 | `libx264 -crf 25 -movflags +faststart` (or `libvpx-vp9 -crf 32 -b:v 0`) | `aac -b:a 128k` (or `libopus`) |

### Animated WebP (Much Smaller Than GIF)

```powershell
ffmpeg -nostdin -hide_banner -ss 0 -t 5 -i input.mp4 -vf "fps=15,scale=640:-1:flags=lanczos" -c:v libwebp -lossless 0 -compression_level 4 -q:v 75 -loop 0 -an preview.webp
```
