import React, { useEffect, useState } from 'react';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Modal, Card, Button, message, Empty, Tag, Popconfirm, Spin, Image } from 'antd';
import { qualiAdd, getCurrent, deleteQuly } from './../request'
import ProForm, {
    ModalForm,
    ProFormText,
    ProFormSelect,
    ProFormUploadButton,
    ProFormCheckbox,
    ProFormDigit
} from '@ant-design/pro-form';
import style from './quli.less'
const { Meta } = Card;

interface FormParams {
    onCancel: () => void;
    Select: string | undefined;
    reload: () => void;
}
const statusMap = {
    '0': <Tag color="orange">等待审核</Tag>,
    '1': <Tag color="green">审核通过</Tag>,
    '-1': <Tag color="red">审核未过</Tag>
}
const Form: React.FC<FormParams> = (props) => {
    const { onCancel, Select, reload } = props
    const [quliList, setquliList] = useState<any[]>([])
    const [isLoading, setisLoading] = useState<boolean>(true)
    useEffect(() => {
        init()
    }, [])
    const init = () => {
        setisLoading(true)
        getCurrent({ k: Select as string }).then(res => {
            console.log(res)
            setisLoading(false)
            if (res.code === 1) {
                setquliList(res.data?.adv_qualifications || [])
            }
        })
    }
    return (<Modal {...{
        labelCol: { span: 8 },
        wrapperCol: { span: 14 },
    }}
        visible={true}
        title={'资质管理'}
        width={900}
        onOk={onCancel}
        okText={'确定'}
        cancelText={'取消'}
        onCancel={onCancel}
    >
        <Spin tip="Loading..." spinning={isLoading}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                flexWrap: 'wrap',
                maxHeight: 800,
                overflow: 'auto'
            }}>
                {
                    quliList.length ? quliList.map(itm => {
                        return (
                            <Card
                                className={style.card}
                                key={itm.id}
                                hoverable
                                style={{ width: 240, marginBottom: 24, position: 'relative' }}
                                cover={
                                    <Image
                                        height={275}
                                        src={itm.file_url}
                                    />
                                }
                            >
                                <Meta title={itm.name} description={itm.number} />
                                <span title={itm.audited_info} style={{ position: 'absolute', right: 0, bottom: 5 }}>
                                    {statusMap[itm.status.toString()]}
                                </span>
                                <span className={style.delete}>
                                    <Popconfirm placement="bottom" title={'确定要删除这条资质？'} onConfirm={() => {
                                        deleteQuly({
                                            adv_qua_id: itm.id,
                                            adv_id: Select
                                        }).then(res => {
                                            if (res.code === 1) {
                                                message.success(res.msg)
                                                init()
                                            }
                                        })
                                    }} okText="Yes" cancelText="No">
                                        <DeleteOutlined />
                                    </Popconfirm>
                                </span>
                            </Card>
                        )
                    }) : <Empty style={{ textAlign: 'center' }} />
                }
                {quliList.length ? <i style={{ width: 240 }}></i> : null}
                {quliList.length ? <i style={{ width: 240 }}></i> : null}
            </div>
        </Spin>
        <ModalForm<any>  {...{
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        }} layout={'horizontal'}
            width={450}
            title="添加资质"
            trigger={
                <div style={{ textAlign: 'right' }}><Button type="primary"><PlusOutlined />添加资质</Button></div>
            }
            onFinish={async (values) => {
                console.log(values.name);
                let form = new FormData()
                form.append('file', values.file[0].originFileObj)
                form.append('adv_id', Select as string)
                form.append('name', values.name)
                form.append('number', values.number)
                let res = await qualiAdd(form);
                if (res.code === 1) {
                    message.success(res.msg);
                    init()
                    return true;
                }
            }}
        >
            <ProFormText
                width="md"
                name="name"
                label="名称"
                placeholder="请输入"
                rules={[
                    {
                        required: true,
                        message: '资质图片是必传项！'
                    }
                ]}
            />
            <ProFormText
                width="md"
                name="number"
                label="编号"
                placeholder="请输入"
                rules={[
                    {
                        required: true,
                        message: '资质图片是必传项！'
                    }
                ]}
            />
            <ProFormUploadButton
                name="file"
                label="资质图片"
                max={1}
                fieldProps={{
                    name: 'file',
                    listType: 'picture-card'
                }}
                rules={[
                    {
                        required: true,
                        message: '资质图片是必传项！'
                    }
                ]}
                action={''}
                extra="请上传小于4M的png/jpg格式的图片"
            />
        </ModalForm>
    </Modal>
    );
};
export default Form