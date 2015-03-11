/**
 * Created by Dylan on 10/02/2015.
 */

function makeRender(state){

    fileContent = "";

    var tracks = currentProject.tabListTracks;
    var nextElement;
    var elementEnd;
    var tempIndex;
    var i;
    for (t=0;t<tracks.length;t++)
    {
        elementInTrack = tracks[t].tabElements;
        //fileContent += "\n track "+t;
        console.log("track ",t);
        for (e =0;e<elementInTrack.length;e++){
            console.log("element ", e);
            if  (e == 0)
            {
                //fileContent += "first";
                if (elementInTrack[e].marginLeft != 0)
                {
                    //fileContent += "\n black from 0 to "+ elementInTrack[e].marginLeft/oneSecond;
                    console.log("black from 0 to ", elementInTrack[e].marginLeft/oneSecond )
                }

                elementEnd = elementInTrack[e].marginLeft + elementInTrack[e].width

                //fileContent += "\n element from "+elementInTrack[e].marginLeft + " to " + elementEnd;
                console.log("element from "+elementInTrack[e].marginLeft + " to " + elementEnd);
                tempIndex = e;
                tempIndex++;
                if (!(tempIndex > elementInTrack.length)) {
                    nextElement = elementInTrack[tempIndex];
                    if (nextElement.marginLeft == elementEnd) {
                        //fileContent += "\n element+1 sticked !";
                        console.log("sticked");
                    }
                    else {
                        //fileContent += "\n black from "+elementEnd + "to "+ nextElement.marginLeft;
                        console.log("black from ", elementEnd, "to ", nextElement.marginLeft);
                    }
                }


            }
            else if (e == elementInTrack.length-1)
            {
                //fileContent += "\nlastELement from "+ elementInTrack[e].marginLeft + " to "+ elementInTrack[e].marginLeft + elementInTrack[e].width
                console.log("last element from",  elementInTrack[e].marginLeft , " to ", elementInTrack[e].marginLeft + elementInTrack[e].width)
            }
            else
            {
                elementEnd = elementInTrack[e].marginLeft + elementInTrack[e].width

                //fileContent += "\n element from "+elementInTrack[e].marginLeft + " to " + elementEnd;
                console.log("element from "+elementInTrack[e].marginLeft + " to " + elementEnd)
                tempIndex = e;
                tempIndex++;
                if (!(tempIndex > elementInTrack.length)) {
                    nextElement = elementInTrack[tempIndex];
                    if (nextElement.marginLeft == elementEnd) {
                        //fileContent += "\n element+1 sticked !";
                        console.log("sticked");
                    }
                    else {
                        //fileContent += "\n black from "+elementEnd + "to "+ nextElement.marginLeft;
                        console.log("black from ", elementEnd, "to ", nextElement.marginLeft);
                    }
                }
            }


        }
    }

}
