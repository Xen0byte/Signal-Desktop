// Copyright 2018-2021 Signal Messenger, LLC
// SPDX-License-Identifier: AGPL-3.0-only

/* global $, Whisper */

$(document).on('keydown', e => {
  if (e.keyCode === 27) {
    window.closeSettings();
  }
});

const $body = $(document.body);

async function applyTheme() {
  const theme = await window.getThemeSetting();
  $body.removeClass('light-theme');
  $body.removeClass('dark-theme');
  $body.addClass(`${theme === 'system' ? window.systemTheme : theme}-theme`);
}

applyTheme();

window.SignalContext.nativeThemeListener.subscribe(() => {
  applyTheme();
});

const getInitialData = async () => ({
  deviceName: await window.getDeviceName(),

  themeSetting: await window.getThemeSetting(),
  hideMenuBar: await window.getHideMenuBar(),
  systemTray: await window.getSystemTraySetting(),

  notificationSetting: await window.getNotificationSetting(),
  audioNotification: await window.getAudioNotification(),
  notificationDrawAttention: await window.getNotificationDrawAttention(),
  countMutedConversations: await window.getCountMutedConversations(),

  spellCheck: await window.getSpellCheck(),
  autoLaunch: await window.getAutoLaunch(),

  incomingCallNotification: await window.getIncomingCallNotification(),
  callRingtoneNotification: await window.getCallRingtoneNotification(),
  callSystemNotification: await window.getCallSystemNotification(),
  alwaysRelayCalls: await window.getAlwaysRelayCalls(),

  mediaPermissions: await window.getMediaPermissions(),
  mediaCameraPermissions: await window.getMediaCameraPermissions(),

  isPrimary: await window.isPrimary(),
  lastSyncTime: await window.getLastSyncTime(),
  universalExpireTimer: await window.getUniversalExpireTimer(),
});

window.initialRequest = getInitialData();

// eslint-disable-next-line more/no-then
window.initialRequest.then(
  data => {
    window.initialData = data;
    window.view = new Whisper.SettingsView();
    window.view.$el.appendTo($body);
  },
  error => {
    window.log.error(
      'settings.initialRequest error:',
      error && error.stack ? error.stack : error
    );
    window.closeSettings();
  }
);
