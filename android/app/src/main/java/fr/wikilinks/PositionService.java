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

    /** Binder so that the activity can get the current instance */
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
     * Fetches the position
     * (Needs ACCESS_FINE_LOCATION)
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

    /** Callback interface to send back the result */
    public interface LocationResultListener {
        void onLocationResult(double latitude, double longitude);
        void onLocationError(String errorMessage);
    }
}
