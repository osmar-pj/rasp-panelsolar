const SerialPort = require('serialport');
const ModbusMaster = require('modbus-rtu').ModbusMaster;
const mqtt = require('mqtt')
require('dotenv').config()
const options = {
    clientId: 'MonitorPanelSolar',
    username: 'MonitorPanelSolarRaspberry',
    password: ''
}

const connectUrl = `${process.env.BASE_URL_MQTT}`
const client = mqtt.connect(connectUrl, options)
client.on('connect', () => {
})

const serialPort = new SerialPort("COM7", {
   baudRate: 9600
});

const master = new ModbusMaster(serialPort);
let datas = {
    detector_rasp: {
        mac: "RB-PANELSOLAR",
        values: []
    }
}
setInterval( async () => {
    const data = await master.readHoldingRegisters(1, 15200, 25)
    datas.detector_rasp.values = data
    client.publish(process.env.TOPIC_PS, JSON.stringify(datas))
}, 2000)