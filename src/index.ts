import {
  declareIndexPlugin,
  WidgetLocation,
  AppEvents,
  ReactRNPlugin,
} from '@remnote/plugin-sdk';
import { SessionTracker } from './tracker';

async function onActivate(plugin: ReactRNPlugin) {
  const tracker = new SessionTracker(plugin);
  await tracker.init();
  (window as any).tracker = tracker;

  await plugin.app.registerCommand({
    id: 'start-flashcard-session',
    name: 'Start Flashcard Session',
    action: () => tracker.startSession(),
  });

  await plugin.app.registerCommand({
    id: 'end-flashcard-session',
    name: 'End Flashcard Session',
    action: () => tracker.endSession(),
  });

  plugin.event.addListener(AppEvents.QueueCompleteCard, 'tracker', (data: any) => {
    tracker.recordAnswer(data.correct ?? true);
  });

  await plugin.app.registerWidget('session-stats', WidgetLocation.RightSidebar, {
    dimensions: { width: 300, height: 180 },
  });
}

async function onDeactivate(plugin: ReactRNPlugin) {}

declareIndexPlugin(onActivate, onDeactivate);
