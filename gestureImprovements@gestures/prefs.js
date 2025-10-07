/* exported init, fillPreferencesWindow */

import { buildPrefsWidget } from './prefs/prefs.js'
import { ExtensionPreferences } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class GestureImprovementsExtensionPreferences extends ExtensionPreferences {
    fillPreferencesWindow(prefsWindow) {
		var _a;
		const UIDirPath = (_a = this.dir.get_child('ui').get_path()) !== null && _a !== void 0 ? _a : '';
		const settings = this.getSettings();
		buildPrefsWidget(prefsWindow, settings, UIDirPath);
    }
}
