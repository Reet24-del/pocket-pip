# The Room That Remembers

A three-room haunted escape game for desktop browsers and hands-first WebXR.

Play at https://pocket-pip-preview.vercel.app/.

- On a Meta VR headset, enable hand tracking, open the URL in Quest Browser, and select **Enter VR**. Aim and pinch to interact. Use **Move** to change between fixed, seated viewpoints.
- On desktop, use WASD or the arrow keys to walk. Drag to look, click to inspect, and press Esc to back out.
- The **Journal** records clues and provides hints. Select items from **Inventory** to use them or reopen a photograph.

For local development, serve this directory over HTTP on localhost. WebXR outside localhost requires HTTPS. The VR input manager is bundled from Meta's `@iwsdk/xr-input` 1.1.0. License notices are in `vendor/`. The headset path has been exercised in Meta's IWER Quest 3 emulator. Physical headset performance has yet to be measured.
