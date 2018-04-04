package edmt.dev.androidgridlayout;

import android.content.Intent;
import android.graphics.Color;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.CardView;
import android.view.View;
import android.widget.GridLayout;
import android.widget.GridView;
import android.widget.LinearLayout;
import android.widget.Toast;

public class MainActivity extends AppCompatActivity {

    CardView mycard, mycard1, mycard2, mycard3;
    Intent i, i1, i2, i3;
    LinearLayout ll;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        android.support.v7.app.ActionBar actionBar = getSupportActionBar();
        actionBar.hide();
       /// ll = (LinearLayout) findViewById(R.id.ll);
        mycard = (CardView) findViewById(R.id.timetablecardId);
        mycard1 = (CardView) findViewById(R.id.statuscardId);
        mycard2 = (CardView) findViewById(R.id.FeedbackcardId);
        mycard3 = (CardView) findViewById(R.id.helpcardId);

        i = new Intent(MainActivity.this, FareCalculator.class);
        mycard.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(i);
            }
        });
        i1 = new Intent(MainActivity.this, Travel.class);
        mycard1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(i1);
            }
        });
        i2 = new Intent(MainActivity.this, FeedBackActivity.class);
        mycard2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(i2);
            }
        });
        i3 = new Intent(MainActivity.this, HelpActivity.class);
        mycard3.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(i3);
            }
        });


    }


}
