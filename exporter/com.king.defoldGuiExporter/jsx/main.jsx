/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder*/

//
// Overview:
//    Classes
//    Utility functions
//    Core functions
//


// --- Classes --- //

function Node(layer){
// Description: Node class using a constructor. This object holds all the metadata properties of a layer.

    // Method for adjusting child node position to parent node position
    this.adjustToParent = function(parentNode){
        this.positionX = this.positionX - parentNode.positionX;
        this.positionY = this.positionY - parentNode.positionY;
    }

    // Properties
    this.height = layer.bounds[3].value - layer.bounds[1].value;
    this.width = layer.bounds[2].value - layer.bounds[0].value;
    this.adjust_mode = getMetadata("adjust_mode");
    this.alpha = (layer.opacity / 100);
    var anchor = getMetadata("anchor");
    this.blend_mode = getMetadata("blend_mode");
    this.clipInverted = getMetadata("clipping_inverted");
    this.clipMode = getMetadata("clipping_mode");
    this.clipVisible = getMetadata("clipping_visible");
    // this.alphaInherit = getMetadata("inherit_alpha");
    this.layer = getMetadata("layer");
    this.lyrName = layer.name; // this.name is reserved - going with lyrName instead
    this.parent = undefined;
    this.pivot = getMetadata("pivot");
    this.slice9x = getMetadata("slice9x");
    this.slice9y = getMetadata("slice9y");
    this.slice9z = getMetadata("slice9z");
    this.slice9w = getMetadata("slice9w");

    // Text/Font properties
    if (layer.kind == LayerKind.TEXT){
        this.fontColor = layer.textItem.color; // Text color - Used where?
        this.fontName = getMetadata("font");
        this.fontSize = layer.textItem.size.value;
        this.fontText = layer.textItem.contents;
        this.nodeType = "text";
    }else{
        this.nodeType = "art";
    }

    // X/Y anchor property
    if (anchor == "ANCHOR_NW"){
        this.xanchor = "XANCHOR_LEFT";
        this.yanchor = "YANCHOR_TOP";
    }else if (anchor == "ANCHOR_W"){
        this.xanchor = "XANCHOR_LEFT";
        this.yanchor = "YANCHOR_NONE";
    }else if (anchor == "ANCHOR_SW"){
        this.xanchor = "XANCHOR_LEFT";
        this.yanchor = "YANCHOR_BOTTOM";
    }else if (anchor == "ANCHOR_NE"){
        this.xanchor = "XANCHOR_RIGHT";
        this.yanchor = "YANCHOR_TOP";
    }else if (anchor == "ANCHOR_E"){
        this.xanchor = "XANCHOR_RIGHT";
        this.yanchor = "YANCHOR_NONE";
    }else if (anchor == "ANCHOR_SE"){
        this.xanchor = "XANCHOR_RIGHT";
        this.yanchor = "YANCHOR_BOTTOM";
    }else if (anchor == "ANCHOR_N"){
        this.xanchor = "XANCHOR_NONE";
        this.yanchor = "YANCHOR_TOP";
    }else if (anchor == "ANCHOR_S"){
        this.xanchor = "XANCHOR_NONE";
        this.yanchor = "YANCHOR_BOTTOM";
    }else if (anchor == "ANCHOR_CENTER"){
        this.xanchor = "XANCHOR_NONE";
        this.yanchor = "YANCHOR_NONE";
    }

    // Parent property
    if (layer.parent.typename == "LayerSet"){ // Check for parent layerSet

        // Check if the layer set has the same name as an existing layer
        var artLyrs = getLayers(LayerKind.NORMAL);
        var match = false;
        for (var i in artLyrs){
            if (layer.parent.name == artLyrs[i].name){
                match = true;
            }
        }

        // Merge set if necessary and set parent property
        if (match == true){
            this.parent = layer.parent;
        }else{ // Merge the set and treat as a node. Parent to root doc.
            this.parent = activeDocument;
        }
    }else{
        this.parent = activeDocument;
    }

    // Calculate Defold position based off pivot value
    this.lyrX_nw = layer.bounds[0].value; // Counted from NW - in Defold 0,0 is in SW corner
    this.lyrY_nw = layer.bounds[1].value;

    // Pivot property
    if (this.pivot == "PIVOT_NW"){
        this.positionX = this.lyrX_nw; // west x
        this.positionY = activeDocument.height.value - this.lyrY_nw; // north y

    }else if (this.pivot == "PIVOT_W"){
        this.positionX = this.lyrX_nw; // west x
        this.positionY = activeDocument.height.value - this.lyrY_nw - (this.height / 2); // center y

    }else if (this.pivot == "PIVOT_SW"){
        this.positionX = this.lyrX_nw; // west x
        this.positionY = activeDocument.height.value - this.lyrY_nw - this.height; // south Y

    }else if (this.pivot == "PIVOT_NE"){
        this.positionX = this.lyrX_nw + this.width; // east X
        this.positionY = activeDocument.height.value - this.lyrY_nw; // north y

    }else if (this.pivot == "PIVOT_E"){
        this.positionX = this.lyrX_nw + this.width; // east X
        this.positionY = activeDocument.height.value - this.lyrY_nw - (this.height / 2); // center y

    }else if (this.pivot == "PIVOT_SE"){
        this.positionX = this.lyrX_nw + this.width; // east X
        this.positionY = activeDocument.height.value - this.lyrY_nw - this.height; // south Y

    }else if (this.pivot == "PIVOT_N"){
        this.positionX = this.lyrX_nw + (this.width / 2); // center X
        this.positionY = activeDocument.height.value - this.lyrY_nw; // north y

    }else if (this.pivot == "PIVOT_S"){
        this.positionX = this.lyrX_nw + (this.width / 2); // center X
        this.positionY = activeDocument.height.value - this.lyrY_nw - this.height; // south Y

    }else if (this.pivot == "PIVOT_CENTER"){
        this.positionX = this.lyrX_nw + (this.width / 2); // center X
        this.positionY = activeDocument.height.value - this.lyrY_nw - (this.height / 2); // center y
    }

    return this;
}


function CreateProgressWindow(title, message){
// Description: Progress window class using a constructor.

    var win; // self

    // Method for updating the progress bar with a new value and message
    this.updateProgress = function(progressValue, message){
        if (progressValue != null){
            win.bar.value = progressValue;
        }
        if (message != null){
            win.staticMsg.text = message;
        }
        return win.update();
    };

    win = new Window("palette", "" + title, undefined);
    win.bar = win.add("progressbar",{
        x: 20,
        y: 12,
        width: 300,
        height: 20
    }, 0, 100);
    win.staticMsg = win.add("statictext",{
        x: 10,
        y: 36,
        width: 320,
        height: 20
    }, "" + message);
    win.staticMsg.justify = "center";
    win.center(win.parent);

    return win.show();
}


// --- Utility functions --- //

function documentCheck(){
// Description: Check for open document
    if (!documents.length){
        alert("There are no documents open!");
        return;
    }
}


function isWindows(){
// Description: OS check
    return app.systemInformation.indexOf("Operating System: Windows") >= 0
}
function isMac(){
    return app.systemInformation.indexOf("Operating System: Mac") >= 0
}


function quickMaskCheck(){
// Description: Make sure that the user is not in Quick Mask mode
    if (activeDocument.quickMaskMode == true) activeDocument.quickMaskMode(false);
}


function sTID(s){
// Shorthand notation of ActionManager funcs
    return stringIDToTypeID(s);
}


function toAbsolute(path){
// Description: Formats a relative path absolute by adding it to the project path

    path = path.toString();
    if (path.match(/^[.\/]/) != ""){ // Already absolute?
        var projPath = getMetadata("proj_path");
        path = projPath + path;
    }
    path = path.replace(/\/\//g,"/"); // Remove double front slashes

    return path;
}


// --- Core functions --- //


function browse(objType, pathType){
// Description: Manages communication between the UI and file/folder dialogue function createDialog()
// Returns: Absolute path for the project folder OR a relative path if browsing sub-folders/files

    var dialogMessage;
    var extension;
    var fullPath;
    var projPath = getMetadata("proj_path");

    // Setup paths and the browser dialog message
    if (pathType == "atlas"){
        var atlasPath = getMetadata("atlas_path");
        dialogMessage = "Set atlas file (.atlas) location";
        extension = pathType;
        fullPath = projPath + atlasPath;
    }else if (pathType == "gui"){
        var guiPath = getMetadata("gui_path");
        dialogMessage = "Set GUI file (.gui) location";
        fullPath = projPath + guiPath;
        extension = pathType;
    }else if (pathType == "fonts"){
        var fontPath = getMetadata("font_path");
        dialogMessage = "Set font folder location";
        fullPath = projPath + fontPath;
    }else if (pathType == "images"){
        var imgPath = getMetadata("img_path");
        dialogMessage = "Set image folder location";
        fullPath = projPath + imgPath;
    }else if (pathType == "project"){
        dialogMessage = "Set Defold project folder location";
        fullPath = projPath;
    }

    // Open up file/folder browser dialog
    var path = createDialog(dialogMessage, objType, extension, fullPath); // browser3

    return path;
}


function createDialog(dialogMessage, dialogType, extFilter, oldPath){
// Description: Opens up a file or older dialog window for browsing (Win and OSX compatible!)
// Returns: Absolute path (string) to the file or folder that was picked by the user

    // DEBUG
    // alert("ran createDialog with params:\ndialogMessage: " + dialogMessage + "\ndialogType: " + dialogType + "\nextFilter: " + extFilter + "\noldPath: " + oldPath);

    // File
    if (dialogType == "file"){

        // Create filter function for the File.saveDlg -function
        var filter = null
        if (isMac()){ // OSX
            if (extFilter){
                var filter_regex = new RegExp("[^\.]*\."+extFilter+"$")
                filter = function (file_entry){ // Gets rid of the greyed-out -folders issue on OSX
                    if (file_entry instanceof Folder){ 
                        return true;
                    }else{
                        return filter_regex.test(file_entry.name);
                    }
                }
            }else{
                filter = function(){ return true } // All and any file(s)
            }
        }else if (isWindows()){ // Win
            if (extFilter){
                filter = extFilter.charAt(0).toUpperCase() + extFilter.slice(1)+"-files:*."+extFilter;
            }else{
                filter = "All files:*.*"; // All and any file(s)
            }
        }else{
            filter = null;
        }

        // Create file dialog
        var path = new File(oldPath);
        var dialog = path.saveDlg(dialogMessage, filter);

    // Folder
    }else if(dialogType == "folder"){

        // Create folder dialog
        var path = new Folder(oldPath);
        var dialog = path.selectDlg(dialogMessage);
        while (dialog.alias){
            dialog = dialog.resolve.selectDlg(dialogMessage);
        }
    }

    if (dialog) return dialog.fsName.replace(/\\/g, "/"); // Back to Front slashes
}


function compileFile(type, lyrs, txtLyrs){
// Description: Compiles the data into a JSON-formatted string
    //alert("compileFile ran with arg: " + type); // DEBUG

    var atlasPath = getMetadata("atlas_path");
    var bleeding = getMetadata("atlas_bleeding");
    var atlasAppend = getMetadata("atlas_append");
    var fileString = "";
    var fontPath = getMetadata("font_path");
    var imgPath = getMetadata("img_path");
    var margin = getMetadata("atlas_margin");
    var padding = getMetadata("atlas_padding");
    var projPath = getMetadata("proj_path"); // Object

    // Create node objects
    if (type == "font"){
        activeDocument.activeLayer = lyrs;
        var node = new Node(lyrs);
    }else{
        var artNodes = [];
        var fontNodes = [];
        var nodes = [];
        for (var i in lyrs){
            activeDocument.activeLayer = lyrs[i];
            artNodes[i] = new Node(lyrs[i]);
            nodes.push(artNodes[i]);
        }
        for (var i in txtLyrs){
            activeDocument.activeLayer = txtLyrs[i];
            fontNodes[i] = new Node(txtLyrs[i]);
            nodes.push(fontNodes[i]);
        }
    }

    // Compile string
    if (type == "atlas"){
        // alert("compiling atlas file..."); // DEBUG

        // Create image arrays from artLayers. Skip if name ends with suffix: _something_
        for (var i in artNodes){
            if (lyrs[i].name.match(/(_+[A-Za-z0-9.]+_$)/)) continue;
            fileString += "images { image: \"" + imgPath + "/" + artNodes[i].lyrName + ".png\" }\n";
        }

        // Append image array(s) to atlas file...
        if (atlasAppend == "true"){
            var file = new File(toAbsolute(atlasPath));
            file.open("a", "TEXT");
            var oldFileString = "";
            while (!file.eof){
                var line = file.readln();
                if (fileString.indexOf(line) == -1){
                    oldFileString += line + "\n";
                }
            }
            fileString = fileString + oldFileString; // Merge new array(s) with old file
            file.close();

        }else{ // ...or finalize the atlas.
            fileString += "margin: " + margin + "\n";
            fileString += "extrude_borders: " + bleeding +"\n";
            fileString += "inner_padding: " + padding + "\n";
        }

    }else if (type == "font"){
        fileString += "font: \"" + fontPath + "/" + node.fontName + ".ttf\"\n";
        fileString += "material: \"/builtins/fonts/font.material\"\n";
        fileString += "size: " + node.fontSize + "\n";
        fileString += "alpha: 1.0\n";
        fileString += "outline_alpha: 0.0\n";
        fileString += "outline_width: 0.0\n";
        fileString += "shadow_alpha: 0.0\n";
        fileString += "shadow_blur: 0\n";
        fileString += "shadow_x: 0.0\n";
        fileString += "shadow_y: 0.0\n";
        fileString += "all_chars: false\n";
        fileString += "cache_width: 0\n";
        fileString += "cache_height: 0\n";

    }else if (type == "gui"){
        //alert("compileFile() - compiling gui file..."); // DEBUG
        var atlasPath = getMetadata("atlas_path").toString();
        var atlasName = atlasPath.replace(".atlas", ""); // Name from path
        atlasName = atlasName.replace(/^(.*[\\\/])/,"");
        fileString += "script: \"\"\n";

        // Fonts
        for (var i in fontNodes){
            fileString += "fonts {\n";
            fileString += "  name: \"" + fontNodes[i].lyrName + "\"\n";
            fileString += "  font: \"" + fontPath + "\/" + fontNodes[i].lyrName + ".font\"\n";
            fileString += "}\n";
        }

        fileString += "textures {\n";
        fileString += "  name: \"" + atlasName + "\"\n";
        fileString += "  texture: \"" + atlasPath + "\"\n";
        fileString += "}\n";
        fileString += "background_color {\n";
        fileString += "  x: 0.0\n";
        fileString += "  y: 0.0\n";
        fileString += "  z: 0.0\n";
        fileString += "  w: 1.0\n";
        fileString += "}\n";

        for (var i in nodes){

            // Adjust positions for parent-child relationships
            for (var j in nodes){
                if (nodes[i].parent.name == nodes[j].lyrName){
                    nodes[i].adjustToParent(nodes[j]);
                }
            }

            // Split resource and ID if layer name ends with suffix: _something_
            if (nodes[i].lyrName.match(/(_+[A-Za-z0-9.]+_$)/)){
                var parts = nodes[i].lyrName.split(/(_+[A-Za-z0-9.]+_$)/);
                nodes[i].lyrName = parts[0];
                var resource = parts[1].slice(1, -1);
            }else{
                var resource = nodes[i].lyrName;
            }

            fileString += "nodes {\n";
            fileString += "  position {\n";
            fileString += "    x: " + nodes[i].positionX + "\n";
            fileString += "    y: " + nodes[i].positionY + "\n";
            fileString += "    z: 0.0\n";
            fileString += "    w: 1.0\n";
            fileString += "  }\n";
            fileString += "  rotation {\n";
            fileString += "    x: 0.0\n";
            fileString += "    y: 0.0\n";
            fileString += "    z: 0.0\n";
            fileString += "    w: 1.0\n";
            fileString += "  }\n";
            fileString += "  scale {\n";
            fileString += "    x: 1.0\n";
            fileString += "    y: 1.0\n";
            fileString += "    z: 1.0\n";
            fileString += "    w: 1.0\n";
            fileString += "  }\n";
            fileString += "  size {\n";
            fileString += "    x: " + nodes[i].width + ".0\n";
            fileString += "    y: " + nodes[i].height + ".0\n";
            fileString += "    z: 0.0\n";
            fileString += "    w: 1.0\n";
            fileString += "  }\n";

            fileString += "  blend_mode: " + nodes[i].blend_mode + "\n";
            fileString += "  id: \"" + nodes[i].lyrName + "\"\n";
            fileString += "  xanchor: " + nodes[i].xanchor + "\n";
            fileString += "  yanchor: " + nodes[i].yanchor + "\n";
            fileString += "  pivot: " + nodes[i].pivot + "\n";
            fileString += "  adjust_mode: " + nodes[i].adjust_mode + "\n";

            // If layer is parented under a group
            if (nodes[i].parent.typename == "LayerSet"){
                fileString += "  parent: \"" + nodes[i].parent.name + "\"\n";
            }

            fileString += "  layer: \"" + nodes[i].layer + "\"\n";
            // fileString += "  inherit_alpha: " + nodes[i].alphaInherit + "\n";
            fileString += "  inherit_alpha: true\n";
            fileString += "  clipping_mode: " + nodes[i].clipMode + "\n";
            fileString += "  clipping_visible: " + nodes[i].clipVisible + "\n";
            fileString += "  clipping_inverted: " + nodes[i].clipInverted + "\n";
            fileString += "  alpha: " + nodes[i].alpha + "\n";
            fileString += "  template_node_child: false\n";
            fileString += "  size_mode: SIZE_MODE_MANUAL\n";

            // If ArtLayer
            if (nodes[i].nodeType == "art"){
                fileString += "  color {\n";
                fileString += "    x: 1.0\n";
                fileString += "    y: 1.0\n";
                fileString += "    z: 1.0\n";
                fileString += "    w: 1.0\n";
                fileString += "  }\n";
                fileString += "  type: TYPE_BOX\n";
                fileString += "  texture: \"" + atlasName + "\/" + resource + "\"\n";
                fileString += "  slice9 {\n";
                fileString += "    x: " + nodes[i].slice9x + ".0\n";
                fileString += "    y: " + nodes[i].slice9y + ".0\n";
                fileString += "    z: " + nodes[i].slice9z + ".0\n";
                fileString += "    w: " + nodes[i].slice9w + ".0\n";
                fileString += "  }\n";
                fileString += "}\n";

            }else{ // TextLayer
                fileString += "  color {\n";
                fileString += "    x: " + (nodes[i].fontColor.rgb.red / 255) + "\n";
                fileString += "    y: " + (nodes[i].fontColor.rgb.green / 255) + "\n";
                fileString += "    z: " + (nodes[i].fontColor.rgb.blue / 255) + "\n";
                fileString += "    w: 1.0\n";
                fileString += "  }\n";
                fileString += "  type: TYPE_TEXT\n";
                fileString += "  text: \"" + nodes[i].fontText + "\"\n";
                fileString += "  font: \"" + nodes[i].lyrName + "\"\n";
                fileString += "  outline {\n";
                fileString += "    x: 1.0\n";
                fileString += "    y: 1.0\n";
                fileString += "    z: 1.0\n";
                fileString += "    w: 1.0\n";
                fileString += "  }\n";
                fileString += "  shadow {\n";
                fileString += "    x: 0.0\n";
                fileString += "    y: 0.0\n";
                fileString += "    z: 0.0\n";
                fileString += "    w: 1.0\n";
                fileString += "  }\n";
                fileString += "  line_break: false\n";
                fileString += "  outline_alpha: 1.0\n";
                fileString += "  shadow_alpha: 1.0\n";
                fileString += "  text_leading: 1.0\n";
                fileString += "  text_tracking: 0.0\n";
                fileString += "}\n";
            }
        }

        // Final attributes
        fileString += "layers {\n"; // Retrieve from metadata - Create a metadata attrib +UI control for this in the future
        fileString += "  name: \"main\"\n";
        fileString += "}\n";
        fileString += "material: \"/builtins/materials/gui.material\"\n";
        fileString += "adjust_reference: ADJUST_REFERENCE_PARENT\n";
        fileString += "max_nodes: 512\n";
    }
    return fileString;
}


function createSnapshot(name){
// Creates a history snapshot. Not possible via DOM - have to use Action Manager

    var desc = new ActionDescriptor();
    var ref1 = new ActionReference();
    var ref2 = new ActionReference();

    ref1.putClass( sTID("snapshotClass") );
    desc.putReference( sTID("null"), ref1 );
    ref2.putProperty( sTID("historyState"), sTID("currentHistoryState") );
    desc.putReference( sTID("from"), ref2 );
    desc.putString( sTID("name"), name );
    desc.putEnumerated( sTID("using"), sTID("historyState"), sTID("fullDocument") );

    executeAction( sTID("make"), desc, DialogModes.NO );
}


function deleteSnapshot(name){
// Removes a history snapshot. Not possible via DOM - have to use Action Manager

    var desc = new ActionDescriptor();
    var ref = new ActionReference();

    ref.putName( sTID("snapshotClass"), name );
    desc.putReference( sTID("null"), ref );

    executeAction( sTID("delete"), desc, DialogModes.NO );
}


function exportFiles(){
// Description: Exports the JSON data to a .gui file

    documentCheck(); // Check for active document
    var paths = exportCheck();
    if (paths == false) return;

    // Create progress window
    var progressCount = 0;
    var progressWin = new CreateProgressWindow("Exporting GUI to Defold", "Please wait...");
    progressWin.updateProgress(0, "Merging layer sets, " + progressCount + "% completed!");

    // Retrieve layer sets whose names doesn't match an art layer
    var artLayers = getLayers(LayerKind.NORMAL);
    var layerSets = activeDocument.layerSets;
    var mergeList = [];

    for (var i = 0; i < layerSets.length; i++){
        var match = false;
        for (var j in artLayers){
            if (artLayers[j].name == layerSets[i].name){
                match = true;
            }
        }
        if (match == false){
            mergeList.push(layerSets[i]);
        }
    }

    // Create snapshot then merge layer sets down to art layers
    createSnapshot("uncel_dolan4321");
    for (var i = 0; i < mergeList.length; i++){
        activeDocument.layerSets.getByName(mergeList[i].name).merge();
    }
    artLayers = getLayers(LayerKind.NORMAL);

    progressCount = 10; // Update progress window
    progressWin.updateProgress(10, "Retrieving metadata, " + progressCount + "% completed!");

    // Create vars from metadata and doc size
    var atlasPath = getMetadata("atlas_path");
    var docWidth = activeDocument.width.value;
    var docHeight = activeDocument.height.value;
    var fontPath = getMetadata("font_path");
    var guiPath = getMetadata("gui_path");
    var imgPath = getMetadata("img_path");
    var textLayers = getLayers(LayerKind.TEXT);

    // Store ruler settings
    var originalRulerUnits = preferences.rulerUnits;
    preferences.rulerUnits = Units.PIXELS;

    progressCount = 30; // Update progress window
    progressWin.updateProgress(30, "Creating Defold files, " + progressCount + "% completed!");

    // Compile + Create Defold files
    var atlasData = compileFile("atlas", artLayers, textLayers);
    saveFile(toAbsolute(atlasPath), atlasData, "atlas");
    var guiData = compileFile("gui", artLayers, textLayers);
    saveFile(toAbsolute(guiPath), guiData);

    for (var i in textLayers){
        var fontData = compileFile("font", textLayers[i]);
        var fontFilePath = fontPath + "/" + textLayers[i].name + ".font";
        saveFile(toAbsolute(fontFilePath), fontData);
    }

    progressCount = 50; // Update progress window
    progressWin.updateProgress(50, "Exporting PNG's, " + progressCount + "% completed!");

    // Save out layers as PNG's
    saveFile(toAbsolute(imgPath), undefined, "image", progressWin);

    progressCount = 100; // Update progress window
    progressWin.updateProgress(100, "Finalizing, " + progressCount + "% completed!");

    // Restore to and remove snapshot
    setSnapshot("uncel_dolan4321");
    deleteSnapshot("uncel_dolan4321");

    // Restore the original ruler settings
    preferences.rulerUnits = originalRulerUnits;

    alert("Export complete!");
}


function getFonts(folderPath){
// Description: Retrieves all font (ttf) files from a folder

    var fontFolder = new Folder(folderPath);
    if(!fontFolder.exists){
        fontFolder.create();
    }

    var fontFiles = fontFolder.getFiles("*.ttf");
    for (var i in fontFiles){
        var temp = fontFiles[i].toString().replace(/^.*[\\\/]/, '');
        fontFiles[i] = temp.substr(0, temp.length-4);
    }

    return fontFiles
}


function getLayers(lyrType){
// Description: Gets all visible, normal, layers in a document

    // Recursively get all visible layers of a requested kind (lyrType)
    function collectLayers (parent, allLayers){
        for (var i = 0; i < parent.layers.length; i++){
            var lyr = parent.layers[i];
            if (lyr.typename == "ArtLayer"){ // Includes text layers
                if(lyr.visible &&
                  !lyr.isBackgroundLayer &&
                   lyr.kind == lyrType){ // LayerKind.NORMAL or LayerKind.Text
                    allLayers.push(lyr);
                }
            }else{
                collectLayers(lyr, allLayers);
            }
        }
        return allLayers;
    }

    var visibleLayers = [];
    var visibleLayers = collectLayers(activeDocument, visibleLayers);

    return visibleLayers;
}


function getMetadataAll(){
// Description: Retrieves all metadata property from the active layer

    // alert("ran getMetadataAll"); // DEBUG

    // Retrieve individual metadata
    // var inheritAlpha = "";
    var blendMode = getMetadata("blend_mode");
    var pivotPos = getMetadata("pivot"); 
    var anchorPos = getMetadata("anchor");
    var adjustMode = getMetadata("adjust_mode");
    var layer = getMetadata("layer");
    var clipMode = getMetadata("clipping_mode");
    var clipVisible = getMetadata("clipping_visible");
    var clipInverted = getMetadata("clipping_inverted");
    var slice1Field = getMetadata("slice9x");
    var slice2Field = getMetadata("slice9y");
    var slice3Field = getMetadata("slice9z");
    var slice4Field = getMetadata("slice9w");
    var atlasAppend = getMetadata("atlas_append");
    var margin = getMetadata("atlas_margin");
    var bleeding = getMetadata("atlas_bleeding");
    var padding = getMetadata("atlas_padding");
    var atlasPath = getMetadata("atlas_path");
    var fontPath = getMetadata("font_path");
    var font = getMetadata("font");
    var guiPath = getMetadata("gui_path");
    var imgPath = getMetadata("img_path");
    var projPath = getMetadata("proj_path");
    var activeLyrKind = activeDocument.activeLayer.kind;


    // Fill in blanks/undefined, since new layers have no custom metadata upon creation
    /*
    if (inheritAlpha == undefined){
        inheritAlpha = "true";
        setMetadata("inherit_alpha", inheritAlpha);
    }*/
    if (blendMode == undefined){
        blendMode = "BLEND_MODE_ALPHA";
        setMetadata("blend_mode", blendMode);
    }
    if (pivotPos == undefined){
        pivotPos = "PIVOT_CENTER";
        setMetadata("pivot", pivotPos);
    }
    if (anchorPos == undefined){
        anchorPos = "ANCHOR_CENTER";
        setMetadata("anchor", anchorPos);
    }
    if (adjustMode == undefined){
        adjustMode = "ADJUST_MODE_FIT";
        setMetadata("adjust_mode", adjustMode);
    }
    if (layer == undefined){
        layer = "";
        setMetadata("layer", layer);
    }
    if (clipMode == undefined){
        clipMode = "CLIPPING_MODE_NONE";
        setMetadata("clipping_mode", clipMode);
    }
    if (clipVisible == undefined){
        clipVisible = "true",
        setMetadata("clipping_visible", clipVisible);
    }
    if (clipInverted == undefined){
        clipInverted = "false";
        setMetadata("clipping_inverted", clipInverted);
    }
    if (font == undefined){
        font = "Default";
        setMetadata("font", font);
    }
    if (slice1Field == undefined){
        slice1Field = 0;
        setMetadata("slice9x", slice1Field);
    }
    if (slice2Field == undefined){
        slice2Field = 0;
        setMetadata("slice9y", slice2Field);
    }
    if (slice3Field == undefined){
        slice3Field = 0;
        setMetadata("slice9z", slice3Field);
    }
    if (slice4Field == undefined){
        slice4Field = 0;
        setMetadata("slice9w", slice4Field);
    }
    if (margin == undefined){
        margin = 0;
        setMetadata("atlas_margin", margin);
    }
    if (bleeding == undefined){
        bleeding = 0;
        setMetadata("atlas_bleeding", bleeding);
    }
    if (padding == undefined){
        padding = 0;
        setMetadata("atlas_padding", padding);
    }
    if (atlasPath == undefined){
        atlasPath = "";
        setMetadata("atlas_path", atlasPath);
    }
    
    if (atlasAppend == undefined){
        atlasAppend = "";
        setMetadata("atlas_append", atlasAppend);
    }
    
    if (fontPath == undefined){
        fontPath = "";
        setMetadata("font_path", fontPath);
    }
    if (guiPath == undefined){
        guiPath = "";
        setMetadata("gui_path", guiPath);
    }
    if (imgPath == undefined){
        imgPath = "";
        setMetadata("img_path", imgPath);
    }
    if (projPath == undefined){
        projPath = "";
        setMetadata("proj_path", projPath);
    }

    // Read font files from the font folder
    var fontFiles = getFonts(projPath + fontPath);
    fontFiles = fontFiles.toString();
    fontFiles = fontFiles.replace(/,/g, "|"); // So we can split the dataArray using two chars

    // Return data as array
    var dataArray = [guiPath, atlasPath, atlasAppend, blendMode, pivotPos, anchorPos, adjustMode, 
    layer, clipMode, clipVisible, clipInverted, slice1Field, slice2Field, slice3Field, 
    slice4Field, margin, bleeding, padding, imgPath, projPath, fontPath, activeLyrKind, fontFiles, font]; // Array size: 23 atm

    return dataArray;
}


function getMetadata(property){
// Description: Retrieves one metadata property from a layer and writes it to the field

    // Create XMP object
    if (ExternalObject.AdobeXMPScript == undefined) ExternalObject.AdobeXMPScript = new ExternalObject("lib:AdobeXMPScript");
    try{
        // Document or layer metadata?
        if ((property == "atlas_margin") || 
            (property == "atlas_bleeding") || 
            (property == "atlas_padding") || 
            (property == "atlas_path") || 
            (property == "atlas_append") || 
            (property == "font_path") || 
            (property == "gui_path") || 
            (property == "img_path") || 
            (property == "proj_path")){
            xmp = activeDocument.xmpMetadata.rawData;
        }else{
            xmp = activeDocument.activeLayer.xmpMetadata.rawData;
        }
        xmpObject = new XMPMeta(xmp);

    }catch(e){ // Defaults
        var metadata;
        if (property == "inherit_alpha"){
            metadata = "true";

        }else if (property == "blend_mode"){
            metadata = "BLEND_MODE_ALPHA";

        }else if (property == "pivot"){
            metadata = "PIVOT_CENTER";

        }else if (property == "anchor"){
            metadata = "ANCHOR_CENTER";

        }else if (property == "adjust_mode"){
            metadata = "ADJUST_MODE_FIT";

        }else if (property == "layer"){
            metadata = "";

        }else if (property == "clipping_mode"){
            metadata = "CLIPPING_MODE_NONE";

        }else if (property == "clipping_visible"){
            metadata = "true";

        }else if (property == "clipping_inverted"){
            metadata = "false";

        }else if (property == "slice9x"){
            metadata = 0;

        }else if (property == "slice9y"){
            metadata = 0;

        }else if (property == "slice9z"){
            metadata = 0;

        }else if (property == "slice9w"){
            metadata = 0;

        }else if (property == "font"){
            metadata = "Default";

        }else if (property == "atlas_path"){
            metadata = "";

        }else if (property == "font_path"){
            metadata = "";

        }else if (property == "gui_path"){
            metadata = "";

        }else if (property == "img_path"){
            metadata = "";

        }else if (property == "proj_path"){
            metadata = "";

        }else if (property == "atlas_margin"){
            metadata = 0;

        }else if (property == "atlas_bleeding"){
            metadata = 0;

        }else if (property == "atlas_padding"){
            metadata = 0;

        }else if (property == "atlas_append"){
            metadata = "false";
        }

        return(metadata);
    }

    // Retrieve and return metadata
    var kingNamespace = "http://www.king.com";
    var metadata = xmpObject.getProperty(kingNamespace, property);
    return(metadata);
}


function exportCheck(textLayers){
// Description: Checks the user-specified paths prior to exporting.
// Returns: status (boolean) - true if all paths are OK, false if not

    // Check if blanks
    var atlasPath = getMetadata("atlas_path");
    var fontPath = getMetadata("font_path");
    var guiPath = getMetadata("gui_path");
    var imgPath = getMetadata("img_path");
    var projPath = getMetadata("proj_path");

    // Trigger error messages and halt execution if we have blanks
    var result = true;
    if (projPath == ""){
        alert("You need to specify a Defold project folder before exporting! Aborting export!");
        result = false;
    }
    if (atlasPath == ""){
        alert("You need to specify a path to an atlas file before exporting! Aborting export!");
        result = false;
    }
    if (guiPath == ""){
        alert("You need to specify a path to a GUI file before exporting! Aborting export!");
        result = false;
    }
    if (imgPath == ""){
        var answer = confirm("Image path not specified! The art layers being exported will end up as images " + 
        "in the root of the project folder! Are you sure you want to continue?");
        result = false;
    }

    // Retrieve text layers. If we have any, check if the user has specified a font path
    var txtLyrs = getLayers(LayerKind.TEXT);
    if (txtLyrs != undefined){
        if (fontPath == ""){
            var answer = confirm("Font path specified! If you have text layers then the exported font " + 
            "files will end up in the root of the project folder! Are you sure you want to continue?");
            if (answer != true) result = false;
        }
    }

    return result;
}


function saveFile(filePath, data, mode, progressWin){
// Description: Writes a file to disk

    if (mode != "image"){ // Atlas or GUI
        file = new File(filePath);
        file.remove();
        file.open("w", "TEXT");
        file.lineFeed = "\n";
        file.write(data);
        file.close();

    }else{ // PNG's
        var pngOptions = new ExportOptionsSaveForWeb; // Singleton that holds all settings for "Save for web"
        pngOptions.format = SaveDocumentType.PNG;
        pngOptions.PNG8 = false; // 24 bits
        pngOptions.transparency = true;
        pngOptions.interlaced = false;
        pngOptions.quality = 100;

        // alert("saveFile (png). filePath is:\n" + filePath);

        // Clone doc and get art layers
        activeDocument.duplicate();
        lyrs = getLayers(LayerKind.NORMAL);

        // Loop through layers and export them
        var progress = 50;
        var stepSize = (progress / lyrs.length);
        for (var i in lyrs){

            // Continue if layer name ends with suffix: _something_
            if (lyrs[i].name.match(/(_+[A-Za-z0-9.]+_$)/)) continue;

            // Create snapshot
            createSnapshot("uncel_dolan1234");

            // Turn off all layers, then set and turn on the active layer
            for(var j = 0; j < activeDocument.layers.length; j++) activeDocument.layers[j].visible = false;
            activeDocument.activeLayer = lyrs[i];
            activeDocument.activeLayer.visible = true;
            if (activeDocument.activeLayer.parent != activeDocument){
                activeDocument.activeLayer.parent.visible = true;
            }

            // Trim to layer bounds and export file
            activeDocument.trim(TrimType.TRANSPARENT, true, true, true, true);
            file = File( filePath + "\uncel_dolan.png" ); // setting temp hardcoded name
            oldTemp = File( filePath + "\uncel_dolan.png" ); // setting temp hardcoded name
            activeDocument.exportDocument( new File(file), ExportType.SAVEFORWEB, pngOptions );

            // Fix path if character doesn't end with front or backslash
            if ( !((filePath.match(/.$/) == "/") || (filePath.match(/.$/) == "\\")) ){
                filePath = filePath + "/"; // ERROR HERE
            }

            // Copy the temp uncel_dolan name to the final path and remove the temp file
            file.copy( filePath + lyrs[i].name + ".png");
            oldTemp.remove();

            // Restore to and remove snapshot
            setSnapshot("uncel_dolan1234");
            deleteSnapshot("uncel_dolan1234");

            // Increase the progress bar
            progress = progress + stepSize;
            progressWin.updateProgress(progress, "Exporting PNG's, " + progress + "% completed!");
        }

        activeDocument.close(SaveOptions.DONOTSAVECHANGES);
    }
}


function setBlendMode(mode){
// Description: Changes the blend mode of the currently active layer

    // alert("setBlendMode with param: " + mode); // DEBUG

    if (mode == "BLEND_MODE_ADD"){
        activeDocument.activeLayer.blendMode = BlendMode.LINEARDODGE;
    }else if (mode == "BLEND_MODE_MULT"){
        activeDocument.activeLayer.blendMode = BlendMode.MULTIPLY;
    }else{ // Blend mode is normal/alpha
        activeDocument.activeLayer.blendMode = BlendMode.NORMAL;
    }
}


function setMetadata(property, propertyValue){
// Description: Retrieves metadata from a layer and writes it to the field

    // alert("setting metadata property " + property + " with value " + propertyValue); // DEBUG

    // Check if active layer is background layer
    if (activeDocument.activeLayer.isBackgroundLayer) alert("Metadata cannot be written to the background layer!");

    // Create XMP object
    if (ExternalObject.AdobeXMPScript == undefined) ExternalObject.AdobeXMPScript = new ExternalObject("lib:AdobeXMPScript");
    try{
        // Document or layer metadata?
        if ((property == "atlas_margin") || 
            (property == "atlas_bleeding") || 
            (property == "atlas_padding") || 
            (property == "atlas_path") || 
            (property == "atlas_append") || 
            (property == "font_path") || 
            (property == "gui_path") || 
            (property == "img_path") || 
            (property == "proj_path")){
            xmp = activeDocument.xmpMetadata.rawData;
        }else{
            xmp = activeDocument.activeLayer.xmpMetadata.rawData;
        }
        xmpObject = new XMPMeta(xmp);

    }catch(e){
        xmpObject = new XMPMeta();
    }

    // Register and update metadata
    var kingNamespace = "http://www.king.com";
    var kingPrefix = "king";
    XMPMeta.registerNamespace(kingNamespace, kingPrefix);
    xmpObject.deleteProperty(kingNamespace, property);
    xmpObject.setProperty(kingNamespace, property, propertyValue);

    // Document or layer metadata?
    if ((property == "atlas_margin") || 
        (property == "atlas_bleeding") || 
        (property == "atlas_padding") || 
        (property == "atlas_path") || 
        (property == "atlas_append") || 
        (property == "font_path") || 
        (property == "gui_path") || 
        (property == "img_path") || 
        (property == "proj_path")){
        activeDocument.xmpMetadata.rawData = xmpObject.serialize();
    }else{
        activeDocument.activeLayer.xmpMetadata.rawData = xmpObject.serialize();
    }

}


function setSnapshot(name){
// Sets the history to a previous snapshot. Not possible via DOM - have to use Action Manager

    var desc = new ActionDescriptor();
    var ref = new ActionReference();

    ref.putName( sTID("snapshotClass"), name );
    desc.putReference( sTID("null"), ref );

    executeAction( sTID("select"), desc, DialogModes.NO );
}