# test images 

Test images are stored in the following directories
* batch - groups of files for a specific museum, zoo, etc. 
* easy - images with text that should be easy to capture by OCR 
   * High contrast between letters and background
   * Simple fonts
   * Sharp focus 
   * Straight focus
* medium - images with one or more modest challenges for OCR
   * actual signage with variable lighting, glare, etc 
   * somewhat out of focus 
   * photographed up to 30 degrees from perpendicular
   * poor contrast 
* hard - images with significant challenges for OCR
   * signs with complex or engraved letters
   * hand-written names 
   * signage with poor contrast 
   * fuzzy image 
   * photographed more than 30 degrees from perpendicular  
   * poor contrast

At the same level as each directory of images is a csv file describing the images and their content with the following fields: 
* filename - name of the image file
* species - the species (or other taxon) names that should be captured from the image
* image_quality - L = low, M = medium, h = high for image quality
* image_issues - whatever results in quality below h, e.g., skew, blur, low contrast, etc. 
* OCR_comment - for any comments about the outcome of OCR on this image