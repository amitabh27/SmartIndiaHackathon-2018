package edmt.dev.androidgridlayout;

/**
 * Created by Akshay on 28-03-2018.
 */

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

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;


import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.AppCompatTextView;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by Akshay on 24-03-2018.
 */

public class UserLoginActivity extends AppCompatActivity {

    private static final String TAG = "UserLoginActivity";
    private static final String URL_FOR_LOGIN = "http://busoccupancy.herokuapp.com/occupancy/";
    ProgressDialog progressDialog;
    private EditText loginInputEmail, loginInputPassword;
    private Button btnlogin;
    private ListView lv;
    private Button  btnLinkSignup;
    ArrayList<HashMap<String, String>> contactList;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_list);
        android.support.v7.app.ActionBar actionBar = getSupportActionBar();
        actionBar.setHomeButtonEnabled(true);
        actionBar.setDisplayHomeAsUpEnabled(true);
        contactList = new ArrayList<>();

        lv = (ListView) findViewById(R.id.list);
        //  = (TextView) findViewById(R.id.textViewLinkRegister);
        // Progress dialog
        progressDialog = new ProgressDialog(this);
        progressDialog.setCancelable(false);
       String  a = getIntent().getStringExtra("add_data");
        String b = getIntent().getStringExtra("mog_data");

                loginUser(a,b);


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
                    JSONObject jObj = new JSONObject(response);
                   // String error = jObj.getString("data");

                    //if (!error) {
                    String user = jObj.getJSONObject("data").getString("text");
                   //System.out.print(user);
                     //   String user = jObj.getString("data");
                        String route_id=user.substring(user.indexOf("bus")+4,user.indexOf("bus")+9);
                        String bus_stop=user.substring(user.indexOf("stop")+5,user.indexOf("is")-1);
                        String seats=user.substring(user.indexOf("is")+3,user.indexOf("is")+5);
                        String next_available=user.substring(user.indexOf("are")+4,user.indexOf("and")-1);
                        String next_next_available=user.substring(user.indexOf("and")+4,user.indexOf(".T"));

                        String f1,f2,f3;
                         System.out.println(user.indexOf(","));
                        f1=user.substring(user.indexOf("Rs")+3,user.indexOf(","));

                        f2=user.substring(user.indexOf(",")+1,user.lastIndexOf(','));
                        f3=user.substring(user.lastIndexOf(',')+1,user.lastIndexOf("for")-1);



                    System.out.println("route id :"+route_id);
                    System.out.println("bus stop : "+bus_stop);
                    System.out.println("seats : "+seats);
                    System.out.println("next available : " + next_available);
                    System.out.println("next next available :"+ next_next_available);
                    System.out.println("Adult :"+ f1);
                    System.out.println("Child :"+ f2);
                    System.out.println("Senior :"+ f3);




                    //contact.put("date",f);
               //     for(int i=1;i<separated.length;i++)
                 //   {

                        HashMap<String, String> contact = new HashMap<>();


                        // adding each child node to HashMap key => value
                        contact.put("routeid","Bus Id : " + route_id);
                    contact.put("busstop","Arriving at bus stop " + bus_stop);
                    contact.put("seats","Available seats : " + seats);
                    contact.put("nextavailable","Getting down on next stop : " + next_available);
                    contact.put("nextnextavailable","Getting down on next to next stop : " + next_next_available );
                    contact.put("adult","Adult fare : " + f1);
                    contact.put("child","Child fare : " + f2);
                    contact.put("senior","Senior citizen :" + f3);

                   // contact.put("busstop",bus_stop);
                    //contact.put("seats",seats);

                        // adding contact to contact list
                        contactList.add(contact);


                   // }

                      //  System.out.println(user);


                        Toast.makeText(getApplicationContext(),
                                "Hi" +user, Toast.LENGTH_LONG).show();


                   // ListAdapter adapter = new SimpleAdapter(
                     //       UserLoginActivity.this, contactList,
                       //     R.layout.list_item, new String[]{"routeid","busstop","seats","nextavailable","nextnextavailable","adult","child","senior"}, new int[]{R.id.routeid,R.id.busstop,R.id.seats,R.id.nextavailable,R.id.nextnextavailable,R.id.adult,R.id.child,R.id.senior});
                    CustomAdapter simpleAdapter = new CustomAdapter(UserLoginActivity.this,contactList, R.layout.list_item, new String[]{"routeid","busstop","seats","nextavailable","nextnextavailable","adult","child","senior"},new int[]{R.id.routeid,R.id.busstop,R.id.seats,R.id.nextavailable,R.id.nextnextavailable,R.id.adult,R.id.child,R.id.senior},email,password);//Create object and set the parameters for simpleAdapter
                    lv.setAdapter(simpleAdapter);//sets the adapter for listView
                   // lv.setAdapter(adapter);

                        //finish();
                    //} else {

                        String errorMsg = jObj.getString("error_msg");
                        Toast.makeText(getApplicationContext(),
                                errorMsg, Toast.LENGTH_LONG).show();
                    //}
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
                Intent  i = new Intent(UserLoginActivity.this,MainActivity.class);
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



