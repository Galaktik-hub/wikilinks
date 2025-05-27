package fr.wikilinks;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.content.SharedPreferences;
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
import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import org.json.JSONObject;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneOffset;
import java.util.Locale;
import java.util.Map;

/**
 * MainActivity hosts the WebView and handles all permission requests
 * as well as binding to the Location service and scheduling daily notifications.
 */
public class MainActivity extends AppCompatActivity {

    private WebView webView;
    private PositionService positionService;
    private boolean serviceBound = false;

    private final ActivityResultLauncher<String> notificationPermissionRequest =
            registerForActivityResult(
                    new ActivityResultContracts.RequestPermission(),
                    this::onNotificationPermissionResult
            );

    private final ActivityResultLauncher<String[]> locationPermissionRequest =
            registerForActivityResult(
                    new ActivityResultContracts.RequestMultiplePermissions(),
                    this::onLocationPermissionsResult
            );

    // ------------------------------------------------------------------------------------------------
    // Lifecycle
    // ------------------------------------------------------------------------------------------------

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main);
        AndroidBug5497Workaround.assistActivity(this);
        applyEdgeToEdgePadding();
        NotificationSender.createNotificationChannel(this);

        bindPositionService();
        askPermissions();
        AlarmHelper.scheduleNext8Alarm(this);

        initializeWebView();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (serviceBound) {
            unbindService(connection);
        }
    }

    // ------------------------------------------------------------------------------------------------
    // Permission Handling
    // ------------------------------------------------------------------------------------------------

    /**
     * Starts the permission request flow:
     * (1) Notifications on Android 13+, then
     * (2) Location permissions.
     */
    private void askPermissions() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            requestNotificationPermission();
        } else {
            // Pre-Android 13: skip notification prompt and schedule work immediately
            requestLocationPermissions();
        }
    }

    /** Requests POST_NOTIFICATIONS (Android 13+). */
    @RequiresApi(api = Build.VERSION_CODES.TIRAMISU)
    private void requestNotificationPermission() {
        notificationPermissionRequest.launch(Manifest.permission.POST_NOTIFICATIONS);
    }

    /**
     * Callback invoked after notification permission is granted or denied.
     *
     * @param granted whether the user granted notification permission
     */
    private void onNotificationPermissionResult(boolean granted) {
        if (!granted) {
            Log.w("[WikiLinks]", "Notification permission denied");
        }
        // Proceed to location permissions regardless of outcome
        requestLocationPermissions();
    }

    /** Requests ACCESS_FINE_LOCATION and ACCESS_COARSE_LOCATION together. */
    private void requestLocationPermissions() {
        locationPermissionRequest.launch(new String[] {
                Manifest.permission.ACCESS_FINE_LOCATION,
                Manifest.permission.ACCESS_COARSE_LOCATION
        });
    }

    /**
     * Callback invoked after location permissions are handled.
     *
     * @param result map of permission names to grant results
     */
    private void onLocationPermissionsResult(Map<String, Boolean> result) {
        boolean fine = false;
        boolean coarse = false;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            fine = Boolean.TRUE.equals(result.getOrDefault(
                        Manifest.permission.ACCESS_FINE_LOCATION,
                        false
                    ));
            coarse = Boolean.TRUE.equals(result.getOrDefault(
                        Manifest.permission.ACCESS_COARSE_LOCATION,
                        false
                    ));
        }

        if (fine) {
            Log.i("[WikiLinks]", "Fine location granted");
        } else if (coarse) {
            Log.i("[WikiLinks]", "Coarse location granted");
        } else {
            Log.w("[WikiLinks]", "Location permission denied");
        }
    }

    // ------------------------------------------------------------------------------------------------
    // Position Service Binding
    // ------------------------------------------------------------------------------------------------

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

    /**
     * Binds to the PositionService for location updates.
     */
    private void bindPositionService() {
        Intent svcIntent = new Intent(this, PositionService.class);
        bindService(svcIntent, connection, BIND_AUTO_CREATE);
    }

    // ------------------------------------------------------------------------------------------------
    // WebView Setup
    // ------------------------------------------------------------------------------------------------

    @SuppressLint("SetJavaScriptEnabled")
    private void initializeWebView() {
        webView = findViewById(R.id.webview);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setDomStorageEnabled(true);
        webView.addJavascriptInterface(new JavaScriptObject(), "AndroidApp");
        webView.loadUrl(BuildConfig.WEBVIEW_URL);
    }

    /**
     * Applies window insets padding for edge-to-edge UI.
     */
    private void applyEdgeToEdgePadding() {
        ViewCompat.setOnApplyWindowInsetsListener(
                findViewById(R.id.main),
                (v, insets) -> {
                    Insets bars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
                    v.setPadding(bars.left, bars.top, bars.right, bars.bottom);
                    return insets;
                }
        );
    }

    // ------------------------------------------------------------------------------------------------
    // JavaScript Interface
    // ------------------------------------------------------------------------------------------------

    /**
     * Exposes methods to JavaScript to communicate with the website.
     */
    class JavaScriptObject {
        @JavascriptInterface
        public void requestLocation() {
            if (!serviceBound) return;

            if (ActivityCompat.checkSelfPermission(
                    MainActivity.this,
                    Manifest.permission.ACCESS_FINE_LOCATION
            ) != PackageManager.PERMISSION_GRANTED) {
                Log.w("[WikiLinks]", "No location permission");
                return;
            }

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

        @JavascriptInterface
        public void getUsername() {
            // Retrieve username from SharedPreferences
            SharedPreferences prefs = MainActivity.this.getPreferences(Context.MODE_PRIVATE);
            String name = prefs.getString("username", "");
            String quoted = JSONObject.quote(name);
            String js = "window.onUsernameReceived(" + quoted + ");";
            webView.post(() -> webView.evaluateJavascript(js, null));
        }

        @JavascriptInterface
        public void setUsername(String username) {
            SharedPreferences prefs = MainActivity.this.getPreferences(Context.MODE_PRIVATE);
            prefs.edit()
                    .putString("username", username)
                    .apply();
            String js = "window.onUsernameSaved();";
            webView.post(() -> webView.evaluateJavascript(js, null));
        }

        /**
         * To get the time window between today 8:00 UTC and tomorrow 8:00 UTC
         */
        private String getWindowDateKey() {
            LocalDate todayUtc = null;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                LocalTime nowUtc = LocalTime.now(ZoneOffset.UTC);
                todayUtc = LocalDate.now(ZoneOffset.UTC);
                if (nowUtc.isBefore(LocalTime.of(8, 0))) {
                    todayUtc = todayUtc.minusDays(1);
                }
            }
            return todayUtc == null ? "2025-01-01" : todayUtc.toString();
        }

        @JavascriptInterface
        public void setTodayChallengePlayed() {
            String key = "challenge-" + getWindowDateKey();
            SharedPreferences prefs = MainActivity.this.getPreferences(Context.MODE_PRIVATE);
            prefs.edit()
                    .putBoolean(key, true)
                    .apply();
        }

        @JavascriptInterface
        public void isTodayChallengePlayed() {
            String key = "challenge-" + getWindowDateKey();
            SharedPreferences prefs = MainActivity.this.getPreferences(Context.MODE_PRIVATE);
            String js = "window.onTodayChallengePlayed(" + prefs.getBoolean(key, false) + ");";
            webView.post(() -> webView.evaluateJavascript(js, null));
        }
    }
}
