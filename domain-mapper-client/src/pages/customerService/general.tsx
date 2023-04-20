import React, { useEffect, useState } from 'react'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Input, Button, Upload } from 'antd'
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import axios from 'axios';
import baseUrl from '@/utils/baseUrl';
// import Image from 'next/image'


const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};


const General = ({ site }: any) => {

  console.log(site)

  const [file, setFile] = useState<any>(null)
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    if(site) {
      setImageUrl(site?.logo)
    }
  }, [site])

  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    setFile(info.file.originFileObj)
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const handleUpload = async (event: any) => {
    event.preventDefault();
    setLoading(true)
    try {
      const token = localStorage.getItem("mtoken")
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios({
        method: "POST",
        url: baseUrl + "/member/updateLogo",
        headers: { Authorization: `Bearer ${token}` },
        data: formData
      });
      console.log(response)
      if (response.status === 200) {
        console.log('Image uploaded successfully');
        message.success({
          content: "Image uploaded successfully!"
        })
      } else {
        console.error('Failed to upload image');
        message.error({
          content: "Could not upload image!"
        })
      }
    } catch (err: any) {
      console.log(err)
      setLoading(false)
      return message.error({
        content: err?.message || "Error uploading image!"
      })
    }
    setLoading(false)
  }


  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <div style={{ background: "#eee", padding: '2rem', borderRadius: "8px", width: "30%" }}>
      <h3 style={{ marginBottom: "2rem" }}>General Settings</h3>
      <div>
        <p style={{ marginBottom: '8px' }}>Agent Name</p>
        <Input disabled contentEditable={false} value={site?.username} placeholder="Agent Name" />
      </div>
      <div style={{ marginTop: "1rem" }}>
        <p style={{ marginBottom: '8px' }}>Logo</p>
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          beforeUpload={beforeUpload}
          onChange={handleChange}
        >
          {imageUrl ? <img src={imageUrl} alt="avatar" style={{width: "100%"}} /> : uploadButton}
        </Upload>
        <Button disabled={!file} onClick={handleUpload} loading={loading} type="primary" style={{ marginTop: '8px' }}>Upload</Button>
      </div>
    </div>
  )
}

export default General