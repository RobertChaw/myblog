import React, { useCallback, useEffect, useRef, useState } from "react";
import { Card, message, Spin, Table, Radio, RadioChangeEvent } from "antd";
import { useRequest } from "ahooks";
import { getPlacesList } from "../../config/api";
import {
  GeoJSONProps,
  MapContainer,
  TileLayer,
  GeoJSON,
  Tooltip,
} from "react-leaflet";
import { FeatureCollection, GeoJsonObject } from "geojson";
import {
  GeoJSON as LeafletGeoJSON,
  LatLngExpression,
  LatLngTuple,
  Layer,
  Map as LeafletMap,
} from "leaflet";
import "leaflet/dist/leaflet.css";
import data from "./location.json";
import { Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import { GetComponentProps } from "rc-table/lib/interface";

const { Title } = Typography;
export default function TravelMap() {
  const map = useRef<LeafletMap>(null);
  const geoJson = useRef<LeafletGeoJSON<any>>(null);
  const [toggle, setToggle] = useState(0);

  const {
    data: places,
    run: reload,
    loading,
  } = useRequest(() => getPlacesList());

  const filteredPlaces = useCallback(() => {
    const ps = places?.filter((place) => place.status === toggle);
    const sortedP = ps?.sort((a, b) => {
      return (b.date as number) - (a.date as number);
    });
    return sortedP;
  }, [places, toggle])();

  const [placesMap] = useState(new Map());
  const [visitedCount, setVisitedCount] = useState(0);
  const [plannedCount, setPlannedCount] = useState(0);
  const [mapKey, setMapKey] = useState(0);

  useEffect(() => {
    places?.forEach((place) => {
      placesMap.set(place.name, place);
      if (place.status === 0) setVisitedCount((prv) => prv + 1);
      if (place.status === 1) setPlannedCount((prv) => prv + 1);
    });
    setMapKey((prv) => prv + 1);
    return () => {
      placesMap.clear();
      setVisitedCount(0);
      setPlannedCount(0);
    };
  }, [places]);

  useEffect(() => {
    return () => {
      if (geoJson.current && map.current) {
        const bounds = geoJson.current.getBounds();
        map.current.fitBounds(bounds);
        console.log("??????bounds??????");
      }
    };
  }, [geoJson.current]);

  const unselectedStyle: GeoJSONProps["style"] = {
    stroke: false,
    color: "#aeafaf",
    opacity: 0.2,
    fill: true,
    fillColor: "#c4c5c6",
    fillOpacity: 0,
  };

  const visitedStyle: GeoJSONProps["style"] = {
    stroke: false,
    color: "#aeafaf",
    opacity: 0.1,
    fill: true,
    fillColor: "#5DAC81",
    fillOpacity: 0.8,
  };

  const plannedStyle: GeoJSONProps["style"] = {
    stroke: false,
    color: "#aeafaf",
    opacity: 0.1,
    fill: true,
    fillColor: "#F7D94C",
    fillOpacity: 0.8,
  };

  const selectedStyle: GeoJSONProps["style"] = {
    stroke: false,
    color: "#aeafaf",
    opacity: 0.1,
    fill: true,
    fillColor: "#3b7efc",
    fillOpacity: 0.8,
  };

  const [selectedPlace, setSelectedPlace] = useState("");
  const geoJsonStyle: GeoJSONProps["style"] = (feature) => {
    const name = feature?.properties.name;
    if (placesMap.has(name)) {
      const place = placesMap.get(name);
      const style = {};
      if (place.status === 0) {
        Object.assign(style, visitedStyle);
      }
      if (place.status === 1) {
        Object.assign(style, plannedStyle);
      }

      if (selectedPlace && selectedPlace !== name) {
        Object.assign(style, { fillOpacity: 0.2 });
      }
      return style;
    }

    if (selectedPlace === name) return selectedStyle;
    return unselectedStyle;
  };

  const onEachFeature: GeoJSONProps["onEachFeature"] = (feature, layer) => {
    const name = feature.properties.name;
    layer.on({
      mouseout: () => {
        setSelectedPlace("");
      },
      mouseover: () => {
        setSelectedPlace(name);
      },
      click: () => {

      },
    });
  };

  function getStatus(status: number) {
    switch (status) {
      case 0:
        return "??????";
      case 1:
        return "??????";
      default:
        return "??????";
    }
  }

  let tip: any = `${selectedPlace}`;
  if (placesMap.has(selectedPlace)) {
    const place = placesMap.get(selectedPlace);
    // tip = `${tip} ${getStatus(place.status)} ${place.date}`
    tip = (
      <>
        <p className="mb-0.5">{tip}</p>
        <p className="mb-0.5">
          ??????:{" "}
          <span
            className={place.status === 0 ? "text-blue-600" : "text-yellow-600"}
          >
            {getStatus(place.status)}
          </span>
        </p>
        <p className="m-0">
          ??????:{" "}
          <span
            className={place.status === 0 ? "text-blue-600" : "text-yellow-600"}
          >
            {place.date}
          </span>
        </p>
      </>
    );
  }

  type Props<T extends (...args: any) => any> = Parameters<T>[0];
  type TableProps = Props<typeof Table<API.Place>>;

  const d: TableProps["dataSource"] = places;

  const columns: ColumnsType<API.Place> = [
    {
      title: "??????",
      dataIndex: "date",
      key: "date",
      width: 100,
    },
    {
      title: "??????",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
    },
  ];

  const onRow: GetComponentProps<API.Place> = (record) => {
    return {
      onMouseEnter: (event) => {
        const name = record.name || "";
        setSelectedPlace(name);
        let latlng: LatLngTuple = [0, 0];

        const d = data as FeatureCollection;
        const features = d.features;
        for (const feature of features) {
          if (feature.properties?.name === name) {
            latlng = [...feature.properties.center] as LatLngTuple;
            latlng.reverse();
            break;
          }
        }
        geoJson.current?.openTooltip(latlng);
        map.current?.panTo(latlng);
      },
      onMouseLeave: (event) => {
        setSelectedPlace("");
        geoJson.current?.closeTooltip();
      },
    };
  };

  return (
    <Spin spinning={loading}>
      <div className="flex max-w-full space-x-4 p-5">
        <MapContainer
          center={[34.167, 108.89]}
          zoom={5}
          scrollWheelZoom="center"
          className="min-h-[32rem] w-[32rem] flex-auto rounded"
          ref={map}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://api.tiles.mapbox.com/styles/v1/{id}/tiles/{tileSize}/{z}/{x}/{y}?access_token={accessToken}"
            id="chaw1213/cl32dvwpm009c15mxtmcbmax4"
            accessToken="pk.eyJ1IjoiY2hhdzEyMTMiLCJhIjoiY2xjdnI4dzRwMDFtazNucDdtdHJwMmRiMSJ9.uPGWtxwSSwpxdSVVpHyJ_A"
          />
          <GeoJSON
            style={geoJsonStyle}
            data={data as FeatureCollection}
            onEachFeature={onEachFeature}
            key={mapKey}
            ref={geoJson}
          >
            <Tooltip key="Tooltip" direction="top" className="my-tooltip">
              {tip}
            </Tooltip>
          </GeoJSON>
        </MapContainer>
        <div className="w-[18rem] flex-auto space-y-4">
          <Card>
            <p className="m-0 text-xl">
              ????????????:&nbsp;&nbsp;
              <span className=" text-4xl font-semibold text-emerald-600">
                {visitedCount}
              </span>
            </p>
          </Card>
          <Card>
            <p className="m-0 text-xl">
              ????????????:&nbsp;&nbsp;
              <span className="text-4xl font-semibold text-amber-600">
                {plannedCount}
              </span>
            </p>
          </Card>
          <Card>
            <Radio.Group
              value={toggle}
              buttonStyle="solid"
              onChange={({ target: { value } }: RadioChangeEvent) =>
                setToggle(value)
              }
              className="mb-2"
            >
              <Radio.Button value={0}>??????</Radio.Button>
              <Radio.Button value={1}>??????</Radio.Button>
            </Radio.Group>
            <div className="flex ">
              <Table
                rowKey={"id"}
                columns={columns}
                dataSource={filteredPlaces}
                pagination={false}
                onRow={onRow}
                scroll={{ x: "auto", y: 250 }}
                className="h-[20rem] w-auto"
              />
            </div>
          </Card>
        </div>
      </div>
    </Spin>
  );
}
