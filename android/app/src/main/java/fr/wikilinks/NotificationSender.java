package fr.wikilinks;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.os.Build;

import androidx.core.app.NotificationCompat;

import java.util.Random;

public class NotificationSender {
    private static final String CHANNEL_ID = "notification";
    private static final int NOTIF_ID = 1;
    public static void createNotificationChannel(Context ctx) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            CharSequence name = "Daily challenge";
            String desc = "Channel for daily 8 UTC challenge";
            int importance = NotificationManager.IMPORTANCE_HIGH;
            NotificationChannel ch = new NotificationChannel(CHANNEL_ID, name, importance);
            ch.setDescription(desc);
            NotificationManager nm = ctx.getSystemService(NotificationManager.class);
            nm.createNotificationChannel(ch);
        }
    }

    public static void showNotification(Context ctx) {
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
        String message = CATCHPHRASES[new Random().nextInt(CATCHPHRASES.length)];

        NotificationCompat.Builder b = new NotificationCompat.Builder(ctx, CHANNEL_ID)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle("Défi du jour")
                .setContentText(message)
                .setAutoCancel(true)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setDefaults(NotificationCompat.DEFAULT_ALL);

        NotificationManager nm = (NotificationManager) ctx.getSystemService(Context.NOTIFICATION_SERVICE);
        nm.notify(NOTIF_ID, b.build());
    }
}