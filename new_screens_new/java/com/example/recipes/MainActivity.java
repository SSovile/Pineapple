package com.example.recipes;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.database.DataSetObserver;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;
import android.widget.Adapter;
import android.widget.CheckBox;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.navigation.Navigation;

import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthCredential;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.auth.GoogleAuthProvider;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;

import java.util.HashMap;
import java.util.Map;

public class MainActivity extends AppCompatActivity {

    public String[][] items = {
            {"ramen","Рамен","Пшеничне борошно, сіль, вода-кансуй, яйця"},
            {"pizza","Піца","Соус, сир, шинка, помідор, гриби"},
            {"lasania","Лазанья","М'ясний фарш, гриби, овочі, сир, масло"},
            {"borshch","Борщ","Картопля, буряк, цибуля, морква, чорнослив, гриби, томатна паста, олія"},
            {"vareniki","Вареники","Свинина, цибуля, олія, сіль, перець чорний мелений"},
            {"friedpotatoeswithmeat","Смажена картопля з м'ясом","Картопля, м'ясо"}
    };
    private static final String TAG = "GoogleActivity";
    private static final int RC_SIGN_IN = 9001;
    private FirebaseAuth mAuth;
    private GoogleSignInClient mGoogleSignInClient;
    FirebaseFirestore db = FirebaseFirestore.getInstance();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestIdToken("657788042776-cnr96bunj7p1k280rh1djrviujnbvkka.apps.googleusercontent.com")
                .requestEmail()
                .build();
        mGoogleSignInClient = GoogleSignIn.getClient(this, gso);
        mAuth = FirebaseAuth.getInstance();
    }

    @Override
    public void onStart() {
        super.onStart();
        FirebaseUser currentUser = mAuth.getCurrentUser();
        updateUI(currentUser);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == RC_SIGN_IN) {
            Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(data);
            try {
                GoogleSignInAccount account = task.getResult(ApiException.class);
                Log.d(TAG, "firebaseAuthWithGoogle:" + account.getId());
                firebaseAuthWithGoogle(account.getIdToken());
            } catch (ApiException e) {
                Log.w(TAG, "Google sign in failed", e);
            }
        }
    }
    private void firebaseAuthWithGoogle(String idToken) {
        AuthCredential credential = GoogleAuthProvider.getCredential(idToken, null);
        mAuth.signInWithCredential(credential)
                .addOnCompleteListener(this, new OnCompleteListener<AuthResult>() {
                    @Override
                    public void onComplete(@NonNull Task<AuthResult> task) {
                        if (task.isSuccessful()) {
                            Log.d(TAG, "signInWithCredential:success");
                            FirebaseUser user = mAuth.getCurrentUser();
                            updateUI(user);
                        } else {
                            Log.w(TAG, "signInWithCredential:failure", task.getException());
                            updateUI(null);
                        }
                    }
                });
    }
    public void signIn() {
        Intent signInIntent = mGoogleSignInClient.getSignInIntent();
        startActivityForResult(signInIntent, RC_SIGN_IN);
    }
    private void updateUI(FirebaseUser user) {

    }
    public void navigationBtn(View view) {
        FirebaseUser user = FirebaseAuth.getInstance().getCurrentUser();
        if(view.getTag().equals("back")){
            View elem = findViewById(R.id.nav_host_fragment);
            Navigation.findNavController(elem).navigate(R.id.homeFragment);
        }else if(view.getTag().equals("wishlist")) {
            if (user != null) {
                View elem = findViewById(R.id.nav_host_fragment);
                Navigation.findNavController(elem).navigate(R.id.wishlistFragment);
            }else{
                signIn();
            }
        } else if (view.getTag().equals("user")) {
            if(user != null){
                new AlertDialog.Builder(MainActivity.this)
                        .setTitle("Вийти?")
                        .setMessage("Вийти з акаунту?")
                        .setPositiveButton(android.R.string.yes, new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface dialog, int id) {
                                Intent intent = getIntent();
                                FirebaseAuth.getInstance().signOut();
                                finish();
                                startActivity(intent);
                            }
                        })
                        .setNegativeButton(android.R.string.cancel, null)
                        .show();
            }else{
                signIn();
            }
        }
    }
    public void addItem(View view){
        FirebaseUser user = FirebaseAuth.getInstance().getCurrentUser();
        if(user!=null){
            CheckBox cb = (CheckBox) view;
            if(cb.isChecked()){
                db.collection("items").document(cb.getTag().toString()).get().addOnCompleteListener(new OnCompleteListener<DocumentSnapshot>() {
                    @Override
                    public void onComplete(@NonNull Task<DocumentSnapshot> task) {
                        if (task.isSuccessful()) {
                            DocumentSnapshot document = task.getResult();
                            Map<String, Object> data = new HashMap<>();
                            String[] a = document.getData().toString().replaceAll("[}{]","").split("=");
                            data.put(a[0],a[1]);
                            db.collection("favorites").document("items").collection(user.getUid())
                                    .document(cb.getTag().toString()).set(data);
                        }
                    }
                });
            }else{
                db.collection("favorites").document("items").collection(user.getUid())
                        .document(cb.getTag().toString()).delete();
            }
        }else{
            signIn();
        }
    }
}