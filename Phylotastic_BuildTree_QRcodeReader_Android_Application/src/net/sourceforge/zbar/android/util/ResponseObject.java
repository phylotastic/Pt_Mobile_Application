package net.sourceforge.zbar.android.util;

public class ResponseObject {
    private String success;
    private String type;
    private String mess;
    
	public ResponseObject() {
		super();
		// TODO Auto-generated constructor stub
	}
	public ResponseObject(String success, String type, String mess) {
		super();
		this.success = success;
		this.type = type;
		this.mess = mess;
	}
	public String getSuccess() {
		return success;
	}
	public void setSuccess(String success) {
		this.success = success;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getMess() {
		return mess;
	}
	public void setMess(String mess) {
		this.mess = mess;
	}
    
}
