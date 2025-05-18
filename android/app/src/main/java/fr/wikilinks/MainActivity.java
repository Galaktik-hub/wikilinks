package fr.wikilinks;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.ComponentName;
import android.content.Intent;
import android.content.ServiceConnection;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.os.IBinder;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;

import androidx.activity.EdgeToEdge;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.work.ExistingPeriodicWorkPolicy;
import androidx.work.PeriodicWorkRequest;
import androidx.work.WorkManager;

import org.json.JSONObject;

import java.util.Calendar;
import java.util.Locale;
import java.util.TimeZone;
import java.util.concurrent.TimeUnit;

public class MainActivity extends AppCompatActivity {
    private WebView webView;
    private PositionService positionService;
    private boolean serviceBound = false;

    private final ActivityResultLauncher<String[]> locationPermissionRequest =
            registerForActivityResult(new ActivityResultContracts.RequestMultiplePermissions(), result -> {
                Boolean fine = null;
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                    fine = result.getOrDefault(Manifest.permission.ACCESS_FINE_LOCATION, false);
                }
                Boolean coarse = null;
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                    coarse = result.getOrDefault(Manifest.permission.ACCESS_COARSE_LOCATION, false);
                }
                if (Boolean.TRUE.equals(fine)) {
                    // OK for precise location
                } else if (Boolean.TRUE.equals(coarse)) {
                    // Only coarse
                } else {
                    // Refused
                    Log.w("[WikiLinks]", "Location permission denied");
                }
            });

    private final ServiceConnection connection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName name, IBinder binder) {
            PositionService.LocalBinder lb = (PositionService.LocalBinder) binder;
            positionService = lb.getService();
            serviceBound = true;
        }
        @Override
        public void onServiceDisconnected(ComponentName name) {
            serviceBound = false;
            positionService = null;
        }
    };

    private final ActivityResultLauncher<String> notifPermissionRequest =
            registerForActivityResult(new ActivityResultContracts.RequestPermission(), granted -> {
                if (granted) {
                    scheduleDailyWork();
                } else {
                    Log.w("[WikiLinks]", "Notification permission denied");
                }
            });

    private long computeInitialDelayTo8UTC() {
        Calendar nowUtc = Calendar.getInstance(TimeZone.getTimeZone("UTC"));
        Calendar next8 = (Calendar) nowUtc.clone();
        next8.set(Calendar.HOUR_OF_DAY, 8);
        next8.set(Calendar.MINUTE, 0);
        next8.set(Calendar.SECOND, 0);
        next8.set(Calendar.MILLISECOND, 0);

        if (nowUtc.after(next8)) {
            next8.add(Calendar.DAY_OF_YEAR, 1);
        }
        return next8.getTimeInMillis() - nowUtc.getTimeInMillis();
    }

    private void scheduleDailyWork() {
        long initialDelay = computeInitialDelayTo8UTC();

        PeriodicWorkRequest dailyWork =
                new PeriodicWorkRequest.Builder(DailyNotificationWorker.class, 1, TimeUnit.DAYS)
                        .setInitialDelay(initialDelay, TimeUnit.MILLISECONDS)
                        .build();

        WorkManager.getInstance(this)
                .enqueueUniquePeriodicWork(
                        "daily-notif-work",
                        ExistingPeriodicWorkPolicy.REPLACE,
                        dailyWork
                );
    }

    @SuppressLint({"SetJavaScriptEnabled"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main);
        AndroidBug5497Workaround.assistActivity(this);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });
        Intent svcIntent = new Intent(this, PositionService.class);
        bindService(svcIntent, connection, BIND_AUTO_CREATE);

        // Entry point to save the notification intent
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            notifPermissionRequest.launch(Manifest.permission.POST_NOTIFICATIONS);
        } else {
            scheduleDailyWork();
        }

        locationPermissionRequest.launch(new String[] {
                Manifest.permission.ACCESS_FINE_LOCATION,
                Manifest.permission.ACCESS_COARSE_LOCATION
        });

        webView = findViewById(R.id.webview);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setDomStorageEnabled(true);
        webView.getSettings().setDatabaseEnabled(true);

        webView.addJavascriptInterface(new JavaScriptObject(), "AndroidApp");
        webView.loadUrl(BuildConfig.WEBVIEW_URL);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (serviceBound) {
            unbindService(connection);
        }
    }

    class JavaScriptObject {
        @JavascriptInterface
        public void hello() {
            Log.i("[WikiLinks]", "Hello !");
        }

        @JavascriptInterface
        public void requestLocation() {
            if (!serviceBound) return;

            // Vérifie la permission runtime
            if (ActivityCompat.checkSelfPermission(
                    MainActivity.this, Manifest.permission.ACCESS_FINE_LOCATION
            ) != PackageManager.PERMISSION_GRANTED) {
                Log.w("[WikiLinks]", "No location permission");
                return;
            }

            // Appel asynchrone du service
            positionService.requestLocation(new PositionService.LocationResultListener() {
                @Override
                public void onLocationResult(double lat, double lon) {
                    String js = String.format(Locale.US,
                            "window.onLocationReceived({ latitude: %f, longitude: %f });",
                            lat, lon
                    );
                    webView.post(() -> webView.evaluateJavascript(js, null));
                }
                @Override
                public void onLocationError(String errorMessage) {
                    String js = String.format(Locale.US,
                            "window.onLocationError(%s);",
                            JSONObject.quote(errorMessage)
                    );
                    webView.post(() -> webView.evaluateJavascript(js, null));
                }
            });
        }
    }
}
