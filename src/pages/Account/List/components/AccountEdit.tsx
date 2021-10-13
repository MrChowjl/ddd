import React, { useEffect } from 'react';
import { Button, message } from 'antd';
import type { ConnectState } from '@/models/connect';
import { connect } from 'umi';
import ProForm, {
    ModalForm,
    ProFormText,
    ProFormDateRangePicker,
    ProFormSelect,
    ProFormRadio,
    ProFormDigit
} from '@ant-design/pro-form';
import { getOptions, addAcount, getRTA, getCurrent } from './../request'
import { useState } from 'react';
import moment from 'moment'

type Item = {
    name: string;
    id: number;
    budgetday: string;
    budgetall: string;
    adx_id: string;
    user_adv_id: string;
    type: number;
    rta_id: string;
    category: string;
    adv_id: string;
    edate: number;
    sdate: number;
    budget_all: number;
    budget_day: number;
};
const Form: React.FC<any> = (props) => {
    const { onCancel, reFresh, currentSelected, currentUser } = props
    const [options, setoptions] = useState<{
        Media: { value: number; label: string }[],
        Adhost: { value: number; label: string }[],
        Cate: { value: number; label: string }[],
        Rta: { value: number; label: string }[],
    }>({
        Media: [],
        Adhost: [],
        Cate: [],
        Rta: []
    })
    const [cate, setcate] = useState('')
    const [currentItem, setcurrentItem] = useState<Item | undefined>(undefined)
    useEffect(() => {
        getOptions().then(res => {
            if (res.code === 1) {
                let Media = []
                let Adhost = []
                let Cate = []
                Media = res.data.adx?.map(itm => {
                    return {
                        value: itm.id,
                        label: itm.name
                    }
                })
                Cate = res.data.category?.map(itm => {
                    return {
                        value: itm.id,
                        label: itm.name
                    }
                })
                Adhost = res.data.adv?.map(itm => {
                    return {
                        value: itm.id,
                        label: itm.name
                    }
                })
                setoptions({ ...options, Media, Cate, Adhost })
            }
            if (currentSelected) {
                getCurrent(currentSelected.id).then(res => {
                    if (res.code === 1) {
                        setcurrentItem(res.data)
                    }
                })
            }
        })
    }, [])
    useEffect(() => {
        if (currentItem) {
            getRTA(currentItem?.adv_id as string).then(res => {
                console.log(options)
                setoptions({
                    ...options, Rta: res.data.map(itm => {
                        return {
                            value: itm.id,
                            label: itm.name
                        }
                    })
                })
                setcate(currentItem?.rta_id)
            })
        }
    }, [currentItem])
    return (
        (currentSelected ? currentItem?.id ? true : false : true) ?
            <ModalForm<any> {...{
                labelCol: { span: 6 },
                wrapperCol: { span: 14 },
            }}
                layout={'horizontal'}
                visible={true}
                title={currentSelected ? '编辑投放账户' : '创建投放账户'}
                width={600}
                modalProps={{
                    onCancel: () => onCancel()
                }}
                initialValues={{
                    name: currentItem?.name,
                    contractTime: currentItem ? [currentItem && moment(currentItem.sdate * 1000).format('yyyy-MM-DD'), moment(currentItem && currentItem.edate * 1000).format('yyyy-MM-DD')] : null,
                    budgetday: Number(currentItem?.budget_day),
                    budgetall: Number(currentItem?.budget_all),
                    adx_id: currentItem?.adx_id,
                    user_adv_id: currentItem?.adv_id,
                    type: currentItem?.category.toString(),
                    rta_id: currentItem?.rta_id
                }}
                onFinish={async (values) => {
                    let params = new FormData()
                    params.append('name', values.name)
                    params.append('sdate', values.contractTime[0])
                    params.append('edate', values.contractTime[1])
                    params.append('budgetday', values.budgetday)
                    params.append('budgetall', values.budgetall)
                    params.append('adx_id', values.adx_id)
                    params.append('user_adv_id', values.user_adv_id)
                    params.append('type', values.type)
                    params.append('rta_id', values.rta_id || '')
                    params.append('aid', currentSelected ? currentSelected.id : '')
                    await addAcount(params).then(res => {
                        if (res.code === 1) {
                            message.success(res.msg);
                            reFresh()
                            onCancel()
                        }
                    })
                    return true;
                }}
            >
                <ProFormText
                    width="md"
                    name="name"
                    label="投放账户名称"
                    tooltip="最长为 24 位"
                    placeholder="请输入名称"
                    rules={[
                        {
                            required: true,
                            message: '名称是必填项！'
                        },
                        {
                            max: 24,
                            message: '名称最多24个字！'
                        }
                    ]}
                />
                <ProFormSelect
                    options={options.Media}
                    rules={[
                        {
                            required: true,
                            message: '媒体是必填项！'
                        }
                    ]}
                    width="md"
                    name="adx_id"
                    placeholder="请选择媒体"
                    label="媒体"
                />
                <ProFormSelect
                    options={options.Adhost}
                    rules={[
                        {
                            required: true,
                            message: '广告主是必填项！'
                        }
                    ]}
                    fieldProps={{
                        onChange: async (value) => {
                            console.log(value)
                            setcate('')
                            let res = await getRTA(value)
                            if (res.code === 1) {
                                setoptions({
                                    ...options, Rta: res.data.map(itm => {
                                        return {
                                            value: itm.id,
                                            label: itm.name
                                        }
                                    })
                                })
                            }
                        }
                    }}
                    width="md"
                    name="user_adv_id"
                    placeholder="请选择广告主"
                    label="广告主"
                />
                <ProFormRadio.Group
                    label="广告投放类型"
                    name='type'
                    rules={[
                        {
                            required: true,
                            message: '广告投放类型是必填项！'
                        }
                    ]}
                    options={options.Cate}
                />
                {currentUser && <ProFormSelect
                    options={options.Rta}
                    width="md"
                    name="rta_id"
                    placeholder="请选择要绑定的绑定RTA"
                    label="绑定RTA"
                    fieldProps={{
                        value: cate,
                        onChange: (value) => {
                            setcate(value)
                        }
                    }}
                />}
                <ProFormDateRangePicker name="contractTime"
                    width="md" label="投放日期" rules={[
                        {
                            required: true,
                            message: '投放日期是必填项！'
                        }
                    ]} />
                <ProFormDigit label="广告投放总预算"
                    rules={[
                        {
                            required: true,
                            message: '广告投放总预算是必填项！'
                        }
                    ]} name="budgetall" width="md" min={1} />
                <ProFormDigit label="广告投放每日预算"
                    rules={[
                        {
                            required: true,
                            message: '广告投放每日预算是必填项！'
                        }
                    ]} name="budgetday" width="md" min={1} />
            </ModalForm> : <></>
    );
};
export default connect(({ user }: ConnectState) => ({
    currentUser: user.currentUser,
}))(Form);