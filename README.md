# Touchpad Gesture Improvements

This extension modifies and extends existing touchpad gestures on GNOME.

This repository contains the seemingly unmaintaned extension's transpiled to JS version with some fixes to get it to work on GNOME 46,
along with some additions which were previously raised as PR on the original project repo by me but never merged.

Credit goes to @jaophi to for getting the transpiled version to work (https://github.com/harshadgavali/gnome-gesture-improvements/issues/206#issuecomment-1782750156),  
upgrade supported version in metadata.json by @7HE-W0R1D (https://github.com/harshadgavali/gnome-gesture-improvements/issues/206#issuecomment-2023405620)  
and fix for No signal error by @Yanndroid (https://github.com/harshadgavali/gnome-gesture-improvements/issues/206#issuecomment-2026336600).
And thanks to @harshadgavali for creating [Gesture Improvements](https://github.com/harshadgavali/gnome-gesture-improvements) in the first place!

There is still the issue of pinch gestures not working that needs to be fixed.
And also application gestures not working.

## Installation
### Manually
1. Download the latest extension version from https://github.com/sidevesh/gnome-gesture-improvements--transpiled/releases/latest
2. Install extension
```
gnome-extensions install -f ~/Downloads/gestureImprovements@gestures.zip
```
2. Log out and log in **or** just restart session (X11)
3. Enable extension via extensions app or via command line
```
gnome-extensions enable gestureImprovements@gestures
```

### Additional app X11
On X11, you also need to install [gnome-x11-gesture-daemon](https://github.com/harshadgavali/gnome-x11-gesture-daemon)

## Gestures (including built-in ones)
| Swipe Gesture                           | Modes    | Fingers | Direction       |
| :-------------------------------------- | :------- | :------ | :-------------- |
| Switch windows                          | Desktop  | 3       | Horizontal      |
| Switch workspaces                       | Overview | 2/3     | Horizontal      |
| Switch app pages                        | AppGrid  | 2/3     | Horizontal      |
| Switch workspaces                       | *        | 4       | Horizontal      |
| Desktop/Overview/AppGrid navigation     | *        | 4       | Vertical        |
| Unmaximize/maximize/fullscreen a window | Desktop  | 3       | Vertical        |
| Minimize a window                       | Desktop  | 3       | Vertical        |
| Snap/half-tile a window                 | Desktop  | 3       | Explained below |

| Pinch Gesture           | Modes   | Fingers |
| :---------------------- | :------ | :------ |
| Show Desktop            | Desktop | 3/4     |
| Show Notification List  | Desktop | 3/4     |

| Application Gestures (Configurable) |
| :--- |
| Go back or forward in browser tab |
| Switch to next or previous image in image viewer |
| Switch to next or previous audio |
| Change tabs |

#### For activating tiling gesture (inverted T gesture)
1. Do a 3-finger vertical downward gesture on a unmaximized window
2. Wait a few milliseconds
3. Do a 3-finger horizontal gesture to tile a window to either side

#### Notes
* Minimize gesture is available if you have dash-to-dock/panel or similar extension enabled.
* To activate application gesture, hold for few moments(configurable) before swiping
* Tiling gesture can't be activated if you enable minimize gesture


## Customization
* To switch to windows from *all* workspaces using 3-fingers swipes, run 
```
gsettings set org.gnome.shell.window-switcher current-workspace-only false
```

* Add delay to alt-tab gesture, to ensure second windows gets selected when a fast swipe is done
* Change sensitivity of swipe (touchpad swipe speed)
* Option to follow natural scrolling (seperate from option in GNOME settings)
* Revert to 3-finger swipes to switch workspace on desktop (4-fingers to switch windows)
* Revert to 3-finger swipes for overview navigation (4-fingers to maximize/unmaximize/tile)

# Contributors
[@jacksongoode](https://github.com/jacksongoode)
[@kyteinsky](https://github.com/kyteinsky)

# Thanks
[@ewlsh](https://gitlab.gnome.org/ewlsh) for [Typescript definitions](https://www.npmjs.com/package/@gi-types/glib) for GLib, GObject, ...
