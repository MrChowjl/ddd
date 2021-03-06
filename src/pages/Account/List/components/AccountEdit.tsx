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
                title={currentSelected ? '??????????????????' : '??????????????????'}
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
                    label="??????????????????"
                    tooltip="????????? 24 ???"
                    placeholder="???????????????"
                    rules={[
                        {
                            required: true,
                            message: '?????????????????????'
                        },
                        {
                            max: 24,
                            message: '????????????24?????????'
                        }
                    ]}
                />
                <ProFormSelect
                    options={options.Media}
                    rules={[
                        {
                            required: true,
                            message: '?????????????????????'
                        }
                    ]}
                    width="md"
                    name="adx_id"
                    placeholder="???????????????"
                    label="??????"
                />
                <ProFormSelect
                    options={options.Adhost}
                    rules={[
                        {
                            required: true,
                            message: '????????????????????????'
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
                    placeholder="??????????????????"
                    label="?????????"
                />
                <ProFormRadio.Group
                    label="??????????????????"
                    name='type'
                    rules={[
                        {
                            required: true,
                            message: '?????????????????????????????????'
                        }
                    ]}
                    options={options.Cate}
                />
                {currentUser && <ProFormSelect
                    options={options.Rta}
                    width="md"
                    name="rta_id"
                    placeholder="???????????????????????????RTA"
                    label="??????RTA"
                    fieldProps={{
                        value: cate,
                        onChange: (value) => {
                            setcate(value)
                        }
                    }}
                />}
                <ProFormDateRangePicker name="contractTime"
                    width="md" label="????????????" rules={[
                        {
                            required: true,
                            message: '???????????????????????????'
                        }
                    ]} />
                <ProFormDigit label="?????????????????????"
                    rules={[
                        {
                            required: true,
                            message: '????????????????????????????????????'
                        }
                    ]} name="budgetall" width="md" min={1} />
                <ProFormDigit label="????????????????????????"
                    rules={[
                        {
                            required: true,
                            message: '???????????????????????????????????????'
                        }
                    ]} name="budgetday" width="md" min={1} />
            </ModalForm> : <></>
    );
};
export default connect(({ user }: ConnectState) => ({
    currentUser: user.currentUser,
}))(Form);