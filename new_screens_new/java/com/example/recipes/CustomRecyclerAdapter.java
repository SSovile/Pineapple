package com.example.recipes;


import android.content.Context;
import android.content.res.Resources;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.CheckBox;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;

import java.util.List;


public class CustomRecyclerAdapter extends RecyclerView.Adapter<CustomRecyclerAdapter.ViewHolder> {

    private Context context;
    private List<ProductUtils> productUtils;

    public CustomRecyclerAdapter(Context context, List productUtils) {
        this.context = context;
        this.productUtils = productUtils;
    }

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.product_item, parent, false);
        ViewHolder viewHolder = new ViewHolder(v);
        return viewHolder;
    }

    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {
        holder.itemView.setTag(productUtils.get(position));
        ProductUtils pu = productUtils.get(position);
        Resources resources = context.getApplicationContext().getResources();
        final int resourceId = resources.getIdentifier(pu.getImageName(),
                "drawable", context.getPackageName());

        holder.iName.setImageResource(resourceId);
        holder.pName.setText(pu.getProductName());
        holder.pName.setTag(pu.getImageName());
        holder.cList.setText(pu.getComponentsList());
    }

    @Override
    public int getItemCount() {
        return productUtils.size();
    }

    public class ViewHolder extends RecyclerView.ViewHolder{

        public ImageView iName;
        public TextView pName;
        public TextView cList;

        public ViewHolder(View itemView) {
            super(itemView);

            iName = itemView.findViewById(R.id.productImage);
            pName = itemView.findViewById(R.id.pNametxt);
            cList = itemView.findViewById(R.id.pJobProfiletxt);
        }

    }

}