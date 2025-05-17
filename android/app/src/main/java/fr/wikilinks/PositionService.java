package fr.wikilinks;

import android.Manifest;
import android.app.Service;
import android.content.Intent;
import android.os.Binder;
import android.os.IBinder;

import androidx.annotation.Nullable;
import androidx.annotation.RequiresPermission;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;

public class PositionService extends Service {
    private final IBinder binder = new LocalBinder();
    private FusedLocationProviderClient fusedLocationClient;

    /** Binder pour que l’Activity puisse récupérer l’instance du service */
    public class LocalBinder extends Binder {
        public PositionService getService() {
            return PositionService.this;
        }
    }

    @Override
    public void onCreate() {
        super.onCreate();
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this);
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return binder;
    }

    /**
     * Récupère la dernière position et renvoie via callback  
     * (nécessite ACCESS_FINE_LOCATION)  
     */
    @RequiresPermission(Manifest.permission.ACCESS_FINE_LOCATION)
    public void requestLocation(LocationResultListener listener) {
        fusedLocationClient.getLastLocation()
                .addOnSuccessListener(location -> {
                    if (location != null) {
                        listener.onLocationResult(location.getLatitude(), location.getLongitude());
                    } else {
                        listener.onLocationError("Location unavailable");
                    }
                })
                .addOnFailureListener(e -> {
                    listener.onLocationError(e.getMessage());
                });
    }

    /** Interface de callback pour renvoyer le résultat à l'appelant */
    public interface LocationResultListener {
        void onLocationResult(double latitude, double longitude);
        void onLocationError(String errorMessage);
    }
}
