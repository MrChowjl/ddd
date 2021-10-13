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
        device_type: number;
    }>()
    useEffect(() => {
        let form = new FormData()
        form.append('k', Select ? Select : '')
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
                device_type: current?.device_type,
                url: current?.url
            }}
            layout={'horizontal'}
            visible={true}
            title={Select ? '编辑人群包' : '编辑人群包'}
            width={600}
            modalProps={{
                onCancel: () => onCancel()
            }}
            onFinish={async (values) => {
                let form = new FormData()
                form.append('title', values.title)
                form.append('device_type', values.device_type)
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
                label="人群包标题"
                placeholder="请输入"
                rules={[
                    {
                        required: true,
                        message: '人群包标题是必填项！'
                    }
                ]}
            />
            <ProFormSelect
                width="md"
                name="device_type"
                label="匹配设备类型"
                options={[
                    { label: 'RTA不限制', value: 0 },
                    { label: 'IMEI', value: 1 },
                    { label: 'ANDROIDID', value: 2 },
                    { label: 'OAID', value: 3 },
                    { label: 'IDFA', value: 4 },
                ]}
                rules={[
                    {
                        required: true,
                        message: '人群包标题是必填项！'
                    }
                ]}
            />
            {current?.title ?
                <ProFormText
                    width="md"
                    name="url"
                    label="人群包路径"
                    placeholder="请输入"
                    disabled={true}
                /> :
                <ProFormUploadButton
                    name="file"
                    label="人群包"
                    max={1}
                    fieldProps={{
                        name: 'file',
                        listType: 'picture-card'
                    }}
                    rules={[
                        {
                            required: true,
                            message: '人群包是必传项！'
                        }
                    ]}
                    action={''}
                    extra="请上传以txt后缀结尾的文本文件"
                />}
        </ModalForm > : null
    );
};
export default Form