# Pocket Pip

Hands-only, seated mixed-reality reverse escape room for Meta Quest. A tiny person, Pip, is trapped in a dollhouse on your desk and you help them escape.

Unity 6000.3.26f1 (Unity 6.3 LTS), URP, Meta XR SDK 207.0.1 (core, interaction, MR Utility Kit), Oculus XR plugin.

## Palm-bridge prototype

Scene: `Assets/Scenes/PalmBridgePrototype.unity`

- The attic floor appears about 45 cm in front of you, below eye level, with a gap in the middle. Pip is on the left; the gold disc on the right is the goal.
- **Point** with your index finger (other fingers curled) at the floor on the right and hold still briefly. Pip walks there and stops at the edge of the gap.
- **Hold your hand flat, palm up and steady** across the gap. A green plank appears on your palm, and Pip walks across your hand to the goal.
- Tip your hand over while Pip is on it and Pip falls, then respawns on solid ground.

Tuning values are on the `HandLogic` object (`PalmBridge`, `PointToMove`, `HandPose`) and on `Pip` (`PipController`).

## Menu: Pocket Pip

- **Configure For Quest**: Android, IL2CPP, ARM64, XR loader, hands-only tracking, passthrough. Already applied.
- **Build Palm Bridge Prototype**: regenerates the greybox scene.
- **Build Quest APK**: writes `Builds/PocketPip.apk`.

## Install on the headset

With Developer Mode on and the Quest connected by USB (accept the "Allow USB debugging" prompt in the headset):

```bash
~/Library/Android/sdk/platform-tools/adb install -r Builds/PocketPip.apk
```

Or drag the APK onto Meta Quest Developer Hub. The app shows up under Library, in Unknown Sources.
