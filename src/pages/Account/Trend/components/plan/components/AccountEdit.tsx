import React, { useEffect, useState } from 'react';
import { Alert, message, Image } from 'antd';
import { mediaEdit, getCurrent } from './../request'
import ProForm, {
    ModalForm,
    ProFormText,
    ProFormSelect,
    ProFormUploadButton,
    ProFormCheckbox,
    ProFormDigit,
    ProFormDateRangePicker
} from '@ant-design/pro-form';
interface FormParams {
    onCancel: () => void;
    Select: string | undefined;
    reload: () => void;
}
const Form: React.FC<FormParams> = (props) => {
    const { onCancel, Select, reload } = props
    const [current, setcurrent] = useState<{
        title: string;
        url: string;
        thumbnail: string;
    }>()
    useEffect(() => {
        let form = new FormData()
        form.append('k', Select ? Select : '0')
        Select && getCurrent({ k: Select }).then(res => {
            if (res.code === 1) {
                setcurrent(res.data)
            }
        })
    }, [])
    return (
        (Select ? current?.title ? true : false : true) ? <ModalForm<any> {...{
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        }}
            initialValues={{
                title: current?.title,
            }}
            layout={'horizontal'}
            visible={true}
            title={Select ? '编辑视频' : '添加视频'}
            width={600}
            modalProps={{
                onCancel: () => onCancel()
            }}
            onFinish={async (values) => {
                let form = new FormData()
                form.append('title', values.title)
                form.append('category', '1')
                form.append('file', values.file ? values.file[0].originFileObj : current?.url)
                form.append('id', Select || '')
                let res = await mediaEdit(form);
                if (res.code === 1) {
                    message.success(res.msg);
                    reload()
                    onCancel()
                    return true;
                }
            }}
        >
            <ProFormText
                width="md"
                name="title"
                label="视频标题"
                placeholder="请输入"
                rules={[
                    {
                        required: true,
                        message: '视频标题是必填项！'
                    }
                ]}
            />
            {Select ? <div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <video src={current?.url} controls></video>
                </div>
            </div> : <ProFormUploadButton
                name="file"
                label="视频文件"
                max={1}
                fieldProps={{
                    name: 'file',
                    listType: 'picture-card'
                }}
                rules={[
                    {
                        required: true,
                        message: '视频文件是必传项！'
                    }
                ]}
                action={''}
                extra="请上传avi/mp4/flv格式的文件"
            />}
        </ModalForm > : null
    );
};
export default Form