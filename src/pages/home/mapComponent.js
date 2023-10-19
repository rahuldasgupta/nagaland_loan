import React, {useState, useEffect} from 'react'
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, } from '@react-google-maps/api';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FaPhoneAlt } from "react-icons/fa";

let containerStyle = {
  width: '101.5%',
  height: '110vh',
  margin: 0
};

function MapComponent() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyBttNovQQfTde-VkUHOugPWUrgr9DkmmaU"
  })

  const [mapRef, setMapRef] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [map, setMap] = React.useState(null);
  const [zoom, setZoom] = React.useState(18);
  const [infoWindowData, setInfoWindowData] = useState();
  const [markers, setMarkers] = useState([{
    adTitle: "IDAN",
    lat: 25.7049669,
    lng: 94.1066582,
  }]);
  const [position, setPosition] = useState({
    lat: 25.7049669,
    lng: 94.1066582,
  });
  useEffect(() => {
    if(window.innerWidth<700){
      containerStyle = {
        width: '100%',
        height: '70vh',
        margin: 0
      };
    }
    else{
      containerStyle = {
        width: '101.5%',
        height: '110vh',
        margin: 0
      }
    }
  }, []);

  const onLoad = React.useCallback(function callback(map) {
    setZoom(18)
    map.setZoom(zoom)
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
    setZoom(18)
  }, [])
  
  const handleMarkerClick = (id, lat, lng, adTitle) => {
    mapRef?.panTo({ lat, lng });
    setInfoWindowData({ id, adTitle });
    setIsOpen(true);
  };
  const mapOptions = {
    zoom: 18,
    styles: [
      {
        featureType: 'poi',
        stylers: [{ visibility: 'off' }],
      },
    ],
  };
  return isLoaded ? (
    <>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={position}
        onLoad={onLoad}
        options={mapOptions}
        zoom={zoom}
        onUnmount={onUnmount}
      >
        <>
          {markers.map(({ adTitle, lat, lng }, key) => (
            <>
              {
                markers.length > 0 ?
                <>
                <Marker
                    key={key}
                    position={{ lat, lng }}
                    icon={{
                      url: "https://i.ibb.co/k93PgvJ/pin.png", // Path to your custom icon image
                      scaledSize: new window.google.maps.Size(50, 58), // Set the desired width and height of the icon
                      origin: new window.google.maps.Point(0, 0),
                      anchor: new window.google.maps.Point(20, 40), // Center the icon at the specified position
                    }}
                    onClick={() => {
                      handleMarkerClick(key, lat, lng, adTitle);
                    }}
                  >
                    {isOpen && infoWindowData?.id === key && (
                      <InfoWindow
                        options= {{minWidth : 250 }}
                        onCloseClick={() => {
                          setIsOpen(false);
                        }}
                      >
                        <>
                          <p className='markerTxt' onClick={() => window.open("https://www.google.com/maps/place/Nagaland+Staff+Selection+Board/@25.7158996,94.1088023,19.46z/data=!4m14!1m7!3m6!1s0x37462313caa8c26f:0x3130df059fe53d32!2sNagaland+Staff+Selection+Board!8m2!3d25.7159063!4d94.1090047!16s%2Fg%2F11ssbkssb0!3m5!1s0x37462313caa8c26f:0x3130df059fe53d32!8m2!3d25.7159063!4d94.1090047!16s%2Fg%2F11ssbkssb0?entry=ttu", "_blank")}>IDAN</p>
                          <p className='markerSubTxt'>Capital Convention Center</p>
                          <p className='markerSubTxt'>Kohima - 797001, Nagaland</p>
                          <Row>
                            <Col md={1} xs={1} sm={1}>
                              <FaPhoneAlt
                                size={15}
                                className="loc-icons_marker"
                              />
                            </Col>
                            <Col md={5} xs={10} sm={10}>
                              <a href={"tel:" + "+91370221180"}>
                                <p className="contact-div1-subtitle-marker number">+91370221180</p>
                              </a>
                            </Col>
                          </Row>
                        </>
                      </InfoWindow>
                    )}
                  </Marker>
                </>
                :
                <></>
              }
            </>
          ))}
        </>
      </GoogleMap>
    </>
    
  ) : <></>
}

export default React.memo(MapComponent)