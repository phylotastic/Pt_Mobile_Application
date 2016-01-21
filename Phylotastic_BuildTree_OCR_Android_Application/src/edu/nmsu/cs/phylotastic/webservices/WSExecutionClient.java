package edu.nmsu.cs.phylotastic.webservices;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.ArrayList;

import javax.net.ssl.HttpsURLConnection;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import android.content.Context;
import android.net.http.AndroidHttpClient;
import android.util.Log;
import android.widget.Toast;

public class  WSExecutionClient {
	private String WSExecutionURL;
	private String WSDL;
	private ArrayList<String> params;
	private String operationName;
	
	private final String USER_AGENT = "Mozilla/5.0";

	public WSExecutionClient(String wSExecutionURL, String wSDL, ArrayList<String> params, String operationName) {
		super();
		WSExecutionURL = wSExecutionURL;
		WSDL = wSDL;
		this.params = params;
		for(int i = 0 ; i < this.params.size() ; i++){
			String value = this.params.get(i);
			String standardValue = standardString(value);
			this.params.set(i, standardValue);
		}
		this.operationName = operationName;
	}
	public String getWSExecutionURL() {
		return WSExecutionURL;
	}
	public void setWSExecutionURL(String wSExecutionURL) {
		WSExecutionURL = wSExecutionURL;
	}
	public String getWSDL() {
		return WSDL;
	}
	public void setWSDL(String wSDL) {
		WSDL = wSDL;
	}
	public ArrayList<String> getParams() {
		return params;
	}
	public void setParams(ArrayList<String> params) {
		this.params = params;
	}
	public String getOperationName() {
		return operationName;
	}
	public void setOperationName(String operationName) {
		this.operationName = operationName;
	}
	
	private static String standardString(String s){
		s = s.replaceAll("\"", " ");
		s = s.replaceAll("\'", " ");
		s = s.replaceAll("'", " ");
		s = s.replaceAll("[^\\x00-\\x7F]", "");
		return s;
	}
	
	public String sendPost() {
		try{
			String url = this.WSExecutionURL;
			@SuppressWarnings("deprecation")
			DefaultHttpClient httpClient = new DefaultHttpClient();
			HttpPost postRequest = new HttpPost(
					url);
			String urlParameters = "{\"ws_function_name\":\"" + this.operationName + "\", \"ws_wsdl_url\":\""+ this.WSDL +"\",\"ws_input_params\":[\""+ params.get(0).toString().trim() + "\"]}";
			
			// Send post request
			System.out.println("Request : " + urlParameters);
			StringEntity input = new StringEntity(
					urlParameters);
			input.setContentType("application/json");
			postRequest.setEntity(input);
			
			
			HttpResponse response = httpClient.execute(postRequest);

			if (response.getStatusLine().getStatusCode() != 200 && response.getStatusLine().getStatusCode() != 201) {
				throw new RuntimeException("Failed : HTTP error code : "
						+ response.getStatusLine().getStatusCode() + " === " + response.toString());
			}

			BufferedReader br = new BufferedReader(new InputStreamReader(
					(response.getEntity().getContent())));

			String output;
			String responseString = "";
			//System.out.println("Output from Server .... \n");
			while ((output = br.readLine()) != null) {
				responseString += output;
				//System.out.println(output);
			}
			
			
			httpClient.getConnectionManager().shutdown();
			return responseString; 
		}catch (Exception ex){
			return ex.getMessage();
		}
	}
	
}
