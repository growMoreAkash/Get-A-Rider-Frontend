var map;
var mapcanvas;

let coordinates = [];

function InitMap() {
    var location = new google.maps.LatLng(28.620585, 77.228609);

    mapOptions = {
        zoom: 12,
        center: location,
        mapTypeId: google.maps.MapTypeId.RoadMap,
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    var all_overlays = [];
    var selectedShape;

    var drawingManager = new google.maps.drawing.DrawingManager({
        drawingControlOptions: {
            position: google.maps.ControlPosition.Top_CENTER,
            drawingModes: [
                google.maps.drawing.OverlayType.POLYGON,
                // google.maps.drawing.OverlayType.MARKER,
                // google.maps.drawing.OverlayType.CIRCLE,
                // google.maps.drawing.OverlayType.RECTANGLE,
            ],
        },
        markerOptions: {},
        circleOptions: {
            fillColor: '#ffff00',
            fillOpacity: 0.2,
            strokeWeight: 3,
            clickable: false,
            editable: true,
            zIndex: 1,
        },
        polygonOptions: {
            clickable: true,
            draggable: false,
            editable: true,
            fillColor: '#ADFF2F',
            fillOpacity: 0.5,
        },
        rectangleOptions: {
            fillColor: '#ffff00',
            fillOpacity: 0.5,
            clickable: true,
            editable: true,
            draggable: true,
        },
    });

    drawingManager.setMap(map);

    function clearSelection() {
        if (selectedShape) {
            selectedShape.setEditable(false);
            selectedShape = null;
        }
    }

    function stopDrawing() {
        drawingManager.setMap(null);
    }

    function setSelection(shape) {
        clearSelection();
        stopDrawing();
        selectedShape = shape;
        shape.setEditable(true);
    }

    function deleteSelectedShape() {
        if (selectedShape) {
            selectedShape.setMap(null);
            drawingManager.setMap(null);
            coordinates.splice(0, coordinates.length);
            document.getElementById('info').innerHTML = '';
        }
    }

    function CenterControl(controlDiv, map) {
        //set css for the control border
        var controlUI = document.createElement('div');
        controlUI.style.background = '#fff';
        controlUI.style.border = '2px solid #fff';
        controlUI.style.boxShadow = '0px 2px 6px rgba(0,0,0,0.3)';
        controlUI.style.borderRadius = '3px';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginBottom = '15px';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Select to delete the shape';
        controlDiv.appendChild(controlUI);

        //set css for the control interior
        var controlText = document.createElement('div');
        controlText.style.color = 'rgb(25,25,25)';
        controlText.style.fontFamily = 'Roboto';
        controlText.style.fontSize = '16px';
        controlText.style.lineHeight = '38px';
        controlText.style.paddingLeft = '5px';
        controlText.style.paddingRight = '5px';
        controlText.innerHTML = 'Delete Selected Area';
        controlUI.appendChild(controlText);

        //set up click event listener simple set the map to [location]
        controlUI.addEventListener('click', function () {
            deleteSelectedShape();
        });
    }

    function getPolygonCoords(newShape) {
        coordinates.splice(0, coordinates.length);
        var len = newShape.getPath().getLength();

        for (var i = 0; i < len; i++) {
            coordinates.push(newShape.getPath().getAt(i).toUrlValue(5));
        }
        document.getElementById('info').innerHTML = coordinates;
        window.parent.postMessage({ type: 'SEND_COORDINATES', data: coordinates }, '*');

        // document.getElementById("info").innerHTML = coordinates;
        //////.log(coordinates);
        return coordinates;
    }

    google.maps.event.addListener(drawingManager, 'polygoncomplete', function (event) {
        event.getPath().getLength();
        getPolygonCoords(event);

        google.maps.event.addListener(event, 'dragend', function () {
            getPolygonCoords(event);
        });

        google.maps.event.addListener(event.getPath(), 'insert_at', function () {
            getPolygonCoords(event);
            coordinates.splice(0, coordinates.length);
            var len = event.getPath().getLength();
            for (var i = 0; i < len; i++) {
                document.getElementById('info').innerHTML = coordinates;
                coordinates.push(event.getPath().getAt(i).toUrlValue(5));
            }
            document.getElementById('info').innerHTML = coordinates;
            window.parent.postMessage({ type: 'SEND_COORDINATES', data: coordinates }, '*');
            //////.log(coordinates);
        });
        google.maps.event.addListener(event.getPath(), 'set_at', function () {
            getPolygonCoords(event);
            coordinates.splice(0, coordinates.length);
            var len = event.getPath().getLength();
            for (var i = 0; i < len; i++) {
                document.getElementById('info').innerHTML = coordinates;
                coordinates.push(event.getPath().getAt(i).toUrlValue(5));
            }
            document.getElementById('info').innerHTML = coordinates;
            window.parent.postMessage({ type: 'SEND_COORDINATES', data: coordinates }, '*'); // ✅ Ensures React gets the latest data
        });

        window.parent.postMessage({ type: 'SEND_COORDINATES', data: coordinates }, '*');
    });

    google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
        all_overlays.push(event);
        if (event.type !== google.maps.drawing.OverlayType.MARKER) {
            drawingManager.setDrawingMode(null);

            var newShape = event.overlay;
            newShape.type = event.type;
            google.maps.event.addListener(newShape, 'click', function () {
                setSelection(newShape);
            });
            setSelection(newShape);
        }
    });

    var centerControlDiv = document.createElement('div');
    var centerControl = new CenterControl(centerControlDiv, map);

    centerControlDiv.index = 1;
    map.controls[google.maps.Controlposition.BOTTOM_CENTER].push(centerControlDiv);
}
