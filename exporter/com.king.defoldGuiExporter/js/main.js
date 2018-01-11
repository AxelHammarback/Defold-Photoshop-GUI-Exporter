/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, window, location, CSInterface, SystemPath, themeManager*/

(function(){
    'use strict';

    var csInterface = new CSInterface();
    var extensionId =  csInterface.getExtensionID();

    function init(){
        themeManager.init(); // Testing this for OSX

        // Event listener of type PhotoshopJSONCallback
        csInterface.addEventListener("com.adobe.PhotoshopJSONCallback" + extensionId, PhotoshopCallbackUnique);

        // The callback for the event listener
        function PhotoshopCallbackUnique(csEvent){

            try{
                if (typeof csEvent.data === "string"){
                    var eventData = csEvent.data.replace("ver1,{", "{"); // Dealing with JSON obj-inside-obj -bug
                    var eventDataObject = JSON.parse(eventData);
                    csEvent.data = eventDataObject;

                    // Retrieve metadata and update controls
                    csInterface.evalScript("getMetadataAll()", function(result){

                        // Format result (return is string)
                        result = result.split(",");
                        result[2] = (result[2] === "true");
                        result[9] = (result[9] === "true");
                        result[10] = (result[10] === "true");

                        // $("#alphaCheckbox").prop("checked", result[2]);
                        $("#blendmodeMenu").val(result[3]);

                        if (result[4] == "PIVOT_NW"){ // Pivot icons
                            $("#topLeftButtonP").attr("src", "img/pivotSelTL.png");
                            $("#topButtonP").attr("src", "img/unselT.png");
                            $("#topRightButtonP").attr("src", "img/unselTR.png");
                            $("#leftButtonP").attr("src", "img/unselL.png");
                            $("#centerButtonP").attr("src", "img/unselPivotC.png");
                            $("#rightButtonP").attr("src", "img/unselR.png");
                            $("#bottomLeftButtonP").attr("src", "img/unselBL.png");
                            $("#bottomButtonP").attr("src", "img/unselB.png");
                            $("#bottomRightButtonP").attr("src", "img/unselBR.png");

                        }else if (result[4] == "PIVOT_N"){
                            $("#topLeftButtonP").attr("src", "img/unselTL.png");
                            $("#topButtonP").attr("src", "img/pivotSelT.png");
                            $("#topRightButtonP").attr("src", "img/unselTR.png");
                            $("#leftButtonP").attr("src", "img/unselL.png");
                            $("#centerButtonP").attr("src", "img/unselPivotC.png");
                            $("#rightButtonP").attr("src", "img/unselR.png");
                            $("#bottomLeftButtonP").attr("src", "img/unselBL.png");
                            $("#bottomButtonP").attr("src", "img/unselB.png");
                            $("#bottomRightButtonP").attr("src", "img/unselBR.png");

                        }else if (result[4] == "PIVOT_NE"){
                            $("#topLeftButtonP").attr("src", "img/unselTL.png");
                            $("#topButtonP").attr("src", "img/unselT.png");
                            $("#topRightButtonP").attr("src", "img/pivotSelTR.png");
                            $("#leftButtonP").attr("src", "img/unselL.png");
                            $("#centerButtonP").attr("src", "img/unselPivotC.png");
                            $("#rightButtonP").attr("src", "img/unselR.png");
                            $("#bottomLeftButtonP").attr("src", "img/unselBL.png");
                            $("#bottomButtonP").attr("src", "img/unselB.png");
                            $("#bottomRightButtonP").attr("src", "img/unselBR.png");
                           
                        }else if (result[4] == "PIVOT_W"){
                            $("#topLeftButtonP").attr("src", "img/unselTL.png");
                            $("#topButtonP").attr("src", "img/unselT.png");
                            $("#topRightButtonP").attr("src", "img/unselTR.png");
                            $("#leftButtonP").attr("src", "img/pivotSelL.png");
                            $("#centerButtonP").attr("src", "img/unselPivotC.png");
                            $("#rightButtonP").attr("src", "img/unselR.png");
                            $("#bottomLeftButtonP").attr("src", "img/unselBL.png");
                            $("#bottomButtonP").attr("src", "img/unselB.png");
                            $("#bottomRightButtonP").attr("src", "img/unselBR.png");

                        }else if (result[4] == "PIVOT_CENTER"){
                            $("#topLeftButtonP").attr("src", "img/unselTL.png");
                            $("#topButtonP").attr("src", "img/unselT.png");
                            $("#topRightButtonP").attr("src", "img/unselTR.png");
                            $("#leftButtonP").attr("src", "img/unselL.png");
                            $("#centerButtonP").attr("src", "img/pivotSelC.png");
                            $("#rightButtonP").attr("src", "img/unselR.png");
                            $("#bottomLeftButtonP").attr("src", "img/unselBL.png");
                            $("#bottomButtonP").attr("src", "img/unselB.png");
                            $("#bottomRightButtonP").attr("src", "img/unselBR.png");

                        }else if (result[4] == "PIVOT_E"){
                            $("#topLeftButtonP").attr("src", "img/unselTL.png");
                            $("#topButtonP").attr("src", "img/unselT.png");
                            $("#topRightButtonP").attr("src", "img/unselTR.png");
                            $("#leftButtonP").attr("src", "img/unselL.png");
                            $("#centerButtonP").attr("src", "img/unselPivotC.png");
                            $("#rightButtonP").attr("src", "img/pivotSelR.png");
                            $("#bottomLeftButtonP").attr("src", "img/unselBL.png");
                            $("#bottomButtonP").attr("src", "img/unselB.png");
                            $("#bottomRightButtonP").attr("src", "img/unselBR.png");

                        }else if (result[4] == "PIVOT_SW"){
                            $("#topLeftButtonP").attr("src", "img/unselTL.png");
                            $("#topButtonP").attr("src", "img/unselT.png");
                            $("#topRightButtonP").attr("src", "img/unselTR.png");
                            $("#leftButtonP").attr("src", "img/unselL.png");
                            $("#centerButtonP").attr("src", "img/unselPivotC.png");
                            $("#rightButtonP").attr("src", "img/unselR.png");
                            $("#bottomLeftButtonP").attr("src", "img/pivotSelBL.png");
                            $("#bottomButtonP").attr("src", "img/unselB.png");
                            $("#bottomRightButtonP").attr("src", "img/unselBR.png");

                        }else if (result[4] == "PIVOT_S"){
                            $("#topLeftButtonP").attr("src", "img/unselTL.png");
                            $("#topButtonP").attr("src", "img/unselT.png");
                            $("#topRightButtonP").attr("src", "img/unselTR.png");
                            $("#leftButtonP").attr("src", "img/unselL.png");
                            $("#centerButtonP").attr("src", "img/unselPivotC.png");
                            $("#rightButtonP").attr("src", "img/unselR.png");
                            $("#bottomLeftButtonP").attr("src", "img/unselBL.png");
                            $("#bottomButtonP").attr("src", "img/pivotSelB.png");
                            $("#bottomRightButtonP").attr("src", "img/unselBR.png");

                        }else if (result[4] == "PIVOT_SE"){
                            $("#topLeftButtonP").attr("src", "img/unselTL.png");
                            $("#topButtonP").attr("src", "img/unselT.png");
                            $("#topRightButtonP").attr("src", "img/unselTR.png");
                            $("#leftButtonP").attr("src", "img/unselL.png");
                            $("#centerButtonP").attr("src", "img/unselPivotC.png");
                            $("#rightButtonP").attr("src", "img/unselR.png");
                            $("#bottomLeftButtonP").attr("src", "img/unselBL.png");
                            $("#bottomButtonP").attr("src", "img/unselB.png");
                            $("#bottomRightButtonP").attr("src", "img/pivotSelBR.png");
                        }

                        if (result[5] == "ANCHOR_NW"){ // Anchor icons
                            $("#topLeftButtonA").attr("src", "img/anchorSelTL.png");
                            $("#topButtonA").attr("src", "img/unselT.png");
                            $("#topRightButtonA").attr("src", "img/unselTR.png");
                            $("#leftButtonA").attr("src", "img/unselL.png");
                            $("#centerButtonA").attr("src", "img/unselAnchorC.png");
                            $("#rightButtonA").attr("src", "img/unselR.png");
                            $("#bottomLeftButtonA").attr("src", "img/unselBL.png");
                            $("#bottomButtonA").attr("src", "img/unselB.png");
                            $("#bottomRightButtonA").attr("src", "img/unselBR.png");

                        }else if (result[5] == "ANCHOR_N"){
                            $("#topLeftButtonA").attr("src", "img/unselTL.png");
                            $("#topButtonA").attr("src", "img/anchorSelT.png");
                            $("#topRightButtonA").attr("src", "img/unselTR.png");
                            $("#leftButtonA").attr("src", "img/unselL.png");
                            $("#centerButtonA").attr("src", "img/unselAnchorC.png");
                            $("#rightButtonA").attr("src", "img/unselR.png");
                            $("#bottomLeftButtonA").attr("src", "img/unselBL.png");
                            $("#bottomButtonA").attr("src", "img/unselB.png");
                            $("#bottomRightButtonA").attr("src", "img/unselBR.png");

                        }else if (result[5] == "ANCHOR_NE"){
                            $("#topLeftButtonA").attr("src", "img/unselTL.png");
                            $("#topButtonA").attr("src", "img/unselT.png");
                            $("#topRightButtonA").attr("src", "img/anchorSelTR.png");
                            $("#leftButtonA").attr("src", "img/unselL.png");
                            $("#centerButtonA").attr("src", "img/unselAnchorC.png");
                            $("#rightButtonA").attr("src", "img/unselR.png");
                            $("#bottomLeftButtonA").attr("src", "img/unselBL.png");
                            $("#bottomButtonA").attr("src", "img/unselB.png");
                            $("#bottomRightButtonA").attr("src", "img/unselBR.png");

                        }else if (result[5] == "ANCHOR_W"){
                            $("#topLeftButtonA").attr("src", "img/unselTL.png");
                            $("#topButtonA").attr("src", "img/unselT.png");
                            $("#topRightButtonA").attr("src", "img/unselTR.png");
                            $("#leftButtonA").attr("src", "img/anchorSelL.png");
                            $("#centerButtonA").attr("src", "img/unselAnchorC.png");
                            $("#rightButtonA").attr("src", "img/unselR.png");
                            $("#bottomLeftButtonA").attr("src", "img/unselBL.png");
                            $("#bottomButtonA").attr("src", "img/unselB.png");
                            $("#bottomRightButtonA").attr("src", "img/unselBR.png");

                        }else if (result[5] == "ANCHOR_CENTER"){
                            $("#topLeftButtonA").attr("src", "img/unselTL.png");
                            $("#topButtonA").attr("src", "img/unselT.png");
                            $("#topRightButtonA").attr("src", "img/unselTR.png");
                            $("#leftButtonA").attr("src", "img/unselL.png");
                            $("#centerButtonA").attr("src", "img/anchorSelC.png");
                            $("#rightButtonA").attr("src", "img/unselR.png");
                            $("#bottomLeftButtonA").attr("src", "img/unselBL.png");
                            $("#bottomButtonA").attr("src", "img/unselB.png");
                            $("#bottomRightButtonA").attr("src", "img/unselBR.png");

                        }else if (result[5] == "ANCHOR_E"){
                            $("#topLeftButtonA").attr("src", "img/unselTL.png");
                            $("#topButtonA").attr("src", "img/unselT.png");
                            $("#topRightButtonA").attr("src", "img/unselTR.png");
                            $("#leftButtonA").attr("src", "img/unselL.png");
                            $("#centerButtonA").attr("src", "img/unselAnchorC.png");
                            $("#rightButtonA").attr("src", "img/anchorSelR.png");
                            $("#bottomLeftButtonA").attr("src", "img/unselBL.png");
                            $("#bottomButtonA").attr("src", "img/unselB.png");
                            $("#bottomRightButtonA").attr("src", "img/unselBR.png");

                        }else if (result[5] == "ANCHOR_SW"){
                            $("#topLeftButtonA").attr("src", "img/unselTL.png");
                            $("#topButtonA").attr("src", "img/unselT.png");
                            $("#topRightButtonA").attr("src", "img/unselTR.png");
                            $("#leftButtonA").attr("src", "img/unselL.png");
                            $("#centerButtonA").attr("src", "img/unselAnchorC.png");
                            $("#rightButtonA").attr("src", "img/unselR.png");
                            $("#bottomLeftButtonA").attr("src", "img/anchorSelBL.png");
                            $("#bottomButtonA").attr("src", "img/unselB.png");
                            $("#bottomRightButtonA").attr("src", "img/unselBR.png");

                        }else if (result[5] == "ANCHOR_S"){
                            $("#topLeftButtonA").attr("src", "img/unselTL.png");
                            $("#topButtonA").attr("src", "img/unselT.png");
                            $("#topRightButtonA").attr("src", "img/unselTR.png");
                            $("#leftButtonA").attr("src", "img/unselL.png");
                            $("#centerButtonA").attr("src", "img/unselAnchorC.png");
                            $("#rightButtonA").attr("src", "img/unselR.png");
                            $("#bottomLeftButtonA").attr("src", "img/unselBL.png");
                            $("#bottomButtonA").attr("src", "img/anchorSelB.png");
                            $("#bottomRightButtonA").attr("src", "img/unselBR.png");

                        }else if (result[5] == "ANCHOR_SE"){
                            $("#topLeftButtonA").attr("src", "img/unselTL.png");
                            $("#topButtonA").attr("src", "img/unselT.png");
                            $("#topRightButtonA").attr("src", "img/unselTR.png");
                            $("#leftButtonA").attr("src", "img/unselL.png");
                            $("#centerButtonA").attr("src", "img/unselAnchorC.png");
                            $("#rightButtonA").attr("src", "img/unselR.png");
                            $("#bottomLeftButtonA").attr("src", "img/unselBL.png");
                            $("#bottomButtonA").attr("src", "img/unselB.png");
                            $("#bottomRightButtonA").attr("src", "img/anchorSelBR.png");
                        }

                        $("#adjustMenu").val(result[6]);
                        $("#layerField").val(result[7]);

                        if (result[8] == "CLIPPING_MODE_NONE"){
                            $("#clippingNone").prop("checked", true);
                            $("#clippingStencil").prop("checked", false);
                        }else{
                            $("#clippingNone").prop("checked", false);
                            $("#clippingStencil").prop("checked", true);
                        }

                        $("#clipperVisible").prop("checked", result[9]);
                        $("#clipperInverted").prop("checked", result[10]);
                        $("#slice1Field").val(result[11]);
                        $("#slice2Field").val(result[12]);
                        $("#slice3Field").val(result[13]);
                        $("#slice4Field").val(result[14]);
                        $("#marginField").val(result[15]);
                        $("#bleedingField").val(result[16]);
                        $("#paddingField").val(result[17]);
                        $("#atlasFileField").val(result[1]);
                        $("#atlasAppend").prop("checked", result[2]);
                        $("#guiFileField").val(result[0]);
                        $("#imagesField").val(result[18]);
                        $("#fontsField").val(result[20]);
                        $("#projectField").val(result[19]);

                        // Set required path backgrounds to red if they are blank strings or undefined
                        if ((result[19] == undefined) || (result[19] == "")){
                            $("#projectField").css("background-color", "#aa4444");
                        }else{
                            $("#projectField").css("background-color", "");
                        }
                        
                        if ((result[1] == undefined) || (result[1] == "")){
                            $("#atlasFileField").css("background-color", "#aa4444");
                        }else{
                            $("#atlasFileField").css("background-color", "");
                        }
                        
                        if ((result[0] == undefined) || (result[0] == "")){
                            $("#guiFileField").css("background-color", "#aa4444");
                        }else{
                            $("#guiFileField").css("background-color", "");
                        }

                        // Hide/Show slice9 settings depending on layer type
                        if (result[21] == "LayerKind.NORMAL"){
                            $(".font-settings").hide();
                            $(".slice9-settings").show();
                        }else{
                            $(".font-settings").show();
                            $(".slice9-settings").hide();
                            
                            if (result[20] == ""){ // No path specified
                                $(".fontSelector").css("background-color", "#aa4444");

                                // Show default option, destroy the rest
                                $("#fontSelectMenu option[value='Default']").show();
                                $("#fontSelectMenu").find("option:gt(0)").remove();

                            }else{ // Path specified
                                $(".fontSelector").css("background-color", "");

                                // Hide default option, create the rest dynamically
                                $("#fontSelectMenu option[value='Default']").hide();
                                var fonts = result[22].split("|");
                                for (var i in fonts){
                                    if ($("#fontSelectMenu option[value=" + fonts[i] + "]").length){
                                    }else{
                                        $("#fontSelectMenu").append("<option value=" + fonts[i] + ">" + fonts[i] + "</option>");
                                    }
                                    $("#fontSelectMenu :selected").text(fonts[i]);
                                }
                            }
                            $("#fontSelectMenu :selected").text(result[23]);

                        }// End of TextLayer -selected

                    });// End of getMetadataAll -callback

                }else{
                    console.log("PhotoshopCallbackUnique expecting string for csEvent.data!");
                }

            }catch(e){
                console.log("PhotoshopCallbackUnique caught exception: " + e);
            }
        }

        // Path check for validating paths on the UI in case the user gets it wrong when manually entering them
        function pathCheck(field, pathType, incPath){
            // alert("ran pathCheck!\npathType: " + pathType + "\nincPath: " + incPath); // DEBUG

            var path;

            // Clear BG color
            field.css("background-color", "");

            // User is manually editing the path
            if (incPath == undefined){
                path = field.val().replace(/\\/g,"/"); // Back to front slash

            }else{ // Path retrieved from file browsing
                path = incPath;
            }

            // Path is blank
            if (path == ""){
                field.val(path);

                // Alert user by turning the field red
                if ((pathType == "project") || (pathType == "atlas") || (pathType == "gui")){
                    field.css("background-color", "#aa4444");
                }
                return; // Early exit
            }

            // Make the sub-folder paths relative
            var projPath = $("#projectField").val();
            if (pathType != "project"){
                path = path.replace(projPath, "");
                if (path.match(/(^\/)/) == undefined) path = "/" + path; // Missing starting front slash
            }
            if (path == "/") path = "";

            // Make sure we have the correct extension
            if (pathType == "project"){
                if (incPath != undefined) path = incPath;
            }else if (pathType == "atlas"){
                if (path.match(/(.atlas$)/) == undefined) path = path + ".atlas";
            }else if (pathType == "gui"){
                if (path.match(/(.gui$)/) == undefined) path = path + ".gui";
            }

            // Update field on UI
            field.val(path);

            // alert("pathCheck ran - end result: \n" + path); // DEBUG
        }

        // Manages CSEvent registration
        // Remove later and just hardcode this section - no need for a toggle as we want it active all the time
        function toggleEventRegistering(eventStringID, isOn){
            var event;
            if (isOn){
                event = new CSEvent("com.adobe.PhotoshopRegisterEvent", "APPLICATION");
            }else{
                event = new CSEvent("com.adobe.PhotoshopUnRegisterEvent", "APPLICATION");
            }
            event.extensionId = extensionId;

            // Convert stringID to a typeID and dispatch the event
            csInterface.evalScript("app.stringIDToTypeID('" + eventStringID + "')", function (typeID){
                event.data = typeID;
                csInterface.dispatchEvent(event);
                // alert("Dispatched Event " + eventStringID, event); // DEBUG
            });
        }

        // Changes an absolute path to be relative to the project folder
        function toRelative(path, field){
            var projPath = $("#projectField").val();
            path = path.replace(projPath, "");
            if (path.match(/(^\/)/) == undefined) path = "/" + path; // In case the user get it wrong
            field.val(path);

            return path;
        }
        
        // Auto refresh - DEBUG
        /*
        $('#refresh').change(function(){ // #select before
            toggleEventRegistering("select", this.checked); // (this.id, this.checked) before
        });
        */
        toggleEventRegistering("select", true); // Make permanent?

        $("#toggleButton").click(function(){
            $('.path-settings').toggle();
        });

        // Inherit alpha
        /* Obsolete. Always true now
        $("#alphaCheckbox").change(function(){
            var cBox = $("#alphaCheckbox").prop("checked");
            csInterface.evalScript("setMetadata('inherit_alpha', '" + cBox + "')");
        });
        */

        // Alpha blend mode
        $("#blendmodeMenu").change(function(){
            var selected = $("#blendmodeMenu").find(":selected").text();
            if (selected == "ALPHA"){
                selected = "BLEND_MODE_ALPHA";
            }else if (selected == "ADD"){
                selected = "BLEND_MODE_ADD";
            }else{
                selected = "BLEND_MODE_MULT";
            }
            csInterface.evalScript("setBlendMode('" + selected + "')");
            csInterface.evalScript("setMetadata('blend_mode', '" + selected + "')");
        });

        // Pivot position
        $("#topLeftButtonP").click(function(){
            $("#topLeftButtonP").attr("src", "img/pivotSelTL.png");
            $("#topButtonP").attr("src", "img/unselT.png");
            $("#topRightButtonP").attr("src", "img/unselTR.png");
            $("#leftButtonP").attr("src", "img/unselL.png");
            $("#centerButtonP").attr("src", "img/unselPivotC.png");
            $("#rightButtonP").attr("src", "img/unselR.png");
            $("#bottomLeftButtonP").attr("src", "img/unselBL.png");
            $("#bottomButtonP").attr("src", "img/unselB.png");
            $("#bottomRightButtonP").attr("src", "img/unselBR.png");
            csInterface.evalScript("setMetadata('pivot', 'PIVOT_NW')");
        });
        $("#topButtonP").click(function(){
            $("#topLeftButtonP").attr("src", "img/unselTL.png");
            $("#topButtonP").attr("src", "img/pivotSelT.png");
            $("#topRightButtonP").attr("src", "img/unselTR.png");
            $("#leftButtonP").attr("src", "img/unselL.png");
            $("#centerButtonP").attr("src", "img/unselPivotC.png");
            $("#rightButtonP").attr("src", "img/unselR.png");
            $("#bottomLeftButtonP").attr("src", "img/unselBL.png");
            $("#bottomButtonP").attr("src", "img/unselB.png");
            $("#bottomRightButtonP").attr("src", "img/unselBR.png");
            csInterface.evalScript("setMetadata('pivot', 'PIVOT_N')");
        });
        $("#topRightButtonP").click(function(){
            $("#topLeftButtonP").attr("src", "img/unselTL.png");
            $("#topButtonP").attr("src", "img/unselT.png");
            $("#topRightButtonP").attr("src", "img/pivotSelTR.png");
            $("#leftButtonP").attr("src", "img/unselL.png");
            $("#centerButtonP").attr("src", "img/unselPivotC.png");
            $("#rightButtonP").attr("src", "img/unselR.png");
            $("#bottomLeftButtonP").attr("src", "img/unselBL.png");
            $("#bottomButtonP").attr("src", "img/unselB.png");
            $("#bottomRightButtonP").attr("src", "img/unselBR.png");
            csInterface.evalScript("setMetadata('pivot', 'PIVOT_NE')");
        });
        $("#leftButtonP").click(function(){
            $("#topLeftButtonP").attr("src", "img/unselTL.png");
            $("#topButtonP").attr("src", "img/unselT.png");
            $("#topRightButtonP").attr("src", "img/unselTR.png");
            $("#leftButtonP").attr("src", "img/pivotSelL.png");
            $("#centerButtonP").attr("src", "img/unselPivotC.png");
            $("#rightButtonP").attr("src", "img/unselR.png");
            $("#bottomLeftButtonP").attr("src", "img/unselBL.png");
            $("#bottomButtonP").attr("src", "img/unselB.png");
            $("#bottomRightButtonP").attr("src", "img/unselBR.png");
            csInterface.evalScript("setMetadata('pivot', 'PIVOT_W')");
        });
        $("#centerButtonP").click(function(){
            $("#topLeftButtonP").attr("src", "img/unselTL.png");
            $("#topButtonP").attr("src", "img/unselT.png");
            $("#topRightButtonP").attr("src", "img/unselTR.png");
            $("#leftButtonP").attr("src", "img/unselL.png");
            $("#centerButtonP").attr("src", "img/pivotSelC.png");
            $("#rightButtonP").attr("src", "img/unselR.png");
            $("#bottomLeftButtonP").attr("src", "img/unselBL.png");
            $("#bottomButtonP").attr("src", "img/unselB.png");
            $("#bottomRightButtonP").attr("src", "img/unselBR.png");
            csInterface.evalScript("setMetadata('pivot', 'PIVOT_CENTER')");
        });
        $("#rightButtonP").click(function(){
            $("#topLeftButtonP").attr("src", "img/unselTL.png");
            $("#topButtonP").attr("src", "img/unselT.png");
            $("#topRightButtonP").attr("src", "img/unselTR.png");
            $("#leftButtonP").attr("src", "img/unselL.png");
            $("#centerButtonP").attr("src", "img/unselPivotC.png");
            $("#rightButtonP").attr("src", "img/pivotSelR.png");
            $("#bottomLeftButtonP").attr("src", "img/unselBL.png");
            $("#bottomButtonP").attr("src", "img/unselB.png");
            $("#bottomRightButtonP").attr("src", "img/unselBR.png");
            csInterface.evalScript("setMetadata('pivot', 'PIVOT_E')");
        });
        $("#bottomLeftButtonP").click(function(){
            $("#topLeftButtonP").attr("src", "img/unselTL.png");
            $("#topButtonP").attr("src", "img/unselT.png");
            $("#topRightButtonP").attr("src", "img/unselTR.png");
            $("#leftButtonP").attr("src", "img/unselL.png");
            $("#centerButtonP").attr("src", "img/unselPivotC.png");
            $("#rightButtonP").attr("src", "img/unselR.png");
            $("#bottomLeftButtonP").attr("src", "img/pivotSelBL.png");
            $("#bottomButtonP").attr("src", "img/unselB.png");
            $("#bottomRightButtonP").attr("src", "img/unselBR.png");
            csInterface.evalScript("setMetadata('pivot', 'PIVOT_SW')");
        });
        $("#bottomButtonP").click(function(){
            $("#topLeftButtonP").attr("src", "img/unselTL.png");
            $("#topButtonP").attr("src", "img/unselT.png");
            $("#topRightButtonP").attr("src", "img/unselTR.png");
            $("#leftButtonP").attr("src", "img/unselL.png");
            $("#centerButtonP").attr("src", "img/unselPivotC.png");
            $("#rightButtonP").attr("src", "img/unselR.png");
            $("#bottomLeftButtonP").attr("src", "img/unselBL.png");
            $("#bottomButtonP").attr("src", "img/pivotSelB.png");
            $("#bottomRightButtonP").attr("src", "img/unselBR.png");
            csInterface.evalScript("setMetadata('pivot', 'PIVOT_S')");
        });
        $("#bottomRightButtonP").click(function(){
            $("#topLeftButtonP").attr("src", "img/unselTL.png");
            $("#topButtonP").attr("src", "img/unselT.png");
            $("#topRightButtonP").attr("src", "img/unselTR.png");
            $("#leftButtonP").attr("src", "img/unselL.png");
            $("#centerButtonP").attr("src", "img/unselPivotC.png");
            $("#rightButtonP").attr("src", "img/unselR.png");
            $("#bottomLeftButtonP").attr("src", "img/unselBL.png");
            $("#bottomButtonP").attr("src", "img/unselB.png");
            $("#bottomRightButtonP").attr("src", "img/pivotSelBR.png");
            csInterface.evalScript("setMetadata('pivot', 'PIVOT_SE')");
        });

        // Anchor position
        $("#topLeftButtonA").click(function(){
            $("#topLeftButtonA").attr("src", "img/anchorSelTL.png");
            $("#topButtonA").attr("src", "img/unselT.png");
            $("#topRightButtonA").attr("src", "img/unselTR.png");
            $("#leftButtonA").attr("src", "img/unselL.png");
            $("#centerButtonA").attr("src", "img/unselAnchorC.png");
            $("#rightButtonA").attr("src", "img/unselR.png");
            $("#bottomLeftButtonA").attr("src", "img/unselBL.png");
            $("#bottomButtonA").attr("src", "img/unselB.png");
            $("#bottomRightButtonA").attr("src", "img/unselBR.png");
            csInterface.evalScript("setMetadata('anchor', 'ANCHOR_NW')");
        });
        $("#topButtonA").click(function(){
            $("#topLeftButtonA").attr("src", "img/unselTL.png");
            $("#topButtonA").attr("src", "img/anchorSelT.png");
            $("#topRightButtonA").attr("src", "img/unselTR.png");
            $("#leftButtonA").attr("src", "img/unselL.png");
            $("#centerButtonA").attr("src", "img/unselAnchorC.png");
            $("#rightButtonA").attr("src", "img/unselR.png");
            $("#bottomLeftButtonA").attr("src", "img/unselBL.png");
            $("#bottomButtonA").attr("src", "img/unselB.png");
            $("#bottomRightButtonA").attr("src", "img/unselBR.png");
            csInterface.evalScript("setMetadata('anchor', 'ANCHOR_N')");
        });
        $("#topRightButtonA").click(function(){
            $("#topLeftButtonA").attr("src", "img/unselTL.png");
            $("#topButtonA").attr("src", "img/unselT.png");
            $("#topRightButtonA").attr("src", "img/anchorSelTR.png");
            $("#leftButtonA").attr("src", "img/unselL.png");
            $("#centerButtonA").attr("src", "img/unselAnchorC.png");
            $("#rightButtonA").attr("src", "img/unselR.png");
            $("#bottomLeftButtonA").attr("src", "img/unselBL.png");
            $("#bottomButtonA").attr("src", "img/unselB.png");
            $("#bottomRightButtonA").attr("src", "img/unselBR.png");
            csInterface.evalScript("setMetadata('anchor', 'ANCHOR_NE')");
        });
        $("#leftButtonA").click(function(){
            $("#topLeftButtonA").attr("src", "img/unselTL.png");
            $("#topButtonA").attr("src", "img/unselT.png");
            $("#topRightButtonA").attr("src", "img/unselTR.png");
            $("#leftButtonA").attr("src", "img/anchorSelL.png");
            $("#centerButtonA").attr("src", "img/unselAnchorC.png");
            $("#rightButtonA").attr("src", "img/unselR.png");
            $("#bottomLeftButtonA").attr("src", "img/unselBL.png");
            $("#bottomButtonA").attr("src", "img/unselB.png");
            $("#bottomRightButtonA").attr("src", "img/unselBR.png");
            csInterface.evalScript("setMetadata('anchor', 'ANCHOR_W')");
        });
        $("#centerButtonA").click(function(){
            $("#topLeftButtonA").attr("src", "img/unselTL.png");
            $("#topButtonA").attr("src", "img/unselT.png");
            $("#topRightButtonA").attr("src", "img/unselTR.png");
            $("#leftButtonA").attr("src", "img/unselL.png");
            $("#centerButtonA").attr("src", "img/anchorSelC.png");
            $("#rightButtonA").attr("src", "img/unselR.png");
            $("#bottomLeftButtonA").attr("src", "img/unselBL.png");
            $("#bottomButtonA").attr("src", "img/unselB.png");
            $("#bottomRightButtonA").attr("src", "img/unselBR.png");
            csInterface.evalScript("setMetadata('anchor', 'ANCHOR_CENTER')");
        });
        $("#rightButtonA").click(function(){
            $("#topLeftButtonA").attr("src", "img/unselTL.png");
            $("#topButtonA").attr("src", "img/unselT.png");
            $("#topRightButtonA").attr("src", "img/unselTR.png");
            $("#leftButtonA").attr("src", "img/unselL.png");
            $("#centerButtonA").attr("src", "img/unselAnchorC.png");
            $("#rightButtonA").attr("src", "img/anchorSelR.png");
            $("#bottomLeftButtonA").attr("src", "img/unselBL.png");
            $("#bottomButtonA").attr("src", "img/unselB.png");
            $("#bottomRightButtonA").attr("src", "img/unselBR.png");
            csInterface.evalScript("setMetadata('anchor', 'ANCHOR_E')");
        });
        $("#bottomLeftButtonA").click(function(){
            $("#topLeftButtonA").attr("src", "img/unselTL.png");
            $("#topButtonA").attr("src", "img/unselT.png");
            $("#topRightButtonA").attr("src", "img/unselTR.png");
            $("#leftButtonA").attr("src", "img/unselL.png");
            $("#centerButtonA").attr("src", "img/unselAnchorC.png");
            $("#rightButtonA").attr("src", "img/unselR.png");
            $("#bottomLeftButtonA").attr("src", "img/anchorSelBL.png");
            $("#bottomButtonA").attr("src", "img/unselB.png");
            $("#bottomRightButtonA").attr("src", "img/unselBR.png");
            csInterface.evalScript("setMetadata('anchor', 'ANCHOR_SW')");
        });
        $("#bottomButtonA").click(function(){
            $("#topLeftButtonA").attr("src", "img/unselTL.png");
            $("#topButtonA").attr("src", "img/unselT.png");
            $("#topRightButtonA").attr("src", "img/unselTR.png");
            $("#leftButtonA").attr("src", "img/unselL.png");
            $("#centerButtonA").attr("src", "img/unselAnchorC.png");
            $("#rightButtonA").attr("src", "img/unselR.png");
            $("#bottomLeftButtonA").attr("src", "img/unselBL.png");
            $("#bottomButtonA").attr("src", "img/anchorSelB.png");
            $("#bottomRightButtonA").attr("src", "img/unselBR.png");
            csInterface.evalScript("setMetadata('anchor', 'ANCHOR_S')");
        });
        $("#bottomRightButtonA").click(function(){
            $("#topLeftButtonA").attr("src", "img/unselTL.png");
            $("#topButtonA").attr("src", "img/unselT.png");
            $("#topRightButtonA").attr("src", "img/unselTR.png");
            $("#leftButtonA").attr("src", "img/unselL.png");
            $("#centerButtonA").attr("src", "img/unselAnchorC.png");
            $("#rightButtonA").attr("src", "img/unselR.png");
            $("#bottomLeftButtonA").attr("src", "img/unselBL.png");
            $("#bottomButtonA").attr("src", "img/unselB.png");
            $("#bottomRightButtonA").attr("src", "img/anchorSelBR.png");
            csInterface.evalScript("setMetadata('anchor', 'ANCHOR_SE')");
        });

        // Adjust mode
        $("#adjustMenu").change(function(){
            var selected = $("#adjustMenu").find(":selected").text();
            if (selected == "FIT"){
                selected = "ADJUST_MODE_FIT";
            }else if (selected == "ZOOM"){
                selected = "ADJUST_MODE_ZOOM";
            }else{
                selected = "ADJUST_MODE_STRETCH";
            }
            csInterface.evalScript("setMetadata('adjust_mode', '" + selected + "')");
        });

        // Layer
        $("#layerField").change(function(){
            var value = $("#layerField").val();
            csInterface.evalScript("setMetadata('layer', '" + value + "')");
        });

        // Clipping
        $("#clippingNone").click(function(){
            csInterface.evalScript("setMetadata('clipping_mode', 'CLIPPING_MODE_NONE')");
        });
        $("#clippingStencil").click(function(){
            csInterface.evalScript("setMetadata('clipping_mode', 'CLIPPING_MODE_STENCIL')");
        });

        // Visible clipper
        $("#clipperVisible").click(function(){
            var cBox = $("#clipperVisible").prop("checked");
            csInterface.evalScript("setMetadata('clipping_visible', '" + cBox + "')");
        });
        
        // Inverted clipper
        $("#clipperInverted").click(function(){
            var cBox = $("#clipperInverted").prop("checked");
            csInterface.evalScript("setMetadata('clipping_inverted', '" + cBox + "')");
        });

        // Font menu
        $("#fontSelectMenu").change(function(){
            var selected = $("#fontSelectMenu").val();
            csInterface.evalScript("setMetadata('font', '" + selected +"')");
        });

        // Slice9
        $("#slice1Field").change(function(){
            var value = $("#slice1Field").val();
            csInterface.evalScript("setMetadata('slice9x', '" + value + "')");
        });
        $("#slice2Field").change(function(){
            var value = $("#slice2Field").val();
            csInterface.evalScript("setMetadata('slice9y', '" + value + "')");
        });
        $("#slice3Field").change(function(){
            var value = $("#slice3Field").val();
            csInterface.evalScript("setMetadata('slice9z', '" + value + "')");
        });
        $("#slice4Field").change(function(){
            var value = $("#slice4Field").val();
            csInterface.evalScript("setMetadata('slice9w', '" + value + "')");
        });

        // Project
        // Works on Windows
        $("#projectField").change(function(){
            var field = $("#projectField");
            pathCheck(field, "project");
            csInterface.evalScript("setMetadata('proj_path', '" + field.val() + "')");
        });
        $("#projectButton").click(function(){
            var field = $("#projectField");
            csInterface.evalScript("browse('folder', 'project')", function(result){
                if (result != "EvalScript error."){ // Cancelled/Failed
                    pathCheck(field, "project", result);
                    csInterface.evalScript("setMetadata('proj_path', '" + field.val() + "')");
                }
            });
        });

        // Atlas margin
        $("#marginField").change(function(){
            var value = $("#marginField").val();
            csInterface.evalScript("setMetadata('atlas_margin', '" + value + "')");
        });

        // Atlas bleeding
        $("#bleedingField").change(function(){
            var value = $("#bleedingField").val();
            csInterface.evalScript("setMetadata('atlas_bleeding', '" + value + "')");
        });

        // Atlas padding
        $("#paddingField").change(function(){
            var value = $("#paddingField").val();
            csInterface.evalScript("setMetadata('atlas_padding', '" + value + "')");
        });

        // Atlas append/creation
        $("#atlasAppend").click(function(){
            var cBox = $("#atlasAppend").prop("checked");
            csInterface.evalScript("setMetadata('atlas_append', '" + cBox + "')");
        });

        // Atlas file
        // Works on Windows
        $("#atlasFileField").change(function(){
            var field = $("#atlasFileField");
            pathCheck(field, "atlas");
            csInterface.evalScript("setMetadata('atlas_path', '" + field.val() + "')");
        });
        $("#atlasButton").click(function(){
            var field = $("#atlasFileField");
            csInterface.evalScript("browse('file', 'atlas')", function(result){
                if (result != "EvalScript error."){ // Cancelled/Failed
                    pathCheck(field, "atlas", result);
                    csInterface.evalScript("setMetadata('atlas_path', '" + field.val() + "')");
                }
            });
        });

        // GUI file
        // Works on Windows
        $("#guiFileField").change(function(){
            var field = $("#guiFileField");
            pathCheck(field, "gui");
            csInterface.evalScript("setMetadata('gui_path', '" + field.val() + "')");
        });
        $("#guiButton").click(function(){
            var field = $("#guiFileField");
            csInterface.evalScript("browse('file', 'gui')", function(result){
                if (result != "EvalScript error."){ // Cancelled/Failed
                    pathCheck(field, "gui", result);
                    csInterface.evalScript("setMetadata('gui_path', '" + field.val() + "')");
                }
            });
        });

        // Fonts folder
        // Works on windows
        $("#fontsField").change(function(){
            var field = $("#fontsField");
            pathCheck(field, "font");
            csInterface.evalScript("setMetadata('font_path', '" + field.val() + "')");
        });
        $("#fontsButton").click(function(){
            var field = $("#fontsField");
            csInterface.evalScript("browse('folder', 'fonts')", function(result){
                if (result != "EvalScript error."){ // Cancelled/Failed
                    pathCheck(field, "font", result);
                    csInterface.evalScript("setMetadata('font_path', '" + field.val() + "')");
                }
            });
        });

        // Images folder
        // Works on windows
        $("#imagesField").change(function(){
            var field = $("#imagesField");
            pathCheck(field, "images");
            csInterface.evalScript("setMetadata('img_path', '" + field.val() + "')");
        });
        $("#imagesButton").click(function(){
            var field = $("#imagesField");
            csInterface.evalScript("browse('folder', 'images')", function(result){
                if (result != "EvalScript error."){ // Cancelled/Failed
                    pathCheck(field, "images", result);
                    csInterface.evalScript("setMetadata('img_path', '" + field.val() + "')");
                }
            });
        });

        // Export
        $("#exportButton").click(function(){
            csInterface.evalScript("exportFiles()");
        });

    }
    init();
}());