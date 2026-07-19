# Installed codec capability report

- Collected: 2026-07-19T04:37:09.709894+00:00
- Machine: `vm` (Linux-6.18.5-x86_64-with-glibc2.39)
- FFmpeg: `ffmpeg version 6.1.1-3ubuntu5 Copyright (c) 2000-2023 the FFmpeg developers`
- Demuxers: 367 · video decoders: 299 · audio decoders: 214
- Hardware acceleration: vdpau, cuda, vaapi, qsv, drm, opencl, vulkan

This inventory reflects the ffmpeg build on THIS machine only. Re-run `python contentos_cli.py codec-inventory` after any ffmpeg change or on a new machine.

## Codec family support

| Family | Supported | Detail |
|---|---|---|
| H.264/AVC | ✅ | h264, h264_cuvid |
| H.265/HEVC | ✅ | hevc, hevc_cuvid |
| MPEG-2 | ✅ | mpeg2video |
| MPEG-4 Part 2 | ✅ | mpeg4 |
| Apple ProRes | ✅ | prores |
| Avid DNxHD/DNxHR | ✅ | dnxhd |
| GoPro CineForm | ✅ | cfhd |
| AV1 | ✅ | libdav1d, libaom-av1, av1 |
| VP8 | ✅ | vp8, libvpx |
| VP9 | ✅ | vp9, libvpx-vp9 |
| Motion JPEG | ✅ | mjpeg |
| DV/DVCPRO | ✅ | dvvideo |
| OpenEXR | ✅ | exr |
| Blackmagic RAW | ❌ | requires vendor SDK/decoder ffmpeg does not ship |
| RED R3D | ❌ | requires vendor SDK/decoder ffmpeg does not ship |
| ARRIRAW | ❌ | requires vendor SDK/decoder ffmpeg does not ship |
| PCM | ✅ | pcm_s16le, pcm_s24le |
| AAC | ✅ | aac |
| MP3 | ✅ | mp3, mp3float |
| FLAC | ✅ | flac |
| ALAC | ✅ | alac |
| AC-3 | ✅ | ac3 |
| E-AC-3 | ✅ | eac3 |
| Opus | ✅ | opus, libopus |
| Vorbis | ✅ | vorbis, libvorbis |
| WMA | ✅ | wmav2 |

## Known missing capabilities

- Blackmagic RAW: requires vendor SDK/decoder ffmpeg does not ship
- RED R3D: requires vendor SDK/decoder ffmpeg does not ship
- ARRIRAW: requires vendor SDK/decoder ffmpeg does not ship
