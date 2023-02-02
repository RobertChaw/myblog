import {useCallback, useRef} from "react";
import {PageContainer} from "@ant-design/pro-components";
import {Card, Popconfirm, Select, Table} from "antd";
import {useEffect, useState} from 'react'

import 'leaflet/dist/leaflet.css';
import {MapContainer, TileLayer, GeoJSON, Tooltip} from 'react-leaflet'
import data from './location.json'
import {GeoJsonObject} from "geojson";
import {GeoJSONProps} from "react-leaflet/lib/GeoJSON";

import {Button, message, DatePicker, Form, Input, Modal} from "antd";
import {addPlace, delPlace, getPlacesList} from "@/services/ant-design-pro/api";
import {useRequest} from "ahooks";
import {GeoJSON as LeafletGeoJSON, Map as LeafletMap} from "leaflet";

const {Option} = Select;
const {Column} = Table;
export default function () {
  const map = useRef<LeafletMap>(null)
  const geoJson = useRef<LeafletGeoJSON<any>>(null)
  const [form] = Form.useForm();

  const [mapKey, setMapKey] = useState(0);
  const {data: places, run: reload} = useRequest(() => getPlacesList())
  const [placesMap] = useState(new Map());
  useEffect(() => {
    places?.forEach(place => {
      placesMap.set(place.name, place)
    })
    setMapKey(prv => prv + 1)
    return () => {
      placesMap.clear()
    }
  }, [places])

  // useEffect(() => {
  //   return () => {
  //     if (geoJson.current && map.current) {
  //       const bounds = geoJson.current.getBounds()
  //       map.current.fitBounds(bounds)
  //       console.log('设置bounds成功')
  //     }
  //   };
  // }, [geoJson.current]);


  const style: GeoJSONProps['style'] = {
    stroke: false,
    color: '#aeafaf',
    opacity: 0.2,
    fill: true,
    fillColor: '#c4c5c6',
    fillOpacity: 0
  }

  const visitedStyle: GeoJSONProps['style'] = {
    stroke: false,
    color: '#aeafaf',
    opacity: 0.1,
    fill: true,
    fillColor: '#5DAC81',
    fillOpacity: 0.8
  }

  const plannedStyle: GeoJSONProps['style'] = {
    stroke: false,
    color: '#aeafaf',
    opacity: 0.1,
    fill: true,
    fillColor: '#F7D94C',
    fillOpacity: 0.8
  }

  const selectedStyle: GeoJSONProps['style'] = {
    stroke: false,
    color: '#aeafaf',
    opacity: 0.1,
    fill: true,
    fillColor: '#3b7efc',
    fillOpacity: 0.8
  }

  const [selectedPlace, setSelectedPlace] = useState('');

  const geoJsonStyle: GeoJSONProps['style'] = (feature) => {
    const name = feature?.properties.name
    if (placesMap.has(name)) {
      const place = placesMap.get(name)
      if (place.status === 0) {
        return visitedStyle
      }
      if (place.status === 1) {
        return plannedStyle
      }
      return selectedStyle
    }

    if (selectedPlace === name)
      return selectedStyle
    return style
  }

  const [showModal, setShowModal] = useState(false);

  const onEachFeature: GeoJSONProps["onEachFeature"] = (feature, layer) => {
    const name = feature.properties.name
    layer.on({
      'mouseout': () => {
        setSelectedPlace('未选择')
        console.log('鼠标移除')
      },
      'mouseover': () => {
        setSelectedPlace(name)
        form.setFieldsValue({
          name: name
        })
        console.log('鼠标进入')
      },
      'click': () => {
        console.log(`点击了: ${feature.properties.name}`)
        console.log(placesMap.has(name))

        if (!placesMap.has(name))
          setShowModal(true)
        else
          message.error(`${name} 已经去过`)
      }
    })
  }

  let tip: any = `${selectedPlace}`
  if (placesMap.has(selectedPlace)) {
    const place = placesMap.get(selectedPlace)
    // tip = `${tip} ${getStatus(place.status)} ${place.date}`
    tip = (<>
      <p className="mb-0.5">{tip}</p>
      <p className="mb-0.5">状态: <span className="text-blue-600">{getStatus(place.status)}</span></p>
      <p className="m-0">时间: <span className="text-blue-600">{place.date}</span></p>
    </>)
  }


  const {run: add} = useRequest(
    (values) => addPlace(
      {...values}),
    {
      onSuccess() {
        message.success('提交成功')
        setShowModal(false)
        form.resetFields()
      },
      onError() {
        message.error('提交失败')
      },
      onFinally() {
        reload()
      },
      manual: true
    })
  const onOk = () => {
    form.validateFields().then((values) => {
      values.date = values.date.format('yyyy')
      values.date = Number(values.date)
      values.status = Number(values.status)
      add({...values})
    })
  };

  const {run: del} = useRequest(
    (id: number) => delPlace({id}),
    {
      onSuccess() {
        message.success('删除成功')
        setShowModal(false)
      },
      onError() {
        message.error('删除失败')
      },
      onFinally() {
        reload()
      },
      manual: true
    }
  )

  function onConfirm(id: number) {
    return () => del(id)
  }

  function getStatus(status: number) {
    switch (status) {
      case 0:
        return '去过'
      case 1:
        return '想去'
      default:
        return '未知'
    }
  }

  return (
    <PageContainer>
      <Card>
        <p>已选 {selectedPlace}</p>
        <div className="w-full flex gap-2">
          <MapContainer center={[34.167, 108.890]}
                        zoom={5}
                        scrollWheelZoom={true}
                        className="h-[64rem] w-[32rem] flex-auto"
                        ref={map}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url='https://api.tiles.mapbox.com/styles/v1/{id}/tiles/{tileSize}/{z}/{x}/{y}?access_token={accessToken}'
              id="chaw1213/cl32dvwpm009c15mxtmcbmax4"
              accessToken="pk.eyJ1IjoiY2hhdzEyMTMiLCJhIjoiY2xjdnI4dzRwMDFtazNucDdtdHJwMmRiMSJ9.uPGWtxwSSwpxdSVVpHyJ_A"/>
            <GeoJSON
              style={geoJsonStyle}
              data={data as GeoJsonObject}
              onEachFeature={onEachFeature}
              key={mapKey}
              ref={geoJson}
            >
              <Tooltip key="Tooltip" sticky direction="top" className="my-tooltip">
                {tip}
              </Tooltip>
            </GeoJSON>
          </MapContainer>
          <Table dataSource={places} className="w-[8rem] border flex-auto">
            <Column title="地名" dataIndex="name" key="name"/>
            <Column title="状态"
                    dataIndex="status"
                    key="status"
                    render={(status: number) => getStatus(status)}
            />
            <Column title="时间" dataIndex="date" key="date"/>
            <Column
              title="操作"
              dataIndex="operation"
              key="operation"
              render={(_, place: API.Place) => (
                <>
                  <Popconfirm
                    title="确认删除?"
                    onConfirm={onConfirm(place.id as number)}
                    okText="是"
                    cancelText="否"
                  >
                    <Button key={place.name} type="text" danger>
                      删除
                    </Button>
                  </Popconfirm>
                </>
              )}
            />
          </Table>
        </div>
      </Card>
      <Modal
        title="添加地点"
        centered
        open={showModal}
        onOk={onOk}
        onCancel={() => setShowModal(false)}
      >
        <Form
          form={form}
          name="basic"
          // labelCol={{span:4}}
          // wrapperCol={{span: 16}}
          layout="vertical"
          initialValues={{status: '0'}}
          autoComplete="off"
        >
          <Form.Item
            label="地名"
            name="name"
          >
            <Input disabled/>
          </Form.Item>
          <Form.Item
            label="日期"
            name="date"
            rules={[{required: true, message: '日期不能为空'}]}
          >
            <DatePicker picker="year" format="yyyy" className="w-full"/>
          </Form.Item>
          <Form.Item
            label="状态"
            name="status"
            rules={[{required: true, message: '状态不能为空'}]}
          >
            <Select>
              <Option value="0">已去</Option>
              <Option value="1">想去</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  )
}


