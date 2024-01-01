import { useRef, useState, useEffect } from 'react';
import {
  Marker,
  GoogleMap,
  InfoWindow,
  useJsApiLoader,
  DirectionsRenderer,
} from '@react-google-maps/api';

import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useSettingsContext } from 'src/components/settings';

// ----------------------------------------------------------------------
const AnyReactComponent = (text: any) => <div>{text}</div>;

export default function TwoView() {
  const [map, setMap] = useState<any>(/** @type google.maps.Map */ null);
  const [directionRes, setDirectionRes] = useState<any>(null);
  const [distance, setDistance] = useState<any>('');
  const [deration, setDuration] = useState<any>('');
  const originRef = useRef<any>(null);
  const destinationRef = useRef<any>(null);
  const settings = useSettingsContext();
  const [position, setPosition] = useState<any>({ latitude: null, longitude: null });

  const { isLoaded } = useJsApiLoader({
    id: 'libertyMap',
    googleMapsApiKey: 'AIzaSyDWgjTr5A7uHmIg4LPVJuHEWhXlswPc_0g',
    libraries: ['places'],
  });

  const center = {
    lat: position?.latitude,
    lng: position?.longitude,
  };

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setPosition({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      });
    } else {
      console.log('Geolocation is not available in your browser.');
    }
  }, []);

  if (!isLoaded) {
    return <p>map is loading.</p>;
  }

  const calculateRoute = async () => {
    if (originRef.current.value !== '' || destinationRef.current.value !== '') {
      return;
    }
    const directionServices = new google.maps.DirectionsService();
    const result = await directionServices.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionRes(result);
    if (
      result &&
      result.routes &&
      result.routes.length > 0 &&
      result.routes[0].legs &&
      result.routes[0].legs.length > 0
    ) {
      const distanceText = result.routes[0].legs[0].distance?.text;
      if (distanceText) {
        setDistance(distanceText);
      }
      const durationText = result.routes[0].legs[0].duration?.text;
      if (durationText) {
        setDuration(durationText);
      }
    }
  };

  const clearRoute = () => {
    setDirectionRes(null);
    setDistance('');
    setDistance('');
    originRef.current.value = '';
    destinationRef.current.value = '';
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'} sx={{ position: 'relative' }}>
      <Typography variant="h4"> Page Two </Typography>
      {/* <Box
        sx={{
          zIndex: 60,
          background: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          gap: 1,
          position: 'absolute',
          top: '6.2rem',
          left: '48px',
          width: 'auto',
          padding: '19px',
        }}
      >
        <Autocomplete>
          <TextField label="origin" variant="outlined" ref={originRef} />
        </Autocomplete>
        <Autocomplete>
          <TextField label="destination" variant="outlined" ref={destinationRef} />
        </Autocomplete>
        <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%', gap: 1 }}>
          <Button variant="outlined" onClick={() => map.panTo(center)}>
            Recenter
          </Button>
          <Button variant="outlined" onClick={calculateRoute}>
            Search
          </Button>
          <Button variant="outlined" onClick={clearRoute}>
            Reset
          </Button>
        </Box>
      </Box> */}
      <Box
        sx={{
          mt: 5,
          width: 1,
          p: '10px',
          height: '75vh',
          borderRadius: 2,
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
          border: (theme) => `dashed 1px ${theme.palette.divider}`,
        }}
      >
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={(newMap) => setMap(newMap)}
        >
          <Marker position={center}>
            <InfoWindow>
              <div>person 1</div>
            </InfoWindow>
          </Marker>

          {directionRes && <DirectionsRenderer directions={directionRes} />}
        </GoogleMap>
      </Box>
    </Container>
  );
}
