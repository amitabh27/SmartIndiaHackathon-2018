package edmt.dev.androidgridlayout;

import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.SimpleAdapter;
import android.widget.Toast;

import com.android.volley.Response;

import java.util.ArrayList;
import java.util.HashMap;

public class CustomAdapter extends SimpleAdapter {
    LayoutInflater inflater;
    Context context;
    ArrayList<HashMap<String, String>> arrayList;
   String source=null;
   String destination=null;
    public CustomAdapter(UserLoginActivity context, ArrayList<HashMap<String, String>> data, int resource, String[] from, int[] to,String source,String destination) {

        super(context, data, resource, from, to);
        this.source=source;
        this.destination=destination;
        this.context = context;
        this.arrayList = data;
        inflater.from(context);
    }

    @Override
    public View getView(final int position, View convertView, ViewGroup parent) {
        View view = super.getView(position, convertView, parent);
        Button btn = (Button)view.findViewById(R.id.bookticket);
        ///ImageView imageView = (ImageView) view.findViewById(R.id.imageView);
        btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                //Toast.makeText(context, arrayList.get(position).get("name"), Toast.LENGTH_SHORT).show();

                Intent intent = new Intent(context, BookActivity.class);

                intent.putExtra("source", source);
                intent.putExtra("destination", destination);
                        context.startActivity(intent);

            }
        });
        return view;
    }

}