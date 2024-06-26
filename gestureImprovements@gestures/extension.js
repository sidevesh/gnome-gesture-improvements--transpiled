/* exported init */
import GLib from 'gi://GLib';

import { PinchGestureType } from './common/settings.js'
import * as Constants from './constants.js'
import { AltTabConstants, ExtSettings, TouchpadConstants } from './constants.js'
import { AltTabGestureExtension } from './src/altTab.js'
import { ForwardBackGestureExtension } from './src/forwardBack.js'
import { GestureExtension } from './src/gestures.js'
import { OverviewRoundTripGestureExtension } from './src/overviewRoundTrip.js'
import { CloseWindowExtension } from './src/pinchGestures/closeWindow.js'
import { ShowNotificationListExtension } from './src/pinchGestures/showNotificationList.js'
import { ShowDesktopExtension } from './src/pinchGestures/showDesktop.js'
import { SnapWindowExtension } from './src/snapWindow.js'
import * as DBusUtils from './src/utils/dbus.js'
import * as VKeyboard from './src/utils/keyboard.js'
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
export default class MyExtension extends Extension {
	constructor(metadata) {
		super(metadata);
		this._settingChangedId = 0;
		this._reloadWaitId = 0;
		this._extensions = [];
		this._addReloadDelayFor = [
			'touchpad-speed-scale',
			'alttab-delay',
			'touchpad-pinch-speed',
		];
	}

	enable() {
		this.settings = this.getSettings();
		this._settingChangedId = this.settings.connect('changed', this.reload.bind(this));
		this._enable();
	}

	disable() {
		if (this.settings) {
			this.settings.disconnect(this._settingChangedId);
		}

		if (this._reloadWaitId !== 0) {
			GLib.source_remove(this._reloadWaitId);
			this._reloadWaitId = 0;
		}

		this._disable();
		DBusUtils.drop_proxy();
	}

	reload(_settings, key) {
		if (this._reloadWaitId !== 0) {
			GLib.source_remove(this._reloadWaitId);
			this._reloadWaitId = 0;
		}

		this._reloadWaitId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, (this._addReloadDelayFor.includes(key) ? Constants.RELOAD_DELAY : 0), () => {
			this._disable();
			this._enable();
			this._reloadWaitId = 0;
			return GLib.SOURCE_REMOVE;
		});
	}

	_enable() {
		this._initializeSettings();
		this._extensions = [];
		if (this.settings === undefined)
			return;
		if (this.settings.get_boolean('enable-alttab-gesture'))
			this._extensions.push(new AltTabGestureExtension());
		if (this.settings.get_boolean('enable-forward-back-gesture')) {
			const appForwardBackKeyBinds = this.settings.get_value('forward-back-application-keyboard-shortcuts').deepUnpack();
			this._extensions.push(new ForwardBackGestureExtension(appForwardBackKeyBinds));
		}

		this._extensions.push(new OverviewRoundTripGestureExtension(this.settings.get_enum('overview-navifation-states')), new GestureExtension());
		if (this.settings.get_boolean('enable-window-manipulation-gesture'))
			this._extensions.push(new SnapWindowExtension());

		// pinch to show desktop
		const pinchToFingersMap = this._getPinchGestureTypeAndFingers();
		const showDesktopFingers = pinchToFingersMap.get(PinchGestureType.SHOW_DESKTOP);
		if (showDesktopFingers === null || showDesktopFingers === void 0 ? void 0 : showDesktopFingers.length)
			this._extensions.push(new ShowDesktopExtension(showDesktopFingers));

		// pinch to close window
		const closeWindowFingers = pinchToFingersMap.get(PinchGestureType.CLOSE_WINDOW);
		if (closeWindowFingers === null || closeWindowFingers === void 0 ? void 0 : closeWindowFingers.length)
			this._extensions.push(new CloseWindowExtension(closeWindowFingers, PinchGestureType.CLOSE_WINDOW));

		// pinch to close document
		const closeDocumentFingers = pinchToFingersMap.get(PinchGestureType.CLOSE_DOCUMENT);
		if (closeDocumentFingers === null || closeDocumentFingers === void 0 ? void 0 : closeDocumentFingers.length)
			this._extensions.push(new CloseWindowExtension(closeDocumentFingers, PinchGestureType.CLOSE_DOCUMENT));

		// pinch to show notification list
		const showNotificationListFingers = pinchToFingersMap.get(PinchGestureType.SHOW_NOTIFICATION_LIST);
		if (showNotificationListFingers === null || showNotificationListFingers === void 0 ? void 0 : showNotificationListFingers.length)
			this._extensions.push(new ShowNotificationListExtension(showNotificationListFingers));
		this._extensions.forEach(extension => { var _a; return (_a = extension.apply) === null || _a === void 0 ? void 0 : _a.call(extension); });
	}

	_disable() {
		VKeyboard.extensionCleanup();
		DBusUtils.unsubscribeAll();
		this._extensions.reverse().forEach(extension => extension.destroy());
		this._extensions = [];
	}

	_initializeSettings() {
		if (this.settings) {
			ExtSettings.DEFAULT_SESSION_WORKSPACE_GESTURE = this.settings.get_boolean('default-session-workspace');
			ExtSettings.DEFAULT_OVERVIEW_GESTURE = this.settings.get_boolean('default-overview');
			ExtSettings.ALLOW_MINIMIZE_WINDOW = this.settings.get_boolean('allow-minimize-window');
			ExtSettings.ALLOW_FULLSCREEN_WINDOW = this.settings.get_boolean('allow-fullscreen-window');
			ExtSettings.FOLLOW_NATURAL_SCROLL = this.settings.get_boolean('follow-natural-scroll');
			ExtSettings.DEFAULT_OVERVIEW_GESTURE_DIRECTION = this.settings.get_boolean('default-overview-gesture-direction');
			ExtSettings.APP_GESTURES = this.settings.get_boolean('enable-forward-back-gesture');
			TouchpadConstants.SWIPE_MULTIPLIER = Constants.TouchpadConstants.DEFAULT_SWIPE_MULTIPLIER * this.settings.get_double('touchpad-speed-scale');
			TouchpadConstants.PINCH_MULTIPLIER = Constants.TouchpadConstants.DEFAULT_PINCH_MULTIPLIER * this.settings.get_double('touchpad-pinch-speed');
			AltTabConstants.DELAY_DURATION = this.settings.get_int('alttab-delay');
			TouchpadConstants.HOLD_SWIPE_DELAY_DURATION = this.settings.get_int('hold-swipe-delay-duration');
		}
	}

	_getPinchGestureTypeAndFingers() {
		if (!this.settings)
			return new Map();
		const pinch3FingerGesture = this.settings.get_enum('pinch-3-finger-gesture');
		const pinch4FingerGesture = this.settings.get_enum('pinch-4-finger-gesture');
		const gestureToFingersMap = new Map();
		if (pinch3FingerGesture === pinch4FingerGesture)
			gestureToFingersMap.set(pinch3FingerGesture, [3, 4]);
		else {
			gestureToFingersMap.set(pinch3FingerGesture, [3]);
			gestureToFingersMap.set(pinch4FingerGesture, [4]);
		}

		return gestureToFingersMap;
	}
}
