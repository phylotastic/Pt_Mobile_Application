package edu.nmsu.cs.phylotastic.ocr;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.webkit.WebView;
import edu.nmsu.cs.phylotastic.ocr.R;

public class TreeViewerActivity extends Activity {
	private WebView webView;

	@SuppressLint("SetJavaScriptEnabled")
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.tree_viewer);
		webView = (WebView) findViewById(R.id.tree_viewer);
		webView.getSettings().setJavaScriptEnabled(true);
		webView.getSettings().setBuiltInZoomControls(true);
		
		/* Get Web Service data */
		Bundle extras = getIntent().getExtras(); 
		String treeViewWS = "";
		if (extras != null) {
		    treeViewWS = extras.getString("tree_view_web_service");
		    Log.i("Tree Data", treeViewWS);
		}
		
		/* End */
		
		webView.loadUrl(treeViewWS);
	}
}
