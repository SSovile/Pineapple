package com.example.recipes;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.os.AsyncTask;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.Observer;
import androidx.navigation.Navigation;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.CheckBox;
import android.widget.ScrollView;
import android.widget.SearchView;
import android.widget.TextView;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.logging.Level;

public class HomeFragment extends Fragment{
    RecyclerView recyclerView, recyclerViewSearch;
    CustomRecyclerAdapter mAdapter,mAdapterSearch;
    RecyclerView.LayoutManager layoutManager,layoutManagerSearch;
    List<ProductUtils> productUtilsList,productUtilsListSearch;
    SearchView searchView;
    TextView txt_nothing,txt_recom;
    ScrollView scroll_recom,scroll_search;
    FirebaseFirestore db = FirebaseFirestore.getInstance();
    final String[][][] arr_result = {new String[1][1]};
    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.fragment_home, container, false);

        recyclerView = root.findViewById(R.id.recycleViewContainer);
        recyclerViewSearch = root.findViewById(R.id.recycleViewContainerSearch);
        searchView = root.findViewById(R.id.searchView);

        layoutManager = new LinearLayoutManager(getContext());
        layoutManagerSearch = new LinearLayoutManager(getContext());
        recyclerView.setLayoutManager(layoutManager);
        recyclerViewSearch.setLayoutManager(layoutManagerSearch);
        productUtilsList = new ArrayList<>();
        productUtilsListSearch = new ArrayList<>();
        txt_recom = root.findViewById(R.id.txt_recomended);
        scroll_recom = root.findViewById(R.id.scroll_recomended);
        scroll_search = root.findViewById(R.id.scroll_search);
        txt_nothing = root.findViewById(R.id.txt_nothing);

        recyclerViewSearch.addOnItemTouchListener(
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

        searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String query) {
                doSomething(query);
                return false;
            }
            @Override
            public boolean onQueryTextChange(String newText) {
                doSomething(newText);
                return true;
            }
        });
        db.collection("items").get().addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
            @Override
            public void onComplete(@NonNull Task<QuerySnapshot> task) {
                if (task.isSuccessful()) {
                    String[][] arr = new String[task.getResult().getDocuments().size()][3];
                    int i = 0;
                    for (QueryDocumentSnapshot document : task.getResult()) {
                        int finalI = i;
                        db.collection("items").document(document.getId()).get().addOnCompleteListener(new OnCompleteListener<DocumentSnapshot>() {
                            @Override
                            public void onComplete(@NonNull Task<DocumentSnapshot> task) {
                                if (task.isSuccessful()) {
                                    DocumentSnapshot document = task.getResult();
                                    arr[finalI][0] = document.getId();
                                    String[] sasd = document.getData().toString().replaceAll("[}{]", "").split("=");
                                    arr[finalI][1] = sasd[0];
                                    arr[finalI][2] = sasd[1];
//                                    listen.setValue("Changed value"+finalI);
                                    productUtilsList.add(new ProductUtils(document.getId(),sasd[0],sasd[1]));
                                    mAdapter = new CustomRecyclerAdapter(getContext(), productUtilsList);
                                    mAdapterSearch = new CustomRecyclerAdapter(getContext(), productUtilsListSearch);
                                    recyclerView.setAdapter(mAdapter);
                                }
                                if(finalI==task.getResult().getData().size()){
                                    arr_result[0] = arr;
                                }
                            }
                        });
                        i++;
                    }
                }
            }
        });
        return root;
    }
    void doSomething(String txt){
        if(searchView.getQuery().toString().equals("")){
            txt_nothing.setVisibility(View.INVISIBLE);
            scroll_search.setVisibility(View.INVISIBLE);
            txt_recom.setVisibility(View.VISIBLE);
            scroll_recom.setVisibility(View.VISIBLE);
        }else{
            if(scroll_search.getVisibility() == View.VISIBLE){
                txt_recom.setVisibility(View.INVISIBLE);
                scroll_recom.setVisibility(View.INVISIBLE);
                showFoundProducts(txt);
            }else {
                scroll_search.setVisibility(View.VISIBLE);
                txt_recom.setVisibility(View.INVISIBLE);
                scroll_recom.setVisibility(View.INVISIBLE);
                showFoundProducts(txt);
            }
        }
    }
    public void showFoundProducts(String text){
        productUtilsListSearch.clear();
        recyclerViewSearch.setAdapter(mAdapterSearch);
        for (int i=0;i<arr_result[0].length;i++){
            if(arr_result[0][i][1].toLowerCase().contains(text.toLowerCase())){
                productUtilsListSearch.add(new ProductUtils(arr_result[0][i][0],arr_result[0][i][1],arr_result[0][i][2]));
            }
        }
        if(productUtilsListSearch.isEmpty()){
            txt_nothing.setVisibility(View.VISIBLE);
        }else{
            txt_nothing.setVisibility(View.INVISIBLE);
            recyclerViewSearch.setAdapter(mAdapterSearch);
        }
    }
}