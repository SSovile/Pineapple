package com.example.recipes;

import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ScrollView;
import android.widget.SearchView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.Observer;
import androidx.navigation.Navigation;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class FavoriteFragment extends Fragment {
    RecyclerView recyclerView;
    RecyclerView.Adapter mAdapter;
    RecyclerView.LayoutManager layoutManager;
    List<ProductUtils> productUtilsList;
    FirebaseFirestore db = FirebaseFirestore.getInstance();
    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.fragment_favorite, container, false);
        recyclerView = root.findViewById(R.id.recycleViewContainer1);
        layoutManager = new LinearLayoutManager(getContext());
        recyclerView.setLayoutManager(layoutManager);
        productUtilsList = new ArrayList<>();
        FirebaseUser user = FirebaseAuth.getInstance().getCurrentUser();
        recyclerView.addOnItemTouchListener(
                new RecyclerItemClickListener(getContext(), recyclerView ,new RecyclerItemClickListener.OnItemClickListener() {
                    @Override public void onItemClick(View view, int position) {
                        TextView txt = view.findViewById(R.id.pNametxt);
                        TextView txt1 = view.findViewById(R.id.pJobProfiletxt);

                        View elem = getActivity().findViewById(R.id.nav_host_fragment);
                        Bundle bundle = new Bundle();
                        bundle.putString("title", txt.getText().toString());
                        bundle.putString("description", txt1.getText().toString());
                        bundle.putString("image",txt.getTag().toString());
                        Navigation.findNavController(elem).navigate(R.id.viewItemFragment,bundle);
                    }

                    @Override
                    public void onLongItemClick(View view, int position) {

                    }
                })
        );
        db.collection("favorites").document("items").collection(user.getUid()).get().addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
            @Override
            public void onComplete(@NonNull Task<QuerySnapshot> task) {
                if (task.isSuccessful()) {
                    if(task.getResult().getDocuments().isEmpty()){
                        root.findViewById(R.id.txt_nothing).setVisibility(View.VISIBLE);
                    }else{
                        int i = 0;
                        for (QueryDocumentSnapshot document : task.getResult()) {
                            db.collection("favorites").document("items").collection(user.getUid()).document(document.getId()).get().addOnCompleteListener(new OnCompleteListener<DocumentSnapshot>() {
                                @Override
                                public void onComplete(@NonNull Task<DocumentSnapshot> task) {
                                    if (task.isSuccessful()) {
                                        DocumentSnapshot document = task.getResult();
                                        String[] sasd = document.getData().toString().replaceAll("[}{]", "").split("=");
                                        productUtilsList.add(new ProductUtils(document.getId(),sasd[0],sasd[1]));
                                        mAdapter = new CustomRecyclerAdapter(getContext(), productUtilsList);
                                        recyclerView.setAdapter(mAdapter);
                                    }
                                }
                            });
                        }
                    }
                }
            }
        });
        return root;
    }
}