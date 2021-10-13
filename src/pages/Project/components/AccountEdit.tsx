import React, { useEffect, useState, useRef } from 'react';
import { Form, message, Image } from 'antd';
import { mediaEdit, getCurrent, getIndustry } from './../request'
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { queryAccount, getOptions } from './../request'
import ProTable from '@ant-design/pro-table';
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
type Item = {
    url: string;
    id: number;
    number: number;
    title: string;
    labels: {
        name: string;
        color: string;
    }[];
    status: string;
    state: string;
    comments: number;
    created_at: string;
    updated_at: string;
    closed_at?: string;
};
const Formtable: React.FC<FormParams> = (props) => {
    const { onCancel, Select, reload } = props
    const [current, setcurrent] = useState<{
        name?: string;
        id?: string;
    }>()
    const [selectedRowKeys, setselectedRowKeys] = useState([])
    const [loading, setloading] = useState<boolean>(false)
    const actionRef = useRef<ActionType>();
    const [options, setoptions] = useState<{
        Media: { status: number; text: string } | {},
        Adhost: { status: number; text: string } | {},
        Cate: { status: number; text: string } | {},
        Status: { status: number; text: string } | {},
    }>({
        Media: {},
        Adhost: {},
        Cate: {},
        Status: {},
    })
    const onSelectChange = (selectedRowKeys: any) => {
        setselectedRowKeys(selectedRowKeys)
    };
    const columns: ProColumns<Item>[] = [
        {
            title: '所有广告主',
            hideInTable: true,
            valueType: 'select',
            name: 'adv_id',
            valueEnum: options.Adhost,
        },
        {
            title: '所有媒体',
            hideInTable: true,
            valueType: 'select',
            name: 'adx_id',
            valueEnum: options.Media,
        },
        {
            title: '投放类型',
            hideInTable: true,
            valueType: 'select',
            name: 'type',
            valueEnum: options.Cate,
        },
        {
            title: '投放账户名称',
            dataIndex: 'name',
            hideInSearch: true,
            width: 150,
            ellipsis: true,
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: '此项为必填项',
                    },
                ],
            },
        },
        {
            dataIndex: 'adv_name',
            title: '广告主',
            hideInSearch: true,
        },
        {
            dataIndex: 'adx_name',
            title: '媒体',
            hideInSearch: true,
        },
        {
            dataIndex: 'category',
            title: '投放类型',
            hideInSearch: true,
        },
    ];
    enum status {
        '待系统审核' = 'processing',
        '待媒体审核' = 'processing',
        '系统审核通过' = 'default',
        '媒体审核通过' = 'default',
        '系统审核失败' = 'error',
        '媒体审核失败' = 'error',
        '开启中' = 'success',
        '已关闭' = 'default',
        '已删除' = 'default'
    }
    useEffect(() => {
        getOptions().then(res => {
            if (res.code === 1) {
                let Media = {}
                let Adhost = {}
                let Cate = {}
                let Status = {}
                res.data.adx?.forEach(itm => {
                    Media[itm.id] = {
                        status: itm.id,
                        text: itm.name
                    }
                })
                res.data.category?.forEach(itm => {
                    Cate[itm.id] = {
                        status: itm.id,
                        text: itm.name
                    }
                })
                res.data.status?.forEach(itm => {
                    Status[itm.id] = {
                        status: itm.id,
                        text: itm.name
                    }
                })
                res.data.adv?.forEach(itm => {
                    Adhost[itm.id] = {
                        status: itm.id,
                        text: itm.name
                    }
                })
                setoptions({ ...options, Media, Cate, Status, Adhost })
                setloading(true)
            }
        })
    }, [])
    useEffect(() => {
        Select && getCurrent({ k: Select }).then(res => {
            if (res.code === 1) {
                setcurrent(res.data)
                setselectedRowKeys(res.data.ad_acc_ids || [])
            }
        })
        getIndustry().then(res => {
            if (res.code === 1) {
                let keys = Object.keys(res.data)
                let values = Object.values(res.data)
                let ar = keys.map((itm, idx) => {
                    return {
                        label: values[idx],
                        value: Number(keys[idx])
                    }
                })
            }
        })
    }, [])
    return (
        (Select ? current?.name ? true : false : true) ? <ModalForm<any> {...{
            labelCol: { span: 4 },
            wrapperCol: { span: 18 },
        }}
            initialValues={{
                name: current?.name,
            }}
            layout={'horizontal'}
            visible={true}
            title={Select ? '编辑项目' : '添加项目'}
            width={900}
            modalProps={{
                onCancel: () => onCancel()
            }}
            onFinish={async (values) => {
                console.log(values.file)
                if (selectedRowKeys.length < 1) {
                    message.warning('投放账户必选！')
                    return
                }
                let obj = {
                    name: values?.name,
                    id: current?.id,
                    ad_acc_id: selectedRowKeys
                }
                let res = await mediaEdit(obj);
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
                label="项目名称"
                placeholder="请输入"
                rules={[
                    {
                        required: true,
                        message: '项目名称是必填项！'
                    }
                ]}
            />
            <Form.Item label="包含投放账户" valuePropName="checked">
                {loading ? <ProTable
                    rowSelection={{
                        selectedRowKeys,
                        onChange: onSelectChange,
                    }}
                    columns={columns}
                    actionRef={actionRef}
                    request={async (
                        // 第一个参数 params 查询表单和 params 参数的结合
                        // 第一个参数中一定会有 pageSize 和  current ，这两个参数是 antd 的规范
                        params: T & {
                            pageSize: number;
                            current: number;
                        },
                        sort,
                        filter,
                    ) => {
                        // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
                        // 如果需要转化参数可以在这里进行修改
                        const msg = await queryAccount({
                            page: params.current,
                            limit: params.pageSize,
                            adv_id: params.adv_id,
                            adx_id: params.adx_id,
                            type: params.type,
                            status: 3
                        });
                        return {
                            data: msg.data.list,
                            // success 请返回 true，
                            // 不然 table 会停止解析数据，即使有数据
                            success: true,
                            // 不传会使用 data 的长度，如果是分页一定要传
                            total: msg.data.count,
                        };
                    }}
                    editable={{
                        type: 'multiple',
                    }}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                    }}
                    search={{
                        filterType: 'light'
                    }}
                    headerTitle={false}
                    dateFormatter="string"
                /> : null}
            </Form.Item>
        </ModalForm> : null
    );
};
export default Formtable