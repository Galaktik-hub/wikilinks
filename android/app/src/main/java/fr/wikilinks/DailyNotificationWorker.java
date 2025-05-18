package fr.wikilinks;

import android.Manifest;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;

import androidx.annotation.NonNull;
import androidx.core.app.NotificationCompat;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import java.util.Random;

public class DailyNotificationWorker extends Worker {
    private static final String CHANNEL_ID = "daily_notif_channel";
    private static final int NOTIF_ID = 2001;

    public DailyNotificationWorker(@NonNull Context context,
                                   @NonNull WorkerParameters params) {
        super(context, params);
    }

    @NonNull
    @Override
    public Result doWork() {
        Context ctx = getApplicationContext();

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU
                && ctx.checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS)
                != PackageManager.PERMISSION_GRANTED) {
            return Result.retry();
        }

        createNotificationChannel(ctx);

        Intent launchApp = new Intent(ctx, MainActivity.class);
        PendingIntent pi = PendingIntent.getActivity(
                ctx, 0, launchApp,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        final String[] CATCHPHRASES = {
                "Venez affronter les joueurs du monde entier sur le challenge du jour !",
                "Prêt pour votre dose quotidienne de défi ? C’est parti !",
                "Le défi du jour vous attend… Relèverez-vous le challenge ?",
                "Nouveau challenge disponible : montrez ce que vous valez !",
                "Chaque jour, un nouveau défi. Aujourd’hui, c’est le vôtre !",
                "Défiez vos amis sur l’article du jour : rejoignez la compétition !",
                "Êtes-vous prêt à conquérir l’article mystère du jour ?",
                "Le défi quotidien est lancé. Allez-vous relever le gant ?",
                "Chaque jour un nouveau challenge… et aujourd’hui, c’est le vôtre !",
                "Le challenge du jour est en ligne : à vous de jouer !",
                "Qui sera le meilleur sur le défi d’aujourd’hui ? C’est votre tour !",
                "Défi journalier actif : prouvez votre talent sur l’article du jour !",
                "C’est l’heure du challenge quotidien : attrape-z votre titre !",
                "Nouveau défi en ligne : saurez-vous trouver l’article avant les autres ?",
                "Prêt pour le challenge du jour ? Vous n’avez qu’une seule chance !",
                "Le défi d’aujourd’hui vous attend… et il promet d’être corsé !",
                "Challenge du jour : testez vos connaissances maintenant !",
                "Le défi quotidien bouscule vos habitudes : tentez votre chance !",
                "Défiez-vous sur l’article du jour et grimpez au classement !",
                "Votre nouveau défi est prêt : venez le découvrir dès maintenant !"
        };

        Random rnd = new Random();
        String message = CATCHPHRASES[rnd.nextInt(CATCHPHRASES.length)];

        NotificationCompat.Builder builder = new NotificationCompat.Builder(ctx, CHANNEL_ID)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle("Défi du jour")
                .setContentText(message)
                .setContentIntent(pi)
                .setAutoCancel(true)
                .setPriority(NotificationCompat.PRIORITY_DEFAULT);

        NotificationManager nm = (NotificationManager) ctx.getSystemService(Context.NOTIFICATION_SERVICE);
        nm.notify(NOTIF_ID, builder.build());

        return Result.success();
    }

    private void createNotificationChannel(Context ctx) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            CharSequence name = "Daily notifications";
            String description = "Channel for daily notifications at 08:00 UTC";
            int importance = NotificationManager.IMPORTANCE_DEFAULT;
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, name, importance);
            channel.setDescription(description);
            NotificationManager nm = ctx.getSystemService(NotificationManager.class);
            nm.createNotificationChannel(channel);
        }
    }
}
