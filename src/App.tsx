import React, {useState} from 'react';
import './App.css';
import Html5QrcodePlugin from "./component/Html5QrcodePlugin";
import {Button, Modal, Card} from "antd";

export default function App(): JSX.Element {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [scanValue, setScanValue] = useState<string[]>(["test"]);

    const addQrValue = (value: string)=>{
        alert(`New QR Value is ${value}`)
        setScanValue([...scanValue, value])
    }

    const QrModal = () => {
       return <Modal
           title="Qr Code"
           visible={isModalVisible}
           footer={null}
           onCancel={()=>{setIsModalVisible(false)}}>
            {isModalVisible && <Html5QrcodePlugin
                fps={60}
                qrbox={250}
                disableFlip={false}
                aspectRatio={1}
                qrCodeSuccessCallback={(value: string) => {
                    addQrValue(value)
                    setIsModalVisible(false)
                }}
            />}
        </Modal>
    }

    return  <>
            <QrModal />

            <Card style={{margin: "0.5rem"}} title="Authenticator">
                <Button type="primary" onClick={()=>{setIsModalVisible(true)}}>
                    Add Account
                </Button>
            </Card>

            {scanValue.map(value => {
                return <>
                    <Card style={{margin: "0.5rem"}}>
                        {value}
                    </Card>

                </>
            })}
        </>

}
