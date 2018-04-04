package edmt.dev.androidgridlayout;

import android.app.ProgressDialog;
import android.content.Intent;
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

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;

/**
 * Created by Akshay on 30-03-2018.
 */

public class FeedBackActivity extends AppCompatActivity {


    private static final String TAG = "FeedBackActivity";
    private static final String URL_FOR_LOGIN = "http://busoccupancy.herokuapp.com/support/";
    ProgressDialog progressDialog;
    private EditText loginInputEmail, loginInputPassword,feedback;
    private Button btnlogin;
    private ListView lv;
    private Button  btnLinkSignup;

    ArrayList<HashMap<String, String>> contactList;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_feedback);
        android.support.v7.app.ActionBar actionBar = getSupportActionBar();
        actionBar.setHomeButtonEnabled(true);

        actionBar.setDisplayHomeAsUpEnabled(true);

        // Progress dialog
        progressDialog = new ProgressDialog(this);
        progressDialog.setCancelable(false);
        loginInputEmail = (EditText) findViewById(R.id.feedbackname);
        loginInputPassword = (EditText) findViewById(R.id.feedbackemail);
      feedback =(EditText)findViewById(R.id.EditTextFeedbackBody);

        btnLinkSignup = (Button) findViewById(R.id.feedbackbutton);



        btnLinkSignup.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                final String    a = loginInputPassword.getText().toString();
                final String  b = feedback.getText().toString();
                loginUser(b,a);
            }
        });




    }

    private void loginUser( final String email, final String password) {
        // Tag used to cancel the request
        String cancel_req_tag = "login";
        progressDialog.setMessage("Fetching Data...");
        showDialog();
        String abc=URL_FOR_LOGIN+email+"/"+password;
        StringRequest strReq = new StringRequest(Request.Method.GET,
                abc, new Response.Listener<String>() {

            @Override
            public void onResponse(String response) {
                Log.d(TAG, "Register Response: " + response.toString());
                hideDialog();
                try {
                    //  loginInputEmail.setText(response.toString());
                    JSONObject jsonObj = new JSONObject(response);

                     if(jsonObj!=null)
                     {

                         Toast.makeText(getApplicationContext(),
                                 "Sucessfully Submitted", Toast.LENGTH_LONG).show();


                         Intent i = new Intent(FeedBackActivity.this,MainActivity.class);
                         startActivity(i);

                     }
                    // Getting JSON Array node
                    //JSONArray contacts = jsonObj.getJSONArray("");

                    //if (!error) {



                   // Toast.makeText(getApplicationContext(),
                     //       user, Toast.LENGTH_LONG).show();




                } catch (JSONException e) {
                    e.printStackTrace();
                }

            }
        }, new Response.ErrorListener() {

            @Override
            public void onErrorResponse(VolleyError error) {
                Log.e(TAG, "Login Error: " + error.getMessage());
                Toast.makeText(getApplicationContext(),
                        error.getMessage(), Toast.LENGTH_LONG).show();
                Intent i = new Intent(FeedBackActivity.this,MainActivity.class);
                startActivity(i);
                hideDialog();
            }
        }) {



        };
        // Adding request to request queue
        AppSingleton.getInstance(getApplicationContext()).addToRequestQueue(strReq,cancel_req_tag);
    }

    private void showDialog() {
        if (!progressDialog.isShowing())
            progressDialog.show();
    }
    private void hideDialog() {
        if (progressDialog.isShowing())
            progressDialog.dismiss();
    }
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                //Write your logic here
                Intent i = new Intent(FeedBackActivity.this,MainActivity.class);
                startActivity(i);
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