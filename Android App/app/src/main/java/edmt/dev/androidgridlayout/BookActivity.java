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
import android.widget.RadioGroup;
import android.widget.SimpleAdapter;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;

public class BookActivity extends AppCompatActivity {

    private static final String TAG = "BookActivity";
    private static final String URL_FOR_LOGIN = "http://busoccupancy.herokuapp.com/validatedetails/";
   // ProgressDialog progressDialog;

    private EditText signupInputName, signupInputEmail, signupInputPassword,signupInputRePassword, signupInputPersonid,signupInputAmount;
    private Button btnSignUp;
    private Button btnLinkLogin;
    private RadioGroup genderRadioGroup;
    String a=null;
    String b=null;
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_book);
        android.support.v7.app.ActionBar actionBar = getSupportActionBar();
        actionBar.setHomeButtonEnabled(true);
        actionBar.setDisplayHomeAsUpEnabled(true);

        signupInputName = (EditText) findViewById(R.id.textInputEditTextName);
        signupInputEmail = (EditText) findViewById(R.id.textInputEditTextMobile);
        signupInputPassword = (EditText) findViewById(R.id.textInputEditTextCardNo);
        signupInputRePassword = (EditText) findViewById(R.id.textInputEditTextCVV);
        signupInputPersonid = (EditText) findViewById(R.id.textInputEditTextExpiry);
        signupInputAmount = (EditText) findViewById(R.id.textInputEditTextAmount);
         a = getIntent().getStringExtra("source");
        b = getIntent().getStringExtra("destination");

        btnSignUp = (Button) findViewById(R.id.appCompatButtonBook);
        btnSignUp.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
              System.out.println(a+b+signupInputName.getText().toString()+signupInputEmail.getText().toString());
               loginUser(a,b,signupInputName.getText().toString(), signupInputEmail.getText().toString(),signupInputPassword.getText().toString(),signupInputRePassword.getText().toString(), signupInputPersonid.getText().toString(),signupInputAmount.getText().toString());
            }
        });

    }
        private void loginUser( final String source, final String destination,final String name,final String mobilenumber,final String cardno,final String cvv,final String expiry,final String amount  ) {
            // Tag used to cancel the request
            String cancel_req_tag = "login";
           // progressDialog.setMessage("Fetching Data...");
            //showDialog();
            String abc=URL_FOR_LOGIN+name+"/"+mobilenumber+"/"+cardno+"/"+cvv+"/"+expiry+"/"+amount;

            StringRequest strReq = new StringRequest(Request.Method.GET,
                    abc, new Response.Listener<String>() {

                @Override
                public void onResponse(String response) {
                    Log.d(TAG, "Register Response: " + response.toString());
                   // hideDialog();
                    try {
                        //  loginInputEmail.setText(response.toString());
                        JSONArray jObj = new JSONArray(response);
                        // String error = jObj.getString("data");

                        //if (!error) {
                        //JSONObject jObj = new JSONObject(response);

                        JSONObject user = jObj.getJSONObject(0);
                          String res = user.getString("status");
                          if(res.equalsIgnoreCase("success")) {
                              Intent intent = new Intent(BookActivity.this, OTPActivity.class);

                              intent.putExtra("source", source);
                              intent.putExtra("destination", destination);
                              intent.putExtra("mobileno", mobilenumber);
                              startActivity(intent);
                          }



                    } catch (JSONException e) {
                        e.printStackTrace();
                    }

                }
            }, new Response.ErrorListener() {

                @Override
                public void onErrorResponse(VolleyError error) {
                    Log.e(TAG, "Payment Error: " + error.getMessage());
                    Toast.makeText(getApplicationContext(),
                            error.getMessage(), Toast.LENGTH_LONG).show();
                    //hideDialog();
                }
            }) {



            };
            // Adding request to request queue
            AppSingleton.getInstance(getApplicationContext()).addToRequestQueue(strReq,cancel_req_tag);
        }

     /*   private void showDialog() {
            if (!progressDialog.isShowing())
                progressDialog.show();
        }
        private void hideDialog() {
            if (progressDialog.isShowing())
                progressDialog.dismiss();
        }
        */
        @Override
        public boolean onOptionsItemSelected(MenuItem item) {
            switch (item.getItemId()) {
                case android.R.id.home:
                    //Write your logic here
                    Intent  i = new Intent(BookActivity.this,MainActivity.class);
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
