# FFprobe Inspection, Diagnostics & Error Troubleshooting

> Use these checks before processing unknown inputs and after every encode to verify media integrity.

---

## 1. Fast `ffprobe` Queries (PowerShell-Friendly)

```powershell
# Full JSON metadata for container + streams
ffprobe -v error -show_format -show_streams -of json input.mp4

# Duration in seconds only
ffprobe -v error -show_entries format=duration -of csv=p=0 input.mp4

# Resolution + FPS + pixel format of first video stream
ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,width,height,r_frame_rate,avg_frame_rate,pix_fmt,sample_aspect_ratio -of json input.mp4

# Check whether an audio stream exists (empty output = no audio)
ffprobe -v error -select_streams a -show_entries stream=index,codec_name,channels,sample_rate -of csv=p=0 input.mp4

# Exact frame count (decodes packets; slower on long files)
ffprobe -v error -select_streams v:0 -count_packets -show_entries stream=nb_read_packets -of csv=p=0 input.mp4
```

---

## 2. Media Diagnostics & Quality Checks

### Decode Integrity Check (Detect Corrupt Frames/Streams)

```powershell
ffmpeg -nostdin -v error -i candidate.mp4 -f null -
# Exit code 0 with empty stderr indicates clean packet decoding
```

### Silence & Black-Frame Detection

```powershell
# Detect silences quieter than -35 dB lasting >= 0.4s
ffmpeg -nostdin -hide_banner -i dialogue.mp4 -af "silencedetect=noise=-35dB:d=0.4" -f null -

# Detect black frames lasting >= 0.2s
ffmpeg -nostdin -hide_banner -i render.mp4 -vf "blackdetect=d=0.2:pic_th=0.98" -an -f null -
```

### Loudness & Peak Audit

```powershell
# Measure peak/mean dB quickly
ffmpeg -nostdin -hide_banner -i audio.wav -af "volumedetect" -f null -

# EBU R128 integrated loudness, LRA & true peak stats
ffmpeg -nostdin -hide_banner -i video.mp4 -vn -af "ebur128=peak=true" -f null -
```

### Visual Quality Comparison (VMAF / SSIM / PSNR)

Both inputs must match resolution and frame rate (`scale2ref` or explicit `scale` if compressed vs reference differs):

```powershell
# Compute SSIM + PSNR (first input = distorted, second input = reference)
ffmpeg -nostdin -hide_banner -i encoded.mp4 -i master.mp4 -lavfi "[0:v][1:v]ssim;[0:v][1:v]psnr" -f null -

# Compute VMAF (verified built with --enable-libvmaf)
ffmpeg -nostdin -hide_banner -i encoded.mp4 -i master.mp4 -lavfi "[0:v][1:v]libvmaf" -f null -
```

---

## 3. Common Failure Modes & Exact Fixes

| Symptom / Error | Root Cause | Fix |
|---|---|---|
| `height not divisible by 2` or `width not divisible by 2` | `yuv420p` / H.264 requires even dimensions | Add `-vf "scale=trunc(iw/2)*2:trunc(ih/2)*2"` or `-vf "scale=1280:-2"` |
| Black screen or unplayable in Safari/Chrome | Incompatible pixel format (e.g., `yuv444p` / 10-bit) or `moov` atom at end | Add `-pix_fmt yuv420p -movflags +faststart` |
| Trimmed clip freezes for first 1-3s | `-ss` before `-i` combined with `-c copy` landed between keyframes | Put `-ss` accurately and re-encode (`-c:v libx264 -c:a aac`) for exact cuts |
| `Conversion failed!` / `Cannot connect` in complex filtergraph | Audio stream missing when mapped `[0:a]` or SAR mismatch | Use optional audio map `-map 0:a?`, normalize SAR (`setsar=1`) and sample format (`aformat=sample_rates=48000:channel_layouts=stereo`) |
| `Unable to parse option value` on Windows subtitle path | Unescaped `C:` drive colon inside filter argument | Use forward slashes and escape colon: `subtitles='C\:/dir/subs.srt'` (or use a relative path inside the working dir) |
| Audio drifts out of sync on screen recordings | Variable frame rate (VFR) input | Force CFR output during transcode: `-fps_mode cfr -r 30` (or `-vf fps=30`) |
| `h264_nvenc` init fails or unsupported `pix_fmt` | Missing/outdated NVIDIA runtime or 8-bit/10-bit mismatch | Fall back to `libx264 -preset medium -crf 20`, or pass `-pix_fmt yuv420p` / `nv12` |
| Script hangs waiting for `[y/N]` overwrite prompt | Existing output file without `-y`, `-n`, or `-nostdin` | Always include `-nostdin` in automated scripts and choose `-y` or `-n` explicitly |
