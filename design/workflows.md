# Mobile app workflows 

## Quick overview of interface elements and processes 


### Views
* master (background) - there is a strip of buttons at the bottom, and a logo at the top
* Gallery - the home view, starts out empty
* Source Picker - pop-up to choose "Take Photo", "Photo Library" or "Cancel"
* Image view - view of image with option to proceed to name-extraction or cancel
* List view - list of extracted names (select for taxon view), "Get tree" button
* Taxon view - mash-up of information on a species selected from List view
* Tree view - graphic display of extracted tree, option to share 
* Share view - options for sharing to phylotastic gallery, twitter, facebook, etc. 

### A note about the gallery
Every registered user of our phylotastic apps is going to have a personal gallery.  The content will be stored on a networked server.  The content will consist of records that include the actual tree structure, the provenance, an ID, and a view.  When the user launches the web app or the mobile app for the first time, they will be asked to log in or register for an account.  The gallery that they see is their phylotastic gallery, regardless of which app was used to create the records.  So, for instance, if a user had 20 trees in her gallery from using the web toolbox, these would be visible the first time she logs in to the phylotastic services using her mobile app.  

## Field trip

Assume middle-school or higher level.  The students are brought into an area with a variety of species represented in displays with signage.  This might be an entire zoo, the mammal room at the museum, or even just a collection of herbarium sheets.  

### Workflow 1

Students are assigned to collect 12 species to make a tree.  The aim is to get as much phylogenetic diversity as possible.  Trees are tweeted to the instructor at the end of the session.  

* Launch: user launches app --> show home gallery (empty for first-time user)
* HowTo: user selects "show me how"
   * --> tutorial launches (brief video on how to use app)
   * --> return to home gallery
* NameCapture: user selects "get image"
   * --> source picker 
   * user chooses "Take Photo"
      * --> go to device camera
      * user takes photo
         * --> go to image view 
         * user selects "extract names"
            * --> show spinner during name extraction 
            * --> when complete, go to list view 
* user repeats NameCapture to add 11 more species names
* TreeCapture: user selects "get tree" from list view 
   * --> show tree view 
* TreeShare: from tree view, user selects "share" 
   * --> show share view
   * user selects twitter, adds comment, clicks post
      * --> tree is posted to personal phylotastic gallery 
      * --> tree is posted to twitter with comment

![Workflow 1](workflow1.jpg)
         
### Variations on Workflow 1

