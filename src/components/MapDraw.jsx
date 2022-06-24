import React, { useRef, useState } from "react";

import { Map, FeatureGroup, TileLayer, Polyline } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";

import "./assets/leaflet.css";
import "./assets/leaflet.draw.css";

// Material components
import { makeStyles, Button, Paper, Box, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  map: {
    height: "100vh",
    width: "100%",
    zIndex: 0,
  },
  buttonWrapper: {
    zIndex: 1,
    position: "absolute",
    bottom: theme.spacing(2),
    marginLeft: "33%",
    marginBottom: "4%",
    // transform: "translateX(-50%)",
  },
  headerWrapper: {
    zIndex: 1,
    marginLeft: theme.spacing(3),
    marginTop: theme.spacing(1),
  },
}));

export const MapDraw = (props) => {
  const classes = useStyles(props);
  const editRef = useRef();
  const [items, setItems] = useState([]);
  const [drawing, setDrawing] = useState(false);

  const handleClick = () => {
    if (!drawing) {
      editRef.current.leafletElement._toolbars.draw._modes.polyline.handler.enable();
    } else {
      editRef.current.leafletElement._toolbars.draw._modes.polyline.handler.completeShape();
      editRef.current.leafletElement._toolbars.draw._modes.polyline.handler.disable();
    }
    setDrawing(!drawing);
  };

  const onShapeDrawn = (e) => {
    setDrawing(false);
    setItems([...items, { items: [e.layer._latlngs], id: Date.now() }]);
  };

  const handleDelete = (id) => {
    const filteredItems = items.filter((item) => {
      return id !== item.id;
    });
    setItems(filteredItems);
  };
  return (
    <Box
      style={{
        width: "100%",
        display: "flex",
        minHeight: "100vh",
        flexDirection: "row",
      }}
    >
      <Box style={{ width: "75%", margin: 0 }}>
        <Map
          center={[44.439663, 26.096306]}
          zoom={15}
          zoomControl={true}
          className={classes.map}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
          <FeatureGroup>
            <EditControl
              ref={editRef}
              position="topright"
              onCreated={onShapeDrawn}
              draw={{
                rectangle: false,
                circle: false,
                polyline: {
                  allowIntersection: true,
                  shapeOptions: {
                    color: "#ff0000",
                  },
                },

                circlemarker: false,
                marker: false,
                polygon: false,
              }}
              edit={{
                edit: false,
                remove: false,
                poly: false,
                polyline: false,
              }}
            />
          </FeatureGroup>
          {items.map((item) => {
            return item.items.map((point, i) => {
              return <Polyline positions={point} />;
            });
          })}
        </Map>

        <div className={classes.buttonWrapper}>
          <Button
            color="primary"
            size="large"
            variant="contained"
            onClick={handleClick}
          >
            {drawing ? "Save draw" : "Start draw"}
          </Button>
        </div>
      </Box>
      <Box
        sx={{
          width: "25%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          bgcolor: "#E8E8E8",
        }}
      >
        <Typography
          style={{ paddingTop: "2rem", paddingBottom: "2rem" }}
          variant="h4"
        >
          Routes List
        </Typography>
        {items.length > 0 ? (
          items.map(
            (item, index) =>
              (item.id = (
                <Paper
                  style={{
                    marginTop: "4px",
                    display: "flex",
                    flexDirection: "row",
                    padding: "3%",
                    backgroundColor: "#3f51b5",
                    minWidth: "70%",
                    justifyContent: "space-between",
                  }}
                  key={index}
                >
                  <Typography
                    style={{
                      color: "#ffff",
                      paddingRight: "1rem",
                      paddingLeft: "1rem",
                    }}
                    variant="h6"
                  >
                    Route {index + 1}
                  </Typography>
                  <Button
                    style={{ paddingLeft: "1rem" }}
                    variant="contained"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </Button>
                  <div>
                    {item.items.map((point, index) => (
                      <span key={index}></span>
                    ))}
                  </div>
                </Paper>
              ))
          )
        ) : (
          <Typography variant="h6" style={{ paddingTop: "2rem" }}>
            No routes yet...
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default MapDraw;
