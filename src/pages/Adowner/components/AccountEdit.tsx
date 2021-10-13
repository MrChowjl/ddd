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
        file?: File | string;
        id?: string;
        company?: string;
        site_name?: string;
        site_url?: string;
        industry_id?: string;
        link_name?: string;
        link_tel?: string;
        link_email?: string;
        credit_code?: string;
        business_license?: string;
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
                // file: current?.name,
                name: current?.name,
                company: current?.company,
                site_name: current?.site_name,
                site_url: current?.site_url,
                industry_id: current?.industry_id,
                link_name: current?.link_name,
                link_tel: current?.link_tel,
                link_email: current?.link_email,
                credit_code: current?.credit_code,
            }}
            layout={'horizontal'}
            visible={true}
            title={Select ? '编辑广告主' : '添加广告主'}
            width={600}
            modalProps={{
                onCancel: () => onCancel()
            }}
            onFinish={async (values) => {
                console.log(values.file)

                let form = new FormData()
                form.append('file', values.file ? values.file[0].originFileObj : current?.business_license)
                form.append('id', Select ? Select : '')
                form.append('name', values.name)
                form.append('company', values.company)
                form.append('site_name', values.site_name)
                form.append('site_url', values.site_url)
                form.append('industry_id', values.industry_id)
                form.append('link_name', values.link_name)
                form.append('link_tel', values.link_tel)
                form.append('link_email', values.link_email)
                form.append('credit_code', values.credit_code)
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
                name="name"
                label="简称"
                placeholder="请输入"
                rules={[
                    {
                        required: true,
                        message: '简称是必填项！'
                    },
                    {
                        max: 24,
                        message: '简称最多8个字！'
                    }
                ]}
            />
            <ProFormText
                width="md"
                name="company"
                label="公司"
                placeholder="请输入"
                rules={[
                    {
                        required: true,
                        message: '公司名称是必填项！'
                    },
                    {
                        max: 24,
                        message: '公司名称最多24个字！'
                    }
                ]}
            />
            <ProFormText
                width="md"
                name="site_name"
                label="网站名称"
                placeholder="请输入"
                rules={[
                    {
                        required: true,
                        message: '网站名称是必填项！'
                    },
                    {
                        max: 100,
                        message: '网站名称最多100个字！'
                    }
                ]}
            />
            <ProFormText
                width="md"
                name="site_url"
                label="网站地址"
                placeholder="请输入"
                rules={[
                    {
                        required: true,
                        message: '网站地址是必填项！'
                    },
                    {
                        max: 100,
                        message: '网站地址最多100个字！'
                    },
                    {
                        pattern: /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/,
                        message: '请输入正确的url地址（以http://或https://开头）'
                    }
                ]}
            />
            <ProFormSelect
                options={industry}
                width="md"
                name="industry_id"
                label="行业"
            />
            <ProFormText
                width="md"
                name="link_name"
                label="联系人姓名"
                placeholder="请输入"
                rules={[
                    {
                        required: true,
                        message: '联系人姓名是必填项！'
                    },
                    {
                        max: 24,
                        message: '联系人姓名最多24个字！'
                    }
                ]}
            />
            <ProFormText
                width="md"
                name="link_tel"
                label="联系人电话"
                placeholder="请输入"
                rules={[
                    {
                        required: true,
                        message: '联系人电话是必填项！'
                    },
                    {
                        max: 24,
                        message: '联系人电话最多24个字！'
                    },
                    {
                        pattern: /^1[0-9]{10}$/,
                        message: '请输入正确的手机号'
                    }
                ]}
            />
            <ProFormText
                width="md"
                name="link_email"
                label="联系人邮箱"
                placeholder="请输入"
                rules={[
                    {
                        required: true,
                        message: '联系人邮箱是必填项！'
                    },
                    {
                        max: 24,
                        message: '联系人邮箱最多24个字！'
                    },
                    {
                        pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
                        message: '邮箱格式错误！',
                    },
                ]}
            />
            <ProFormText
                width="md"
                name="credit_code"
                label="营业执照统一信用码"
                disabled={Select ? true : false}
                placeholder="请输入"
                rules={[
                    {
                        required: true,
                        message: '营业执照统一信用码是必填项！'
                    },
                    {
                        max: 24,
                        message: '营业执照统一信用码最多24个字！'
                    }
                ]}
            />
            {Select ? <div>
                <h4 style={{ textAlign: 'center', fontWeight: 'bold', color: '#666666' }}>营业执照</h4>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Image
                        width={200}
                        src={current?.business_license}
                        fallback="data:image/png;base64,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"
                    />
                </div>
            </div> : <ProFormUploadButton
                name="file"
                label="营业执照"
                max={1}
                fieldProps={{
                    name: 'file',
                    listType: 'picture-card'
                }}
                rules={[
                    {
                        required: true,
                        message: '营业执照是必传项！'
                    }
                ]}
                action={''}
                extra="请上传小于4M的png/jpg格式的图片"
            />}
        </ModalForm> : null
    );
};
export default Form