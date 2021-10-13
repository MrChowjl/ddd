import React, { useEffect, useState } from 'react';
import { Alert, message, Image } from 'antd';
import { mediaEdit, getCurrent, getIndustry } from './../request'
import ProForm, {
    ModalForm,
    ProFormText,
    ProFormSelect,
    ProFormUploadButton,
    ProFormCheckbox,
    ProFormDigit
} from '@ant-design/pro-form';

interface FormParams {
    onCancel: () => void;
    Select: string | undefined;
    reload: () => void;
}
const Form: React.FC<FormParams> = (props) => {
    const { onCancel, Select, reload } = props
    const [current, setcurrent] = useState<{
        name?: string;
    }>()
    const [industry, setindustry] = useState<any[]>([])
    useEffect(() => {
        Select && getCurrent({ k: Select }).then(res => {
            if (res.code === 1) {
                setcurrent(res.data)
            }
        })
        getIndustry().then(res => {
            if (res.code === 1) {
                let keys = Object.keys(res.data)
                let values = Object.values(res.data)
                let ar =  keys.map((itm,idx) => {
                    return {
                        label: values[idx],
                        value: Number(keys[idx])
                    }
                } )
                setindustry(ar)
            }
        })
    }, [])
    return (
        (Select ? current?.name ? true : false : true) ? <ModalForm<any> {...{
            labelCol: { span: 8 },
            wrapperCol: { span: 14 },
        }}
            initialValues={{
                name: current?.name,
            }}
            layout={'horizontal'}
            visible={true}
            title={Select ? '编辑项目' : '添加项目'}
            width={600}
            modalProps={{
                onCancel: () => onCancel()
            }}
            onFinish={async (values) => {
                console.log(values.file)
                let obj = {}
                let res = await mediaEdit({...values, ...obj});
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
                name="email"
                label="登录邮箱"
                placeholder="请输入"
                rules={[
                    {
                        required: true,
                        message: '登录邮箱是必填项！'
                    }
                ]}
            />
            <ProFormText
                width="md"
                name="password"
                valueType='password'
                label="密码"
                placeholder="请输入"
                rules={[
                    {
                        required: true,
                        message: '密码是必填项！'
                    }
                ]}
            />
            <ProFormText
                width="md"
                name="confirm_pwd"
                valueType='password'
                label="密码"
                placeholder="请输入"
                rules={[
                    {
                        required: true,
                        message: '确认密码是必填项！'
                    }
                ]}
            />
            <ProFormText
                width="md"
                name="true_name"
                label="使用者姓名"
                placeholder="请输入"
                rules={[
                    {
                        required: true,
                        message: '登录邮箱是必填项！'
                    }
                ]}
            />
            <ProFormSelect
                width="md"
                name="role"
                label="用户角色"
                placeholder="请输入"
                rules={[
                    {
                        required: true,
                        message: '用户角色是必填项！'
                    }
                ]}
                options={[
                    {value: 0, label: '广告投放师'},
                    {value: 5, label: '投放经理'},
                    {value: 9, label: '管理员'},
                ]}
            />
        </ModalForm> : null
    );
};
export default Form