package edmt.dev.androidgridlayout;

import android.app.ProgressDialog;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListAdapter;
import android.widget.ListView;
import android.widget.SimpleAdapter;
import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;

/**
 * Created by Akshay on 27-03-2018.
 */

public class FareCalculator extends AppCompatActivity {

    private EditText loginInputEmail, loginInputPassword;
    private Button btnlogin;
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.farecal_activity);
        android.support.v7.app.ActionBar actionBar = getSupportActionBar();
        actionBar.setHomeButtonEnabled(true);
        actionBar.setDisplayHomeAsUpEnabled(true);
        loginInputEmail = (EditText) findViewById(R.id.textInputEditTextEmail);
        loginInputPassword = (EditText) findViewById(R.id.textInputEditTextPassword);
        btnlogin = (Button) findViewById(R.id.appCompatButtonLogin);

        btnlogin.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                //loginUser(loginInputEmail.getText().toString(),
                //      loginInputPassword.getText().toString());
                Intent intent = new Intent(getBaseContext(), Fetchfair.class);
                intent.putExtra("add_fare_data", loginInputEmail.getText().toString());
                intent.putExtra("mog_fare_data", loginInputPassword.getText().toString());
                startActivity(intent);
            }
        });

    }
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                //Write your logic here
                this.finish();
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }
    @Override
    public void onBackPressed()
    {

        //thats it
    }

}
