/*
 * Basic no frills app which integrates the ZBar barcode scanner with
 * the camera.
 * 
 * Created by lisah0 on 2012-02-24
 */
package net.sourceforge.zbar.android.CameraTest;

import net.sourceforge.zbar.android.CameraTest.CameraPreview;
import net.sourceforge.zbar.android.CameraTest.R;
import net.sourceforge.zbar.android.util.WSExecutionClient;

import java.util.ArrayList;


import android.app.ProgressDialog;

import android.os.AsyncTask;

import android.app.Activity;
import android.app.AlertDialog;

import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.os.Handler;

import android.util.Log;
import android.view.View;
import android.view.View.OnClickListener;

import android.widget.FrameLayout;
import android.widget.Button;

import android.hardware.Camera;
import android.hardware.Camera.PreviewCallback;
import android.hardware.Camera.AutoFocusCallback;

import android.hardware.Camera.Size;
import android.net.Uri;
import android.widget.TextView;
/* Import ZBar Class files */
import net.sourceforge.zbar.ImageScanner;
import net.sourceforge.zbar.Image;
import net.sourceforge.zbar.Symbol;
import net.sourceforge.zbar.SymbolSet;
import net.sourceforge.zbar.Config;

public class CameraTestActivity extends Activity {  
	private Camera mCamera;
	private CameraPreview mPreview;
	private Handler autoFocusHandler;
	public WSExecutionClient client;

	TextView scanText;
	Button scanButton;

	ImageScanner scanner;  
	public String phyloTree = "";
  
	private boolean barcodeScanned = false;
	private boolean previewing = true;
	ProgressDialog progressDialog;
	String qr_code_id = "";

	static {
		System.loadLibrary("iconv");
	}


	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		setContentView(R.layout.main);

		setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);

		autoFocusHandler = new Handler();
		mCamera = getCameraInstance();

		/* Instance barcode scanner */
		scanner = new ImageScanner();
		scanner.setConfig(0, Config.X_DENSITY, 3);
		scanner.setConfig(0, Config.Y_DENSITY, 3);

		mPreview = new CameraPreview(this, mCamera, previewCb, autoFocusCB);
		FrameLayout preview = (FrameLayout) findViewById(R.id.cameraPreview);
		preview.addView(mPreview);  

		scanText = (TextView) findViewById(R.id.scanText);

		scanButton = (Button) findViewById(R.id.ScanButton);

		scanButton.setOnClickListener(new OnClickListener() {
			public void onClick(View v) {
				if (barcodeScanned) {
					try {
						barcodeScanned = false;
						scanText.setText("Please move QR Code into Screen and keep stable.");
						mCamera.setPreviewCallback(previewCb);
						mCamera.startPreview();
						previewing = true;
						mCamera.autoFocus(autoFocusCB);
					} catch (Exception $ex) {
						
					}
				}
			}
		});
	}

	public void onPause() {
		super.onPause();
		releaseCamera();
	}

	/** A safe way to get an instance of the Camera object. */
	public static Camera getCameraInstance() {
		Camera c = null;
		try {
			c = Camera.open();
		} catch (Exception e) {
		}
		return c;
	}

	private void releaseCamera() {
		if (mCamera != null) {
			previewing = false;
			mCamera.setPreviewCallback(null);
			mCamera.release();
			mCamera = null;
		}
	}

	private Runnable doAutoFocus = new Runnable() {
		public void run() {
			if (previewing)
				mCamera.autoFocus(autoFocusCB);
		}
	};

	PreviewCallback previewCb = new PreviewCallback() {
		
		public void onPreviewFrame(byte[] data, Camera camera) {
			Camera.Parameters parameters = camera.getParameters();
			Size size = parameters.getPreviewSize();

			Image barcode = new Image(size.width, size.height, "Y800");
			barcode.setData(data);
			//String phyloTree = "";
			int result = scanner.scanImage(barcode);

			if (result != 0) {
				previewing = false;
				mCamera.setPreviewCallback(null);
				mCamera.stopPreview();

				SymbolSet syms = scanner.getResults();
				for (Symbol sym : syms) {
					qr_code_id = sym.getData();
					Log.i("QR code content", qr_code_id.toString());
					
					try {
						AlertDialog.Builder builder1 = new AlertDialog.Builder(CameraTestActivity.this);
						builder1.setTitle("QRCode Content");
						builder1.setMessage(qr_code_id.toString());
						builder1.setPositiveButton("OK",
								new DialogInterface.OnClickListener() {
									public void onClick(DialogInterface dialog, int which) {
										   
										  class ProgressTask extends AsyncTask<String, Void, Boolean> {
											  
											    private ProgressDialog dialog;

												public ProgressTask(CameraTestActivity activity) {
													dialog = new ProgressDialog(CameraTestActivity.this);
												}

												@Override
												protected void onPreExecute() {
													dialog.getWindow().setBackgroundDrawable(
															new ColorDrawable(0));
													dialog.setProgressStyle(ProgressDialog.STYLE_SPINNER);
													dialog.setIndeterminate(true);
													dialog.setCancelable(true);
													dialog.setMessage("Please wait");
													dialog.show();
												}
												@Override
												protected Boolean doInBackground(String... params) {
													try {
														//Log.i("Chay vao day", "Chay vao day");
														ArrayList<String> lstParams = new ArrayList<String>();
														lstParams.add(qr_code_id);
														client = new WSExecutionClient("http://128.123.177.21:5003/WSExecution/runWSFunctionWithWSDL_json", "http://128.123.177.13/WSRegistry/sites/default/files/wsdl/usecase2_workflow1_text.wsdl", lstParams, "getPhylogeneticTree");
														phyloTree = client.sendPost();
														return true;
													} catch (Exception ex){
														return false;
													}
												}
												
												@Override
												protected void onPostExecute(Boolean result) {
													if (dialog != null) {
														try {
															dialog.dismiss();
															AlertDialog.Builder builder = new AlertDialog.Builder(CameraTestActivity.this);
															builder.setTitle("Newick Tree");
															builder.setMessage(phyloTree);
															builder.setNegativeButton("Cancel",
																	new DialogInterface.OnClickListener() {
																		public void onClick(DialogInterface dialog, int which) {
																			barcodeScanned = false;
																			scanText.setText("Scanning,Please wait...");
																			mCamera.setPreviewCallback(previewCb);
																			mCamera.startPreview();
																			previewing = true;
																			mCamera.autoFocus(autoFocusCB);
																		}
																	});
															builder.setPositiveButton("View",
																	new DialogInterface.OnClickListener() {
																		public void onClick(DialogInterface dialog, int which) {
																			Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse("http://128.123.177.13/Phylotastic_DisplayTree_Project/display_tree.html?uri=&tree_data=" + phyloTree + "&format=newick_text"));
																			startActivity(browserIntent);
																		}
															});
															builder.show();
														} catch (Exception e) {

														}

													}
												}  
											  
										  }
										  
										   /*
										   ArrayList<String> params = new ArrayList<String>();
										   params.add(qr_code_id);
										   client = new WSExecutionClient("http://128.123.177.21:5003/WSExecution/runWSFunctionWithWSDL_json", "http://128.123.177.13/WSRegistry/sites/default/files/wsdl/usecase2_workflow1_text.wsdl", params, "getPhylogeneticTree");
										   phyloTree = client.sendPost();
										   */
										  
										   new ProgressTask(CameraTestActivity.this).execute();
										    /*
											AlertDialog.Builder builder = new AlertDialog.Builder(CameraTestActivity.this);
											builder.setTitle("Newick Tree");
											builder.setMessage(phyloTree);
											builder.setNegativeButton("Cancel",
													new DialogInterface.OnClickListener() {
														public void onClick(DialogInterface dialog, int which) {
															barcodeScanned = false;
															scanText.setText("Scanning,Please wait...");
															mCamera.setPreviewCallback(previewCb);
															mCamera.startPreview();
															previewing = true;
															mCamera.autoFocus(autoFocusCB);
														}
													});
											builder.setPositiveButton("View",
													new DialogInterface.OnClickListener() {
														public void onClick(DialogInterface dialog, int which) {
															Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse("http://128.123.177.13/Phylotastic_DisplayTree_Project/display_tree.html?uri=&tree_data=" + phyloTree + "&format=newick_text"));
															startActivity(browserIntent);
														}
											});
											builder.show();
											*/
									}
						});
						builder1.show();

					} catch (Exception e) {
						// TODO Auto-generated catch block
						e.printStackTrace();  
					}
					barcodeScanned = true;
				}
			}
		}

	};

	// Mimic continuous auto-focusing
	AutoFocusCallback autoFocusCB = new AutoFocusCallback() {
		public void onAutoFocus(boolean success, Camera camera) {
			autoFocusHandler.postDelayed(doAutoFocus, 1000);
		}
	};
}
