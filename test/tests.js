QUnit.test( "Supported image file types should return its types", function( assert ) {
    assert.equal( getTypeFile("test.png"), TYPE.IMAGE);
    assert.equal( getTypeFile("test.gif"), TYPE.IMAGE);
    assert.equal( getTypeFile("test.jpeg"), TYPE.IMAGE);
    assert.equal( getTypeFile("test.jpg"), TYPE.IMAGE);
    assert.equal( getTypeFile("test.bmp"), TYPE.IMAGE);

    assert.equal( getTypeFile("test.bat"), 'ERROR');
    assert.equal( getTypeFile("test.tiff"), 'ERROR');
});

QUnit.test("Supported audio file types should return its type", function ( assert ) {
    assert.equal( getTypeFile("test.mp3"), TYPE.AUDIO);
    assert.equal( getTypeFile("test.wav"), TYPE.AUDIO);
    assert.equal( getTypeFile("test.wma"), TYPE.AUDIO);
    assert.equal( getTypeFile("test.oga"), TYPE.AUDIO);
    assert.equal( getTypeFile("test.ogg"), TYPE.AUDIO);

    assert.equal( getTypeFile("test.m4a"), 'ERROR');
    assert.equal( getTypeFile("test.au"), 'ERROR');
    assert.equal( getTypeFile("test.nsf"), 'ERROR');
});

QUnit.test("Supported video file types should return its type", function ( assert ) {
    assert.equal( getTypeFile("test.avi"), TYPE.VIDEO);
    assert.equal( getTypeFile("test.mp4"), TYPE.VIDEO);
    assert.equal( getTypeFile("test.wmv"), TYPE.VIDEO);
    assert.equal( getTypeFile("test.flv"), TYPE.VIDEO);
    assert.equal( getTypeFile("test.webm"), TYPE.VIDEO);
    assert.equal( getTypeFile("test.ogv"), TYPE.VIDEO);
    assert.equal( getTypeFile("test.mov"), TYPE.VIDEO);

    assert.equal( getTypeFile("test.gifv"), 'ERROR');
    assert.equal( getTypeFile("test.amv"), 'ERROR');
    assert.equal( getTypeFile("test.m4v"), 'ERROR');
});

QUnit.test("Unsupported file types should return errors", function ( assert ) {
    assert.equal( getTypeFile("test.pdf"), 'ERROR');
    assert.equal( getTypeFile("test.docx"), 'ERROR');
    assert.equal( getTypeFile("test.js"), 'ERROR');
    assert.equal( getTypeFile("test.html"), 'ERROR');
    assert.equal( getTypeFile("test.md"), 'ERROR');
    assert.equal( getTypeFile("test.txt"), 'ERROR');
    assert.equal( getTypeFile("test.exe"), 'ERROR');

    assert.throws(
        function() { throw getTypeFile(32034912) },
        "Invalid fileName"
    );
    assert.throws(
        function() { throw getTypeFile(new Object()) },
        "Invalid fileName"
    );
    assert.throws(
        function() { throw getTypeFile(null) },
        "Invalid fileName"
    );
    assert.throws(
        function() { throw getTypeFile({test:"nothing"}) },
        "Invalid fileName"
    );
    assert.throws(
        function() { throw getTypeFile([1, 2, 3, 4, 5]) },
        "Invalid fileName"
    );
});

QUnit.test("New text element tests", function(assert){
    var MTETest = new ManageTextElement;

    MTETest.newTextElement(1);

    assert.equal(MTETest.properties.font, "Calbri");
    assert.equal(MTETest.properties.size, 50);
    assert.equal(MTETest.properties.color, "#000000");
    assert.equal(MTETest.properties.align, "center");
    assert.equal(MTETest.isEditing, false);

});

QUnit.test("Editing text element tests", function( assert ){
    var MTETest = new ManageTextElement;

    MTETest.newTextElement(1);

    MTETest.changeFont("Times New Roman");
    assert.equal(MTETest.properties.font, "Times New Roman");

    MTETest.changeSizeText(60);
    assert.equal(MTETest.properties.size, 60);

    MTETest.changeSizeText(1);
    assert.equal(MTETest.properties.size, 1);

    MTETest.changeSizeText(1000);
    assert.equal(MTETest.properties.size, 1000);

    MTETest.changeColor("#FFFFFF");
    assert.equal(MTETest.properties.color, "#FFFFFF");

    MTETest.changeTextAlign("right");
    assert.equal(MTETest.properties.align, "center");

    MTETest.updateText("Test");
    assert.equal(MTETest.text, "Test");
});

QUnit.test("Creating new Project tests", function( assert ){
    var testP = new Project("Test Project", 1, "Jakob", "03/04/2019");

    assert.equal(testP.name, "Test Project");
    assert.equal(testP.uId, 1);
    assert.equal(testP.username, "Jakob");
    assert.equal(testP.dateCreation, "03/04/2020");
    assert.equal(testP.autoSave, false);

});

QUnit.test("Changing autosave test", function( assert ){
    var testP = new Project("Test Project", 1, "Jakob", "03/04/2019");

    assert.equal(testP.autoSave, false);
    testP.switchAutoSave();
    assert.equal(testP.autoSave, true);

});
