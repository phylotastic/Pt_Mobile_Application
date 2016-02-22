//
//  ViewController.swift
//  LoveInASnap
//
//  Created by Lyndsey Scott on 1/11/15
//  for http://www.raywenderlich.com/
//  Copyright (c) 2015 Lyndsey Scott. All rights reserved.
//

import UIKit
import Foundation
import SwiftyJSON

class ViewController: UIViewController, UITextViewDelegate, UINavigationControllerDelegate {
  
  @IBOutlet weak var textView: UITextView!
  @IBOutlet weak var findTextField: UITextField!
  @IBOutlet weak var replaceTextField: UITextField!
  @IBOutlet weak var topMarginConstraint: NSLayoutConstraint!
  @IBOutlet weak var treeTextView: UITextView!
  
  let OCR_TOOL = "GOOGLE_CLOUD_VISION_API"

  
  var activityIndicator:UIActivityIndicatorView!
  var originalTopMargin:CGFloat!
  
  override func viewDidLoad() {
    super.viewDidLoad()
  }
  
  override func viewDidAppear(animated: Bool) {
    super.viewDidAppear(animated)
    
    originalTopMargin = topMarginConstraint.constant
  }
  
  @IBAction func takePhoto(sender: AnyObject) {
    // 1
    view.endEditing(true)
    moveViewDown()
    
    // 2
    let imagePickerActionSheet = UIAlertController(title: "Snap/Upload Photo",
      message: nil, preferredStyle: .ActionSheet)
    
    // 3
    if UIImagePickerController.isSourceTypeAvailable(.Camera) {
      let cameraButton = UIAlertAction(title: "Take Photo",
        style: .Default) { (alert) -> Void in
          let imagePicker = UIImagePickerController()
          imagePicker.delegate = self
          imagePicker.sourceType = .Camera
          self.presentViewController(imagePicker,
            animated: true,
            completion: nil)
      }
      imagePickerActionSheet.addAction(cameraButton)
    }
    
    // 4
    let libraryButton = UIAlertAction(title: "Choose Existing",
      style: .Default) { (alert) -> Void in
        let imagePicker = UIImagePickerController()
        imagePicker.delegate = self
        imagePicker.sourceType = .PhotoLibrary
        self.presentViewController(imagePicker,
          animated: true,
          completion: nil)
    }
    imagePickerActionSheet.addAction(libraryButton)
    
    // 5
    let cancelButton = UIAlertAction(title: "Cancel",
      style: .Cancel) { (alert) -> Void in
    }
    imagePickerActionSheet.addAction(cancelButton)
    
    // 6
    presentViewController(imagePickerActionSheet, animated: true,
      completion: nil)
  }
  
  @IBAction func swapText(sender: AnyObject) {
    
  }
  
  
  @IBAction func viewTree_WS(sender : AnyObject) {
      print("Open Web Browser to View Tree")
    
      var treeDataText = self.treeTextView.text
      treeDataText = treeDataText.stringByTrimmingCharactersInSet(
         NSCharacterSet.whitespaceAndNewlineCharacterSet()
      )
      print("Tree data : |" + treeDataText + "|")

      if (treeDataText == "Error in request to Server"){
        let refreshAlert = UIAlertController(title: "Phylotastic", message: "Tree Data is invalid.", preferredStyle: UIAlertControllerStyle.Alert)
        
        refreshAlert.addAction(UIAlertAction(title: "Ok", style: .Default, handler: { (action: UIAlertAction!) in
          return;
        }))
        
        presentViewController(refreshAlert, animated: true, completion: nil)
      } else if (treeDataText == "List of resolved names empty") {
        let refreshAlert = UIAlertController(title: "Phylotastic", message: "Tree Data is Empty.", preferredStyle: UIAlertControllerStyle.Alert)
        
        refreshAlert.addAction(UIAlertAction(title: "Ok", style: .Default, handler: { (action: UIAlertAction!) in
          return;
        }))
        
        presentViewController(refreshAlert, animated: true, completion: nil)
        
      } else {
        treeDataText = treeDataText.stringByTrimmingCharactersInSet(
          NSCharacterSet.whitespaceAndNewlineCharacterSet()
        )
        
        print("Tree data : " + treeDataText)
        
        let strURL = "http://128.123.177.13/Phylotastic_DisplayTree_Project/display_tree.html?uri=&tree_data=" + treeDataText + "&format=newick_text"
        
        print("URL : " + strURL)
        
        let url = NSURL(string: strURL)!
        UIApplication.sharedApplication().openURL(url)
      }
    
    
    
  }
  
  @IBAction func clearTextView(sender : AnyObject) {
    textView.text = ""
  }
  
  @IBAction func buildTree_WS(sender : AnyObject) {
    print("Call Web Serivice to Build Tree");
    
    if (textView.text.isEmpty){
      let refreshAlert = UIAlertController(title: "Phylotastic", message: "Text Data is Empty. Please Snap or Upload correct image.", preferredStyle: UIAlertControllerStyle.Alert)
      
      refreshAlert.addAction(UIAlertAction(title: "Ok", style: .Default, handler: { (action: UIAlertAction!) in
        return;
      }))
      
      presentViewController(refreshAlert, animated: true, completion: nil)
    } else {
    
        addActivityIndicator()
        let request = NSMutableURLRequest(URL: NSURL(string: "http://phylo.cs.nmsu.edu:5003/WSExecution/runWSFunctionWithWSDL_wwwEncode")!)
        request.HTTPMethod = "POST"
      
        let ocrText = textView.text
    
        let data = ocrText.stringByTrimmingCharactersInSet(
          NSCharacterSet.whitespaceAndNewlineCharacterSet()
        )
    
        let postString = "ws_function_name=getPhylogeneticTree&ws_wsdl_url=http://phylo.cs.nmsu.edu:8080//WSRegistry/sites/default/files/wsdl/usecase2_workflow1_text.wsdl&ws_input_params=" + data
    
        print ("Request  : " + postString)
        request.HTTPBody = postString.dataUsingEncoding(NSUTF8StringEncoding)
    
        let task = NSURLSession.sharedSession().dataTaskWithRequest(request) { data, response, error in
            guard error == nil && data != nil else {                                                          // check for fundamental networking error
                print("error=\(error)")
              return
            }
      
            if let httpStatus = response as? NSHTTPURLResponse where httpStatus.statusCode != 200 {           // check for http errors
                print("statusCode should be 200, but is \(httpStatus.statusCode)")
                print("response = \(response)")
                dispatch_async(dispatch_get_main_queue(), { () -> Void in
                    //self.textView.text = "Error in request to Server"
                    self.treeTextView.text = "Error in request to Server"
                    self.self.removeActivityIndicator()
                  })
              } else {
        
                let responseString = NSString(data: data!, encoding: NSUTF8StringEncoding)
                //print("responseString == \(responseString)")
                let correctResponse = responseString! as String
                print("response2 == " + (responseString! as String))
        
                //print("New String == " + newString!)
                dispatch_async(dispatch_get_main_queue(), { () -> Void in
                    //self.textView.text = correctResponse
                    self.treeTextView.text = correctResponse
                    self.self.removeActivityIndicator()
                })
            }
        }
        task.resume()
    }
    
  }
  
  @IBAction func sharePoem(sender: AnyObject) {
    
  }
  
  
  // Activity Indicator methods
  
  func addActivityIndicator() {
    activityIndicator = UIActivityIndicatorView(frame: view.bounds)
    activityIndicator.activityIndicatorViewStyle = .WhiteLarge
    
    activityIndicator.backgroundColor = UIColor(white: 0, alpha: 0.25)
    activityIndicator.startAnimating()
    view.addSubview(activityIndicator)
  }
  
  func removeActivityIndicator() {
    activityIndicator.removeFromSuperview()
    activityIndicator = nil
  }
  
  
  // The remaining methods handle the keyboard resignation/
  // move the view so that the first responders aren't hidden
  
  func moveViewUp() {
    if topMarginConstraint.constant != originalTopMargin {
      return
    }
    
    topMarginConstraint.constant -= 135
    UIView.animateWithDuration(0.3, animations: { () -> Void in
      self.view.layoutIfNeeded()
    })
  }
  
  func moveViewDown() {
    if topMarginConstraint.constant == originalTopMargin {
      return
    }

    topMarginConstraint.constant = originalTopMargin
    UIView.animateWithDuration(0.3, animations: { () -> Void in
      self.view.layoutIfNeeded()
    })

  }
  
  func scaleImage(image: UIImage, maxDimension: CGFloat) -> UIImage {
    
    var scaledSize = CGSize(width: maxDimension, height: maxDimension)
    var scaleFactor: CGFloat
    
    if image.size.width > image.size.height {
      scaleFactor = image.size.height / image.size.width
      scaledSize.width = maxDimension
      scaledSize.height = scaledSize.width * scaleFactor
    } else {
      scaleFactor = image.size.width / image.size.height
      scaledSize.height = maxDimension
      scaledSize.width = scaledSize.height * scaleFactor
    }
    
    UIGraphicsBeginImageContext(scaledSize)
    image.drawInRect(CGRectMake(0, 0, scaledSize.width, scaledSize.height))
    let scaledImage = UIGraphicsGetImageFromCurrentImageContext()
    UIGraphicsEndImageContext()
    
    return scaledImage
  }
  
  @IBAction func backgroundTapped(sender: AnyObject) {
    view.endEditing(true)
    moveViewDown()
  }
  
  func performImageRecognition(image: UIImage) {
    
    print("Chay vao day TESSERACT ")
    // 1
    //let tesseract = G8Tesseract()
    // 2
    //tesseract.language = "eng+fra"
    //tesseract.language = "eng"
    // 3
    //tesseract.engineMode = .TesseractCubeCombined
    // 4
    //tesseract.pageSegmentationMode = .Auto
    // 5
    //tesseract.maximumRecognitionTime = 60.0
    // 6
    //tesseract.image = image.g8_blackAndWhite()
    //tesseract.recognize()
    
    //let ocrText = tesseract.recognizedText.stringByTrimmingCharactersInSet(
    //  NSCharacterSet.whitespaceAndNewlineCharacterSet()
    //)
    // 7
    //textView.text = textView.text + " " + ocrText
    
    
    removeActivityIndicator()
    
    //textView.editable = true
    // 8
   
  }
  
  /********************************************************/
  /****GOOGLE CLOUD VISION API*****************************/
  /********************************************************/
  
  func resizeImage(imageSize: CGSize, image: UIImage) -> NSData {
    UIGraphicsBeginImageContext(imageSize)
    image.drawInRect(CGRectMake(0, 0, imageSize.width, imageSize.height))
    let newImage = UIGraphicsGetImageFromCurrentImageContext()
    let resizedImage = UIImagePNGRepresentation(newImage)
    UIGraphicsEndImageContext()
    return resizedImage!
  }
  
  func base64EncodeImage(image: UIImage) -> String {
    var imagedata = UIImagePNGRepresentation(image)
    
    // Resize the image if it exceeds the 2MB API limit
    // 2097152
    if (imagedata?.length > 1048576) {
      print("reduce size")
      let oldSize: CGSize = image.size
      let newSize: CGSize = CGSizeMake(800, oldSize.height / oldSize.width * 800)
      //let newSize: CGSize = CGSizeMake(1024, 768)
      imagedata = resizeImage(newSize, image: image)
      print("After reduce size")
      print(imagedata?.length)
    }
    
    return imagedata!.base64EncodedStringWithOptions(.EncodingEndLineWithCarriageReturn)
  }
  
  func createRequest(imageData: String) {
    // Create our request URL
    let request = NSMutableURLRequest(URL: NSURL(string: "https://vision.googleapis.com/v1/images:annotate?key=\(API_KEY)")!)
    request.HTTPMethod = "POST"
    request.addValue("application/json", forHTTPHeaderField: "Content-Type")
    
    // Build our API request
    let jsonRequest: [String: AnyObject] = [
      "requests": [
        "image": [
          "content": imageData
        ],
        "features": [
          [
            "type": "TEXT_DETECTION",
            "maxResults": 10
          ]
        ]
      ]
    ]
    
    //print(jsonRequest)
    
    // Serialize the JSON
    request.HTTPBody = try! NSJSONSerialization.dataWithJSONObject(jsonRequest, options: [])
    
    // Run the request on a background thread
    
    
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), {
      self.runRequestOnBackgroundThread(request)
    });
    
    
    /** Thu nghiem **/
    /*
    let task = NSURLSession.sharedSession().dataTaskWithRequest(request) { data, response, error in
      guard error == nil && data != nil else {
        print("error=\(error)")
        return
      }
      
      if let httpStatus = response as? NSHTTPURLResponse where httpStatus.statusCode != 200 {
        print("statusCode should be 200, but is \(httpStatus.statusCode)")
        print("response = \(response)")
        dispatch_async(dispatch_get_main_queue(), { () -> Void in
          self.textView.text = "Error in request to Server"
          self.removeActivityIndicator()
        })
      } else {
        
        let responseString = NSString(data: data!, encoding: NSUTF8StringEncoding)
        let correctResponse = responseString! as String
        print("response2 == " + (correctResponse))
        
        dispatch_async(dispatch_get_main_queue(), { () -> Void in
          self.removeActivityIndicator()
          
          let errorObj: JSON = json["error"]
          if (errorObj.dictionaryValue != [:]) {
            self.textView.text = "Error code \(errorObj["code"]): \(errorObj["message"])"
          } else {
            print("JSON REsponse : ")
            print(json)
            let responses: JSON = json["responses"][0]
            
            print("Thu nghiem")
            print(json["responses"][0])
            
            let OCRTextAnnotations: JSON = responses["textAnnotations"]
          
            
            let OCRTextResult = OCRTextAnnotations[0]["description"].stringValue
            
            print("Descriotion Value = " + (OCRTextResult))
            
            if (OCRTextResult.isEmpty){
              self.textView.text = self.textView.text + "\nError in request to Server"
            } else {
              self.textView.text = self.textView.text + "\n" + OCRTextResult
            }
            
          }
        })
      }
    }
    task.resume()
    */
    /* Ket thuc thu nghiem */
  }
  
  func runRequestOnBackgroundThread(request: NSMutableURLRequest) {
    let session = NSURLSession.sharedSession()
    // run the request
    print("vao day")
    let task = session.dataTaskWithRequest(request, completionHandler: {data, response, error -> Void in
        print("Vao trong")
        self.analyzeResults(data!)
    })
    task.resume()
    
  }
  
  func analyzeResults(dataToParse: NSData) {
    // Update UI on the main thread
    dispatch_async(dispatch_get_main_queue(), {
      // Use SwiftyJSON to parse results
      let json = JSON(data: dataToParse)
      let errorObj: JSON = json["error"]
     
      self.removeActivityIndicator()
      // Check for errors
      if (errorObj.dictionaryValue != [:]) {
        self.textView.text = "Error code \(errorObj["code"]): \(errorObj["message"])"
      } else {
        // Parse the response
        print(json)
        let responses: JSON = json["responses"][0]
        
        // Get label annotations
        
        let OCRTextAnnotations: JSON = responses["textAnnotations"]
        let OCRTextResult = OCRTextAnnotations[0]["description"].stringValue
        if (OCRTextResult.isEmpty){
           self.textView.text = self.textView.text + "\nError in request to Server"
        } else {
           self.textView.text = self.textView.text + "\n" + OCRTextResult
        }
        
      }
    })
  }
  
}

extension ViewController: UITextFieldDelegate {
  func textFieldDidBeginEditing(textField: UITextField) {
    moveViewUp()
  }
  
  @IBAction func textFieldEndEditing(sender: AnyObject) {
    view.endEditing(true)
    moveViewDown()
  }
  
  func textViewDidBeginEditing(textView: UITextView) {
    moveViewDown()
  }
}

extension ViewController: UIImagePickerControllerDelegate {
  func imagePickerController(picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [String : AnyObject]) {
    let selectedPhoto = info[UIImagePickerControllerOriginalImage] as! UIImage
    //let scaledImage = scaleImage(selectedPhoto, maxDimension: 640)
    addActivityIndicator()
    // Base64 encode the image and create the request
    print("Google API Vision Cloud")
    let binaryImageData = self.base64EncodeImage(selectedPhoto)
    self.createRequest(binaryImageData)
    
    dismissViewControllerAnimated(true, completion: nil)
  }
}
