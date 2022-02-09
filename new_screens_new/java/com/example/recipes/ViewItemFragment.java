package com.example.recipes;

import android.content.res.Resources;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.CheckBox;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;

public class ViewItemFragment extends Fragment {
    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.fragment_view_item, container, false);

        TextView tv = root.findViewById(R.id.itemTitle);
        TextView tv1 = root.findViewById(R.id.itemDescription);
        ImageView img = root.findViewById(R.id.itemImage);
        CheckBox cb = root.findViewById(R.id.itemBox);
        tv.setText(getArguments().getString("title"));
        tv1.setText(getArguments().getString("description"));
        cb.setTag(getArguments().getString("image"));

        try{
            FirebaseFirestore.getInstance().collection("favorites").document("items")
                    .collection(FirebaseAuth.getInstance().getCurrentUser().getUid()).document(getArguments().getString("image"))
                    .get().addOnCompleteListener(new OnCompleteListener<DocumentSnapshot>() {
                @Override
                public void onComplete(@NonNull Task<DocumentSnapshot> task) {
                    if (task.isSuccessful()) {
                        DocumentSnapshot document = task.getResult();
                        if (document.exists()) {
                            cb.setChecked(true);
                        }
                    }
                }
            });
        }catch (Exception ignore){}


        Resources resources = getContext().getApplicationContext().getResources();
        final int resourceId = resources.getIdentifier(getArguments().getString("image"),
                "drawable", getContext().getPackageName());
        img.setImageResource(resourceId);

        return root;
    }
}