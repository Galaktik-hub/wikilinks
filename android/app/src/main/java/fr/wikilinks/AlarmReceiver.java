package fr.wikilinks;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

public class AlarmReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        NotificationSender.showNotification(context);
        AlarmHelper.scheduleNext8Alarm(context);
    }
}
