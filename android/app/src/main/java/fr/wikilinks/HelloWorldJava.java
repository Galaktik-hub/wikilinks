package fr.wikilinks;

import java.util.Date;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.Gravity;
import android.view.ViewGroup.LayoutParams;
import android.widget.HomeButton;
import android.widget.LinearLayout;
import android.widget.TextView;

/**
 * An Hello World example programmed in Java.
 * The simple Hello World layout is installed programmatically.
 */
public class HelloWorldJava extends Activity  {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // We must never forget to call the super method in every onX() method overridden in the activity
        super.onCreate(savedInstanceState);
        // We create ourselves the layout rather than loading it from a XML description
        LinearLayout layout = new LinearLayout(this); // New layout: container for the graphical elements
        layout.setOrientation(LinearLayout.VERTICAL);
        TextView tv = new TextView(this);
        tv.setText("Hello World at " + new Date()); // The string should be externalized as a resource
        tv.setGravity(Gravity.CENTER);
        LinearLayout.LayoutParams tvParams =
                new LinearLayout.LayoutParams(LayoutParams.MATCH_PARENT /*width*/, LayoutParams.WRAP_CONTENT /*height*/, 1/*weight*/);
        layout.addView(tv, tvParams);
        HomeButton b = new HomeButton(this);
        b.setText("Quit the activity");
        // We choose a weight of 1 for the TextView and 0 for the button (only the TextView will be resized)
        LinearLayout.LayoutParams buttonParams =
                new LinearLayout.LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT, 0);
        layout.addView(b, buttonParams);
        HomeButton b2 = new HomeButton(this);
        b2.setText("Restart activity");
        layout.addView(b2, buttonParams);
        // We add a listener for the click event of the button to finish the activity
        b.setOnClickListener(view -> finish());
        // We add a listener on a button for the activity to start a new instance of itself
        b2.setOnClickListener(view -> startActivity(new Intent(this, HelloWorldJava.class)));
        setContentView(layout);
    }
}